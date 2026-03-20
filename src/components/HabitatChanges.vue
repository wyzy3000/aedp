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
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors">Module 02 · Habitat</span>
        </div>
        <h2 class="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight transition-colors" style="letter-spacing:-0.02em">
          Habitat Dynamics
        </h2>
        <p class="mt-2 font-display font-medium text-lg italic text-[#FBB03A] transition-colors">Hali ya miti na makazi</p>
        <p class="mt-3 text-white/90 text-[15px] leading-relaxed max-w-2xl transition-colors">
          Observe spatial shifts in woody cover, wetlands, and open plains. Select a year to view the corresponding satellite terrain mapping.
        </p>
      </div>

      <div class="flex flex-wrap gap-2 mb-8 fade-up" ref="selectorRef">
        <button
          v-for="yd in habitatDataSet" :key="yd.year"
          @click="selectedYear = yd.year"
          class="year-btn"
          :class="selectedYear === yd.year ? 'selected border-orange-500 text-white dark:text-white bg-orange-500 dark:bg-orange-500' : 'border-black/5 dark:border-white/10 text-slate-600 dark:text-neutral-400 bg-black/5 dark:bg-white/5'">
          {{ yd.year }}
        </button>
      </div>

      <div class="glass-card mb-8 fade-up bg-white/80 dark:bg-[#0a160c]/50 transition-colors" ref="mapRef" style="border-radius:16px;">
        <div class="flex flex-col lg:flex-row gap-2 bg-white dark:bg-white border border-slate-100 transition-colors shadow-2xl" style="height:550px; border-radius:12px; overflow:hidden; padding:8px;">
          <!-- MAP CONTAINER -->
          <div class="relative flex-1 bg-white rounded-lg overflow-hidden border border-slate-50">
            <div v-for="yd in habitatDataSet" :key="yd.year"
                 class="absolute transition-opacity duration-700 ease-in-out inset-0"
                 :style="{ opacity: selectedYear === yd.year ? 1 : 0, zIndex: selectedYear === yd.year ? 2 : 1 }">
              <img :src="yd.image"
                   class="map-image w-full h-full object-contain"
                   :alt="`Amboseli Basin map ${yd.year}`" />
            </div>

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
            <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FBB03A] mb-5 text-center border-b border-[#FBB03A]/20 pb-2">Habitat Key</h4>
            
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
                   <span class="text-[11px] font-bold text-slate-900">Park Boundary</span>
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

const lang = inject('lang')
const isDark = inject('isDark')
const headerRef = ref(null)
const mapRef = ref(null)
const selectorRef = ref(null)

const selectedYear = ref(2023)
const showLegend = ref(false)

const yearsList = [1950, 1967, 1973, 1978, 1983, 1987, 1993, 1997, 2002, 2007, 2012, 2017, 2023]

const habitatDataSet = yearsList.map(y => {
  const ext = [1983, 1997, 2002, 2007].includes(y) ? 'jpg' : 'png'
  return {
    year: y,
    image: new URL(`../assets/mapsv1/${y}.${ext}`, import.meta.url).href,
    trendValue: 'Archive',
    trendLabel: `Snapshot ${y}`,
    trendColor: 'text-neutral-400',
    desc: `Satellite landcover and ecosystem footprint across the Amboseli basin during the ${y} period. Observe the shift in dry wood and permanent swamps.`
  }
})

const currentYearData = computed(() => habitatDataSet.find(d => d.year === selectedYear.value) || habitatDataSet[0])
const selectedYearIndex = computed(() => habitatDataSet.findIndex(d => d.year === selectedYear.value))

const legendItems = [
  { label: 'Dense Bushlands', color: '#541c19', type: 'High Cover' },
  { label: 'Dense Woodlands', color: '#134d1c', type: 'Tree Canopy' },
  { label: 'Grasslands',      color: '#fffda8', type: 'Open Plain' },
  { label: 'Open Bushlands',  color: '#9e6211', type: 'Low Cover' },
  { label: 'Open Waters',     color: '#969696', type: 'Hydrology' },
  { label: 'Open Woodlands',  color: '#13b313', type: 'Scattered Trees' },
  { label: 'Permanent Swamp', color: '#11108c', type: 'Wetland' },
  { label: 'Sueda',           color: '#b0a300', type: 'Saline Scrub' },
  { label: 'Swamp Edge',      color: '#00f7f7', type: 'Buffer' }
]

const hotspots = [
  { id: 1, x: 25, y: 70, color: '#11108c', label: 'Marshes' },
  { id: 2, x: 15, y: 30, color: '#fffda8', label: 'Primary Grasslands' },
  { id: 3, x: 80, y: 60, color: '#9e6211', label: 'Acacia Scrub' },
  { id: 4, x: 50, y: 45, color: '#00f7f7', label: 'Wetland Buffer' }
]

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
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.25s ease;
}
.year-btn:hover {
  /* background: #f97316; */
  /* border-color: #f97316; */
  color: #ffffff;
}
:global(.dark) .year-btn:hover {
  /* background: #f97316; */
  /* border-color: #f97316; */
  color: #ffffff;
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

.custom-scroll-light::-webkit-scrollbar { width: 3px; }
.custom-scroll-light::-webkit-scrollbar-track { background: transparent; }
.custom-scroll-light::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
