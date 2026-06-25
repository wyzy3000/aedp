<template>
  <section id="habitat" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <div class="mb-10 fade-up" ref="headerRef">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full bg-savanna-500" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors">
            {{ lang === 'en' ? 'Module 02 · Habitat' : 'Moduli 02 · Makazi' }}
          </span>
        </div>
        <h2 class="module-title transition-colors" style="letter-spacing:-0.02em">
          {{ lang === 'en' ? cmsData.titleEn : cmsData.titleSw }}
        </h2>
        <p class="mt-3 text-[15px] leading-relaxed max-w-2xl transition-colors" style="color: #ffffff;">
          {{ lang === 'en' ? cmsData.descEn : cmsData.descSw }}
        </p>
      </div>

      <div class="flex flex-wrap gap-2 mb-8 fade-up" ref="selectorRef">
        <button
          v-for="yd in habitatDataSet" :key="yd.year"
          @click="selectedYear = yd.year"
          class="year-btn"
          :class="{ selected: selectedYear === yd.year }">
          {{ yd.year }}
        </button>
      </div>

      <div class="glass-card mb-8 fade-up bg-white/80 dark:bg-[#0a160c]/50 transition-colors" ref="mapRef" style="border-radius:16px;">
        <div class="flex flex-col lg:flex-row gap-2 bg-white dark:bg-white border border-slate-100 transition-colors shadow-2xl" style="height:550px; border-radius:12px; overflow:hidden; padding:8px;">
          <!-- MAP CONTAINER -->
          <div class="relative flex-1 bg-white rounded-lg overflow-hidden border border-slate-50">
            <transition name="map-fade" mode="out-in">
              <img :src="currentYearData.image"
                   :key="selectedYear"
                   class="map-image w-full h-full object-contain absolute inset-0"
                   :alt="`Amboseli Basin map ${selectedYear}`" />
            </transition>

            <div v-if="selectedYear === 2023" class="absolute inset-0 z-[5] pointer-events-none">
              <!-- Example Hotspots for 2023 -->
              <div v-for="hotspot in hotspots" :key="hotspot.id" 
                   class="absolute group pointer-events-auto cursor-help"
                   :style="{ top: hotspot.y + '%', left: hotspot.x + '%' }">
                <div class="relative">
                  <div class="w-2.5 h-2.5 rounded-full border border-white/50 shadow-lg animate-pulse" :style="{ backgroundColor: hotspot.color }"></div>
                  <div class="absolute left-1/2 -top-1 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[9px] font-bold text-white z-20 shadow-xl">
                    {{ hotspot.label }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- EMBEDDED LEGEND -->
          <div class="w-full lg:w-[280px] h-full flex flex-col bg-white rounded-lg p-6 shadow-xl overflow-hidden">
            <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] mb-5 text-center border-b pb-2" style="color: #E09E34; border-color: rgba(224, 158, 52, 0.2);">
              {{ lang === 'en' ? 'Habitat Key' : 'Ufunguo wa Makazi' }}
            </h4>
            
            <div class="flex-1 space-y-4 pr-1">
               <div v-for="item in legendItems" :key="item.label" class="flex items-center gap-3 group">
                 <div class="w-3.5 h-3.5 rounded-sm shadow-sm transition-transform group-hover:scale-125 border border-black/10" :style="{ backgroundColor: item.color }"></div>
                 <div class="flex flex-col">
                   <span class="text-[11px] font-bold text-slate-900">{{ item.label }}</span>
                   <span class="text-[9px] text-slate-500 uppercase tracking-tighter mt-0.5">{{ item.type }}</span>
                 </div>
               </div>
               
               <div class="pt-4 mt-4 border-t border-slate-100">
                 <div class="flex items-center gap-3">
                   <div class="w-4 h-0.5 bg-[#ff0000]"></div>
                   <span class="text-[11px] font-bold text-slate-900">
                     {{ lang === 'en' ? 'Park Boundary' : 'Mpaka wa Hifadhi' }}
                   </span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/5 dark:divide-white/5 border-t border-black/5 dark:border-white/5 transition-colors">
          <div class="px-6 py-4 text-center">
            <p class="text-[13px] text-slate-600 dark:text-neutral-400 mb-1 leading-relaxed transition-colors">
              {{ currentYearData.desc }}
            </p>
          </div>
          <div class="px-6 py-4 flex flex-col items-center justify-center">
            <p class="text-2xl font-display font-bold transition-colors" :class="isDark ? currentYearData.trendColor : 'text-slate-500'">{{ currentYearData.trendValue }}</p>
            <p class="text-xs text-slate-500 dark:text-neutral-500 mt-1 uppercase tracking-widest transition-colors">{{ currentYearData.trendLabel }}</p>
          </div>
          <div class="px-6 py-4 flex flex-col justify-center">
             <div class="flex flex-col gap-2">
                <button @click="toggleAudio" :class="['audio-btn border border-black/10 dark:border-white/10 w-full justify-center', isPlaying ? 'playing bg-savanna-900/40 text-savanna-400 border-savanna-500/50' : '']">
                  <div class="waveform" :class="{ active: isPlaying }">
                    <span /><span /><span /><span /><span />
                  </div>
                  <span v-if="!isPlaying" class="font-medium text-[13px]">
                    {{ lang === 'en' ? '🔊 Play Explanation' : '🔊 Sikiliza Maelezo' }}
                  </span>
                  <span v-else class="font-medium text-[13px]">
                    {{ lang === 'en' ? '⏹ Stop Narration' : '⏹ Simamisha' }}
                  </span>
                </button>
                <p class="text-[10px] text-neutral-600 text-center">
                  source: assets/habitat2.mp3
                </p>
                <audio ref="audioElement" src="/habitat2.mp3" @ended="isPlaying = false" class="hidden"></audio>
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'

