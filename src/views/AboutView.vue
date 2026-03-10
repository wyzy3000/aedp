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
        
        <h2 class="font-display font-extrabold text-4xl md:text-5xl leading-tight transition-colors mb-6"
            :class="isDark ? 'text-white' : 'text-[#1a2a12]'">
          About AEDP
        </h2>
        
        <p class="text-[15px] font-medium leading-relaxed max-w-3xl transition-colors"
           :class="isDark ? 'text-white' : 'text-[#4a4230]'">
          AEDP turns long-term rangeland monitoring into clear, practical stories communities and partners can use. It combines visuals with audio narration (including Maa and Swahili) to support informed decisions across the Amboseli landscape.
        </p>
      </div>

      <!-- Information Sections -->
      <div class="space-y-16 max-w-4xl fade-up" :class="{ 'visible': isMounted }">
        
        <!-- What you will find -->
        <div class="space-y-4">
          <h3 class="text-3xl font-extrabold transition-colors" :class="isDark ? 'text-white' : 'text-[#1a2a12]'">
            What you will find
          </h3>
          <ul class="space-y-2 list-none">
            <li v-for="(item, idx) in findings" :key="idx" class="flex gap-3 text-[15px] font-medium leading-relaxed transition-colors"
                :class="isDark ? 'text-white' : 'text-[#4a4230]'">
              <span class="text-[#FBB03A] text-xl leading-none">•</span>
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- Technologies -->
        <div class="space-y-4">
          <h3 class="text-3xl font-extrabold transition-colors" :class="isDark ? 'text-white' : 'text-[#1a2a12]'">
            Technologies
          </h3>
          <p class="text-[15px] font-medium leading-relaxed transition-colors" 
             :class="isDark ? 'text-white' : 'text-[#4a4230]'">
            R, Shiny, Bootstrap, animated GIFs, HTML5 audio.
          </p>
        </div>

        <!-- Credits -->
        <div class="space-y-6 pt-8 border-t border-dashed" :class="isDark ? 'border-white/10' : 'border-black/10'">
          <h3 class="text-3xl font-extrabold transition-colors" :class="isDark ? 'text-white' : 'text-[#1a2a12]'">
            Credits
          </h3>
          
          <div class="space-y-2 text-[15px] font-medium leading-relaxed transition-colors" 
               :class="isDark ? 'text-white' : 'text-[#4a4230]'">
            <p><span class="font-bold">Principal Investigator:</span> Dr. Victor N. Mose, PhD</p>
            <p><span class="font-bold">Email:</span> victor.mose@acc.or.ke, vnmose@gmail.com</p>
            <p><span class="font-bold">Team:</span> Felista Ndunge, Immaculate Ombongi, Sakimba Kimiti, Winfridah Kemunto, David Western</p>
            <p><span class="font-bold">In association with:</span> Brandika Technologies and Marketing Agency, and the partners listed on this page.</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'

const isDark = inject('isDark')
const isMounted = ref(false)

const findings = [
  'Long-term pasture and vegetation conditions',
  'Narrated, interactive summaries for quick understanding',
  'Change signals across vegetation, rainfall, wildlife, livestock, and settlements',
  'Insights that help anticipate risk, plan better, and take action'
]

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
