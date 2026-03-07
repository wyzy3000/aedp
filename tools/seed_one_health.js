const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://liwuyeukzpqffxhmbbxs.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Based on the Shiny App's Data Structure and typical points in Amboseli
const dummyData = [
    {
        location_name: 'Namanga',
        latitude: -2.5435,
        longitude: 36.7909,
        economic_activity: 'Trade, Livestock keeping',
        livestock_diseases: 'Foot and mouth disease, Tick-borne diseases',
        human_diseases: 'Malaria, Respiratory infections',
        wildlife_trends: 'Decreased',
        water_quality: 'Fair',
        drought_preparedness: 'Somehow prepared',
        major_stressors: 'High cost of living, Livestock deaths due to drought',
        extreme_climate_response: 'Rely on relief food, Sell livestock early'
    },
    {
        location_name: 'Loitokitok',
        latitude: -2.9238,
        longitude: 37.5113,
        economic_activity: 'Farming (crops), Livestock keeping',
        livestock_diseases: 'Lumpy skin disease, Anthrax',
        human_diseases: 'Cholera, Cold and flu',
        wildlife_trends: 'Increased',
        water_quality: 'Good',
        drought_preparedness: 'Fully prepared',
        major_stressors: 'Human-wildlife conflict (elephants destroying crops)',
        extreme_climate_response: 'Diversify crops, Water harvesting'
    },
    {
        location_name: 'Olgulului',
        latitude: -2.6841,
        longitude: 37.1420,
        economic_activity: 'Pastoralism',
        livestock_diseases: 'CCPP, Helminthiasis',
        human_diseases: 'Diarrhoea, Eye infections',
        wildlife_trends: 'No Change',
        water_quality: 'Poor',
        drought_preparedness: 'Not prepared at all',
        major_stressors: 'Distance to water sources, Lack of pasture',
        extreme_climate_response: 'Migration with livestock, Depend on government aid'
    },
    {
        location_name: 'Eselenkei',
        latitude: -2.2533,
        longitude: 37.3888,
        economic_activity: 'Pastoralism, Beekeeping',
        livestock_diseases: 'Trypanosomiasis',
        human_diseases: 'Skin diseases, Typhoid',
        wildlife_trends: 'Decreased',
        water_quality: 'Fair',
        drought_preparedness: 'Somehow prepared',
        major_stressors: 'Drying up of rivers, High temperatures',
        extreme_climate_response: 'Digging deeper wells, Purchasing hay'
    },
    {
        location_name: 'Kimana',
        latitude: -2.7167,
        longitude: 37.5333,
        economic_activity: 'Irrigation farming, Tourism',
        livestock_diseases: 'FMD, Rift Valley Fever',
        human_diseases: 'Malaria, Brucellosis',
        wildlife_trends: 'Increased',
        water_quality: 'Good',
        drought_preparedness: 'Fully prepared',
        major_stressors: 'Flooding during heavy rains, Crop diseases',
        extreme_climate_response: 'Planting drought-resistant crops, Building gabions'
    }
];

async function seedData() {
    console.log('\n--- HOW TO SEED DATA ---');
    console.log('You need to run the following SQL command in your Supabase SQL editor to seed the map with observation points.');
    console.log('This bypasses the need for an admin API key while satisfying the database schema.');
    console.log('------------------------\n');

    let sqlString = `INSERT INTO one_health_data (location_name, latitude, longitude, economic_activity, livestock_diseases, human_diseases, wildlife_trends, water_quality, drought_preparedness, major_stressors, extreme_climate_response, user_id) VALUES \n`;

    // Using a generic valid UUID or selecting an existing one using a subquery. 
    // Since user_id references auth.users, we use a subquery to grab the first user ID available in the system
    const valuesList = dummyData.map(d =>
        `('${d.location_name}', ${d.latitude}, ${d.longitude}, '${d.economic_activity}', '${d.livestock_diseases}', '${d.human_diseases}', '${d.wildlife_trends}', '${d.water_quality}', '${d.drought_preparedness}', '${d.major_stressors}', '${d.extreme_climate_response}', (SELECT id FROM auth.users LIMIT 1))`
    ).join(',\n');

    console.log(sqlString + valuesList + ';\n');
}

seedData();
