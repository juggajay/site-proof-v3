-- CivilOS RLS Policies
-- Users can only access data belonging to their organization

-- Helper function to get current user's organization (in public schema)
create or replace function public.get_user_organization_id()
returns uuid as $$
  select organization_id from public.profiles where id = auth.uid()
$$ language sql security definer stable;

-- ORGANIZATIONS
create policy "Users can view their own organization"
  on organizations for select
  using (id = public.get_user_organization_id());

-- PROFILES
create policy "Users can view profiles in their organization"
  on profiles for select
  using (organization_id = public.get_user_organization_id());

create policy "Users can update their own profile"
  on profiles for update
  using (id = auth.uid());

create policy "New users can insert their profile"
  on profiles for insert
  with check (id = auth.uid());

-- VENDORS
create policy "Users can view vendors in their organization"
  on vendors for select
  using (organization_id = public.get_user_organization_id());

create policy "Managers can insert vendors"
  on vendors for insert
  with check (organization_id = public.get_user_organization_id());

create policy "Managers can update vendors"
  on vendors for update
  using (organization_id = public.get_user_organization_id());

-- RATE CARDS
create policy "Users can view rate cards in their organization"
  on rate_cards for select
  using (organization_id = public.get_user_organization_id());

create policy "Managers can manage rate cards"
  on rate_cards for all
  using (organization_id = public.get_user_organization_id());

-- RESOURCES
create policy "Users can view resources in their organization"
  on resources for select
  using (organization_id = public.get_user_organization_id());

create policy "Managers can manage resources"
  on resources for all
  using (organization_id = public.get_user_organization_id());

-- PROJECTS
create policy "Users can view projects in their organization"
  on projects for select
  using (organization_id = public.get_user_organization_id());

create policy "Managers can manage projects"
  on projects for all
  using (organization_id = public.get_user_organization_id());

-- LOTS
create policy "Users can view lots in their organization"
  on lots for select
  using (organization_id = public.get_user_organization_id());

create policy "Users can manage lots in their organization"
  on lots for all
  using (organization_id = public.get_user_organization_id());

-- DIARIES
create policy "Users can view diaries in their organization"
  on diaries for select
  using (organization_id = public.get_user_organization_id());

create policy "Foremen can create diaries"
  on diaries for insert
  with check (organization_id = public.get_user_organization_id());

create policy "Foremen can update their own diaries"
  on diaries for update
  using (organization_id = public.get_user_organization_id() and (foreman_id = auth.uid() or status = 'draft'));

-- DIARY ENTRIES
create policy "Users can view diary entries via diary"
  on diary_entries for select
  using (
    exists (
      select 1 from diaries
      where diaries.id = diary_entries.diary_id
      and diaries.organization_id = public.get_user_organization_id()
    )
  );

create policy "Users can manage diary entries"
  on diary_entries for all
  using (
    exists (
      select 1 from diaries
      where diaries.id = diary_entries.diary_id
      and diaries.organization_id = public.get_user_organization_id()
    )
  );

-- ITP TEMPLATES
create policy "Users can view ITP templates in their organization"
  on itp_templates for select
  using (organization_id = public.get_user_organization_id());

create policy "Managers can manage ITP templates"
  on itp_templates for all
  using (organization_id = public.get_user_organization_id());

-- LOT ITPS
create policy "Users can view lot ITPs in their organization"
  on lot_itps for select
  using (organization_id = public.get_user_organization_id());

create policy "Users can manage lot ITPs"
  on lot_itps for all
  using (organization_id = public.get_user_organization_id());

-- ITP CHECKS
create policy "Users can view ITP checks via lot_itp"
  on itp_checks for select
  using (
    exists (
      select 1 from lot_itps
      where lot_itps.id = itp_checks.lot_itp_id
      and lot_itps.organization_id = public.get_user_organization_id()
    )
  );

create policy "Users can manage ITP checks"
  on itp_checks for all
  using (
    exists (
      select 1 from lot_itps
      where lot_itps.id = itp_checks.lot_itp_id
      and lot_itps.organization_id = public.get_user_organization_id()
    )
  );
