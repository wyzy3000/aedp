<template>
  <section id="drought" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <!-- Header -->
      <div class="mb-10 fade-up" ref="headerRef">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full bg-red-600 dark:bg-red-700 transition-colors" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-500 transition-colors">Module 06 · Drought</span>
        </div>
        <h2 class="font-display font-extrabold text-4xl md:text-5xl text-slate-900 dark:text-white leading-tight transition-colors" style="letter-spacing:-0.02em">
          Recent Droughts in Kajiado
        </h2>
        <p class="mt-2 font-display font-medium text-lg italic text-red-600 dark:text-red-700/70 transition-colors">Kiangazi Katika Kaunti</p>
        <p class="mt-3 text-slate-600 dark:text-neutral-500 text-[15px] leading-relaxed max-w-2xl transition-colors">
          A satellite-derived narrative timeline of the 2022–2023 drought sequence in Kajiado County,
          tracking progression from early stress signals through peak impact and early recovery.
        </p>
      </div>

      <div class="relative fade-up" ref="timelineRef">

        <!-- Timeline events -->
        <div v-for="(event, idx) in timelineEvents" :key="idx"
             class="relative mb-8 group">
          <!-- Card -->
          <div class="glass-card p-5 hover:border-black/10 dark:hover:border-white/15 transition-all duration-300 group-hover:translate-x-1 bg-white/80 dark:bg-transparent">
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="font-display font-semibold text-sm transition-colors text-slate-900 dark:text-white">
                {{ event.period }}
              </span>
              <span class="tag-pill transition-colors !text-black" :style="{ borderColor: isDark ? event.color : (event.colorDarker || event.color), backgroundColor: isDark ? event.color : (event.colorDarker || event.color) }">
                {{ event.phase }}
              </span>
            </div>
            <h3 class="font-semibold text-slate-900 dark:text-white text-base mb-2 transition-colors">{{ event.title }}</h3>
            <p class="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed transition-colors">{{ event.description }}</p>

            <!-- Metric chips -->
            <div class="flex flex-wrap gap-2 mt-4">
              <div v-for="chip in event.metrics" :key="chip.label"
                   class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/8 transition-colors">
                <span class="text-xs font-semibold transition-colors" :style="{ color: isDark ? event.color : event.colorDarker || event.color }">{{ chip.value }}</span>
                <span class="text-xs text-slate-500 dark:text-neutral-500 transition-colors">{{ chip.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data source note -->
      <div class="mt-8 fade-up" ref="noteRef">
        <div class="glass-card p-4 flex items-start gap-3 bg-white/80 dark:bg-transparent transition-colors">
          <Satellite class="w-4 h-4 text-slate-500 dark:text-neutral-500 flex-shrink-0 mt-0.5 transition-colors" />
          <p class="text-xs text-slate-600 dark:text-neutral-500 leading-relaxed transition-colors">
            <span class="text-slate-800 dark:text-neutral-400 font-medium transition-colors">Data source:</span>
            MODIS Terra/Aqua, Sentinel-2, and ERA5 reanalysis. Indicators include Vegetation
            Condition Index (VCI), Water Requirement Satisfaction Index (WRSI), and Land Surface Temperature (LST).
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { Satellite } from 'lucide-vue-next'

const lang = inject('lang')
const isDark = inject('isDark')
const headerRef = ref(null)
const timelineRef = ref(null)
const noteRef = ref(null)

const timelineEvents = [
  {
    period: 'Mar – May 2022',
    phase: 'Early Warning',
    title: 'Long Rains Failure – Third Consecutive Season',
    description: 'Satellite data confirmed failure of the 2022 long rains (MAM), the third consecutive season of below-average rainfall. SPI-3 dropped to −1.8 across Kajiado County. Livestock body conditions began declining, and community reports noted drying water sources.',
    color: '#e9c160', colorDarker: '#d69e2e',
    bg: 'rgba(233,193,96,0.1)',
    metrics: [
      { value: '−1.8', label: 'SPI-3 index' },
      { value: '35%', label: 'below avg. rainfall' },
      { value: 'VCI 0.28', label: 'vegetation stress' },
    ],
  },
  {
    period: 'Jun – Sep 2022',
    phase: 'Escalation',
    title: 'Short Rains Delayed – Crisis Deepens',
    description: 'The inter-seasonal dry spell extended into the short rains window. LST anomalies averaged +2.4°C above the 20-year mean. Mass livestock movement eastward observed in MODIS reflectance analysis. First mortality reports in Amboseli heartland.',
    color: '#f97316', colorDarker: '#ea580c',
    bg: 'rgba(249,115,22,0.08)',
    metrics: [
      { value: '+2.4°C', label: 'LST anomaly' },
      { value: '−62%', label: 'NDVI vs. baseline' },
      { value: '~15k', label: 'livestock lost (est.)' },
    ],
  },
  {
    period: 'Oct 2022 – Feb 2023',
    phase: 'Peak Impact',
    title: 'Worst Drought in 40 Years – La Niña Driver',
    description: 'Kajiado hit peak drought conditions driven by the 2022–23 La Niña event. VCI fell below 0.15 (extreme drought) across 68% of rangeland. Water pans ran dry. Maasai community declared emergency at sub-county level. Wildebeest migration routes severely disrupted.',
    color: '#ef4444', colorDarker: '#dc2626',
    bg: 'rgba(239,68,68,0.08)',
    metrics: [
      { value: 'VCI <0.15', label: 'extreme drought' },
      { value: '68%', label: 'affected rangeland' },
      { value: '4th Drt', label: 'consecutive season' },
    ],
  },
  {
    period: 'Mar – Jun 2023',
    phase: 'Recovery',
    title: 'Long Rains Return – Partial Vegetation Recovery',
    description: 'The 2023 long rains (MAM) arrived near-normal, triggering rapid vegetation green-up. Sentinel-2 NDVI recovered to 60% of baseline by June. However, livestock populations remain 30–40% below pre-drought levels. Water table recovery expected to take 2–3 more seasons.',
    color: '#4a7d41', colorDarker: '#166534',
    bg: 'rgba(74,125,65,0.1)',
    metrics: [
      { value: '60%', label: 'NDVI recovery' },
      { value: '−35%', label: 'livestock below baseline' },
      { value: '2–3 Seasons', label: 'for full recovery' },
    ],
  },
]

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.1 })
  ;[headerRef.value, timelineRef.value, noteRef.value].forEach(el => el && observer.observe(el))
})
</script>
