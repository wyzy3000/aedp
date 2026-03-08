<template>
  <section id="weather" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <div class="mb-10 fade-up" ref="headerRef">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full bg-blue-500" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors">Module 04 · Weather</span>
        </div>
        <h2 class="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight transition-colors" style="letter-spacing:-0.02em">
          Weather Forecast
        </h2>
        <p class="mt-2 font-display font-medium text-lg italic text-[#FBB03A] transition-colors">Hali ya anga · Open-Meteo</p>
        <p class="mt-3 text-white/90 text-[15px] leading-relaxed max-w-2xl transition-colors">
          Real-time atmospheric data for Amboseli Basin (Lat −2.64°, Lon 37.25°).
          Sourced live from the Open-Meteo free weather API.
        </p>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up" ref="cardsRef">

        <template v-if="isLoading">
          <div v-for="i in 4" :key="i" class="metric-card h-28 shimmer" />
        </template>

        <template v-else-if="!weatherError">
          <div class="metric-card hover:border-orange-500/20 group">
            <div class="flex items-center justify-between mb-3">
              <div class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Thermometer class="w-4 h-4 text-orange-500 dark:text-orange-400" />
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-600">Now</span>
            </div>
            <p class="text-3xl font-display font-bold text-slate-900 dark:text-white transition-colors">
              {{ weatherData?.current?.temperature_2m?.toFixed(1) ?? '--' }}<span class="text-base text-slate-500 dark:text-neutral-500">°C</span>
            </p>
            <p class="text-xs text-slate-600 dark:text-neutral-500 mt-1.5">{{ lang === 'en' ? 'Air temperature (2m)' : 'Joto la hewa' }}</p>
          </div>

          <div class="metric-card hover:border-sky-500/20 group">
            <div class="flex items-center justify-between mb-3">
              <div class="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Wind class="w-4 h-4 text-sky-500 dark:text-sky-400" />
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-600">Now</span>
            </div>
            <p class="text-3xl font-display font-bold text-slate-900 dark:text-white transition-colors">
              {{ weatherData?.current?.wind_speed_10m?.toFixed(1) ?? '--' }}<span class="text-base text-slate-500 dark:text-neutral-500"> km/h</span>
            </p>
            <p class="text-xs text-slate-600 dark:text-neutral-500 mt-1.5">{{ lang === 'en' ? 'Wind speed (10m)' : 'Kasi ya upepo' }}</p>
          </div>

          <div class="metric-card hover:border-blue-500/20 group">
            <div class="flex items-center justify-between mb-3">
              <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <CloudRain class="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-600">Now</span>
            </div>
            <p class="text-3xl font-display font-bold text-slate-900 dark:text-white transition-colors">
              {{ weatherData?.current?.precipitation?.toFixed(1) ?? '--' }}<span class="text-base text-slate-500 dark:text-neutral-500"> mm</span>
            </p>
            <p class="text-xs text-slate-600 dark:text-neutral-500 mt-1.5">{{ lang === 'en' ? 'Precipitation' : 'Mvua' }}</p>
          </div>

          <div class="metric-card hover:border-indigo-500/20 group">
            <div class="flex items-center justify-between mb-3">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Droplets class="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-600">6h</span>
            </div>
            <p class="text-3xl font-display font-bold text-slate-900 dark:text-white transition-colors">
              {{ rainProb }}<span class="text-base text-slate-500 dark:text-neutral-500">%</span>
            </p>
            <p class="text-xs text-slate-600 dark:text-neutral-500 mt-1.5">{{ lang === 'en' ? 'Rain probability (6h)' : 'Uwezekano mvua' }}</p>
          </div>
        </template>

        <div v-else class="col-span-4 metric-card flex items-center gap-4 py-8 border-red-200 dark:border-red-900/30">
          <CloudOff class="w-8 h-8 text-neutral-600 flex-shrink-0" />
          <p class="text-sm text-neutral-500">{{ lang === 'en' ? 'Weather data unavailable. Check your internet connection.' : 'Data ya hali ya hewa haipatikani.' }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-black/5 dark:border-white/8 overflow-hidden mb-8 fade-up bg-white/80 dark:bg-[#080c16]/90 transition-colors" ref="chartRef">

        <div class="flex items-center justify-between px-6 py-4 border-b border-black/5 dark:border-white/5 transition-colors">
          <div class="flex items-center gap-1">
            <button v-for="tab in chartTabs" :key="tab.key"
                    @click="activeTab = tab.key"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                    :class="activeTab === tab.key
                      ? 'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-500/15 dark:border-blue-500/25 dark:text-blue-300'
                      : 'text-slate-500 dark:text-neutral-500 hover:text-slate-800 dark:hover:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'">
              {{ tab.label }}
            </button>
          </div>
          <div class="text-[10px] text-slate-500 dark:text-neutral-700 flex items-center gap-1.5 transition-colors">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live · Open-Meteo API
          </div>
        </div>

        <div class="px-6 pt-4 pb-2">
          <div v-if="activeTab === 'temp'" class="relative" style="height: 140px;">
            <div class="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-slate-400 dark:text-neutral-600 pr-2">
              <span>{{ tempMax }}°</span>
              <span>{{ Math.round((tempMax + tempMin) / 2) }}°</span>
              <span>{{ tempMin }}°</span>
            </div>

            <svg class="absolute inset-0 w-full h-full pl-8" viewBox="0 0 750 130" preserveAspectRatio="none"
                 style="padding-left: 28px;">
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f97316" stop-opacity="0.35" />
                  <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path v-if="hourlyTemps.length" :d="tempAreaPath" fill="url(#tempGrad)" />
              <path v-if="hourlyTemps.length" :d="tempLinePath" fill="none" stroke="#f97316" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <div class="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-slate-400 dark:text-neutral-600">
              <span>6h ago</span><span>3h ago</span><span>Now</span><span>+6h</span><span>+12h</span><span>+18h</span><span>+24h</span>
            </div>
          </div>

          <div v-else-if="activeTab === 'rain'" class="relative" style="height: 140px;">
            <div class="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-slate-400 dark:text-neutral-600 pr-2">
              <span>100%</span><span>50%</span><span>0%</span>
            </div>
            <div class="absolute inset-0 flex items-end gap-0.5 pl-8 pb-6">
              <div v-for="(prob, i) in rainProbs20" :key="i"
                   class="flex-1 rounded-t-sm transition-all duration-500"
                   :style="{
                     height: prob + '%',
                     background: `hsl(220, 80%, ${45 + prob * 0.2}%)`,
                     opacity: i < 6 ? '0.35' : '1',
                     minHeight: '2px',
                   }" :title="prob + '%'" />
            </div>
            <div class="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-slate-400 dark:text-neutral-600">
              <span>6h ago</span><span></span><span>Now</span><span></span><span></span><span></span><span>+24h</span>
            </div>
          </div>

          <div v-else-if="activeTab === 'wind'" class="relative" style="height: 140px;">
            <div class="flex flex-col gap-3 pt-2">
              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-500 dark:text-neutral-500 w-16">Speed</span>
                <div class="flex-1 h-2 bg-black/5 dark:bg-white/[0.06] rounded-full overflow-hidden">
                  <div class="h-full bg-sky-500 dark:bg-sky-400 rounded-full transition-all duration-700"
                       :style="{ width: Math.min(100, (weatherData?.current?.wind_speed_10m || 0) / 50 * 100) + '%' }" />
                </div>
                <span class="text-sm font-semibold text-sky-700 dark:text-sky-300 w-16 text-right">{{ weatherData?.current?.wind_speed_10m?.toFixed(1) }} km/h</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-500 dark:text-neutral-500 w-16">Category</span>
                <div class="flex-1">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold"
                        :style="windCategory.style">{{ windCategory.label }}</span>
                </div>
              </div>
              <p class="text-xs text-slate-500 dark:text-neutral-600 mt-2 px-1">
                {{ lang === 'en' ? 'Wind data sourced from ERA5 reanalysis at 10m height above ground level.' : 'Data ya upepo kutoka ERA5 kwa urefu wa mita 10.' }}
              </p>
            </div>
          </div>

        </div>

        <div class="px-6 py-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between transition-colors">
          <p class="text-[11px] text-slate-500 dark:text-neutral-600 transition-colors">
            Data refreshed on component mount · Amboseli, Kenya
          </p>
          <a href="https://open-meteo.com/en/docs#latitude=-2.64&longitude=37.25&current=temperature_2m,wind_speed_10m,precipitation&hourly=temperature_2m,precipitation_probability"
             target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium">
            <ExternalLink class="w-3 h-3" />
            Full forecast on Open-Meteo →
          </a>
        </div>
      </div>

      <div v-if="!isLoading && !weatherError" class="rounded-2xl border border-black/5 dark:border-white/8 overflow-hidden mb-8 fade-up bg-white/80 dark:bg-[#080c16]/85 transition-colors" ref="outlookRef">
        <div class="px-6 py-4 border-b border-black/5 dark:border-white/5 transition-colors">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-500 transition-colors">
            {{ lang === 'en' ? '24-Hour Temperature Outlook' : 'Mwelekeo wa joto (masaa 24)' }}
          </span>
        </div>
        <div class="grid grid-cols-4 md:grid-cols-8 divide-x divide-black/5 dark:divide-white/5 transition-colors">
          <div v-for="(hour, i) in hourlyOutlook" :key="i"
               class="flex flex-col items-center py-4 gap-2 hover:bg-black/5 dark:hover:bg-white/3 transition-colors">
            <span class="text-[10px] text-slate-500 dark:text-neutral-600 transition-colors">{{ hour.time }}</span>
            <div class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                 :style="{ background: `hsl(${220 - (hour.temp - 15) * 6}, 70%, 50%, ${isDark ? 0.15 : 0.08})` }">
              <CloudRain v-if="hour.rain > 30" class="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <Sun v-else-if="hour.temp > 26" class="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <Cloud v-else class="w-4 h-4 text-slate-400 dark:text-neutral-500 transition-colors" />
            </div>
            <span class="text-sm font-semibold text-slate-900 dark:text-white transition-colors">{{ hour.temp }}°</span>
            <span v-if="hour.rain > 0" class="text-[10px] text-blue-600 dark:text-blue-400">{{ hour.rain }}%</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { Thermometer, Wind, CloudRain, Droplets, CloudOff, ExternalLink, Cloud, Sun } from 'lucide-vue-next'

const lang = inject('lang')
const isDark = inject('isDark')
const weatherData = ref(null)
const isLoading = ref(true)
const weatherError = ref(false)
const activeTab = ref('temp')

const headerRef = ref(null)
const cardsRef = ref(null)
const chartRef = ref(null)
const outlookRef = ref(null)

const chartTabs = [
  { key: 'temp', label: '🌡 Temperature' },
  { key: 'rain', label: '🌧 Rainfall' },
  { key: 'wind', label: '💨 Wind' },
]

const fetchWeather = async () => {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-2.64&longitude=37.25&current=temperature_2m,wind_speed_10m,precipitation&hourly=temperature_2m,precipitation_probability,wind_speed_10m&forecast_days=3'
    const res = await fetch(url)
    weatherData.value = await res.json()
  } catch (e) {
    console.error('Weather fetch failed:', e)
    weatherError.value = true
  } finally {
    isLoading.value = false
  }
}

