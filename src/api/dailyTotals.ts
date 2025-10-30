import { supabase } from '../lib/supabase';

export function toDateOnly(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`; // YYYY-MM-DD
}

export async function upsertDailyTotals(dateISO: string, totals: {
  calories: number; protein_g: number; carbs_g: number; fat_g: number; note?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const row = {
    user_id: user.id,
    log_date: dateISO,
    calories: Math.round(totals.calories),
    protein_g: Number(totals.protein_g),
    carbs_g:  Number(totals.carbs_g),
    fat_g:    Number(totals.fat_g),
    note: totals.note ?? null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('daily_totals').upsert(row);
  if (error) throw error;
}

export async function getDailyTotals(dateISO: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const { data, error } = await supabase
    .from('daily_totals')
    .select('*')
    .eq('user_id', user.id)
    .eq('log_date', dateISO)
    .maybeSingle();

  if (error) throw error;
  return data; // may be null if not saved yet
}

export async function getLast7Days() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const today = new Date();
  const from = new Date(today); from.setDate(today.getDate() - 6);
  const toISO = toDateOnly(today);
  const fromISO = toDateOnly(from);

  const { data, error } = await supabase
    .from('daily_totals')
    .select('log_date, calories, protein_g, carbs_g, fat_g, note')
    .eq('user_id', user.id)
    .gte('log_date', fromISO)
    .lte('log_date', toISO)
    .order('log_date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
