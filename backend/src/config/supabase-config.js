const { createClient } = require("@supabase/supabase-js");

const { supabaseServiceKey } = require("./server-config");

// get from your Supabase dashboard → Project Settings → API
const supabaseUrl = "https://otmijatepfbjhlptqbej.supabase.co";

module.exports = createClient(supabaseUrl, supabaseServiceKey);
