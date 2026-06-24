<template>
  <section id="about" class="relative py-20 min-h-screen overflow-hidden transition-colors duration-700"
           :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'">
    
    <!-- Ambient Background Gradients -->
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :style="isDark 
           ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' 
           : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <!-- Overview Section -->
      <div class="mb-16 fade-up" :class="{ 'visible': isMounted }">
        
        <h2 class="module-title transition-colors mb-6">
          {{ lang === 'en' ? cmsData.titleEn : cmsData.titleSw }}
        </h2>
        
        <p class="text-[15px] font-normal leading-relaxed max-w-5xl transition-colors"
           :class="isDark ? '!text-white' : 'text-[#4a4230]'">
          {{ lang === 'en' ? cmsData.descEn : cmsData.descSw }}
        </p>
      </div>

      <!-- Information Sections -->
      <div class="space-y-16 max-w-4xl fade-up" :class="{ 'visible': isMounted }">
        
        <!-- What you will find -->
        <div class="space-y-4">
          <h3 class="text-3xl font-extrabold transition-colors" :class="isDark ? 'text-white' : 'text-[#1a2a12]'">
            {{ lang === 'en' ? 'What you will find' : 'Utakachopata' }}
          </h3>
          <ul class="space-y-2 list-none">
            <li v-for="(item, idx) in findingsList" :key="idx" class="flex gap-3 text-[15px] font-normal leading-relaxed transition-colors"
                :class="isDark ? '!text-white' : 'text-[#4a4230]'">
              <span class="text-[#E09E34] text-xl leading-none">•</span>
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Technologies -->
        <div class="space-y-4">
          <h3 class="text-3xl font-extrabold transition-colors" :class="isDark ? 'text-white' : 'text-[#1a2a12]'">
            {{ lang === 'en' ? 'Technologies' : 'Teknolojia' }}
          </h3>
          <p class="text-[15px] font-normal leading-relaxed transition-colors" 
             :class="isDark ? '!text-white' : 'text-[#4a4230]'">
            R, Shiny, Bootstrap, animated GIFs, HTML5 audio.
          </p>
        </div>

        <!-- Credits -->
        <div class="space-y-6 pt-8 border-t border-dashed" :class="isDark ? 'border-white/10' : 'border-black/10'">
          <h3 class="text-3xl font-extrabold transition-colors" :class="isDark ? 'text-white' : 'text-[#1a2a12]'">
            {{ lang === 'en' ? 'Credits' : 'Shukrani' }}
          </h3>
          
          <div class="space-y-2 text-[15px] font-normal leading-relaxed transition-colors">
            <p :class="isDark ? '!text-white' : 'text-[#4a4230]'" class="transition-colors"><span class="font-bold">Principal Investigator:</span> {{ cmsData.credits.pi }}</p>
            <p :class="isDark ? '!text-white' : 'text-[#4a4230]'" class="transition-colors"><span class="font-bold">Email:</span> {{ cmsData.credits.email }}</p>
            <p :class="isDark ? '!text-white' : 'text-[#4a4230]'" class="transition-colors"><span class="font-bold">Team:</span> {{ cmsData.credits.team }}</p>
            <p :class="isDark ? '!text-white' : 'text-[#4a4230]'" class="transition-colors"><span class="font-bold">In association with:</span> {{ cmsData.credits.association }}</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { getActivePinia } from 'pinia'
import { useCmsStore } from '../stores/cms'

const isDark = inject('isDark')
const lang = inject('lang')
const isMounted = ref(false)

const defaultAboutData = {
  titleEn: 'About AEDP',
  titleSw: 'Kuhusu AEDP',
  descEn: 'AEDP turns long-term rangeland monitoring into clear, practical stories communities and partners can use. It combines visuals with audio narration (including Maa and Swahili) to support informed decisions across the Amboseli landscape.',
  descSw: 'AEDP inabadilisha ufuatiliaji wa muda mrefu wa malisho kuwa hadithi zilizo wazi na za vitendo ambazo jamii na washirika wanaweza kutumia. Inachanganya picha na maelezo ya sauti (pamoja na Kimaa na Kiswahili) ili kusaidia maamuzi sahihi katika mazingira ya Amboseli.',
  findings: [
    'Long-term pasture and vegetation conditions',
    'Narrated, interactive summaries for quick understanding',
    'Change signals across vegetation, rainfall, wildlife, livestock, and settlements',
    'Insights that help anticipate risk, plan better, and take action'
  ],
  credits: {
    pi: 'Dr. Victor N. Mose, PhD',
    email: 'victor.mose@acc.or.ke, vnmose@gmail.com',
    team: 'Felista Ndunge, Immaculate Ombongi, Sakimba Kimiti, Winfridah Kemunto, David Western',
    association: 'Brandika Technologies and Marketing Agency, and the partners listed on this page.'
  }
}

const cmsData = computed(() => {
  if (getActivePinia()) {
    return useCmsStore().getContent('about_page', defaultAboutData)
  }
  return defaultAboutData
})
const findingsList = computed(() => cmsData.value.findings || defaultAboutData.findings)

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})
</script>

<style scoped>
h2, h3 {
  letter-spacing: -0.022em;
}
</style>
