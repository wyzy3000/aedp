const fs = require('fs');

try {
    const text = fs.readFileSync('src/views/DashboardOneHealth.vue', 'utf8');

    const newTemplate = `<template>
  <section class="relative min-h-screen overflow-hidden pb-20">
    <div class="absolute inset-0 pointer-events-none"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 50% 30%, rgba(74,125,65,0.06) 0%, transparent 60%)" />

    <div class="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 py-12">
      <!-- TABS HEADER -->
      <div class="flex flex-wrap items-center gap-2 mb-6 border-b border-white/10 pb-2">
        <button @click="activeTab = 'pin'" 
                :class="['px-6 py-2.5 rounded-t-xl font-bold transition-all border-b-2', activeTab === 'pin' ? 'text-[#Fbb03a] border-[#Fbb03a] bg-[#Fbb03a]/10' : 'text-white/50 border-transparent hover:text-white hover:bg-white/5']">
          Pin Location
        </button>
        <button @click="activeTab = 'info'" 
                :class="['px-6 py-2.5 rounded-t-xl font-bold transition-all border-b-2', activeTab === 'info' ? 'text-[#Fbb03a] border-[#Fbb03a] bg-[#Fbb03a]/10' : 'text-white/50 border-transparent hover:text-white hover:bg-white/5']">
          Area Information
        </button>
        <div class="flex-1"></div>
        <button @click="openNewForm"
                class="px-6 py-2 rounded-xl font-semibold text-white transition-all duration-300 bg-[#Fbb03a] hover:bg-[#e09e34] shadow-lg shadow-[#Fbb03a]/25 flex items-center justify-center gap-2 text-sm ml-auto">
          <span class="material-symbols-outlined text-[18px]">add</span>
          Record New Data
        </button>
      </div>

      <!-- MAIN CONTENT AREA -->
      <div class="relative min-h-[500px]">

        <!-- TAB 1: PIN AND MAP -->
        <div v-show="activeTab === 'pin'" class="fade-up max-w-[800px] mx-auto w-full">
          <div class="rounded-2xl border border-white/10 bg-[#0a160c] p-6 shadow-xl relative overflow-hidden group">
             <div class="absolute inset-0 bg-[#Fbb03a]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
             
             <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-[#Fbb03a]">pin_drop</span>
                <h3 class="text-white font-bold text-lg">Pin Location</h3>
             </div>
             <p class="text-white/50 text-sm mb-4">Click on the map to view area information or to set coordinates for a new point.</p>
             
             <div id="dashboard-map" class="w-full h-[380px] rounded-xl border border-white/10 mb-4 z-0"></div>
             
             <div class="grid grid-cols-2 gap-4">
               <div>
                 <label class="block text-[10px] font-semibold uppercase text-white/40 mb-1">Latitude</label>
                 <div class="px-3 py-2 bg-white/5 rounded-lg text-white/70 text-sm border border-white/10 cursor-not-allowed">
                   {{ lat ? lat.toFixed(5) : '—' }}
                 </div>
               </div>
               <div>
                 <label class="block text-[10px] font-semibold uppercase text-white/40 mb-1">Longitude</label>
                 <div class="px-3 py-2 bg-white/5 rounded-lg text-white/70 text-sm border border-white/10 cursor-not-allowed">
                   {{ lng ? lng.toFixed(5) : '—' }}
                 </div>
               </div>
             </div>
          </div>
        </div>

        <!-- TAB 2: AREA INFORMATION -->
        <div v-show="activeTab === 'info'" class="fade-up max-w-[800px] mx-auto w-full">
           <div class="rounded-2xl border border-white/10 bg-[#0a160c] p-6 shadow-xl relative min-h-[500px] flex flex-col overflow-y-auto custom-scroll">
              <div v-if="!selectedInfo" class="flex flex-col items-center justify-center h-full text-center opacity-50 absolute inset-0">
                 <span class="material-symbols-outlined text-4xl mb-3 text-white/30">touch_app</span>
                 <h2 class="text-xl font-display font-medium">Select an Observation</h2>
                 <p class="text-sm mt-2 max-w-sm">Click on any blue marker on the map to view detailed area information.</p>
              </div>
              <div v-else class="h-full flex flex-col pt-4">
                 <h2 class="text-white font-display font-bold text-3xl mb-6 pb-4 border-b border-white/10 flex items-start justify-between">
                    Area Details
                 </h2>
                 <div class="flex items-center gap-2 mb-4 justify-end">
                    <button type="button" @click="editEntry(selectedInfo)" class="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg font-semibold transition-colors text-white flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">edit</span> Edit Selection
                    </button>
                    <button type="button" @click="deleteEntry(selectedInfo.id)" class="text-xs border border-red-500/20 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">delete</span> Delete Selection
                    </button>
                 </div>

                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    <div>
                      <p class="text-xs font-semibold uppercase text-[#Fbb03a] mb-1">Location Name</p>
                      <p class="text-white bg-white/5 px-4 py-3 rounded-xl border border-white/10">{{ selectedInfo.location_name || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-semibold uppercase text-[#Fbb03a] mb-1">Point Label</p>
                      <p class="text-white bg-white/5 px-4 py-3 rounded-xl border border-white/10">{{ selectedInfo.point_label || 'N/A' }}</p>
                    </div>
                 </div>

                 <div class="space-y-6">
                    <div>
                      <p class="text-[10px] font-semibold uppercase text-white/40 mb-1">Economic Activity</p>
                      <p class="text-white/80">{{ selectedInfo.economic_activity || 'N/A' }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                       <div>
                         <p class="text-[10px] font-semibold uppercase text-orange-400 mb-1 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">monitor_heart</span> Livestock Diseases</p>
                         <p class="text-white/80">{{ selectedInfo.livestock_diseases || 'N/A' }}</p>
                       </div>
                       <div>
                         <p class="text-[10px] font-semibold uppercase text-red-400 mb-1 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">favorite</span> Human Diseases</p>
                         <p class="text-white/80">{{ selectedInfo.human_diseases || 'N/A' }}</p>
                       </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                       <div>
                         <p class="text-[10px] font-semibold uppercase text-blue-400 mb-1 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">cruelty_free</span> Wildlife Trends</p>
                         <p class="text-white/80">{{ selectedInfo.wildlife_trends || 'N/A' }}</p>
                       </div>
                       <div>
                         <p class="text-[10px] font-semibold uppercase text-cyan-400 mb-1 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">water_drop</span> Water Quality</p>
                         <p class="text-white/80">{{ selectedInfo.water_quality || 'N/A' }}</p>
                       </div>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold uppercase text-white/40 mb-1">Drought Preparedness</p>
                      <p class="text-white/80">{{ selectedInfo.drought_preparedness || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold uppercase text-white/40 mb-1">Major Stressors</p>
                      <p class="text-white/80">{{ selectedInfo.major_stressors || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold uppercase text-white/40 mb-1">Response to Extreme Climate</p>
                      <p class="text-white/80">{{ selectedInfo.extreme_climate_response || 'N/A' }}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>

    <!-- MODAL POPUP FOR SURVEY FORM -->
    <transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 fade-up">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="cancelEdit"></div>
        
        <div class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scroll bg-[#0a160c] rounded-3xl shadow-2xl border border-white/10 p-7 xl:p-10 z-[110]">
          <button @click="cancelEdit" class="absolute top-6 right-6 p-2 rounded-full bg-black/40 text-white/50 hover:text-white hover:bg-black/60 transition-colors border border-white/10 z-[120]">
             <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
          
          <form @submit.prevent="submitForm" class="relative">
            <div v-if="submitting" class="absolute inset-0 bg-[#0a160c]/80 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center">
              <div class="w-10 h-10 border-4 border-[#Fbb03a]/30 border-t-[#Fbb03a] rounded-full animate-spin mb-4" />
              <p class="text-white font-medium">Saving data...</p>
            </div>

            <div class="flex items-center justify-between mb-8">
              <h2 class="text-white font-display font-bold text-3xl flex items-center gap-3">
                {{ isEditing ? 'Edit Existing Point' : 'Area Information Survey' }}
                <span v-if="isEditing && form.point_label" class="text-sm font-normal text-[#Fbb03a] bg-[#Fbb03a]/20 px-2 py-0.5 rounded-full border border-[#Fbb03a]/30 mt-1">
                  {{ form.point_label }}
                </span>
              </h2>
            </div>
            
            <p class="text-white/50 text-sm mb-6 border-b border-white/10 pb-4">Please ensure you have selected/pinned a location on the map before submitting.</p>

            <div class="space-y-6">
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-semibold uppercase text-white/70 mb-2">Location / Area Name <span class="text-red-400">*</span></label>
                  <input v-model="form.location_name" type="text" placeholder="e.g. Olgulului..." required
                         class="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:border-[#Fbb03a] outline-none transition-all text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase text-white/70 mb-2">Point Label / Number <span class="text-red-400">*</span></label>
                  <input v-model="form.point_label" type="text" placeholder="e.g. Point 1, Point 2..." required
                         class="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:border-[#Fbb03a] outline-none transition-all text-sm" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-semibold uppercase text-white/70 mb-2">Main economic activity</label>
                  <input v-model="form.economic_activity" type="text" placeholder="e.g. Livestock keeping, Faming..." required
                         class="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-[#Fbb03a] outline-none transition-all text-sm" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-semibold uppercase text-white/70 mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-orange-400 text-[16px]">monitor_heart</span>
                    Livestock diseases in selected area
                  </label>
                  <input v-model="form.livestock_diseases" type="text" placeholder="e.g. Heart water, FMD..." required
                         class="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-orange-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase text-white/70 mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-red-400 text-[16px]">favorite</span>
                    Human diseases mentioned
                  </label>
                  <input v-model="form.human_diseases" type="text" placeholder="e.g. Malaria, Cold and flu..." required
                         class="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-red-500 outline-none transition-all text-sm" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-semibold uppercase text-white/70 mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-blue-400 text-[16px]">cruelty_free</span>
                    Wildlife trends in selected area
                  </label>
                  <select v-model="form.wildlife_trends" required
                          class="w-full px-4 py-3 rounded-xl bg-[#131b20] border border-white/10 text-white focus:border-blue-500 outline-none transition-all text-sm appearance-none">
                    <option value="" disabled>Select a trend...</option>
                    <option value="Increased">Increased</option>
                    <option value="Decreased">Decreased</option>
                    <option value="No Change">No Change</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold uppercase text-white/70 mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-cyan-400 text-[16px]">water_drop</span>
                    Water quality in your area
                  </label>
                  <select v-model="form.water_quality" required
                          class="w-full px-4 py-3 rounded-xl bg-[#131b20] border border-white/10 text-white focus:border-cyan-500 outline-none transition-all text-sm appearance-none">
                    <option value="" disabled>Select quality...</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase text-white/70 mb-2">Drought preparedness</label>
                <select v-model="form.drought_preparedness" required
                        class="w-full px-4 py-3 rounded-xl bg-[#131b20] border border-white/10 text-white focus:border-[#Fbb03a] outline-none transition-all text-sm appearance-none">
                  <option value="" disabled>Select readiness level...</option>
                  <option value="Fully prepared">Fully prepared</option>
                  <option value="Somehow prepared">Somehow prepared</option>
                  <option value="Not prepared at all">Not prepared at all</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold uppercase text-white/70 mb-2">Major life stressors</label>
                <textarea v-model="form.major_stressors" rows="2" required placeholder="e.g. Frequent droughts, school fees..."
                          class="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-[#Fbb03a] outline-none transition-all text-sm resize-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase text-white/70 mb-2">What can be done in response to extreme climate?</label>
                <textarea v-model="form.extreme_climate_response" rows="2" required placeholder="e.g. Capacity building, hospital food..."
                          class="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:border-[#Fbb03a] outline-none transition-all text-sm resize-none" />
              </div>

            </div>

            <div v-if="submitError" class="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
              {{ submitError }}
            </div>
            <div v-if="submitSuccess" class="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2">
               <span class="material-symbols-outlined">check_circle</span>
               {{ isEditing ? 'Data point updated successfully.' : 'New map point saved successfully!' }}
            </div>

            <div class="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
              <button type="submit"
                      class="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 bg-[#Fbb03a] hover:bg-[#e09e34] shadow-lg shadow-[#Fbb03a]/25 flex items-center justify-center gap-2 text-sm w-full md:w-auto">
                <span class="material-symbols-outlined">{{ isEditing ? 'save_as' : 'check_circle' }}</span>
                {{ isEditing ? 'Save Changes' : 'Submit Record' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </section>
</template>`;

    const finalText = text.replace(/<template>[\s\S]*?<\/template>/, newTemplate);
    fs.writeFileSync('src/views/DashboardOneHealth.vue', finalText, 'utf8');

    console.log("Template rewritten successfully!");
} catch (error) {
    console.error("Error modifying Vue file:", error);
}
