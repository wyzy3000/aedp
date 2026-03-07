<template>
  <section id="diaries" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <div class="mb-10 fade-up" ref="headerRef">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full transition-colors" style="background-color: #FBB03A;" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] transition-colors" style="color: #FBB03A;">Module 03 · Diaries</span>
        </div>
        <h2 class="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight transition-colors" style="letter-spacing:-0.02em">
          Local Community Environmental Diaries
        </h2>
        <p class="mt-2 font-display font-medium text-lg italic transition-colors" style="color: #FBB03A;">Maoni ya wenyeji</p>
        <p class="mt-3 text-white text-[15px] leading-relaxed max-w-2xl transition-colors">
          First-hand seasonal observations from pastoralist and farming communities
          across the Amboseli ecosystem, recorded as structured field notes.
        </p>

        <div class="mt-8 flex flex-col sm:flex-row gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-white">Location</label>
            <select v-model="filterLocation" @change="applyFilters"
                    class="bg-white/10 border border-white/20 text-white text-sm rounded-xl focus:ring-[#FBB03A] focus:border-[#FBB03A] block w-full sm:w-48 p-2.5 outline-none transition-all [&>option]:bg-slate-800 [&>option]:text-white">
              <option value="">All Locations</option>
              <option v-for="loc in uniqueLocations" :key="loc" :value="loc">{{ loc }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-wider text-white">Date</label>
            <select v-model="filterDate" @change="applyFilters"
                    class="bg-white/10 border border-white/20 text-white text-sm rounded-xl focus:ring-[#FBB03A] focus:border-[#FBB03A] block w-full sm:w-48 p-2.5 outline-none transition-all [&>option]:bg-slate-800 [&>option]:text-white">
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 3 Months</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="loading" class="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        <div v-for="i in 6" :key="i" class="break-inside-avoid glass-card p-5 animate-pulse">
          <div class="flex gap-2 mb-3">
            <div class="h-5 w-20 rounded-full bg-white/5" />
            <div class="h-5 w-24 rounded-full bg-white/5" />
          </div>
          <div class="space-y-2 mb-4">
            <div class="h-3 rounded bg-white/5 w-full" />
            <div class="h-3 rounded bg-white/5 w-5/6" />
            <div class="h-3 rounded bg-white/5 w-4/6" />
          </div>
          <div class="h-1 rounded-full bg-white/5" />
        </div>
      </div>

      <div v-else-if="fetchError" class="flex flex-col items-center justify-center py-16 text-center">
        <p class="text-red-400 text-sm mb-3">{{ fetchError }}</p>
        <button @click="applyFilters" class="text-xs text-white/50 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-colors">Try Again</button>
      </div>

      <div v-else-if="diariesData.length === 0"
           class="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
             style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
          <span class="material-symbols-outlined text-white/40" style="font-size: 32px;">inbox</span>
        </div>
        <h3 class="font-display font-medium text-xl text-white mb-2">No observations found</h3>
        <p class="text-white/50 text-sm max-w-sm leading-relaxed mb-6">
          There are currently no diary entries matching your selected location or date.
        </p>
        <button v-if="filterLocation !== '' || filterDate !== 'all'" @click="resetFilters"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all duration-300">
          <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span>
          Clear Filters
        </button>
      </div>

      <div v-else class="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 animate-fade-in" ref="gridRef">
        <div v-for="entry in diariesData" :key="entry.id"
             class="break-inside-avoid glass-card p-5 hover:border-forest-600/40 hover:bg-black/5 dark:hover:bg-white/[0.06] transition-all duration-300 group">

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

          <p class="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-neutral-200 transition-colors">
            {{ entry.observation }}
          </p>

          <div class="mt-4 flex items-center gap-2">
            <span class="text-[10px] text-slate-500 dark:text-neutral-600 uppercase tracking-wider transition-colors">Sentiment</span>
            <div class="flex-1 h-1 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden transition-colors">
              <div class="h-full rounded-full transition-all duration-500"
                   :style="{ width: entry.sentiment + '%', background: sentimentColor(entry.sentiment) }" />
            </div>
            <span class="text-[10px]" :style="{ color: sentimentColor(entry.sentiment) }">
              {{ entry.sentiment >= 70 ? (lang === 'en' ? 'Hopeful' : 'Matumaini') :
                 entry.sentiment >= 40 ? (lang === 'en' ? 'Mixed' : 'Wastani') :
                 (lang === 'en' ? 'Concerned' : 'Wasiwasi') }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="diariesData.length > 0 && hasMore" class="mt-10 text-center animate-fade-in" ref="btnRef">
        <button @click="loadMore"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/10 hover:border-white/40 text-sm font-medium transition-all duration-300 shadow-lg shadow-black/20">
          <span v-if="isLoadingMore" class="material-symbols-outlined animate-spin" style="font-size: 18px;">progress_activity</span>
          <span v-else class="material-symbols-outlined" style="font-size: 18px;">expand_more</span>
          {{ lang === 'en' ? 'Load More Observations' : 'Pakia Uchunguzi Zaidi' }}
        </button>
      </div>
      <div v-else-if="diariesData.length > 0 && !hasMore" class="mt-10 text-center animate-fade-in">
        <p class="text-white/40 text-xs uppercase tracking-wider">No more entries to load</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { MapPin, Calendar, BookOpen } from 'lucide-vue-next'
import { supabase } from '../supabase'

const lang = inject('lang')
const isDark = inject('isDark')
const headerRef = ref(null)
const gridRef = ref(null)
const btnRef = ref(null)
const loading = ref(true)
const fetchError = ref('')
const diariesData = ref([])

const filterLocation = ref('')
const filterDate = ref('all')
const uniqueLocations = ref([])
const limit = ref(6) // Load 6 at a time
const isLoadingMore = ref(false)
const hasMore = ref(true)

const loadUniqueLocations = async () => {
  if (!supabase) return
  const { data } = await supabase.from('diaries').select('location').limit(700)
  if (data) {
    const locs = data.map(d => d.location).filter(Boolean)
    uniqueLocations.value = [...new Set(locs)].sort()
  }
}

const buildQuery = () => {
  let query = supabase
    .from('diaries')
    .select('id, location, date, content, sentiment', { count: 'exact' })

  if (filterLocation.value) {
    query = query.eq('location', filterLocation.value)
  }

  if (filterDate.value && filterDate.value !== 'all') {
    const days = parseInt(filterDate.value)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    query = query.gte('date', cutoffDate.toISOString())
  }

  return query.order('created_at', { ascending: false })
}

const fetchDiaries = async (isLoadMore = false) => {
  if (!isLoadMore) {
    loading.value = true
    limit.value = 6
    diariesData.value = []
  } else {
    isLoadingMore.value = true
  }
  fetchError.value = ''

  if (!supabase) {
    loading.value = false
    isLoadingMore.value = false
    fetchError.value = 'Database not configured'
    return
  }

  const query = buildQuery()
  const { data, count, error } = await query.limit(limit.value)

  loading.value = false
  isLoadingMore.value = false

  if (error) {
    console.error('CommunityDiaries fetch error:', error.code, error.message, error.details)
    fetchError.value = `Could not load diaries: ${error.message}`
    return
  }

  console.log('CommunityDiaries fetched:', data?.length, 'entries', data)

  if (data && data.length > 0) {
    const mapped = data.map(row => ({
      id:          row.id,
      date:        row.date,
      location:    row.location,
      observation: row.content,
      sentiment:   row.sentiment * 10,
    }))
    diariesData.value = mapped
    hasMore.value = mapped.length < count
  } else {
    diariesData.value = []
    hasMore.value = false
  }
}

const applyFilters = () => {
  fetchDiaries(false)
}

const resetFilters = () => {
  filterLocation.value = ''
  filterDate.value = 'all'
  fetchDiaries(false)
}

const loadMore = () => {
  limit.value += 6
  fetchDiaries(true)
}

let subscription = null

const setupRealtime = () => {
  if (!supabase) return
  
  subscription = supabase
    .channel('public_diaries_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'diaries'
    }, (payload) => {
      const mapPayload = (row) => ({
        id:          row.id,
        date:        row.date,
        location:    row.location,
        observation: row.content,
        sentiment:   row.sentiment * 10,
      })

      if (payload.eventType === 'INSERT') {
        const itemDate = new Date(payload.new.date)
        const isLocMatch = filterLocation.value === '' || payload.new.location === filterLocation.value
        let isDateMatch = true
        if (filterDate.value !== 'all') {
          const days = parseInt(filterDate.value)
          const cutoffDate = new Date()
          cutoffDate.setDate(cutoffDate.getDate() - days)
          isDateMatch = itemDate >= cutoffDate
        }

        if (isLocMatch && isDateMatch) {
          diariesData.value.unshift(mapPayload(payload.new))
          if (diariesData.value.length > limit.value) {
            diariesData.value.pop()
            hasMore.value = true
          }
        }
      } else if (payload.eventType === 'UPDATE') {
        const idx = diariesData.value.findIndex(e => e.id === payload.new.id)
        if (idx !== -1) diariesData.value[idx] = mapPayload(payload.new)
      } else if (payload.eventType === 'DELETE') {
        diariesData.value = diariesData.value.filter(e => e.id !== payload.old.id)
      }
    })
    .subscribe()
}

onMounted(() => {
  loadUniqueLocations()
  fetchDiaries()
  setupRealtime()
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.1 })
  ;[headerRef.value, gridRef.value, btnRef.value].forEach(el => el && observer.observe(el))
})

onUnmounted(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
}

const sentimentColor = (val) => {
  if (val >= 70) return '#22c55e'
  if (val >= 40) return '#eab308'
  return '#ef4444'
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
