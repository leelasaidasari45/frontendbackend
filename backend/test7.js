import { supabase } from './supabaseClient.js';

async function simulate() {
  const ownerId = "3334ec48-eca2-4f17-9d07-096698c5a861";
  
  const { data: hostels, error } = await supabase.from('hostels').select('*').eq('owner_id', ownerId);
  console.log("RAW HOSTELS:", hostels);
  console.log("ERROR:", error);
}

simulate();
