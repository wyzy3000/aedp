<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 pointer-events-none"
         :style="isDark
           ? 'background: radial-gradient(ellipse at 55% 55%, rgba(74,125,65,0.16) 0%, transparent 65%), radial-gradient(ellipse at 15% 15%, rgba(212,145,31,0.07) 0%, transparent 50%)'
           : 'background: radial-gradient(ellipse at 62% 48%, rgba(101,130,60,0.09) 0%, transparent 60%), radial-gradient(ellipse at 22% 18%, rgba(190,140,40,0.06) 0%, transparent 52%)'" />
    <div class="absolute top-28 left-[28%] w-72 h-72 rounded-full pointer-events-none"
         :style="'background: radial-gradient(circle, rgba(74,125,65,' + (isDark ? '0.12' : '0.07') + '), transparent 70%); filter: blur(52px); animation: pulse 7s ease-in-out infinite;'" />
    <div class="absolute bottom-24 right-[22%] w-80 h-80 rounded-full pointer-events-none"
         :style="'background: radial-gradient(circle, rgba(190,140,40,' + (isDark ? '0.08' : '0.05') + '), transparent 70%); filter: blur(64px); animation: pulse 8.5s ease-in-out 2.3s infinite;'" />

    <div class="relative z-10 text-center max-w-6xl mx-auto px-8 pt-16">
      <div class="inline-flex items-center gap-2 mb-8">
        <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white">
          {{ lang === 'en' ? 'Ecosystem Early Warning System' : 'Mfumo wa Onyo la Mapema wa Ikolojia' }}
        </span>
      </div>

      <h1 class="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-5 transition-colors overflow-visible pb-2 select-none"
          :class="isDark ? 'text-white' : 'text-[#1a2a12]'">
        Amboseli<br />
        <span
          :style="isDark
            ? 'background: linear-gradient(135deg, #4a9e3a 0%, #8fd47c 45%, #e9c160 85%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;'
            : 'background: linear-gradient(135deg, #2d6b20 0%, #4a9e3a 45%, #c48a1a 88%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;'"
        >
          {{ lang === 'en' ? 'Data Portal' : 'Tovuti ya Takwimu' }}
        </span>
      </h1>


      <p class="text-[16px] max-w-lg mx-auto leading-relaxed mb-10 transition-colors text-white font-light">
        {{ lang === 'en' 
          ? 'A community-driven decision support interface for the Amboseli Basin. Monitoring pasture, habitat, water, and wildlife health — in real time.' 
          : 'Kiolesura cha usaidizi wa maamuzi kinachoendeshwa na jamii kwa Bonde la Amboseli. Kufuatilia malisho, mazingira, maji, na afya ya wanyamapori — kwa wakati halisi.' 
        }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button @click="router.push('/pasture')"
                class="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-[15px] text-white
                       transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-forest-500/25"
                style="background: linear-gradient(135deg, #376332, #4a9e3a)">
          <span>{{ lang === 'en' ? 'Explore the Data' : 'Chunguza Takwimu' }}</span>
          <ChevronDown class="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </button>

        <button @click="router.push('/onehealth')"
                class="flex items-center gap-2 px-7 py-3.5 rounded-xl text-[14px] font-medium
                       transition-all duration-300 border"
                :class="isDark
                  ? 'text-neutral-300 hover:text-white hover:bg-white/8 border-white/10'
                  : 'text-[#3d5a1a] hover:text-[#1a2a12] hover:bg-[#3d7035]/8 border-[#3d7035]/20'">
          <Activity class="w-4 h-4" />
          {{ lang === 'en' ? 'One Health Dashboard' : 'Dashibodi ya Afya Moja' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Activity } from 'lucide-vue-next'

const isDark = inject('isDark')
const lang = inject('lang')
const router = useRouter()
</script>
