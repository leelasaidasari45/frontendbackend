import { supabase } from './supabaseClient.js';

async function test() {
  const { data: hostels, error } = await supabase.from('hostels').select('*');
  console.log("HOSTELS:", hostels);
  console.log("ERROR:", error);
}

test();
