"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const companyName = formData.get("companyName") as string;
  const abn = formData.get("abn") as string | null;
  const fullName = formData.get("fullName") as string;

  // Validate required fields
  if (!companyName?.trim()) {
    return { error: "Company name is required" };
  }
  if (!fullName?.trim()) {
    return { error: "Your name is required" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Create organization and link user using admin client (bypasses RLS)
  if (data.user) {
    let adminClient;
    try {
      adminClient = createAdminClient();
    } catch (e) {
      console.error("Admin client error:", e);
      return { error: "Server configuration error. Please contact support." };
    }

    // Generate slug from company name
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { data: org, error: orgError } = await adminClient
      .from("organizations")
      .insert({
        name: companyName,
        slug: slug + "-" + Date.now().toString(36),
      })
      .select("id")
      .single();

    if (orgError) {
      console.error("Failed to create organization:", orgError);
      return { error: `Failed to create organization: ${orgError.message}` };
    }

    if (org) {
      // Update user profile with full name and org
      const { error: profileError } = await adminClient
        .from("profiles")
        .upsert({
          id: data.user.id,
          full_name: fullName,
          organization_id: org.id,
          role: "admin",
        });

      if (profileError) {
        console.error("Failed to update profile:", profileError);
      }

      // If ABN provided, create the company as an internal vendor
      if (abn?.trim()) {
        await adminClient.from("vendors").insert({
          organization_id: org.id,
          name: companyName,
          abn: abn.replace(/\s/g, ""),
          is_internal: true,
        });
      }
    }
  }

  return { message: "Check your email to confirm your account" };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
