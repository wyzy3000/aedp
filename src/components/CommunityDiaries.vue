<template>
  <section id="diaries" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <!-- Header -->
      <div class="mb-10 fade-up" ref="headerRef">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full bg-forest-500" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-500 transition-colors">Module 03 · Diaries</span>
        </div>
        <h2 class="font-display font-extrabold text-4xl md:text-5xl text-slate-900 dark:text-white leading-tight transition-colors" style="letter-spacing:-0.02em">
          Local Community Environmental Diaries
        </h2>
        <p class="mt-2 font-display font-medium text-lg italic text-forest-700 dark:text-forest-600 transition-colors">Maoni ya wenyeji</p>
        <p class="mt-3 text-slate-600 dark:text-neutral-500 text-[15px] leading-relaxed max-w-2xl transition-colors">
          First-hand seasonal observations from pastoralist and farming communities
          across the Amboseli ecosystem, recorded as structured field notes.
        </p>
      </div>

      <!-- Masonry Grid -->
      <div class="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 fade-up" ref="gridRef">
        <div v-for="entry in diariesData" :key="entry.id"
             class="break-inside-avoid glass-card p-5 hover:border-forest-600/40 hover:bg-black/5 dark:hover:bg-white/[0.06] transition-all duration-300 group">

          <!-- Header row -->
          <div class="flex items-start justify-between gap-3 mb-3">

            <div class="flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="tag-pill">
                  <MapPin class="w-3 h-3 text-forest-600 dark:text-savanna-400 transition-colors" />
                  {{ entry.location }}
                </span>
                <span class="tag-pill">
                  <Calendar class="w-3 h-3 text-slate-500 dark:text-neutral-500 transition-colors" />
                  {{ formatDate(entry.date) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Observation text -->
          <p class="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-neutral-200 transition-colors">
            {{ entry.observation }}
          </p>

          <!-- Sentiment bar -->
          <div class="mt-4 flex items-center gap-2">
            <span class="text-[10px] text-slate-500 dark:text-neutral-600 uppercase tracking-wider transition-colors">Sentiment</span>
            <div class="flex-1 h-1 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden transition-colors">
              <div class="h-full rounded-full transition-all duration-500"
                   :style="{ width: entry.sentiment + '%', background: sentimentColor(entry.sentiment) }" />
            </div>
            <span class="text-[10px]" :style="{ color: sentimentColor(entry.sentiment) }">
              {{ entry.sentiment >= 60 ? (lang === 'en' ? 'Hopeful' : 'Matumaini') : (lang === 'en' ? 'Concerned' : 'Wasiwasi') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Load more button -->
      <div class="mt-10 text-center fade-up" ref="btnRef">
        <button class="px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm text-slate-600 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
          {{ lang === 'en' ? 'View all diary entries →' : 'Ona maingizo yote →' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { MapPin, Calendar } from 'lucide-vue-next'

const lang = inject('lang')
const isDark = inject('isDark')
const headerRef = ref(null)
const gridRef = ref(null)
const btnRef = ref(null)

const diariesData = [
  {
    id: 1,
    date: '2023-11-15',
    location: 'Olgulului',
    observation: 'Heavy rains have finally started, but the grass is recovering slowly due to the prolonged dry spell. Livestock are still weak but showing signs of improvement.',
    sentiment: 55,
  },
  {
    id: 2,
    date: '2023-12-02',
    location: 'Imbirikani',
    observation: 'Wildlife movement has shifted closer to the basin as water pans are filling up. Elephants seen near the northern corridor for the first time in months.',
    sentiment: 72,
  },
  {
    id: 3,
    date: '2023-10-20',
    location: 'Kimana',
    observation: 'Dry conditions persist in the upper catchment. Springs that have been reliable for generations are running low. Herders are moving cattle further south.',
    sentiment: 30,
  },
  {
    id: 4,
    date: '2023-11-30',
    location: 'Eselenkei',
    observation: 'Short rains arrived two weeks late compared to last year. Acacia trees are leafing out, a good sign for the coming season. However, murram roads are now impassable.',
    sentiment: 65,
  },
  {
    id: 5,
    date: '2023-09-05',
    location: 'Rombo',
    observation: 'Dust storms are increasingly common. Visibility on open plains down to less than 500 meters on bad days. Livestock respiratory issues reported by three community members.',
    sentiment: 22,
  },
  {
    id: 6,
    date: '2024-01-10',
    location: 'Olgulului',
    observation: 'Green flush is spreading east from the swamp margins. First good flush in nearly 18 months. Community meeting called to discuss controlled grazing areas.',
    sentiment: 78,
  },
]

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
}

const sentimentColor = (val) => {
  if (val >= 65) return '#4a7d41'
  if (val >= 45) return '#e9c160'
  return '#ef4444'
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.1 })
  ;[headerRef.value, gridRef.value, btnRef.value].forEach(el => el && observer.observe(el))
})
</script>
