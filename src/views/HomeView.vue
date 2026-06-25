<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Video Background Container -->
    <div class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <video
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        class="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://media.brandika.co.ke/final-video.mp4" type="video/mp4" />
      </video>
      <!-- Readability Overlay -->
      <div 
        class="absolute inset-0 transition-colors duration-700"
        :class="isDark ? 'bg-black/55' : 'bg-black/45'"
      ></div>
    </div>

    <div class="relative z-10 text-center max-w-6xl mx-auto px-6 pt-16 pb-28 md:pb-16">
      <div class="inline-flex items-center gap-2 mb-8">
        <span class="text-[16px] font-sans font-light text-white" style="color: white !important;">
          {{ lang === 'en' ? 'Ecosystem Early Warning System' : 'Mfumo wa Onyo la Mapema wa Ikolojia' }}
        </span>
      </div>

      <h1 class="font-sourcesans font-extrabold text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-5 text-white overflow-visible pb-2">
        {{ lang === 'en' ? cmsData.titleEn : cmsData.titleSw }}<br />
        <span>
          {{ lang === 'en' ? cmsData.subtitleEn : cmsData.subtitleSw }}
        </span>
      </h1>


      <p class="text-[16px] max-w-lg mx-auto leading-relaxed mb-10 text-white font-light" style="color: white !important;">
        {{ lang === 'en' ? cmsData.descEn : cmsData.descSw }}
      </p>

      <div class="flex flex-col items-stretch sm:flex-row sm:items-center justify-center gap-3 w-full max-w-sm mx-auto sm:max-w-none">
        <button @click="router.push('/pasture')"
                class="flex items-center justify-center gap-2 px-6 py-[12px] rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                style="background: linear-gradient(135deg, #376332, #4a9e3a); border: 1px solid rgba(0, 0, 0, 0.15);">
          <span>{{ lang === 'en' ? 'Explore the Data' : 'Chunguza Takwimu' }}</span>
          <ChevronDown class="w-4 h-4 flex-shrink-0" />
        </button>

        <button @click="router.push('/onehealth')"
                class="flex items-center justify-center gap-2 px-6 py-[12px] rounded-xl font-bold text-sm tracking-wide text-neutral-300 hover:text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0 border border-white/10 hover:bg-white/8">
          <Activity class="w-4 h-4 flex-shrink-0" />
          <span>{{ lang === 'en' ? 'One Health Dashboard' : 'Dashibodi ya Afya Moja' }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronDown, Activity } from 'lucide-vue-next'
import { getActivePinia } from 'pinia'
import { useCmsStore } from '../stores/cms'

const isDark = inject('isDark')
const lang = inject('lang')
const router = useRouter()

const defaultHomeData = {
  titleEn: 'Amboseli',
  subtitleEn: 'Data Portal',
  titleSw: 'Amboseli',
  subtitleSw: 'Tovuti ya Takwimu',
  descEn: 'A community-driven decision support interface for the Amboseli Basin. Monitoring pasture, habitat, water, and wildlife health.',
  descSw: 'Kiolesura cha usaidizi wa maamuzi kinachoendeshwa na jamii kwa Bonde la Amboseli. Kufuatilia malisho, mazingira, maji, na afya ya wanyamapori.'
}

const cmsData = computed(() => {
  if (getActivePinia()) {
    return useCmsStore().getContent('home_page', defaultHomeData)
  }
  return defaultHomeData
})
</script>
