// src/api/auth.ts
import { supabase } from '../lib/supabase'

// Sign up user and (when possible) create their profile row
export async function signUp(name: string, email: string, password: string) {
  const emailNormalized = email.trim().toLowerCase()
  const { data, error } = await supabase.auth.signUp({
    email: emailNormalized,
    password,
    options: { data: { display_name: name.trim() } }, // stored in auth metadata
  })
  if (error) throw error

  // If email confirmation is OFF you'll have a session now → upsert profile.
  // If it's ON, this may be deferred until the first sign-in.
  const { user, session } = data
  let profileUpsertFailed = false
  if (user) {
    const { error: upErr } = await supabase
      .from('profiles')
      .upsert(
        { user_id: user.id, display_name: name.trim() },
        { onConflict: 'user_id' }
      )
    if (upErr) {
      // RLS or permission errors shouldn't block account creation
      profileUpsertFailed = true
      // eslint-disable-next-line no-console
      console.warn('Profile upsert failed (non-fatal):', upErr)
    }
  }
  return { ...data, emailConfirmationRequired: !session, profileUpsertFailed }
}

export async function signIn(email: string, password: string) {
  const emailNormalized = email.trim().toLowerCase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailNormalized,
    password,
  })
  if (error) throw error

  // Ensure a profile row exists after sign-in (covers email-confirmation flows)
  const user = data.user
  if (user) {
    const { error: upErr } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: user.id,
          display_name: user.user_metadata?.display_name ?? null,
        },
        { onConflict: 'user_id' }
      )
    if (upErr) {
      // Non-fatal in case RLS not configured yet
      // eslint-disable-next-line no-console
      console.warn('Profile upsert failed after sign-in (non-fatal):', upErr)
    }
  }
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Send a password reset email; Supabase will use your project's Site URL (or the provided redirect)
export async function requestPasswordReset(email: string, redirectTo?: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo,
  })
  if (error) throw error
  return data
}
