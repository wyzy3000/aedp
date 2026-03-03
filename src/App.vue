<template>
  <MainLayout>
    <!-- ── Hero Section ──────────────────────────────────────── -->
    <section v-if="activeSection === ''" class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Layered background — offset gradients for naturalness -->
      <div class="absolute inset-0 pointer-events-none"
           :style="isDark
             ? 'background: radial-gradient(ellipse at 55% 55%, rgba(74,125,65,0.16) 0%, transparent 65%), radial-gradient(ellipse at 15% 15%, rgba(212,145,31,0.07) 0%, transparent 50%)'
             : 'background: radial-gradient(ellipse at 62% 48%, rgba(101,130,60,0.09) 0%, transparent 60%), radial-gradient(ellipse at 22% 18%, rgba(190,140,40,0.06) 0%, transparent 52%)'" />
      <!-- Warm ambient blob — slightly asymmetric positions to feel hand-placed -->
      <div class="absolute top-28 left-[28%] w-72 h-72 rounded-full pointer-events-none"
           :style="'background: radial-gradient(circle, rgba(74,125,65,' + (isDark ? '0.12' : '0.07') + '), transparent 70%); filter: blur(52px); animation: pulse 7s ease-in-out infinite;'" />
      <div class="absolute bottom-24 right-[22%] w-80 h-80 rounded-full pointer-events-none"
           :style="'background: radial-gradient(circle, rgba(190,140,40,' + (isDark ? '0.08' : '0.05') + '), transparent 70%); filter: blur(64px); animation: pulse 8.5s ease-in-out 2.3s infinite;'" />

      <div class="relative z-10 text-center max-w-6xl mx-auto px-8 pt-16">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
             style="background: rgba(74,125,65,0.1); border: 1px solid rgba(74,125,65,0.2);">
          <div class="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-forest-400">
            Ecosystem Early Warning System
          </span>
        </div>

        <!-- Title -->
        <h1 class="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-5 transition-colors overflow-visible pb-2 select-none"
            :class="isDark ? 'text-white' : 'text-[#1a2a12]'">
          Amboseli<br />
          <span
            :style="isDark
              ? 'background: linear-gradient(135deg, #4a9e3a 0%, #8fd47c 45%, #e9c160 85%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;'
              : 'background: linear-gradient(135deg, #2d6b20 0%, #4a9e3a 45%, #c48a1a 88%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;'"
          >
            Data Portal
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="font-display font-semibold text-xl transition-colors mb-4"
           :class="isDark ? 'text-savanna-400 italic' : 'text-[#3d6b1a]'">
          Amboseli Ecosystem Data Portal
        </p>

        <p class="text-[16px] max-w-lg mx-auto leading-relaxed mb-10 transition-colors"
           :class="isDark ? 'text-neutral-400 font-light' : 'text-[#4a4230] font-normal'">
          A community-driven decision support interface for the Amboseli Basin.
          Monitoring pasture, habitat, water, and wildlife health — in real time.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button @click="scrollTo('pasture')"
                  class="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-[15px] text-white
                         transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-forest-500/25"
                  style="background: linear-gradient(135deg, #376332, #4a9e3a)">
            <span>Explore the Data</span>
            <ChevronDown class="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <!-- Secondary CTA -->
          <a href="https://earlywarning.shinyapps.io/One_Health_Indicators/"
             target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-2 px-7 py-3.5 rounded-xl text-[14px] font-medium
                    transition-all duration-300 border"
             :class="isDark
               ? 'text-neutral-300 hover:text-white hover:bg-white/8 border-white/10'
               : 'text-[#3d5a1a] hover:text-[#1a2a12] hover:bg-[#3d7035]/8 border-[#3d7035]/20'">
            <ExternalLink class="w-4 h-4" />
            One Health Dashboard
          </a>
        </div>
      </div>
    </section>

    <!-- ── Modules ────────────────────────────────────────────── -->
    <template v-if="activeSection === 'pasture'"><PastureLevel class="min-h-screen pt-4 lg:pt-10" /></template>
    <template v-if="activeSection === 'habitat'"><HabitatChanges class="min-h-screen pt-4 lg:pt-10" /></template>
    <template v-if="activeSection === 'diaries'"><CommunityDiaries class="min-h-screen pt-4 lg:pt-10" /></template>
    <template v-if="activeSection === 'weather'"><WeatherForecast class="min-h-screen pt-4 lg:pt-10" /></template>
    <template v-if="activeSection === 'outlook'"><OutlookReports class="min-h-screen pt-4 lg:pt-10" /></template>
    <template v-if="activeSection === 'drought'"><DroughtStory class="min-h-screen pt-4 lg:pt-10" /></template>
    <template v-if="activeSection === 'onehealth'"><OneHealth class="min-h-screen pt-4 lg:pt-10" /></template>
  </MainLayout>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import { ChevronDown, ExternalLink } from 'lucide-vue-next'
import MainLayout from './layouts/MainLayout.vue'
import PastureLevel from './components/PastureLevel.vue'
import HabitatChanges from './components/HabitatChanges.vue'
import CommunityDiaries from './components/CommunityDiaries.vue'
import WeatherForecast from './components/WeatherForecast.vue'
import OutlookReports from './components/OutlookReports.vue'
import DroughtStory from './components/DroughtStory.vue'
import OneHealth from './components/OneHealth.vue'

const activeSection = ref('')
provide('activeSection', activeSection)

// Dark mode state management
const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  // Initialize theme, default to dark if not set
  if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && !window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    isDark.value = true
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
})

provide('isDark', isDark)
provide('toggleTheme', toggleTheme)

const scrollTo = (id) => {
  if (id === '__top') {
    activeSection.value = ''
  } else {
    activeSection.value = id
  }
  window.scrollTo({ top: 0, behavior: 'instant' })
}
</script>
