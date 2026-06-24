<template>
  <section class="relative min-h-screen overflow-hidden py-6 md:py-16">
    <!-- Background elements -->
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 50% 10%, rgba(224,158,52,0.06) 0%, transparent 60%)" />

    <div class="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-12 w-full">
      <!-- Page Header -->
      <div class="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-1 h-6 rounded-full bg-[#E09E34]" />
            <span class="text-xs font-semibold uppercase tracking-[0.2em] text-[#E09E34]/80">System Management</span>
          </div>
          <h1 class="font-display font-extrabold text-3xl md:text-4xl text-white">Portal Content Editor</h1>
          <p class="text-xs text-white/50 mt-1">Dynamically update headings, copy, timelines, and datasets across the entire portal.</p>
        </div>

        <div class="flex items-center gap-3">
          <button @click="saveActivePage" :disabled="saving || cmsStore.loading"
                  class="flex items-center gap-2 px-5 py-2.5 bg-[#E09E34] hover:bg-[#c9861f] text-white rounded-xl text-xs font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#E09E34]/15">
            <span v-if="saving" class="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            <span class="material-symbols-outlined text-[16px]" v-else>save</span>
            {{ saving ? 'Saving Changes...' : 'Save Portal Changes' }}
          </button>
        </div>
      </div>

      <!-- Messages Toast -->
      <div class="flex flex-col gap-2 mb-6">
        <div v-if="successMsg" class="p-3 px-5 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold flex items-center gap-2 animate-pulse w-fit">
          <span class="material-symbols-outlined text-[16px]">check_circle</span>
          {{ successMsg }}
        </div>
        <div v-if="errorMsg || cmsStore.error" class="p-3 px-5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold flex items-center gap-2 w-fit">
          <span class="material-symbols-outlined text-[16px]">error</span>
          {{ errorMsg || cmsStore.error }}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Sidebar Navigation (Page selection) -->
        <div class="lg:col-span-3 space-y-2">
          <div class="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <span class="block text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] mb-3 px-2">Select Page Component</span>
            <div class="space-y-1">
              <button v-for="tab in tabs" :key="tab.key"
                      @click="switchTab(tab.key)"
                      class="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs font-semibold transition-all duration-200 border"
                      :class="activeTab === tab.key
                        ? 'bg-[#E09E34]/10 border-[#E09E34]/30 text-[#E09E34] shadow-sm'
                        : 'bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/5 hover:border-white/5'">
                <span class="material-symbols-outlined text-[18px]">{{ tab.icon }}</span>
                <span>{{ tab.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Editor Form Panel -->
        <div class="lg:col-span-9">
          <div class="bg-[#1C1F22] border border-white/10 rounded-2xl p-6 md:p-8 relative min-h-[400px]">
            <div v-if="cmsStore.loading && !saving" class="absolute inset-0 bg-[#1C1F22]/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-20">
              <div class="w-8 h-8 border-3 border-[#E09E34]/30 border-t-[#E09E34] rounded-full animate-spin mb-3" />
              <p class="text-white/60 text-xs">Loading page contents...</p>
            </div>

            <!-- ─── TAB 1: HOME VIEW EDITOR ─── -->
            <div v-if="activeTab === 'home_page'" class="space-y-6">
              <h2 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-stone-400">home</span> Home Page Settings
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- English Home -->
                <div class="space-y-4 bg-white/[0.02] p-5 rounded-xl border border-white/5">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider mb-2">English Copy</span>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5 font-medium">Page Title</label>
                    <input v-model="formHome.titleEn" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5 font-medium">Subtitle Gradient Text</label>
                    <input v-model="formHome.subtitleEn" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5 font-medium">Description</label>
                    <textarea v-model="formHome.descEn" rows="4" class="form-input resize-none" />
                  </div>
                </div>

                <!-- Swahili Home -->
                <div class="space-y-4 bg-white/[0.02] p-5 rounded-xl border border-white/5">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider mb-2">Kiswahili Copy</span>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5 font-medium">Kichwa cha Ukurasa</label>
                    <input v-model="formHome.titleSw" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5 font-medium">Kichwa cha Chini</label>
                    <input v-model="formHome.subtitleSw" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5 font-medium">Maelezo</label>
                    <textarea v-model="formHome.descSw" rows="4" class="form-input resize-none" />
                  </div>
                </div>
              </div>
            </div>

            <!-- ─── TAB 2: ABOUT VIEW EDITOR ─── -->
            <div v-if="activeTab === 'about_page'" class="space-y-6">
              <h2 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-stone-400">info</span> About AEDP Settings
              </h2>
              
              <div class="grid grid-cols-1 gap-6">
                <!-- Titles and Descriptions -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5">
                  <div class="space-y-3">
                    <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">English Header</span>
                    <div>
                      <label class="block text-xs text-white/50 mb-1.5">Section Title</label>
                      <input v-model="formAbout.titleEn" type="text" class="form-input" />
                    </div>
                    <div>
                      <label class="block text-xs text-white/50 mb-1.5">Ecosystem Summary</label>
                      <textarea v-model="formAbout.descEn" rows="4" class="form-input resize-none" />
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">Kiswahili Header</span>
                    <div>
                      <label class="block text-xs text-white/50 mb-1.5">Kichwa</label>
                      <input v-model="formAbout.titleSw" type="text" class="form-input" />
                    </div>
                    <div>
                      <label class="block text-xs text-white/50 mb-1.5">Maelezo ya Ikolojia</label>
                      <textarea v-model="formAbout.descSw" rows="4" class="form-input resize-none" />
                    </div>
                  </div>
                </div>

                <!-- Findings bullets list -->
                <div class="bg-white/[0.02] p-5 rounded-xl border border-white/5">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider mb-4">"What you will find" Bullet Points (English)</span>
                  <div class="space-y-3 mb-4">
                    <div v-for="(bullet, index) in formAbout.findings" :key="index" class="flex gap-2 items-center">
                      <input v-model="formAbout.findings[index]" type="text" class="form-input" />
                      <button @click="removeBullet('findings', index)" class="p-2 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-lg">
                        <span class="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                  <button @click="addBullet('findings')" class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px]">add</span> Add Bullet Point
                  </button>
                </div>

                <!-- Credits Section -->
                <div class="bg-white/[0.02] p-5 rounded-xl border border-white/5 space-y-4">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">Credits & Partners</span>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs text-white/50 mb-1.5">Principal Investigator</label>
                      <input v-model="formAbout.credits.pi" type="text" class="form-input" />
                    </div>
                    <div>
                      <label class="block text-xs text-white/50 mb-1.5">Contact Email</label>
                      <input v-model="formAbout.credits.email" type="text" class="form-input" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">AEDP Team Members (Comma-separated)</label>
                    <input v-model="formAbout.credits.team" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Associated Institutions</label>
                    <input v-model="formAbout.credits.association" type="text" class="form-input" />
                  </div>
                </div>
              </div>
            </div>

            <!-- ─── TAB 3: PASTURE LEVEL EDITOR ─── -->
            <div v-if="activeTab === 'pasture_level'" class="space-y-6">
              <h2 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-stone-400">sprout</span> Pasture Level Settings
              </h2>
              
              <!-- Pasture header copy -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5">
                <div class="space-y-3">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">English Headlines</span>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Pasture Level Title</label>
                    <input v-model="formPasture.titleEn" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Pasture Subtitle</label>
                    <input v-model="formPasture.subtitleEn" type="text" class="form-input" />
                  </div>
                </div>
                
                <div class="space-y-3">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">Kiswahili Headlines</span>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Kichwa cha Nyasi</label>
                    <input v-model="formPasture.titleSw" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Kichwa cha Chini</label>
                    <input v-model="formPasture.subtitleSw" type="text" class="form-input" />
                  </div>
                </div>
              </div>

              <!-- Pasture Years Dataset list -->
              <div class="bg-white/[0.02] p-5 rounded-xl border border-white/5">
                <div class="flex items-center justify-between mb-4">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">Year-by-Year NDVI Dataset</span>
                  <button @click="openPastureYearModal(null)" class="px-3.5 py-1.5 bg-[#E09E34]/15 hover:bg-[#E09E34]/30 border border-[#E09E34]/20 text-[#E09E34] rounded-lg text-xs font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">add</span> Add Year Entry
                  </button>
                </div>

                <div class="overflow-x-auto rounded-lg border border-white/5">
                  <table class="w-full text-left text-xs text-white/70">
                    <thead class="text-[10px] uppercase bg-white/5 text-white/40 border-b border-white/5">
                      <tr>
                        <th class="px-4 py-3">Year</th>
                        <th class="px-4 py-3">NDVI</th>
                        <th class="px-4 py-3">Label (EN/SW)</th>
                        <th class="px-4 py-3">Color</th>
                        <th class="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                      <tr v-for="(item, idx) in sortedPastureYears" :key="item.year" class="hover:bg-white/[0.02]">
                        <td class="px-4 py-3 font-semibold text-white">{{ item.year }}</td>
                        <td class="px-4 py-3 font-mono">{{ item.ndvi }}</td>
                        <td class="px-4 py-3">
                          <div class="flex flex-col">
                            <span>{{ item.labelEn }}</span>
                            <span class="text-[10px] text-white/30">{{ item.labelSw }}</span>
                          </div>
                        </td>
                        <td class="px-4 py-3">
                          <div class="flex items-center gap-1.5">
                            <div class="w-3.5 h-3.5 rounded-full border border-white/10" :style="{ backgroundColor: item.lineColor }" />
                            <span class="font-mono text-[10px] uppercase">{{ item.lineColor }}</span>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-right">
                          <div class="flex items-center justify-end gap-1.5">
                            <button @click="openPastureYearModal(item)" class="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-[#E09E34]" title="Edit Entry">
                              <span class="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button @click="deletePastureYear(item.year)" class="p-1.5 hover:bg-red-500/10 rounded text-white/60 hover:text-red-400" title="Delete Entry">
                              <span class="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- ─── TAB 4: HABITAT CHANGES EDITOR ─── -->
            <div v-if="activeTab === 'habitat_changes'" class="space-y-6">
              <h2 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-stone-400">trees</span> Habitat Changes Settings
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5">
                <div class="space-y-3">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">English Headlines</span>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Section Title</label>
                    <input v-model="formHabitat.titleEn" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Subtitle</label>
                    <input v-model="formHabitat.subtitleEn" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Description Context</label>
                    <textarea v-model="formHabitat.descEn" rows="4" class="form-input resize-none" />
                  </div>
                </div>
                
                <div class="space-y-3">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">Kiswahili Headlines</span>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Kichwa cha Makazi</label>
                    <input v-model="formHabitat.titleSw" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Kichwa cha Chini</label>
                    <input v-model="formHabitat.subtitleSw" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Maelezo ya Makazi</label>
                    <textarea v-model="formHabitat.descSw" rows="4" class="form-input resize-none" />
                  </div>
                </div>
              </div>

              <!-- Available Maps list of years -->
              <div class="bg-white/[0.02] p-5 rounded-xl border border-white/5 space-y-4">
                <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">Configured Map Years (Comma-separated)</span>
                <div>
                  <input v-model="formHabitat.yearsListStr" type="text" placeholder="e.g. 1950, 1967, 1973..." class="form-input" />
                  <p class="text-[10px] text-white/30 mt-1.5 uppercase tracking-wide">Ensure map asset images exist in `src/assets/mapsv1/[year].png` or `[year].jpg`.</p>
                </div>
              </div>
            </div>

            <!-- ─── TAB 5: OUTLOOK REPORTS EDITOR ─── -->
            <div v-if="activeTab === 'outlook_report'" class="space-y-6">
              <h2 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-stone-400">cloud</span> Outlook Reports Settings
              </h2>
              
              <!-- Section Headers -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5">
                <div class="space-y-3">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">English Headlines</span>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Outlook Title</label>
                    <input v-model="formOutlook.titleEn" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Subtitle</label>
                    <input v-model="formOutlook.subtitleEn" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Description</label>
                    <textarea v-model="formOutlook.descEn" rows="2" class="form-input resize-none" />
                  </div>
                </div>
                
                <div class="space-y-3">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">Kiswahili Headlines</span>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Kichwa cha Mwelekeo</label>
                    <input v-model="formOutlook.titleSw" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Kichwa cha Chini</label>
                    <input v-model="formOutlook.subtitleSw" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Maelezo</label>
                    <textarea v-model="formOutlook.descSw" rows="2" class="form-input resize-none" />
                  </div>
                </div>
              </div>

              <!-- Main syntheses reports -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5">
                <div>
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider mb-2">English Synthesis Summary</span>
                  <textarea v-model="formOutlook.summaryEn" rows="6" class="form-input resize-none" />
                </div>
                <div>
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider mb-2">Kiswahili Synthesis Summary</span>
                  <textarea v-model="formOutlook.summarySw" rows="6" class="form-input resize-none" />
                </div>
              </div>

              <!-- Outlook Active Conditions -->
              <div class="bg-white/[0.02] p-5 rounded-xl border border-white/5 space-y-4">
                <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">Ecosystem Status Indicators</span>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-for="cond in formOutlook.conditions" :key="cond.key" class="p-4 bg-black/20 rounded-xl border border-white/5 space-y-3">
                    <span class="block text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-1 flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[16px] text-white/40">circle</span>
                      {{ cond.label }} Status
                    </span>
                    
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-[10px] text-white/50 mb-1">Status (EN)</label>
                        <input v-model="cond.status" type="text" class="form-input !py-1.5 text-xs" />
                      </div>
                      <div>
                        <label class="block text-[10px] text-white/50 mb-1">Status (SW)</label>
                        <input v-model="cond.statusSw" type="text" class="form-input !py-1.5 text-xs" />
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-[10px] text-white/50 mb-1">Hex Color</label>
                        <input v-model="cond.color" type="text" class="form-input !py-1.5 text-xs font-mono" />
                      </div>
                      <div>
                        <label class="block text-[10px] text-white/50 mb-1">Background style</label>
                        <input v-model="cond.bg" type="text" class="form-input !py-1.5 text-xs font-mono" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ─── TAB 6: DROUGHT TIMELINE EDITOR ─── -->
            <div v-if="activeTab === 'drought_story'" class="space-y-6">
              <h2 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-stone-400">warning</span> Drought Story Settings
              </h2>
              
              <!-- Drought page headers -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-5 rounded-xl border border-white/5">
                <div class="space-y-3">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">English Headlines</span>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Timeline Title</label>
                    <input v-model="formDrought.titleEn" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Subtitle</label>
                    <input v-model="formDrought.subtitleEn" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Context Description</label>
                    <textarea v-model="formDrought.descEn" rows="4" class="form-input resize-none" />
                  </div>
                </div>
                
                <div class="space-y-3">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">Kiswahili Headlines</span>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Kichwa cha Timeline</label>
                    <input v-model="formDrought.titleSw" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Kichwa cha Chini</label>
                    <input v-model="formDrought.subtitleSw" type="text" class="form-input" />
                  </div>
                  <div>
                    <label class="block text-xs text-white/50 mb-1.5">Maelezo ya Timeline</label>
                    <textarea v-model="formDrought.descSw" rows="4" class="form-input resize-none" />
                  </div>
                </div>
              </div>

              <!-- Timeline Events list -->
              <div class="bg-white/[0.02] p-5 rounded-xl border border-white/5">
                <div class="flex items-center justify-between mb-4">
                  <span class="block text-[10px] font-bold text-[#E09E34] uppercase tracking-wider">Drought Timeline Events</span>
                  <button @click="openDroughtEventModal(null)" class="px-3.5 py-1.5 bg-[#E09E34]/15 hover:bg-[#E09E34]/30 border border-[#E09E34]/20 text-[#E09E34] rounded-lg text-xs font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">add</span> Add Event Entry
                  </button>
                </div>

                <div class="space-y-3">
                  <div v-for="(event, idx) in formDrought.events" :key="idx" class="p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex items-start gap-4 justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider">{{ event.period }}</span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-semibold text-black uppercase tracking-wider" :style="{ backgroundColor: event.color }">{{ event.phase }}</span>
                        <span class="text-white font-bold text-xs truncate">{{ event.title }}</span>
                      </div>
                      <p class="text-xs text-white/60 leading-relaxed line-clamp-2">{{ event.description }}</p>
                      
                      <!-- Metrics chips preview -->
                      <div class="flex flex-wrap gap-1.5 mt-2.5">
                        <div v-for="m in event.metrics" :key="m.label" class="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] flex items-center gap-1">
                          <span class="font-bold" :style="{ color: event.color }">{{ m.value }}</span>
                          <span class="text-white/40">{{ m.label }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-1.5 ml-4 flex-shrink-0">
                      <button @click="openDroughtEventModal(event, idx)" class="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all">
                        <span class="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button @click="deleteDroughtEvent(idx)" class="p-2 hover:bg-red-500/10 rounded-lg text-white/50 hover:text-red-400 transition-all">
                        <span class="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- ─── SUB-MODAL 1: PASTURE YEAR EDITOR ─── -->
    <div v-if="pastureModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" @click="pastureModalOpen = false" />
      <div class="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#1C1F22] p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div class="mb-4 flex items-center justify-between border-b border-white/5 pb-2">
          <h3 class="text-white font-bold text-sm uppercase tracking-wider">
            {{ editingPastureIndex === null ? 'Add Year Entry' : 'Edit Year Entry' }}
          </h3>
          <button @click="pastureModalOpen = false" class="text-white/40 hover:text-white transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 pr-1">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Year</label>
              <input v-model.number="tempPastureYear.year" type="number" class="form-input text-sm" :disabled="editingPastureIndex !== null" />
            </div>
            <div>
              <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">NDVI (0.0 to 1.0)</label>
              <input v-model.number="tempPastureYear.ndvi" type="number" step="0.01" class="form-input text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Label (English)</label>
              <input v-model="tempPastureYear.labelEn" type="text" class="form-input text-sm" />
            </div>
            <div>
              <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Label (Kiswahili)</label>
              <input v-model="tempPastureYear.labelSw" type="text" class="form-input text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Line/Chart Color</label>
              <input v-model="tempPastureYear.lineColor" type="text" class="form-input text-sm font-mono" />
            </div>
            <div>
              <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Grass Sway Color</label>
              <input v-model="tempPastureYear.grassColor" type="text" class="form-input text-sm font-mono" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
            <div>
              <label class="block text-[9px] text-white/40 mb-1 uppercase tracking-wider">Min Grass Height (px)</label>
              <input v-model.number="tempPastureYear.grassMinH" type="number" class="form-input !py-1 text-xs" />
            </div>
            <div>
              <label class="block text-[9px] text-white/40 mb-1 uppercase tracking-wider">Max Grass Height (px)</label>
              <input v-model.number="tempPastureYear.grassMaxH" type="number" class="form-input !py-1 text-xs" />
            </div>
            <div>
              <label class="block text-[9px] text-white/40 mb-1 uppercase tracking-wider">Sway Duration (sec)</label>
              <input v-model.number="tempPastureYear.swaySpeed" type="number" step="0.1" class="form-input !py-1 text-xs" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
            <div>
              <label class="block text-[9px] text-white/40 mb-1 uppercase tracking-wider">Grass Opacity (0.0–1.0)</label>
              <input v-model.number="tempPastureYear.grassOpacity" type="number" step="0.05" class="form-input !py-1 text-xs" />
            </div>
            <div>
              <label class="block text-[9px] text-white/40 mb-1 uppercase tracking-wider">Soil Color (Hex)</label>
              <input v-model="tempPastureYear.soilColor" type="text" class="form-input !py-1 text-xs font-mono" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Context Narrative (English)</label>
            <textarea v-model="tempPastureYear.contextEn" rows="3" class="form-input text-xs resize-none" />
          </div>

          <div>
            <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Context Narrative (Kiswahili)</label>
            <textarea v-model="tempPastureYear.contextSw" rows="3" class="form-input text-xs resize-none" />
          </div>
        </div>

        <div class="mt-5 pt-3 border-t border-white/5 flex gap-3">
          <button @click="pastureModalOpen = false" class="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white">Cancel</button>
          <button @click="savePastureYear" class="flex-1 py-2 bg-[#E09E34] hover:bg-[#c9861f] text-white rounded-xl text-xs font-bold">Save Year Entry</button>
        </div>
      </div>
    </div>

    <!-- ─── SUB-MODAL 2: DROUGHT EVENT EDITOR ─── -->
    <div v-if="droughtModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" @click="droughtModalOpen = false" />
      <div class="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#1C1F22] p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div class="mb-4 flex items-center justify-between border-b border-white/5 pb-2">
          <h3 class="text-white font-bold text-sm uppercase tracking-wider">
            {{ editingDroughtIndex === null ? 'Add Timeline Event' : 'Edit Timeline Event' }}
          </h3>
          <button @click="droughtModalOpen = false" class="text-white/40 hover:text-white transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto space-y-4 pr-1">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Period (e.g., Mar – May 2022)</label>
              <input v-model="tempDroughtEvent.period" type="text" class="form-input text-sm" />
            </div>
            <div>
              <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Phase/Tag (e.g., Crisis)</label>
              <input v-model="tempDroughtEvent.phase" type="text" class="form-input text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Tag Hex Color</label>
              <input v-model="tempDroughtEvent.color" type="text" class="form-input text-sm font-mono" placeholder="e.g. #ef4444" />
            </div>
            <div>
              <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Tag Color Darker</label>
              <input v-model="tempDroughtEvent.colorDarker" type="text" class="form-input text-sm font-mono" placeholder="e.g. #dc2626" />
            </div>
          </div>

          <div>
            <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Event Title</label>
            <input v-model="tempDroughtEvent.title" type="text" class="form-input text-sm" />
          </div>

          <div>
            <label class="block text-[10px] text-white/50 mb-1 uppercase font-bold tracking-wider">Event Description</label>
            <textarea v-model="tempDroughtEvent.description" rows="3" class="form-input text-xs resize-none" />
          </div>

          <!-- Dynamic metrics editor inside event -->
          <div class="border-t border-white/5 pt-4">
            <span class="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">Metrics chips (Exactly 3 recommended)</span>
            <div class="space-y-3">
              <div v-for="(metric, mIdx) in tempDroughtEvent.metrics" :key="mIdx" class="grid grid-cols-12 gap-2 items-center">
                <div class="col-span-5">
                  <input v-model="metric.value" type="text" placeholder="Value (e.g. −1.8)" class="form-input !py-1.5 text-xs" />
                </div>
                <div class="col-span-6">
                  <input v-model="metric.label" type="text" placeholder="Label (e.g. SPI-3 index)" class="form-input !py-1.5 text-xs" />
                </div>
                <div class="col-span-1 text-center">
                  <button @click="removeDroughtEventMetric(mIdx)" class="p-1.5 text-red-400 hover:bg-red-500/10 rounded">
                    <span class="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            </div>
            <button @click="addDroughtEventMetric" class="mt-3.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">add</span> Add Metric Chip
            </button>
          </div>
        </div>

        <div class="mt-5 pt-3 border-t border-white/5 flex gap-3">
          <button @click="droughtModalOpen = false" class="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white">Cancel</button>
          <button @click="saveDroughtEvent" class="flex-1 py-2 bg-[#E09E34] hover:bg-[#c9861f] text-white rounded-xl text-xs font-bold">Save Event</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue'
import { useCmsStore } from '../stores/cms'

const isDark = inject('isDark')
const cmsStore = useCmsStore()

const activeTab = ref('home_page')
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const tabs = [
  { key: 'home_page', label: 'Home Page', icon: 'home' },
  { key: 'about_page', label: 'About Page', icon: 'info' },
  { key: 'pasture_level', label: 'Pasture Level', icon: 'sprout' },
  { key: 'habitat_changes', label: 'Habitat Changes', icon: 'trees' },
  { key: 'outlook_report', label: 'Outlook Reports', icon: 'cloud' },
  { key: 'drought_story', label: 'Drought Story', icon: 'warning' },
]

// ─── DEFAULTS & LOCAL STATE BINDINGS ───

// Home Page form state
const formHome = ref({
  titleEn: '', subtitleEn: '', descEn: '',
  titleSw: '', subtitleSw: '', descSw: ''
})

// About Page form state
const formAbout = ref({
  titleEn: '', descEn: '',
  titleSw: '', descSw: '',
  findings: [],
  credits: { pi: '', email: '', team: '', association: '' }
})

// Pasture Page form state
const formPasture = ref({
  titleEn: '', subtitleEn: '',
  titleSw: '', subtitleSw: '',
  years: []
})

// Habitat Page form state
const formHabitat = ref({
  titleEn: '', subtitleEn: '', descEn: '',
  titleSw: '', subtitleSw: '', descSw: '',
  yearsListStr: ''
})

// Outlook Page form state
const formOutlook = ref({
  titleEn: '', subtitleEn: '', descEn: '',
  titleSw: '', subtitleSw: '', descSw: '',
  summaryEn: '', summarySw: '',
  conditions: []
})

// Drought Page form state
const formDrought = ref({
  titleEn: '', subtitleEn: '', descEn: '',
  titleSw: '', subtitleSw: '', descSw: '',
  events: []
})

// Load data helper
const loadActiveTabState = () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (activeTab.value === 'home_page') {
    const defaultData = {
      titleEn: 'Amboseli',
      subtitleEn: 'Data Portal',
      titleSw: 'Amboseli',
      subtitleSw: 'Tovuti ya Takwimu',
      descEn: 'A community-driven decision support interface for the Amboseli Basin. Monitoring pasture, habitat, water, and wildlife health — in real time.',
      descSw: 'Kiolesura cha usaidizi wa maamuzi kinachoendeshwa na jamii kwa Bonde la Amboseli. Kufuatilia malisho, mazingira, maji, na afya ya wanyamapori — kwa wakati halisi.'
    }
    const val = cmsStore.getContent('home_page', defaultData)
    formHome.value = { ...defaultData, ...val }

  } else if (activeTab.value === 'about_page') {
    const defaultData = {
      titleEn: 'About AEDP',
      titleSw: 'Kuhusu AEDP',
      descEn: 'AEDP turns long-term rangeland monitoring into clear, practical stories communities and partners can use. It combines visuals with audio narration (including Maa and Swahili) to support informed decisions across the Amboseli landscape.',
      descSw: 'AEDP inabadilisha ufuatiliaji wa muda mrefu wa malisho kuwa hadithi zilizo wazi na za vitendo ambazo jamii na washirika wanaweza kutumia. Inachanganya picha na maelezo ya sauti (pamoja na Kimaa na Kiswahili) ili kusaidia maamuzi sahihi katika mazingira ya Amboseli.',
      findings: [
        'Long-term pasture and vegetation conditions',
        'Narrated, interactive summaries for quick understanding',
        'Change signals across vegetation, rainfall, wildlife, livestock, and settlements',
        'Insights that help anticipate risk, plan better, and take action'
      ],
      credits: {
        pi: 'Dr. Victor N. Mose, PhD',
        email: 'victor.mose@acc.or.ke, vnmose@gmail.com',
        team: 'Felista Ndunge, Immaculate Ombongi, Sakimba Kimiti, Winfridah Kemunto, David Western',
        association: 'Brandika Technologies and Marketing Agency, and the partners listed on this page.'
      }
    }
    const val = cmsStore.getContent('about_page', defaultData)
    // Deep clone to avoid direct mutations
    formAbout.value = JSON.parse(JSON.stringify({ ...defaultData, ...val }))

  } else if (activeTab.value === 'pasture_level') {
    const defaultData = {
      titleEn: 'The Pasture Levels of Amboseli',
      titleSw: 'Viwango vya Nyasi vya Amboseli',
      subtitleEn: 'Grass Level',
      subtitleSw: 'Kiwango cha Nyasi',
      years: [
        {
          year: 2018, ndvi: 0.55,
          labelEn: 'Good', labelSw: 'Nzuri',
          lineColor: '#4a9e3a', grassColor: '#2d7a1f',
          swaySpeed: 3.5, grassOpacity: 1.0, soilColor: '#2a1a08',
          grassMinH: 40, grassMaxH: 90,
          contextEn: 'Above-average rains in 2018 brought healthy pasture conditions across the basin. Livestock body condition was good and wildlife populations remained stable.',
          contextSw: 'Mvua zaidi ya wastani mwaka wa 2018 ilileta hali nzuri ya malisho katika bonde lote. Hali ya miili ya mifugo ilikuwa nzuri na idadi ya wanyamapori ilibaki thabiti.'
        },
        {
          year: 2019, ndvi: 0.65,
          labelEn: 'Excellent', labelSw: 'Bora Sana',
          lineColor: '#28c443', grassColor: '#1e9a2a',
          swaySpeed: 3.0, grassOpacity: 1.0, soilColor: '#1a2800',
          grassMinH: 65, grassMaxH: 120,
          contextEn: 'Peak pasture year. High NDVI readings across the Amboseli basin, excellent forage availability, and strong short and long rain seasons contributed to thriving grassland ecosystems.',
          contextSw: 'Mwaka wa malisho ya kiwango cha juu zaidi. Vipimo vya juu vya NDVI katika bonde la Amboseli, upatikanaji mzuri wa chakula cha mifugo, na msimu mzuri wa mvua fupi na ndefu ulichangia kustawi kwa mfumo vya ikolojia vya nyasi.'
        },
        {
          year: 2020, ndvi: 0.50,
          labelEn: 'Adequate', labelSw: 'Ya Kutosha',
          lineColor: '#89b83a', grassColor: '#5a8a1a',
          swaySpeed: 3.8, grassOpacity: 1.0, soilColor: '#22180a',
          grassMinH: 35, grassMaxH: 78,
          contextEn: 'A moderate year with some variability in seasonal rainfall. Overall pasture conditions remained adequate, though slight stress was observed in northern rangeland areas.',
          contextSw: 'Mwaka wa wastani wenye mabadiliko katika mvua za msimu. Hali ya jumla ya malisho ilibaki ya kutosha, ingawa changamoto kidogo ilionekana katika maeneo ya kaskazini ya malisho.'
        },
        {
          year: 2021, ndvi: 0.42,
          labelEn: 'Stressed', labelSw: 'Hali Dhaifu',
          lineColor: '#c8a020', grassColor: '#b08b1a',
          swaySpeed: 4.5, grassOpacity: 0.9, soilColor: '#2a1c06',
          grassMinH: 14, grassMaxH: 48,
          contextEn: 'First signs of a developing drought cycle. The 2021 short rains (OND) failed significantly, triggering early warnings for the ecosystem. Pasture stress became visible by late November.',
          contextSw: 'Ishara za kwanza za kuanza kwa ukame. Mvua fupi za mwaka 2021 (OND) zilifeli sana, na kusababisha tahadhari ya mapema kwa mfumo wa ikolojia. Hali ngumu ya malisho ilianza kuonekana kufikia mwishoni mwa Novemba.'
        },
        {
          year: 2022, ndvi: 0.18,
          labelEn: 'Severe Drought', labelSw: 'Ukame Mkali',
          lineColor: '#d94f14', grassColor: '#a8460b',
          swaySpeed: 6.5, grassOpacity: 0.75, soilColor: '#3a1e08',
          grassMinH: 4, grassMaxH: 18,
          contextEn: 'Catastrophic La Niña-driven drought — the worst in 40 years. VCI fell below 0.15 across 68% of Kajiado rangeland. Widespread livestock losses, dry water pans, and emergency declarations were recorded.',
          contextSw: 'Ukame mkubwa uliosababishwa na La Niña — mbaya zaidi katika miaka 40. VCI ilianguka chini ya 0.15 katika 68% ya malisho ya Kajiado. Hasara kubwa ya mifugo, mabwawa ya maji kukauka, na matangazo ya dharura yalirekodiwa.'
        },
        {
          year: 2023, ndvi: 0.38,
          labelEn: 'Early Recovery', labelSw: 'Ufufukaji wa Mapema',
          lineColor: '#d4911f', grassColor: '#9c841c',
          swaySpeed: 4.2, grassOpacity: 0.9, soilColor: '#281a06',
          grassMinH: 12, grassMaxH: 42,
          contextEn: 'Long rains returned near-normal in 2023, triggering a slow green flush. NDVI recovered to 60% of baseline by mid-year. Livestock populations remained well below pre-drought levels.',
          contextSw: 'Mvua ndefu zilirejea karibu na wastani mnamo 2023, na kuchochea kurejea polepole kwa uoto wa kijani. NDVI ilirejea hadi 60% ya msingi ifikapo katikati ya mwaka. Idadi ya mifugo ilibaki chini sana ya viwango vya kabla ya ukame.'
        },
        {
          year: 2024, ndvi: 0.54,
          labelEn: 'Recovering', labelSw: 'Inayorejea',
          lineColor: '#6db84a', grassColor: '#4a9c26',
          swaySpeed: 3.2, grassOpacity: 1.0, soilColor: '#201808',
          grassMinH: 38, grassMaxH: 84,
          contextEn: 'Continued recovery across the basin. Pasture conditions returning toward pre-drought norms. Community monitors report improving livestock body condition and returning wildlife movement patterns.',
          contextSw: 'Ufufukaji unaoendelea katika bonde zima. Hali ya malisho inarejea kuelekea kawaida ya kabla ya ukame. Wasimamizi wa jamii wanaripoti kuboreka kwa hali ya mifugo na kurejea kwa mifumo ya harakati ya wanyamapori.'
        }
      ]
    }
    const val = cmsStore.getContent('pasture_level', defaultData)
    formPasture.value = JSON.parse(JSON.stringify({ ...defaultData, ...val }))

  } else if (activeTab.value === 'habitat_changes') {
    const defaultData = {
      titleEn: 'Habitat Conditions',
      titleSw: 'Mabadiliko ya Makazi',
      subtitleEn: 'Tree and Habitat Condition',
      subtitleSw: 'Hali ya miti na makazi',
      descEn: 'Observe spatial shifts in woody cover, wetlands, and open plains. Select a year to view the corresponding satellite terrain mapping.',
      descSw: 'Chunguza mabadiliko ya maeneo ya miti, maeneo ya majimaji, na nyanda wazi. Chagua mwaka ili kuona ramani ya satelaiti ya kipindi husika.',
      yearsList: [1950, 1967, 1973, 1978, 1983, 1987, 1993, 1997, 2002, 2007, 2012, 2017, 2023]
    }
    const val = cmsStore.getContent('habitat_changes', defaultData)
    const cloned = JSON.parse(JSON.stringify({ ...defaultData, ...val }))
    cloned.yearsListStr = (cloned.yearsList || []).join(', ')
    formHabitat.value = cloned

  } else if (activeTab.value === 'outlook_report') {
    const defaultData = {
      titleEn: 'Amboseli Outlook Report',
      titleSw: 'Ripoti ya Mwelekeo ya Amboseli',
      subtitleEn: 'Amboseli Reports',
      subtitleSw: 'Taarifa za Amboseli',
      descEn: 'Expert synthesis of current ecosystem conditions drawn from satellite data, ground-truth surveys, and meteorological analysis.',
      descSw: 'Uchambuzi wa wataalamu wa hali ya sasa ya ikolojia kutoka kwa data ya satelaiti, tafiti za ardhini, na uchambuzi wa hali ya hewa.',
      summaryEn: 'Pasture conditions are showing early signs of recovery across the Amboseli basin following the onset of short rains in late October. Short-term weather forecasts indicate continued rainfall over the next two weeks, which should support further vegetation growth and livestock body condition recovery. However, habitat monitoring shows significant woody cover loss from the previous drought sequence, and wetland margins remain stressed. Community monitors report wildlife movements returning to typical seasonal patterns.',
      summarySw: 'Hali ya malisho inaonyesha ishara za mapema za kurejea katika bonde la Amboseli kufuatia kuanza kwa mvua fupi mwishoni mwa Oktoba. Utabiri wa hali ya hewa wa muda mfupi unaonyesha mvua inayoendelea katika wiki mbili zijazo, ambayo inapaswa kusaidia ukuaji zaidi wa uoto na kurejea kwa hali ya mifugo. Hata hivyo, ufuatiliaji wa makazi unaonyesha upotezaji mkubwa wa misitu kutoka kwa ukame uliopita, na pembezoni mwa ardhi ya majimaji bado kuna changamoto. Waangalizi wa jamii wanaripoti harakati za wanyamapori zikirejea katika mifumo ya kawaida ya msimu.',
      conditions: [
        {
          key: 'pasture',
          label: 'Pasture', sw: 'Nyasi',
          status: 'Recovering', statusSw: 'Inajipona',
          color: '#4a7d41', bg: 'rgba(74,125,65,0.15)'
        },
        {
          key: 'rainfall',
          label: 'Rainfall', sw: 'Mvua',
          status: 'Improving', statusSw: 'Inaimarika',
          color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'
        },
        {
          key: 'wildlife',
          label: 'Wildlife', sw: 'Wanyama',
          status: 'Stable', statusSw: 'Imara',
          color: '#e9c160', bg: 'rgba(233,193,96,0.12)'
        },
        {
          key: 'drought',
          label: 'Drought Risk', sw: 'Hatari ya Kiangazi',
          status: 'Moderate', statusSw: 'Ya Wastani',
          color: '#f97316', bg: 'rgba(249,115,22,0.12)'
        }
      ]
    }
    const val = cmsStore.getContent('outlook_report', defaultData)
    formOutlook.value = JSON.parse(JSON.stringify({ ...defaultData, ...val }))

  } else if (activeTab.value === 'drought_story') {
    const defaultData = {
      titleEn: 'Recent Droughts in Kajiado',
      titleSw: 'Kiangazi Katika Kaunti ya Kajiado',
      subtitleEn: 'Drought Story',
      subtitleSw: 'Drought Story (Kiswahili)',
      descEn: 'A satellite-derived narrative timeline of the 2022–2023 drought sequence in Kajiado County, tracking progression from early stress signals through peak impact and early recovery.',
      descSw: 'Muhtasari wa satelaiti wa mlolongo wa ukame wa 2022-2023 katika Wilaya ya Kajiado, ufuatiliaji wa maendeleo kutoka kwa ishara za mapema za dhiki kupitia athari kubwa na ufufukaji wa mapema.',
      events: [
        {
          period: 'Mar – May 2022',
          phase: 'Early Warning',
          title: 'Long Rains Failure – Third Consecutive Season',
          description: 'Satellite data confirmed failure of the 2022 long rains (MAM), the third consecutive season of below-average rainfall. SPI-3 dropped to −1.8 across Kajiado County. Livestock body conditions began declining, and community reports noted drying water sources.',
          color: '#e9c160', colorDarker: '#d69e2e',
          metrics: [
            { value: '−1.8', label: 'SPI-3 index' },
            { value: '35%', label: 'below avg. rainfall' },
            { value: 'VCI 0.28', label: 'vegetation stress' }
          ]
        },
        {
          period: 'Jun – Sep 2022',
          phase: 'Escalation',
          title: 'Short Rains Delayed – Crisis Deepens',
          description: 'The inter-seasonal dry spell extended into the short rains window. LST anomalies averaged +2.4°C above the 20-year mean. Mass livestock movement eastward observed in MODIS reflectance analysis. First mortality reports in Amboseli heartland.',
          color: '#f97316', colorDarker: '#ea580c',
          metrics: [
            { value: '+2.4°C', label: 'LST anomaly' },
            { value: '−62%', label: 'NDVI vs. baseline' },
            { value: '~15k', label: 'livestock lost (est.)' }
          ]
        },
        {
          period: 'Oct 2022 – Feb 2023',
          phase: 'Peak Impact',
          title: 'Worst Drought in 40 Years – La Niña Driver',
          description: 'Kajiado hit peak drought conditions driven by the 2022–23 La Niña event. VCI fell below 0.15 (extreme drought) across 68% of rangeland. Water pans ran dry. Maasai community declared emergency at sub-county level. Wildebeest migration routes severely disrupted.',
          color: '#ef4444', colorDarker: '#dc2626',
          metrics: [
            { value: 'VCI <0.15', label: 'extreme drought' },
            { value: '68%', label: 'affected rangeland' },
            { value: '4th Drt', label: 'consecutive season' }
          ]
        },
        {
          period: 'Mar – Jun 2023',
          phase: 'Recovery',
          title: 'Long Rains Return – Partial Vegetation Recovery',
          description: 'The 2023 long rains (MAM) arrived near-normal, triggering rapid vegetation green-up. Sentinel-2 NDVI recovered to 60% of baseline by June. However, livestock populations remain 30–40% below pre-drought levels. Water table recovery expected to take 2–3 more seasons.',
          color: '#4a7d41', colorDarker: '#166534',
          metrics: [
            { value: '60%', label: 'NDVI recovery' },
            { value: '−35%', label: 'livestock below baseline' },
            { value: '2–3 Seasons', label: 'for full recovery' }
          ]
        }
      ]
    }
    const val = cmsStore.getContent('drought_story', defaultData)
    formDrought.value = JSON.parse(JSON.stringify({ ...defaultData, ...val }))
  }
}

watch(activeTab, () => {
  loadActiveTabState()
}, { immediate: true })

// Helper to switch tabs safely
const switchTab = (tabKey) => {
  activeTab.value = tabKey
}

// Add/Remove bullet points for About findings list
const addBullet = (key) => {
  formAbout.value[key].push('')
}
const removeBullet = (key, index) => {
  formAbout.value[key].splice(index, 1)
}

// ─── PASTURE SUB-FORM LOGIC ───
const pastureModalOpen = ref(false)
const editingPastureIndex = ref(null)
const tempPastureYear = ref({})

const sortedPastureYears = computed(() => {
  return [...formPasture.value.years].sort((a, b) => a.year - b.year)
})

const openPastureYearModal = (item = null) => {
  if (item === null) {
    editingPastureIndex.value = null
    tempPastureYear.value = {
      year: new Date().getFullYear(),
      ndvi: 0.5,
      labelEn: 'Adequate',
      labelSw: 'Ya Kutosha',
      lineColor: '#89b83a',
      grassColor: '#5a8a1a',
      grassMinH: 30,
      grassMaxH: 80,
      swaySpeed: 3.5,
      grassOpacity: 1.0,
      soilColor: '#201808',
      contextEn: '',
      contextSw: ''
    }
  } else {
    const idx = formPasture.value.years.findIndex(y => y.year === item.year)
    editingPastureIndex.value = idx
    tempPastureYear.value = JSON.parse(JSON.stringify(item))
  }
  pastureModalOpen.value = true
}

const savePastureYear = () => {
  const year = tempPastureYear.value.year
  if (!year || year < 1900 || year > 2100) {
    alert('Please enter a valid year.')
    return
  }
  
  if (editingPastureIndex.value === null) {
    // Check duplication
    if (formPasture.value.years.some(y => y.year === year)) {
      alert(`Year ${year} already exists in the dataset.`)
      return
    }
    formPasture.value.years.push({ ...tempPastureYear.value })
  } else {
    formPasture.value.years[editingPastureIndex.value] = { ...tempPastureYear.value }
  }
  pastureModalOpen.value = false
}

const deletePastureYear = (year) => {
  if (confirm(`Are you sure you want to delete year ${year}?`)) {
    formPasture.value.years = formPasture.value.years.filter(y => y.year !== year)
  }
}

// ─── DROUGHT EVENT SUB-FORM LOGIC ───
const droughtModalOpen = ref(false)
const editingDroughtIndex = ref(null)
const tempDroughtEvent = ref({})

const openDroughtEventModal = (item = null, index = null) => {
  if (item === null) {
    editingDroughtIndex.value = null
    tempDroughtEvent.value = {
      period: '',
      phase: '',
      title: '',
      description: '',
      color: '#ef4444',
      colorDarker: '#dc2626',
      metrics: [
        { value: '', label: '' },
        { value: '', label: '' }
      ]
    }
  } else {
    editingDroughtIndex.value = index
    tempDroughtEvent.value = JSON.parse(JSON.stringify(item))
  }
  droughtModalOpen.value = true
}

const addDroughtEventMetric = () => {
  tempDroughtEvent.value.metrics.push({ value: '', label: '' })
}
const removeDroughtEventMetric = (mIdx) => {
  tempDroughtEvent.value.metrics.splice(mIdx, 1)
}

const saveDroughtEvent = () => {
  if (!tempDroughtEvent.value.period || !tempDroughtEvent.value.title) {
    alert('Please provide a period and title.')
    return
  }

  if (editingDroughtIndex.value === null) {
    formDrought.value.events.push({ ...tempDroughtEvent.value })
  } else {
    formDrought.value.events[editingDroughtIndex.value] = { ...tempDroughtEvent.value }
  }
  droughtModalOpen.value = false
}

const deleteDroughtEvent = (index) => {
  if (confirm('Delete this timeline event permanently?')) {
    formDrought.value.events.splice(index, 1)
  }
}

// ─── SAVE LOGIC FOR ACTIVE PAGE ───
const saveActivePage = async () => {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  let payload = null

  if (activeTab.value === 'home_page') {
    payload = formHome.value
  } else if (activeTab.value === 'about_page') {
    payload = formAbout.value
  } else if (activeTab.value === 'pasture_level') {
    payload = formPasture.value
  } else if (activeTab.value === 'habitat_changes') {
    // Parse yearsListStr back to array of integers
    const yearsArray = formHabitat.value.yearsListStr
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n))
    
    payload = {
      titleEn: formHabitat.value.titleEn,
      subtitleEn: formHabitat.value.subtitleEn,
      descEn: formHabitat.value.descEn,
      titleSw: formHabitat.value.titleSw,
      subtitleSw: formHabitat.value.subtitleSw,
      descSw: formHabitat.value.descSw,
      yearsList: yearsArray
    }
  } else if (activeTab.value === 'outlook_report') {
    payload = formOutlook.value
  } else if (activeTab.value === 'drought_story') {
    payload = formDrought.value
  }

  if (payload) {
    const success = await cmsStore.saveCmsData(activeTab.value, payload)
    if (success) {
      successMsg.value = 'Portal changes saved and deployed successfully!'
      setTimeout(() => { successMsg.value = '' }, 4000)
    } else {
      errorMsg.value = 'Failed to save settings. Please verify database permissions.'
    }
  }
  saving.value = false
}
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 10px 14px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  outline: none;
  font-size: 13px;
  transition: all 0.2s ease;
}
.form-input:focus {
  border-color: #E09E34;
  background-color: rgba(255, 255, 255, 0.07);
}
.form-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Scrollbar tweaks */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 176, 58, 0.2);
  border-radius: 4px;
}
</style>
