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
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors">Module 03 · Diaries</span>
        </div>
        <h2 class="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight transition-colors" style="letter-spacing:-0.02em">
          Local Community Environmental Diaries
        </h2>
        <p class="mt-2 font-display font-medium text-lg italic text-[#FBB03A] transition-colors">Maoni ya wenyeji</p>
        <p class="mt-3 text-white/90 text-[15px] leading-relaxed max-w-2xl transition-colors">
          First-hand seasonal observations from pastoralist and farming communities
          across the Amboseli ecosystem, recorded as structured field notes.
        </p>
      </div>

      <!-- Loading skeleton -->
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

      <!-- Error state -->
      <div v-else-if="fetchError" class="flex flex-col items-center justify-center py-16 text-center">
        <p class="text-red-400 text-sm mb-3">{{ fetchError }}</p>
        <button @click="fetchDiaries" class="text-xs text-white/50 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-colors">Try Again</button>
      </div>

      <!-- Empty state — no entries yet -->
      <div v-else-if="diariesData.length === 0"
           class="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div class="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
             style="background: rgba(251,176,58,0.08); border: 1px solid rgba(251,176,58,0.15);">
          <BookOpen class="w-9 h-9 text-[#FBB03A]/60" />
        </div>
        <h3 class="font-display font-bold text-2xl text-white mb-2">No diary entries yet</h3>
        <p class="text-white/50 text-sm max-w-sm leading-relaxed mb-6">
          Be the first community member to document what you're observing in the Amboseli ecosystem.
        </p>
        <router-link to="/dashboard"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FBB03A] hover:bg-[#e09e34] text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-[#FBB03A]/20">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          {{ lang === 'en' ? 'Post the First Entry' : 'Andika Ingizo la Kwanza' }}
        </router-link>
      </div>

      <!-- Diary cards grid — live data -->
      <div v-else class="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 animate-fade-in" ref="gridRef">
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
              {{ entry.sentiment >= 70 ? (lang === 'en' ? 'Hopeful' : 'Matumaini') :
                 entry.sentiment >= 40 ? (lang === 'en' ? 'Mixed' : 'Wastani') :
                 (lang === 'en' ? 'Concerned' : 'Wasiwasi') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Post a diary CTA (shown when entries exist) -->
      <div v-if="!loading && diariesData.length > 0" class="mt-10 text-center animate-fade-in" ref="btnRef">
        <router-link to="/dashboard"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#FBB03A]/30 text-[#FBB03A] hover:bg-[#FBB03A]/10 text-sm font-medium transition-all duration-300">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          {{ lang === 'en' ? 'Add Your Observation' : 'Ongeza Uchunguzi Wako' }}
        </router-link>
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

const fetchDiaries = async () => {
  loading.value = true
  fetchError.value = ''

  if (!supabase) {
    loading.value = false
    fetchError.value = 'Database not configured'
    return
  }

  const { data, error } = await supabase
    .from('diaries')
    .select('id, location, date, content, sentiment')
    .order('created_at', { ascending: false })
    .limit(12)

  loading.value = false

  if (error) {
    console.error('CommunityDiaries fetch error:', error.code, error.message, error.details)
    fetchError.value = `Could not load diaries: ${error.message}`
    return
  }

  console.log('CommunityDiaries fetched:', data?.length, 'entries', data)

  if (data && data.length > 0) {
    // Map sentiment from 1–10 to a percentage (×10) for the bar width
    const mapped = data.map(row => ({
      id:          row.id,
      date:        row.date,
      location:    row.location,
      observation: row.content,
      sentiment:   row.sentiment * 10,
    }))
    console.log('Mapped diariesData length:', mapped.length)
    diariesData.value = mapped
  } else {
    console.log('No data found, setting empty array')
    diariesData.value = []
  }
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
      // Map sentiment to match component state (x10)
      const mapPayload = (row) => ({
        id:          row.id,
        date:        row.date,
        location:    row.location,
        observation: row.content,
        sentiment:   row.sentiment * 10,
      })

      if (payload.eventType === 'INSERT') {
        diariesData.value.unshift(mapPayload(payload.new))
        
        // Ensure we don't exceed 12 items on the public page to keep it tidy
        if (diariesData.value.length > 12) {
          diariesData.value.pop()
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