import { getActivePinia } from 'pinia'
import { useCmsStore } from '../stores/cms'

const lang = inject('lang')
const isDark = inject('isDark')
const headerRef = ref(null)
const mapRef = ref(null)
const selectorRef = ref(null)

const selectedYear = ref(2023)
const showLegend = ref(false)

const defaultHabitatData = {
  titleEn: 'Habitat Conditions',
  titleSw: 'Mabadiliko ya Makazi',
  subtitleEn: 'Tree and Habitat Condition',
  subtitleSw: 'Hali ya miti na makazi',
  descEn: 'Observe spatial shifts in woody cover, wetlands, and open plains. Select a year to view the corresponding satellite terrain mapping.',
  descSw: 'Chunguza mabadiliko ya maeneo ya miti, maeneo ya majimaji, na nyanda wazi. Chagua mwaka ili kuona ramani ya satelaiti ya kipindi husika.',
  yearsList: [1950, 1967, 1973, 1978, 1983, 1987, 1993, 1997, 2002, 2007, 2012, 2017, 2023]
}

const cmsData = computed(() => {
  if (getActivePinia()) {
    return useCmsStore().getContent('habitat_changes', defaultHabitatData)
  }
  return defaultHabitatData
})
const yearsList = computed(() => cmsData.value.yearsList || defaultHabitatData.yearsList)

const habitatDataSet = computed(() => {
  return yearsList.value.map(y => {
    const ext = [1983, 1997, 2002, 2007].includes(y) ? 'jpg' : 'png'
    return {
      year: y,
      image: new URL(`../assets/mapsv1/${y}.${ext}`, import.meta.url).href,
      trendValue: lang.value === 'en' ? 'Archive' : 'Kumbukumbu',
      trendLabel: lang.value === 'en' ? `Snapshot ${y}` : `Picha ya ${y}`,
      trendColor: 'text-neutral-400',
      desc: lang.value === 'en'
        ? `Satellite landcover and ecosystem footprint across the Amboseli basin during the ${y} period. Observe the shift in dry wood and permanent swamps.`
        : `Utafiti wa satelaiti wa uoto wa ardhi na ikolojia katika bonde la Amboseli katika kipindi cha ${y}. Chunguza mabadiliko ya misitu kavu na mabwawa ya kudumu.`
    }
  })
})

const currentYearData = computed(() => habitatDataSet.value.find(d => d.year === selectedYear.value) || habitatDataSet.value[0])
const selectedYearIndex = computed(() => habitatDataSet.value.findIndex(d => d.year === selectedYear.value))