const nowIndex = computed(() => {
  if (!weatherData.value?.hourly?.time) return 0
  const nowStr = new Date().toISOString().slice(0, 13) // yyyy-mm-ddThh
  const ind = weatherData.value.hourly.time.findIndex(t => t.startsWith(nowStr))
  return ind !== -1 ? ind : 0
})

const hourlyTemps = computed(() => {
  return weatherData.value?.hourly?.temperature_2m?.slice(Math.max(0, nowIndex.value - 6), nowIndex.value + 18) ?? []
})

const rainProbs = computed(() => {
  return weatherData.value?.hourly?.precipitation_probability?.slice(Math.max(0, nowIndex.value - 6), nowIndex.value + 18) ?? []
})

const rainProbs20 = computed(() => {
  return rainProbs.value.slice(0, 20)
})

const rainProb = computed(() => {
  const arr = weatherData.value?.hourly?.precipitation_probability?.slice(nowIndex.value, nowIndex.value + 6) ?? []
  return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : '--'
})

const tempMin = computed(() => hourlyTemps.value.length ? Math.floor(Math.min(...hourlyTemps.value)) : 15)
const tempMax = computed(() => hourlyTemps.value.length ? Math.ceil(Math.max(...hourlyTemps.value)) : 35)

const tempY = (v) => {
  const range = (tempMax.value - tempMin.value) || 1
  return 115 - ((v - tempMin.value) / range) * 100
}
const tempX = (i) => (i / (hourlyTemps.value.length - 1)) * 750

