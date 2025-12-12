"use server";

import { createClient } from "@/lib/supabase/server";

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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Create a default organization for the new user
  if (data.user) {
    const orgName = email.split("@")[0] + "'s Organization";

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: orgName })
      .select("id")
      .single();

    if (!orgError && org) {
      // Add user to the organization
      await supabase
        .from("organization_members")
        .insert({
          organization_id: org.id,
          user_id: data.user.id,
          role: "owner",
        });
    }
  }

  return { message: "Check your email to confirm your account" };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
