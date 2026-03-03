<template>
  <section id="outlook" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <!-- Header -->
      <div class="mb-10 fade-up" ref="headerRef">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full bg-savanna-500" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-500 transition-colors">Module 05 · Outlook</span>
        </div>
        <h2 class="font-display font-extrabold text-4xl md:text-5xl text-slate-900 dark:text-white leading-tight transition-colors" style="letter-spacing:-0.02em">
          Amboseli Outlook Report
        </h2>
        <p class="mt-2 font-display font-medium text-lg italic text-savanna-600 transition-colors">Taarifa za Amboseli</p>
        <p class="mt-3 text-slate-600 dark:text-neutral-500 text-[15px] leading-relaxed max-w-2xl transition-colors">
          Expert synthesis of current ecosystem conditions drawn from satellite data,
          ground-truth surveys, and meteorological analysis.
        </p>
      </div>

      <!-- Outlook Card -->
      <div class="glass-card-strong p-8 mb-6 fade-up relative overflow-hidden bg-white/90 dark:bg-[#0c0c08]/80 transition-colors" ref="cardRef">
        <!-- Decorative corner element -->
        <div class="absolute top-0 right-0 w-40 h-40 pointer-events-none transition-colors"
             :style="'background: radial-gradient(circle at top right, rgba(212,145,31,' + (isDark ? '0.08' : '0.15') + ') 0%, transparent 70%)'" />

        <!-- Date badge -->
        <div class="flex items-center gap-3 mb-6 transition-colors">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-savanna-500/10 border border-savanna-500/20">
            <div class="w-1.5 h-1.5 rounded-full bg-savanna-500 dark:bg-savanna-400 animate-pulse transition-colors" />
            <span class="text-xs font-medium text-savanna-700 dark:text-savanna-400 transition-colors">{{ outlookData.date }}</span>
          </div>
        </div>

        <!-- Summary text -->
        <p class="text-base text-slate-700 dark:text-neutral-300 leading-relaxed max-w-3xl transition-colors">
          {{ outlookData.summary }}
        </p>

        <!-- Condition indicators -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-black/5 dark:border-white/5 transition-colors">
          <div v-for="cond in conditions" :key="cond.label" class="text-center">
            <div class="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors"
                 :style="{ background: cond.bg }">
              <component :is="cond.icon" class="w-5 h-5 transition-colors" :style="{ color: cond.color }" />
            </div>
            <p class="text-xs text-slate-500 dark:text-neutral-400 transition-colors">
              {{ lang === 'en' ? cond.label : cond.sw }}
            </p>
            <p class="text-sm font-semibold mt-0.5 transition-colors" :style="{ color: cond.color }">
              {{ lang === 'en' ? cond.status : cond.statusSw }}
            </p>
          </div>
        </div>
      </div>

      <!-- Audio + Info -->
      <div class="flex flex-wrap items-center gap-4 fade-up" ref="audioRef">
        <button @click="toggleAudio" :class="['audio-btn', isPlaying ? 'playing' : '']">
          <div class="waveform" :class="{ active: isPlaying }">
            <span /><span /><span /><span /><span />
          </div>
          <span v-if="!isPlaying">
            {{ lang === 'en' ? '🔊 Listen to Outlook (Swahili)' : '🔊 Sikiliza Taarifa' }}
          </span>
          <span v-else>{{ lang === 'en' ? '⏹ Stop' : '⏹ Simamisha' }}</span>
        </button>
        <div class="text-xs text-slate-500 dark:text-neutral-600 transition-colors">
          {{ lang === 'en' ? 'Synthesis narrated in Swahili for community access' : 'Muhtasari unaosemwa kwa Kiswahili' }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { Sprout, Cloud, Activity, AlertTriangle } from 'lucide-vue-next'

const lang = inject('lang')
const isDark = inject('isDark')
const isPlaying = ref(false)
const headerRef = ref(null)
const cardRef = ref(null)
const audioRef = ref(null)

const outlookData = {
  date: 'Current Outlook',
  summary: 'Pasture conditions are showing early signs of recovery across the Amboseli basin following the onset of short rains in late October. Short-term weather forecasts indicate continued rainfall over the next two weeks, which should support further vegetation growth and livestock body condition recovery. However, habitat monitoring shows significant woody cover loss from the previous drought sequence, and wetland margins remain stressed. Community monitors report wildlife movements returning to typical seasonal patterns.',
}

const conditions = [
  {
    label: 'Pasture', sw: 'Nyasi',
    status: 'Recovering', statusSw: 'Inajipona',
    icon: Sprout, color: '#4a7d41',
    bg: 'rgba(74,125,65,0.15)',
  },
  {
    label: 'Rainfall', sw: 'Mvua',
    status: 'Improving', statusSw: 'Inaimarika',
    icon: Cloud, color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
  },
  {
    label: 'Wildlife', sw: 'Wanyama',
    status: 'Stable', statusSw: 'Imara',
    icon: Activity, color: '#e9c160',
    bg: 'rgba(233,193,96,0.12)',
  },
  {
    label: 'Drought Risk', sw: 'Hatari ya Kiangazi',
    status: 'Moderate', statusSw: 'Ya Wastani',
    icon: AlertTriangle, color: '#f97316',
    bg: 'rgba(249,115,22,0.12)',
  },
]

const toggleAudio = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) setTimeout(() => { isPlaying.value = false }, 8000)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.1 })
  ;[headerRef.value, cardRef.value, audioRef.value].forEach(el => el && observer.observe(el))
})
</script>
