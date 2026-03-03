const fs = require('fs');
let text = fs.readFileSync('src/App.vue', 'utf8');

text = text.replace('<PastureLevel class="min-h-screen" />', '<PastureLevel v-if="activeSection === \'pasture\'" class="min-h-screen pt-4 pb-12" />');
text = text.replace('<HabitatChanges />', '<HabitatChanges v-if="activeSection === \'habitat\'" class="min-h-screen pt-4 pb-12" />');
text = text.replace('<CommunityDiaries />', '<CommunityDiaries v-if="activeSection === \'diaries\'" class="min-h-screen pt-4 pb-12" />');
text = text.replace('<WeatherForecast />', '<WeatherForecast v-if="activeSection === \'weather\'" class="min-h-screen pt-4 pb-12" />');
text = text.replace('<OutlookReports />', '<OutlookReports v-if="activeSection === \'outlook\'" class="min-h-screen pt-4 pb-12" />');
text = text.replace('<DroughtStory />', '<DroughtStory v-if="activeSection === \'drought\'" class="min-h-screen pt-4 pb-12" />');
text = text.replace('<OneHealth />', '<OneHealth v-if="activeSection === \'onehealth\'" class="min-h-screen pt-4 pb-12" />');

// Remove separators
text = text.replace(/<div class="section-sep" \/>\s*/g, '');

// update ref logic
text = text.replace("const activeSection = ref('')", "const activeSection = ref('')\nprovide('activeSection', activeSection)");
text = text.replace("if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })", "if (id !== '__top') { activeSection.value = id; window.scrollTo({ top: 0, behavior: 'instant' }); } else { activeSection.value = ''; window.scrollTo({ top: 0, behavior: 'instant' }); }");

fs.writeFileSync('src/App.vue', text);
console.log('Done');
