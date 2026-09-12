require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  console.log("Orders:", data, "Error:", error);
  
  const { data: pData, error: pError } = await supabase.from('products').select('*').limit(1);
  console.log("Products:", pData, "Error:", pError);
}
test();
