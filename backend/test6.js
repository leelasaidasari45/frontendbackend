import { supabase } from './supabaseClient.js';

async function test() {
  const { data: hostels } = await supabase.from('hostels').select('id').limit(1);
  const hostelId = hostels[0].id;
  console.log("DB RETURNED:", hostelId);
  const { data: hostel } = await supabase.from('hostels').select('*').eq('id', hostelId).maybeSingle();
  console.log("FETCHED BY ID:", hostel);
}

test();
