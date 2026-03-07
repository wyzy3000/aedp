const fs = require('fs');

try {
    let c = fs.readFileSync('src/views/DashboardOneHealth.vue', 'utf8');

    // 1. Header removal
    c = c.replace(
        /<div class="mb-10 fade-up">[\s\S]*?<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">/,
        '<div class="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">'
    );

    // Replace forest focus borders with orange
    c = c.replace(/focus:border-forest-500/g, 'focus:border-[#Fbb03a]');
    c = c.replace(/focus:border-forest-400/g, 'focus:border-[#Fbb03a]');

    // 2. Area Info extracting and modification
    const aiMatch = c.match(/<div v-if="viewMode === 'info'"[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>/);
    if (aiMatch) {
        let aiHtml = aiMatch[0];

        aiHtml = aiHtml.replace(/<div v-if="viewMode === 'info'" class="rounded-2xl border border-white\/10 bg-white\/5 backdrop-blur-sm p-7 xl:p-10 relative min-h-\[500px\]">/, '<div class="rounded-2xl border border-white/10 bg-[#0a160c] p-6 shadow-xl flex-1 flex flex-col relative h-[500px] overflow-y-auto custom-scroll">');
        aiHtml = aiHtml.replace(/<span class="material-symbols-outlined text-4xl mb-3">touch_app<\/span>/, '<span class="material-symbols-outlined text-4xl mb-3 text-white/30">touch_app</span>');
        aiHtml = aiHtml.replace(/text-forest-400/g, 'text-[#Fbb03a]');
        aiHtml = aiHtml.replace(/bg-forest-900\/30/g, 'bg-[#Fbb03a]/20');
        aiHtml = aiHtml.replace(/border-forest-500\/30/g, 'border-[#Fbb03a]/30');

        // Add edit buttons
        aiHtml = aiHtml.replace(
            /<\/div>\n\s*<\/h2>/,
            `\n                    </div>\n                 </h2>\n                 <div v-if="selectedInfo && user" class="flex items-center gap-2 mb-4 justify-end">\n                    <button type="button" @click="editEntry(selectedInfo)" class="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg font-semibold transition-colors text-white"><span class="material-symbols-outlined text-[14px] align-middle mr-1">edit</span> Edit Selection</button>\n                    <button type="button" @click="deleteEntry(selectedInfo.id)" class="text-xs border border-red-500/20 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-semibold transition-colors"><span class="material-symbols-outlined text-[14px] align-middle mr-1">delete</span> Delete Selection</button>\n                 </div>`
        );

        // 3. Replace My Map points inside left col
        c = c.replace(
            /<div class="rounded-2xl border border-white\/10 bg-\[#0a160c\] p-6 shadow-xl flex-1 flex flex-col">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<div class="lg:col-span-7 fade-up" style="animation-delay: 100ms;">/,
            `${aiHtml}\n        </div>\n\n        <div class="fade-up" style="animation-delay: 100ms;">`
        );
    }

    // 4. Clean up Right Col: remove toggle buttons and old Area Info HTML
    c = c.replace(
        /<div class="flex justify-end mb-4">[\s\S]*?<form v-else/,
        '<form '
    );

    // 5. Update submit button
    const p1 = `<button type="submit"
                    class="mt-8 w-full py-4 rounded-xl font-bold text-white transition-all duration-300 bg-forest-600 hover:bg-forest-500 shadow-lg shadow-forest-900/50 flex items-center justify-center gap-2 text-lg">
              <span class="material-symbols-outlined">{{ isEditing ? 'save_as' : 'cloud_upload' }}</span>
              {{ isEditing ? 'Update Map Point' : 'Publish to Map' }}
            </button>`;

    const p2 = `<div class="flex justify-end mt-8">
              <button type="submit"
                      class="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 bg-[#Fbb03a] hover:bg-[#e09e34] shadow-lg shadow-[#Fbb03a]/25 flex items-center justify-center gap-2 text-sm">
                <span class="material-symbols-outlined">{{ isEditing ? 'save_as' : 'check_circle' }}</span>
                {{ isEditing ? 'Save Changes' : 'Submit Record' }}
              </button>
            </div>`;
    c = c.replace(p1, p2);

    // Fix remaining form background and border
    c = c.replace(
        /class="rounded-2xl border border-white\/10 bg-white\/5 backdrop-blur-sm p-7 xl:p-10 relative"/,
        'class="rounded-2xl border border-white/10 bg-[#0a160c] p-7 xl:p-10 relative h-full shadow-xl"'
    );

    // Ensure 'Area Information Survey' text uses the right term
    c = c.replace('Area Information Survey', 'Area Information');

    // Minor UI fixes: Map height can be a bit larger now since header is gone
    c = c.replace(/h-\[300px\]/, 'h-[340px]');

    fs.writeFileSync('src/views/DashboardOneHealth.vue', c, 'utf8');
    console.log('Success');
} catch (e) {
    console.error(e);
}
