<template>
  <section id="onehealth" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <!-- Header -->
      <div class="mb-12 fade-up text-center" ref="headerRef">
        <span class="section-subtitle text-white/70">Module 07</span>
        <h2 class="section-heading mt-2 text-center text-white transition-colors">
          Ecosystem One Health Indicators
        </h2>
        <p class="mt-2 font-display font-medium text-xl text-[#FBB03A] italic text-center transition-colors">
          Biotisho · Eseriani · Eramatare
        </p>
        <p class="mt-2 text-xs text-white/60 uppercase tracking-widest text-center transition-colors">
          Local Community Perceptions
        </p>
        <p class="mt-4 text-white/90 text-base max-w-2xl leading-relaxed text-center mx-auto transition-colors">
          Integrating human, animal, and ecosystem health into a unified early-warning
          dashboard, grounded in community perceptions and scientific monitoring.
        </p>
      </div>

      <!-- CTA Card -->
      <div class="max-w-4xl mx-auto fade-up" ref="ctaRef">
        <div class="relative overflow-hidden rounded-3xl border border-forest-600/20 shadow-xl transition-colors"
             :style="isDark ? 'background: linear-gradient(135deg, rgba(74,125,65,0.08) 0%, rgba(26,56,30,0.2) 50%, rgba(74,125,65,0.05) 100%)' : 'background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(220,252,231,0.6) 50%, rgba(255,255,255,0.95) 100%)'">
          <!-- Glow effect -->
          <div class="absolute inset-0 pointer-events-none transition-colors"
               :style="'background: radial-gradient(ellipse at 30% 40%, rgba(74,125,65,' + (isDark ? '0.15' : '0.05') + ') 0%, transparent 60%)'" />

          <div class="relative p-10 md:p-14">
            <!-- Ecosystem icons row -->
            <div class="flex justify-center gap-6 mb-8">
              <div v-for="icon in ecosystemIcons" :key="icon.label"
                   class="flex flex-col items-center gap-2">
                <div class="w-14 h-14 rounded-2xl border flex items-center justify-center transition-colors bg-white/50 dark:bg-transparent"
                     :style="{ background: isDark ? icon.bg : undefined, borderColor: isDark ? icon.borderColor : (icon.borderColor.replace('0.2)', '0.1)')) }">
                  <component :is="icon.component" class="w-7 h-7 transition-colors" :style="{ color: isDark ? icon.color : icon.colorDarker || icon.color }" />
                </div>
                <span class="text-[10px] text-slate-500 dark:text-neutral-500 uppercase tracking-wider transition-colors">{{ icon.label }}</span>
              </div>
            </div>

            <!-- Heading -->
            <h3 class="text-center font-display font-bold text-2xl md:text-3xl text-slate-900 dark:text-white mb-4 transition-colors">
              {{ lang === 'en' ? 'Explore the One Health Dashboard' : 'Angalia Dashibodi ya Afya Moja' }}
            </h3>
            <p class="text-center text-slate-600 dark:text-neutral-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed transition-colors">
              {{ lang === 'en'
                ? 'An interactive Shiny dashboard displaying integrated indicators for human wellbeing, livestock health, wildlife status, and environmental conditions across Amboseli.'
                : 'Dashibodi ya Shiny inayoonyesha viashiria vya afya ya binadamu, mifugo, wanyamapori, na mazingira katika Amboseli.'
              }}
            </p>

            <!-- CTA Button -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://earlywarning.shinyapps.io/One_Health_Indicators/"
                 target="_blank" rel="noopener noreferrer"
                 class="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base
                        text-white overflow-hidden transition-all duration-300 hover:scale-105
                        hover:shadow-2xl hover:shadow-forest-500/30"
                 style="background: linear-gradient(135deg, #376332 0%, #4a7d41 50%, #376332 100%)">
                <span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style="background: linear-gradient(135deg, #4a7d41 0%, #5c9952 50%, #4a7d41 100%)" />
                <ExternalLink class="w-5 h-5 relative z-10" />
                <span class="relative z-10">
                  {{ lang === 'en' ? 'Launch One Health Dashboard' : 'Fungua Dashibodi ya Afya Moja' }}
                </span>
                <ArrowRight class="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap justify-center gap-2 mt-8">
              <span v-for="tag in tags" :key="tag" class="tag-pill">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { ExternalLink, ArrowRight, Activity, Heart, Bird, Leaf } from 'lucide-vue-next'

const lang = inject('lang')
const isDark = inject('isDark')
const headerRef = ref(null)
const ctaRef = ref(null)

const ecosystemIcons = [
  { label: 'Human',     component: Heart,     color: '#ef4444', colorDarker: '#dc2626', bg: 'rgba(239,68,68,0.1)',   borderColor: 'rgba(239,68,68,0.2)' },
  { label: 'Livestock', component: Activity,  color: '#f59e0b', colorDarker: '#d97706', bg: 'rgba(245,158,11,0.1)',  borderColor: 'rgba(245,158,11,0.2)' },
  { label: 'Wildlife',  component: Bird,      color: '#3b82f6', colorDarker: '#2563eb', bg: 'rgba(59,130,246,0.1)',  borderColor: 'rgba(59,130,246,0.2)' },
  { label: 'Ecosystem', component: Leaf,      color: '#4a7d41', colorDarker: '#166534', bg: 'rgba(74,125,65,0.15)',  borderColor: 'rgba(74,125,65,0.3)' },
]

const tags = [
  'Shiny Dashboard', 'R/Tidyverse', 'Community Science',
  'ILRI', 'Early Warning', 'One Health'
]

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.1 })
  ;[headerRef.value, ctaRef.value].forEach(el => el && observer.observe(el))
})
</script>