const tempLinePath = computed(() => {
  const pts = hourlyTemps.value.map((t, i) => `${tempX(i)},${tempY(t)}`)
  return 'M ' + pts.join(' L ')
})
const tempAreaPath = computed(() => {
  if (!hourlyTemps.value.length) return ''
  const pts = hourlyTemps.value.map((t, i) => `${tempX(i)},${tempY(t)}`)
  return `M ${pts.join(' L ')} L ${tempX(hourlyTemps.value.length - 1)},130 L 0,130 Z`
})

const hourlyOutlook = computed(() => {
  const now = new Date()
  return Array.from({ length: 8 }, (_, i) => {
    const idx = Math.floor(i * (hourlyTemps.value.length / 8))
    const h = new Date(now.getTime() + (i * 3 - 6) * 3600000)
    return {
      time: i === 2 ? 'Now' : (i < 2 ? `-${(2 - i) * 3}h` : `+${(i - 2) * 3}h`),
      temp: Math.round(hourlyTemps.value[idx] ?? 24),
      rain: rainProbs.value[idx] ?? 0,
    }
  })
})

const windCategory = computed(() => {
  const s = weatherData.value?.current?.wind_speed_10m ?? 0
  if (s < 5)  return { label: 'Calm', style: 'background: rgba(74,125,65,0.2); color: #4a9e3a; border: 1px solid rgba(74,125,65,0.3)' }
  if (s < 20) return { label: 'Light Breeze', style: 'background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25)' }
  if (s < 40) return { label: 'Moderate', style: 'background: rgba(234,179,8,0.15); color: #facc15; border: 1px solid rgba(234,179,8,0.25)' }
  return { label: 'Strong Wind', style: 'background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.25)' }
})

onMounted(() => {
  fetchWeather()
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
    { threshold: 0.1 }
  )
  ;[headerRef.value, cardsRef.value, chartRef.value, outlookRef.value].forEach(el => el && io.observe(el))
})
</script>
