require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dummyData = [
    {
        location_name: "Amboseli National Park",
        latitude: -2.6526,
        longitude: 37.2606,
        economic_activity: "Tourism, Conservation",
        livestock_diseases: "None",
        human_diseases: "Heat rash, Malaria",
        wildlife_trends: "Increased",
        water_quality: "Poor",
        drought_preparedness: "Somehow prepared",
        major_stressors: "Drying wetlands",
        extreme_climate_response: "Implement anti-poaching and boreholes"
    },
    {
        location_name: "Rombo",
        latitude: -3.0784,
        longitude: 37.7022,
        economic_activity: "Farming, Trade",
        livestock_diseases: "Anthrax, FMD",
        human_diseases: "Typhoid",
        wildlife_trends: "Decreased",
        water_quality: "Fair",
        drought_preparedness: "Fully prepared",
        major_stressors: "Pest infestations",
        extreme_climate_response: "Early warning systems, improved seeds"
    },
    {
        location_name: "Oloitokitok",
        latitude: -2.9248,
        longitude: 37.5113,
        economic_activity: "Agriculture, Business",
        livestock_diseases: "Tick-borne diseases",
        human_diseases: "Respiratory infections",
        wildlife_trends: "Decreased",
        water_quality: "Good",
        drought_preparedness: "Fully prepared",
        major_stressors: "Soil erosion, deforestation",
        extreme_climate_response: "Tree planting campaigns"
    },
    {
        location_name: "Mashuru",
        latitude: -2.1555,
        longitude: 37.1066,
        economic_activity: "Pastoralism",
        livestock_diseases: "CCPP, Trypanosomiasis",
        human_diseases: "Diarrhoea",
        wildlife_trends: "No Change",
        water_quality: "Poor",
        drought_preparedness: "Not prepared at all",
        major_stressors: "Lack of pasture",
        extreme_climate_response: "Migration"
    },
    {
        location_name: "Kajiado Town",
        latitude: -1.8517,
        longitude: 36.7820,
        economic_activity: "Trade, Services",
        livestock_diseases: "FMD",
        human_diseases: "Common cold",
        wildlife_trends: "Decreased",
        water_quality: "Good",
        drought_preparedness: "Somehow prepared",
        major_stressors: "Urban sprawl, water rationing",
        extreme_climate_response: "Water trucking"
    }
];

async function seedData() {
    console.log("Logging in...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'wycliff.ontiri@gmail.com',
        password: '22chacha#@!',
    });

    if (authError || !authData.user) {
        console.error("Login failed:", authError?.message || "No user returned");
        process.exit(1);
    }

    console.log("Logged in gracefully. User ID:", authData.user.id);

    const dataToInsert = dummyData.map(d => ({
        ...d,
        user_id: authData.user.id
    }));

    console.log("Inserting 5 records...");
    const { data, error } = await supabase
        .from('one_health_data')
        .insert(dataToInsert)
        .select();

    if (error) {
        console.error("Failed to insert data:", error.message);
    } else {
        console.log(`Successfully added ${data.length} records!`);
    }
}

seedData();
