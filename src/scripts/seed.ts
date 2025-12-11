/**
 * Database Seeder - Demo Data for CivilOS
 *
 * Populates the database with realistic civil construction demo data
 * for testing Reports and ITP workflows.
 *
 * Usage: npm run seed
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../lib/supabase/database.types'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables:')
  if (!supabaseUrl) console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  if (!serviceRoleKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nMake sure these are set in your .env.local file')
  process.exit(1)
}

// Create Supabase Admin Client (bypasses RLS)
const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Constants
const DEMO_ORG_NAME = 'CivilOS Demo Corp'
const DEMO_ORG_SLUG = 'civilos-demo'

// Rate card values in cents
const RATES = {
  laborer: 6000,      // $60.00/hr
  operator: 9000,     // $90.00/hr
  excavator: 11000,   // $110.00/hr
  waterCart: 8500,    // $85.00/hr
}

// Helper to generate random hours between min and max
function randomHours(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

// Helper to format time string
function formatTime(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`
}

async function cleanExistingData() {
  console.log('Checking for existing demo data...')

  const { data: existingOrg } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', DEMO_ORG_SLUG)
    .single()

  if (existingOrg) {
    console.log('Found existing demo org, cleaning up...')

    // Delete in reverse dependency order
    // First, get all lot_itps for this org to delete itp_checks
    const { data: lotItps } = await supabase
      .from('lot_itps')
      .select('id')
      .eq('organization_id', existingOrg.id)

    if (lotItps && lotItps.length > 0) {
      const lotItpIds = lotItps.map(l => l.id)
      await supabase.from('itp_checks').delete().in('lot_itp_id', lotItpIds)
    }

    // Get all diaries for this org to delete diary_entries
    const { data: diaries } = await supabase
      .from('diaries')
      .select('id')
      .eq('organization_id', existingOrg.id)

    if (diaries && diaries.length > 0) {
      const diaryIds = diaries.map(d => d.id)
      await supabase.from('diary_entries').delete().in('diary_id', diaryIds)
    }

    // Now delete in order
    await supabase.from('lot_itps').delete().eq('organization_id', existingOrg.id)
    await supabase.from('itp_templates').delete().eq('organization_id', existingOrg.id)
    await supabase.from('diaries').delete().eq('organization_id', existingOrg.id)
    await supabase.from('lots').delete().eq('organization_id', existingOrg.id)
    await supabase.from('projects').delete().eq('organization_id', existingOrg.id)
    await supabase.from('resources').delete().eq('organization_id', existingOrg.id)
    await supabase.from('rate_cards').delete().eq('organization_id', existingOrg.id)
    await supabase.from('vendors').delete().eq('organization_id', existingOrg.id)
    await supabase.from('profiles').delete().eq('organization_id', existingOrg.id)
    await supabase.from('organizations').delete().eq('id', existingOrg.id)

    console.log('Cleanup complete!')
  } else {
    console.log('No existing demo data found.')
  }
}

async function seedSetup() {
  console.log('\n--- Scenario 1: The Setup ---')

  // Create Organization
  console.log('Creating organization...')
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name: DEMO_ORG_NAME, slug: DEMO_ORG_SLUG })
    .select()
    .single()

  if (orgError || !org) {
    console.error('Failed to create organization:', orgError)
    process.exit(1)
  }
  console.log(`  Created: ${org.name} (${org.id})`)

  // Create Vendor 1: Internal Plant Hire
  console.log('Creating vendors...')
  const { data: internalVendor, error: v1Error } = await supabase
    .from('vendors')
    .insert({
      organization_id: org.id,
      name: 'CivilOS Plant Hire',
      is_internal: true,
      abn: '12 345 678 901',
      contact_email: 'plant@civilos.demo'
    })
    .select()
    .single()

  if (v1Error || !internalVendor) {
    console.error('Failed to create internal vendor:', v1Error)
    process.exit(1)
  }
  console.log(`  Created: ${internalVendor.name} (Internal)`)

  // Create Vendor 2: Subcontractor
  const { data: subbieVendor, error: v2Error } = await supabase
    .from('vendors')
    .insert({
      organization_id: org.id,
      name: 'ABC Excavations',
      is_internal: false,
      abn: '98 765 432 109',
      contact_email: 'info@abcexcavations.demo'
    })
    .select()
    .single()

  if (v2Error || !subbieVendor) {
    console.error('Failed to create subcontractor vendor:', v2Error)
    process.exit(1)
  }
  console.log(`  Created: ${subbieVendor.name} (Subcontractor)`)

  // Create Rate Cards
  console.log('Creating rate cards...')
  const rateCardsData = [
    { vendor_id: subbieVendor.id, organization_id: org.id, role_name: 'Laborer', rate_cents: RATES.laborer, unit: 'hour' },
    { vendor_id: subbieVendor.id, organization_id: org.id, role_name: 'Operator', rate_cents: RATES.operator, unit: 'hour' },
    { vendor_id: internalVendor.id, organization_id: org.id, role_name: '5T Excavator', rate_cents: RATES.excavator, unit: 'hour' },
    { vendor_id: internalVendor.id, organization_id: org.id, role_name: 'Water Cart', rate_cents: RATES.waterCart, unit: 'hour' },
  ]

  const { data: rateCards, error: rcError } = await supabase
    .from('rate_cards')
    .insert(rateCardsData)
    .select()

  if (rcError || !rateCards) {
    console.error('Failed to create rate cards:', rcError)
    process.exit(1)
  }

  rateCards.forEach(rc => {
    console.log(`  Created: ${rc.role_name} @ $${(rc.rate_cents / 100).toFixed(2)}/hr`)
  })

  // Create Resources
  console.log('Creating resources...')
  const excavatorRate = rateCards.find(r => r.role_name === '5T Excavator')
  const waterCartRate = rateCards.find(r => r.role_name === 'Water Cart')
  const operatorRate = rateCards.find(r => r.role_name === 'Operator')
  const laborerRate = rateCards.find(r => r.role_name === 'Laborer')

  const resourcesData = [
    // Plant (Internal)
    { vendor_id: internalVendor.id, organization_id: org.id, name: '5T Excavator', type: 'plant' as const, assigned_rate_card_id: excavatorRate?.id },
    { vendor_id: internalVendor.id, organization_id: org.id, name: 'Water Cart', type: 'plant' as const, assigned_rate_card_id: waterCartRate?.id },
    // Labor (Subbie)
    { vendor_id: subbieVendor.id, organization_id: org.id, name: 'Jack Gammell', type: 'labor' as const, phone: '0412 345 678', assigned_rate_card_id: operatorRate?.id },
    { vendor_id: subbieVendor.id, organization_id: org.id, name: 'Tom Builder', type: 'labor' as const, phone: '0423 456 789', assigned_rate_card_id: laborerRate?.id },
  ]

  const { data: resources, error: resError } = await supabase
    .from('resources')
    .insert(resourcesData)
    .select()

  if (resError || !resources) {
    console.error('Failed to create resources:', resError)
    process.exit(1)
  }

  resources.forEach(r => {
    console.log(`  Created: ${r.name} (${r.type})`)
  })

  return { org, internalVendor, subbieVendor, rateCards, resources }
}

async function seedJob(orgId: string) {
  console.log('\n--- Scenario 2: The Job ---')

  // Create Project
  console.log('Creating project...')
  const { data: project, error: projError } = await supabase
    .from('projects')
    .insert({
      organization_id: orgId,
      name: 'Highway Upgrade - Stage 1',
      code: 'HWY-001',
      status: 'active'
    })
    .select()
    .single()

  if (projError || !project) {
    console.error('Failed to create project:', projError)
    process.exit(1)
  }
  console.log(`  Created: ${project.name} (${project.code})`)

  // Create Lots
  console.log('Creating lots...')
  const lotStatuses = ['open', 'open', 'open', 'open', 'conformed', 'conformed', 'conformed', 'closed', 'closed', 'open']
  const lotsData = Array.from({ length: 10 }, (_, i) => ({
    project_id: project.id,
    organization_id: orgId,
    lot_number: `L-${100 + i}`,
    description: `Lot ${100 + i} - Earthworks Section ${i + 1}`,
    status: lotStatuses[i]
  }))

  const { data: lots, error: lotsError } = await supabase
    .from('lots')
    .insert(lotsData)
    .select()

  if (lotsError || !lots) {
    console.error('Failed to create lots:', lotsError)
    process.exit(1)
  }

  const statusCounts = lots.reduce((acc, lot) => {
    acc[lot.status || 'unknown'] = (acc[lot.status || 'unknown'] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log(`  Created ${lots.length} lots:`)
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`    - ${status}: ${count}`)
  })

  return { project, lots }
}

async function seedHistory(orgId: string, projectId: string, resources: Array<{ id: string; name: string; assigned_rate_card_id: string | null }>, rateCards: Array<{ id: string; rate_cents: number }>) {
  console.log('\n--- Scenario 3: The History (Cost Generation) ---')

  const today = new Date()
  const diariesCreated: string[] = []

  console.log('Generating 14 days of diary entries...')

  for (let i = 0; i < 14; i++) {
    const diaryDate = new Date(today)
    diaryDate.setDate(today.getDate() - i)

    // Skip weekends for realism
    const dayOfWeek = diaryDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) continue

    const dateStr = diaryDate.toISOString().split('T')[0]

    // Determine status: most recent one is draft, others are submitted/approved
    let status: string
    if (i === 0) {
      status = 'draft'
    } else if (i < 5) {
      status = 'submitted'
    } else {
      status = 'approved'
    }

    // Create diary
    const { data: diary, error: diaryError } = await supabase
      .from('diaries')
      .insert({
        organization_id: orgId,
        project_id: projectId,
        date: dateStr,
        status,
        notes: `Daily diary for ${dateStr}`
      })
      .select()
      .single()

    if (diaryError || !diary) {
      console.error(`Failed to create diary for ${dateStr}:`, diaryError)
      continue
    }

    diariesCreated.push(diary.id)

    // Create diary entries for each resource with random hours
    const entriesData = resources.map(resource => {
      const totalHours = randomHours(8, 10)
      const rateCard = rateCards.find(rc => rc.id === resource.assigned_rate_card_id)
      const frozenRate = rateCard?.rate_cents || 0
      const totalCost = Math.round(frozenRate * totalHours)

      // Calculate start/finish times based on hours
      const startHour = 7
      const breakHours = 0.5
      const workHours = totalHours - breakHours
      const finishHour = startHour + workHours + breakHours

      return {
        diary_id: diary.id,
        resource_id: resource.id,
        start_time: formatTime(startHour, 0),
        finish_time: formatTime(Math.floor(finishHour), Math.round((finishHour % 1) * 60)),
        break_hours: breakHours,
        total_hours: totalHours,
        frozen_rate_cents: frozenRate,
        total_cost_cents: totalCost
      }
    })

    await supabase.from('diary_entries').insert(entriesData)
  }

  console.log(`  Created ${diariesCreated.length} diaries with entries`)
  console.log('  - 1 draft (today)')
  console.log('  - 4 submitted (recent)')
  console.log('  - Remaining approved (historical)')

  return diariesCreated
}

async function seedQuality(orgId: string, lots: Array<{ id: string; lot_number: string }>) {
  console.log('\n--- Scenario 4: The Quality (ITPs) ---')

  // Create ITP Template with items including hold point
  console.log('Creating ITP template...')
  const templateItems = [
    { question: 'Verify survey setout complete', is_hold_point: false },
    { question: 'Check moisture content within spec', is_hold_point: false },
    { question: 'Compaction test - minimum 95% MDD', is_hold_point: true },
    { question: 'Level tolerance within ±20mm', is_hold_point: false },
    { question: 'Supervisor sign-off on compaction results', is_hold_point: true },
    { question: 'Photographic record complete', is_hold_point: false },
  ]

  const { data: template, error: templateError } = await supabase
    .from('itp_templates')
    .insert({
      organization_id: orgId,
      title: 'Earthworks Compaction',
      items: templateItems
    })
    .select()
    .single()

  if (templateError || !template) {
    console.error('Failed to create ITP template:', templateError)
    process.exit(1)
  }
  console.log(`  Created template: ${template.title}`)

  // Find Lot L-105 to attach ITP
  const targetLot = lots.find(l => l.lot_number === 'L-105')
  if (!targetLot) {
    console.error('Could not find lot L-105')
    process.exit(1)
  }

  // Create Lot ITP
  console.log(`Attaching ITP to ${targetLot.lot_number}...`)
  const { data: lotItp, error: lotItpError } = await supabase
    .from('lot_itps')
    .insert({
      lot_id: targetLot.id,
      organization_id: orgId,
      template_id: template.id,
      status: 'in_progress'
    })
    .select()
    .single()

  if (lotItpError || !lotItp) {
    console.error('Failed to create lot ITP:', lotItpError)
    process.exit(1)
  }

  // Create ITP Checks with mixed statuses
  console.log('Creating ITP checks...')
  const checksData = templateItems.map((item, index) => {
    // Make item 3 (index 2) fail to test warning system
    let status: string
    if (index === 2) {
      status = 'fail'
    } else if (index < templateItems.length - 1) {
      status = 'pass'
    } else {
      status = 'pending' // Last item pending
    }

    return {
      lot_itp_id: lotItp.id,
      question: item.question,
      status,
      is_hold_point: item.is_hold_point,
      rectification_note: status === 'fail' ? 'Compaction at 92% - requires rework' : null
    }
  })

  const { data: checks, error: checksError } = await supabase
    .from('itp_checks')
    .insert(checksData)
    .select()

  if (checksError || !checks) {
    console.error('Failed to create ITP checks:', checksError)
    process.exit(1)
  }

  const checkCounts = checks.reduce((acc, check) => {
    acc[check.status || 'unknown'] = (acc[check.status || 'unknown'] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log(`  Created ${checks.length} ITP checks:`)
  Object.entries(checkCounts).forEach(([status, count]) => {
    console.log(`    - ${status}: ${count}`)
  })

  return { template, lotItp, checks }
}

async function main() {
  console.log('='.repeat(50))
  console.log('CivilOS Database Seeder')
  console.log('='.repeat(50))

  try {
    // Step 1: Clean existing demo data (idempotency)
    await cleanExistingData()

    // Step 2: Seed Setup (Org, Vendors, Resources, Rate Cards)
    const { org, rateCards, resources } = await seedSetup()

    // Step 3: Seed Job (Project, Lots)
    const { project, lots } = await seedJob(org.id)

    // Step 4: Seed History (Diaries with entries)
    await seedHistory(org.id, project.id, resources, rateCards)

    // Step 5: Seed Quality (ITP Template and Checks)
    await seedQuality(org.id, lots)

    console.log('\n' + '='.repeat(50))
    console.log('Seeding complete!')
    console.log('='.repeat(50))
    console.log('\nDemo data created for:')
    console.log(`  Organization: ${DEMO_ORG_NAME}`)
    console.log(`  Project: Highway Upgrade - Stage 1`)
    console.log(`  Lots: L-100 to L-109`)
    console.log(`  Diaries: 14 days of cost data`)
    console.log(`  ITP: Earthworks Compaction on L-105`)
    console.log('\nYou can now log in and view the Reports Dashboard!')

  } catch (error) {
    console.error('\nSeeding failed:', error)
    process.exit(1)
  }
}

main()