const legendItems = computed(() => [
  { label: lang.value === 'en' ? 'Dense Bushlands' : 'Vichaka Kizito', color: '#541c19', type: lang.value === 'en' ? 'High Cover' : 'Kifuniko cha Juu' },
  { label: lang.value === 'en' ? 'Dense Woodlands' : 'Misitu Mizito', color: '#134d1c', type: lang.value === 'en' ? 'Tree Canopy' : 'Kilele cha Miti' },
  { label: lang.value === 'en' ? 'Grasslands' : 'Mbuga za Nyasi',      color: '#fffda8', type: lang.value === 'en' ? 'Open Plain' : 'Tandiko Wazi' },
  { label: lang.value === 'en' ? 'Open Bushlands' : 'Vichaka Wazi',  color: '#9e6211', type: lang.value === 'en' ? 'Low Cover' : 'Kifuniko cha Chini' },
  { label: lang.value === 'en' ? 'Open Waters' : 'Maji Wazi',     color: '#969696', type: lang.value === 'en' ? 'Hydrology' : 'Utafiti wa Maji' },
  { label: lang.value === 'en' ? 'Open Woodlands' : 'Misitu Wazi',  color: '#13b313', type: lang.value === 'en' ? 'Scattered Trees' : 'Miti ya Hapa na Pale' },
  { label: lang.value === 'en' ? 'Permanent Swamp' : 'Bwawa la Kudumu', color: '#11108c', type: lang.value === 'en' ? 'Wetland' : 'Ardhi Linganifu' },
  { label: lang.value === 'en' ? 'Sueda' : 'Sueda',           color: '#b0a300', type: lang.value === 'en' ? 'Saline Scrub' : 'Kichaka cha Chumvi' },
  { label: lang.value === 'en' ? 'Swamp Edge' : 'Pambizo la Bwawa',      color: '#00f7f7', type: lang.value === 'en' ? 'Buffer' : 'Kinga' }
])

const hotspots = computed(() => [
  { id: 1, x: 25, y: 70, color: '#11108c', label: lang.value === 'en' ? 'Marshes' : 'Mito/Mabwawa' },
  { id: 2, x: 15, y: 30, color: '#fffda8', label: lang.value === 'en' ? 'Primary Grasslands' : 'Mbuga za Nyasi Kuu' },
  { id: 3, x: 80, y: 60, color: '#9e6211', label: lang.value === 'en' ? 'Acacia Scrub' : 'Vichaka vya Akasia' },
  { id: 4, x: 50, y: 45, color: '#00f7f7', label: lang.value === 'en' ? 'Wetland Buffer' : 'Kinga ya Ardhi Linganifu' }
])

const audioElement = ref(null)
const isPlaying = ref(false)

const toggleAudio = () => {
  if (!audioElement.value) return
  if (isPlaying.value) {
    audioElement.value.pause()
    audioElement.value.currentTime = 0
    isPlaying.value = false
  } else {
    audioElement.value.play().catch(e => console.error("Audio playback failed:", e))
    isPlaying.value = true
  }
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.15 })
  ;[headerRef.value, mapRef.value, selectorRef.value].forEach(el => el && observer.observe(el))
})
</script>

<style scoped>
.year-btn {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.25s ease;
}
.year-btn:hover {
  background: #E09E34;
  border-color: #E09E34;
  color: #ffffff;
}
.year-btn.selected {
  background: #E09E34;
  border-color: #E09E34;
  color: #ffffff;
  font-weight: 700;
}

.waveform {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 14px;
}
.waveform span {
  display: block;
  width: 2px;
  height: 4px;
  background-color: currentColor;
  border-radius: 2px;
  transition: height 0.1s ease;
}
.waveform.active span {
  animation: wave 1s ease-in-out infinite;
}
.waveform.active span:nth-child(2) { animation-delay: 0.2s; }
.waveform.active span:nth-child(3) { animation-delay: 0.4s; }
.waveform.active span:nth-child(4) { animation-delay: 0.6s; }
.waveform.active span:nth-child(5) { animation-delay: 0.8s; }

@keyframes wave {
  0%, 100% { height: 4px; }
  50% { height: 14px; }
}

.map-image {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  filter: contrast(1.15) brightness(1.02) saturate(1.1);
  transition: filter 0.3s ease;
}

.map-image:hover {
  filter: contrast(1.2) brightness(1.05) saturate(1.2);
}

.custom-scroll-light::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scroll-light::-webkit-scrollbar-track { background: transparent; margin-top: 8px; margin-bottom: 8px; }
.custom-scroll-light::-webkit-scrollbar-thumb { background: #64748b; border-radius: 3px; }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.map-fade-enter-active, .map-fade-leave-active {
  transition: opacity 0.25s ease;
}
.map-fade-enter-from, .map-fade-leave-to {
  opacity: 0;
}
</style>
