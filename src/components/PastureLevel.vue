<template>
  <section id="pasture" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <div class="mb-10 fade-up" ref="headerRef">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full" :style="{ background: selectedYearData.lineColor }" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Module 01 · Pasture</span>
        </div>
        <h2 class="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight">
          The Grass Story of Amboseli
        </h2>
        <p class="mt-2 text-[#FBB03A] font-display font-medium text-lg italic">Kiwango cha Nyasi</p>
        <p class="mt-3 text-white/90 text-[15px] leading-relaxed max-w-2xl">{{ selectedYearData.context }}</p>
      </div>

      <!-- Year selector -->
      <div class="flex flex-wrap gap-2 mb-8 fade-up" ref="selectorRef">
        <button
          v-for="yd in yearDataSet" :key="yd.year"
          @click="selectedYear = yd.year"
          class="year-btn"
          :class="{ selected: selectedYear === yd.year }">
          {{ yd.year }}
        </button>
      </div>

      <!-- NDVI Line Chart -->
      <div class="rounded-2xl border border-white/8 overflow-hidden mb-8 fade-up bg-[#0a160c]/80 backdrop-blur-md" ref="chartRef">
        <div class="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div class="flex items-center gap-2.5">
            <div class="w-2 h-2 rounded-full animate-pulse" :style="{ background: selectedYearData.lineColor }" />
            <span class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Multi-Year NDVI Trend</span>
          </div>
          <div class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-black text-neutral-300 border border-white/10">
            {{ selectedYear }} · NDVI {{ selectedYearData.ndvi }}
          </div>
        </div>

        <div class="relative w-full" style="height: 220px;">
          <svg class="absolute inset-0 w-full h-full" viewBox="0 0 1000 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" :stop-color="selectedYearData.lineColor" stop-opacity="0.35" />
                <stop offset="100%" :stop-color="selectedYearData.lineColor" stop-opacity="0" />
              </linearGradient>
            </defs>

            <line v-for="y in [45, 90, 135, 180]" :key="y" :x1="0" :y1="y" :x2="1000" :y2="y"
                  stroke="currentColor" stroke-width="1" class="text-white/5" />

            <path :d="areaPath" fill="url(#areaFill)" class="transition-all duration-700" />
            <path :d="linePath" fill="none" :stroke="selectedYearData.lineColor"
                  stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                  class="transition-all duration-700" />

            <g v-for="(yd, i) in yearDataSet" :key="yd.year">
              <circle :cx="yearX(i)" :cy="ndviY(yd.ndvi)" r="4.5"
                      :fill="yd.lineColor"
                      class="cursor-pointer transition-all duration-300"
                      @click="selectedYear = yd.year" />
              <text :x="yearX(i)" y="210"
                    :fill="yd.year === selectedYear ? yd.lineColor : '#4b5563'"
                    font-size="11" text-anchor="middle" font-family="Inter, sans-serif"
                    class="cursor-pointer" font-weight="500"
                    @click="selectedYear = yd.year">
                {{ yd.year }}
              </text>
            </g>

            <line :x1="yearX(selectedYearIndex)" y1="0"
                  :x2="yearX(selectedYearIndex)" y2="190"
                  :stroke="selectedYearData.lineColor" stroke-width="1"
                  stroke-dasharray="4,3" opacity="0.4" class="transition-all duration-500" />
          </svg>
        </div>

        <div class="px-6 py-3 border-t border-white/5 flex items-center gap-4">
          <span class="text-xs text-neutral-600">Pasture Condition:</span>
          <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700"
                 :style="{ width: (selectedYearData.ndvi * 100) + '%', background: selectedYearData.lineColor }" />
          </div>
          <span class="text-xs font-semibold text-white">
            {{ selectedYearData.label }}
          </span>
        </div>
      </div>

      <!-- Live Grass Preview -->
      <div class="rounded-2xl border border-white/8 overflow-hidden mb-8 fade-up bg-[#08120a]/90" ref="grassRef">
        <div class="flex items-center justify-between px-6 py-3 border-b border-white/5">
          <span class="text-[11px] uppercase tracking-widest text-neutral-600 font-semibold">Live Condition Preview · {{ selectedYear }}</span>
          <span class="text-[11px] font-semibold text-white">{{ selectedYearData.label }}</span>
        </div>

        <div class="relative overflow-hidden" style="height: 180px;">
          <!-- Soil strip -->
          <div class="absolute bottom-0 left-0 right-0 h-6 transition-colors duration-700"
               :style="{ background: selectedYearData.soilColor }" />

          <!-- Grass blades — height driven by NDVI -->
          <div class="absolute bottom-6 left-0 right-0 flex items-end justify-around px-1" style="height: 150px;">
            <svg
              v-for="(blade, idx) in grassBlades" :key="idx"
              class="grass-blade flex-shrink-0"
              :style="{
                height: blade.h + 'px',
                animationDuration: selectedYearData.swaySpeed + 's',
                animationDelay: blade.delay + 's',
                opacity: selectedYearData.grassOpacity,
                transformOrigin: 'bottom center',
              }"
              :width="blade.w" viewBox="0 0 10 50" preserveAspectRatio="none">
              <path :d="`M5,50 Q${blade.cx},${blade.cy} 5,0`"
                    fill="none"
                    :stroke="interpolateGrassColor(selectedYearData.grassColor, idx)"
                    :stroke-width="Math.max(2, blade.w)"
                    stroke-linecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Audio -->
      <div class="flex flex-wrap items-center gap-4 fade-up" ref="audioRef">
        <button @click="toggleAudio" :class="['audio-btn', isPlaying ? 'playing' : '']">
          <div class="waveform" :class="{ active: isPlaying }">
            <span /><span /><span /><span /><span />
          </div>
          <span>{{ isPlaying
            ? (lang === 'en' ? '⏹ Stop Narration' : '⏹ Simamisha')
            : (lang === 'en' ? '🔊 Play Explanation (Maa)' : '🔊 Sikiliza (Kimaa)')
          }}</span>
        </button>
        <audio ref="audioElement" src="/Swahili_Early_Warning_Amboseli.mp3" @ended="isPlaying = false" preload="auto" class="hidden"></audio>
        <p class="text-xs text-neutral-600 italic">
          {{ lang === 'en' ? 'Audio narration prepared in Maa language' : 'Maelezo kwa lugha ya Kimaa' }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'

const lang = inject('lang')
const isDark = inject('isDark')
const isPlaying = ref(false)
const selectedYear = ref(2022)
const headerRef = ref(null)
const selectorRef = ref(null)
const chartRef = ref(null)
const grassRef = ref(null)
const audioRef = ref(null)
const audioElement = ref(null)

// grassMinH / grassMaxH define the blade height range in px for each year.
// Drought years → short sparse stubble. Rain years → tall lush blades.
const yearDataSet = [
  {
    year: 2018, ndvi: 0.55, label: 'Good',
    lineColor: '#4a9e3a', grassColor: '#2d7a1f',
    swaySpeed: 3.5, grassOpacity: 1.0, soilColor: '#2a1a08',
    grassMinH: 40, grassMaxH: 90,
    context: 'Above-average rains in 2018 brought healthy pasture conditions across the basin. Livestock body condition was good and wildlife populations remained stable.',
  },
  {
    year: 2019, ndvi: 0.65, label: 'Excellent',
    lineColor: '#28c443', grassColor: '#1e9a2a',
    swaySpeed: 3.0, grassOpacity: 1.0, soilColor: '#1a2800',
    grassMinH: 65, grassMaxH: 120,
    context: 'Peak pasture year. High NDVI readings across the Amboseli basin, excellent forage availability, and strong short and long rain seasons contributed to thriving grassland ecosystems.',
  },
  {
    year: 2020, ndvi: 0.50, label: 'Adequate',
    lineColor: '#89b83a', grassColor: '#5a8a1a',
    swaySpeed: 3.8, grassOpacity: 1.0, soilColor: '#22180a',
    grassMinH: 35, grassMaxH: 78,
    context: 'A moderate year with some variability in seasonal rainfall. Overall pasture conditions remained adequate, though slight stress was observed in northern rangeland areas.',
  },
  {
    year: 2021, ndvi: 0.42, label: 'Stressed',
    lineColor: '#c8a020', grassColor: '#b08b1a',
    swaySpeed: 4.5, grassOpacity: 0.9, soilColor: '#2a1c06',
    grassMinH: 14, grassMaxH: 48,
    context: 'First signs of a developing drought cycle. The 2021 short rains (OND) failed significantly, triggering early warnings for the ecosystem. Pasture stress became visible by late November.',
  },
  {
    year: 2022, ndvi: 0.18, label: 'Severe Drought',
    lineColor: '#d94f14', grassColor: '#a8460b',
    swaySpeed: 6.5, grassOpacity: 0.75, soilColor: '#3a1e08',
    grassMinH: 4, grassMaxH: 18,
    context: 'Catastrophic La Niña-driven drought — the worst in 40 years. VCI fell below 0.15 across 68% of Kajiado rangeland. Widespread livestock losses, dry water pans, and emergency declarations were recorded.',
  },
  {
    year: 2023, ndvi: 0.38, label: 'Early Recovery',
    lineColor: '#d4911f', grassColor: '#9c841c',
    swaySpeed: 4.2, grassOpacity: 0.9, soilColor: '#281a06',
    grassMinH: 12, grassMaxH: 42,
    context: 'Long rains returned near-normal in 2023, triggering a slow green flush. NDVI recovered to 60% of baseline by mid-year. Livestock populations remained well below pre-drought levels.',
  },
  {
    year: 2024, ndvi: 0.54, label: 'Recovering',
    lineColor: '#6db84a', grassColor: '#4a9c26',
    swaySpeed: 3.2, grassOpacity: 1.0, soilColor: '#201808',
    grassMinH: 38, grassMaxH: 84,
    context: 'Continued recovery across the basin. Pasture conditions returning toward pre-drought norms. Community monitors report improving livestock body condition and returning wildlife movement patterns.',
  },
]

const selectedYearData = computed(() => yearDataSet.find(d => d.year === selectedYear.value) || yearDataSet[0])
const selectedYearIndex = computed(() => yearDataSet.findIndex(d => d.year === selectedYear.value))

const yearX = (i) => 100 + i * ((1000 - 200) / (yearDataSet.length - 1))
const ndviY = (v) => 180 - v * 150

const linePath = computed(() => {
  const pts = yearDataSet.map((d, i) => `${yearX(i)},${ndviY(d.ndvi)}`)
  return 'M ' + pts.join(' L ')
})
const areaPath = computed(() => {
  const pts = yearDataSet.map((d, i) => `${yearX(i)},${ndviY(d.ndvi)}`)
  return 'M ' + pts.join(' L ') + ` L ${yearX(yearDataSet.length - 1)},220 L ${yearX(0)},220 Z`
})

// Pre-seeded random values so blade positions stay stable when switching years.
// Only blade HEIGHT changes dynamically based on the selected year's grassMinH/grassMaxH.
const bladeSeeds = Array.from({ length: 280 }, () => ({
  r:     Math.random(),           // 0-1 height multiplier
  w:     6 + Math.random() * 6,
  cx:    1 + Math.random() * 5,
  cy:    15 + Math.random() * 20,
  delay: -(Math.random() * 5),
}))

const grassBlades = computed(() => {
  const { grassMinH, grassMaxH } = selectedYearData.value
  return bladeSeeds.map(s => ({
    ...s,
    h: grassMinH + s.r * (grassMaxH - grassMinH),
  }))
})

const interpolateGrassColor = (baseHex, idx) => {
  const alphas = ['cc', 'dd', 'e6', 'ff', 'bb', 'd9', 'f2']
  return baseHex + alphas[idx % alphas.length]
}

const toggleAudio = async () => {
  if (!audioElement.value) return
  try {
    if (!audioElement.value.paused) {
      audioElement.value.pause()
      audioElement.value.currentTime = 0
      isPlaying.value = false
    } else {
      isPlaying.value = true
      await audioElement.value.play()
    }
  } catch (err) {
    isPlaying.value = false
  }
}

onMounted(() => {
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
    { threshold: 0.1 }
  )
  ;[headerRef.value, selectorRef.value, chartRef.value, grassRef.value, audioRef.value]
    .forEach(el => el && io.observe(el))
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
  background: rgba(251, 176, 58, 0.15);
  border-color: #FBB03A;
  color: #FBB03A;
}
.year-btn.selected {
  background: #FBB03A;
  border-color: #FBB03A;
  color: #ffffff;
  font-weight: 700;
}
</style>
