<template>
  <div class="flex min-h-screen">

    <!-- ─── Left Sidebar ─────────────────────────────────────── -->
    <aside
      class="fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300
             border-r bg-[#faf8f3] dark:bg-[#060e08]/96
             border-stone-200/80 dark:border-white/5
             shadow-[2px_0_12px_rgba(100,80,30,0.06)] dark:shadow-none
             backdrop-blur-sm"
      :class="collapsed ? 'w-[68px]' : 'w-64'"
    >
      <!-- Logo / Brand -->
      <div class="flex items-center justify-center gap-3 px-2 pt-0 pb-0 -mt-[5px] border-b border-stone-200/60 dark:border-white/5 flex-shrink-0 transition-all duration-300">
        <img src="../assets/aedp-logo.png" alt="AEDP Logo" class="w-full object-contain transition-all duration-300 scale-105" :class="collapsed ? 'h-12 max-w-[48px]' : 'h-40 max-w-[240px]'" />
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
        <!-- Hero link -->
        <button @click="scrollTo('__top')"
          class="sidebar-link group w-full"
          :class="activeSection === '' ? 'active' : ''"
          :title="collapsed ? 'Home' : ''">
          <Home class="sidebar-icon" />
          <Transition name="fade-side">
            <span v-if="!collapsed" class="sidebar-label">{{ lang === 'en' ? 'Home' : 'Nyumbani' }}</span>
          </Transition>
        </button>

        <div v-if="!collapsed" class="mt-4 mb-2 px-2">
          <p class="text-[9px] text-stone-400 dark:text-neutral-600 uppercase tracking-widest font-semibold transition-colors">Modules</p>
        </div>
        <div v-else class="mt-4 mb-2 border-t border-black/5 dark:border-white/5" />

        <button v-for="link in navLinks" :key="link.id"
          @click="scrollTo(link.id)"
          class="sidebar-link group w-full"
          :class="activeSection === link.id ? 'active' : ''"
          :title="collapsed ? (lang === 'en' ? link.en : link.sw) : ''">
          <component :is="link.icon" class="sidebar-icon" />
          <Transition name="fade-side">
            <!-- Sub-label: show English as secondary label in sw mode -->
            <div v-if="!collapsed" class="flex flex-col items-start overflow-hidden">
              <span class="sidebar-label">{{ lang === 'en' ? link.en : link.sw }}</span>
              <span class="text-[10px] text-stone-400 dark:text-neutral-600 italic leading-none mt-0.5 whitespace-nowrap transition-colors">
                {{ lang === 'en' ? link.sw : link.en }}
              </span>
            </div>
          </Transition>
        </button>
      </nav>

      <!-- Bottom controls -->
      <div class="flex-shrink-0 border-t border-black/5 dark:border-white/5 p-3 flex flex-col gap-2.5 transition-colors">
        
        <!-- Lang toggle -->
        <button @click="toggleLang"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg w-full
                 bg-stone-100/80 border border-stone-200/60 hover:bg-stone-200/70
                 dark:bg-white/[0.04] dark:border-white/[0.08] dark:hover:bg-white/[0.08]
                 transition-all duration-200 group"
          :title="collapsed ? 'Language' : ''">
          <Globe class="w-4 h-4 text-stone-500 dark:text-neutral-400 group-hover:text-stone-700 dark:group-hover:text-neutral-200 flex-shrink-0 transition-colors" />
          <Transition name="fade-side">
            <span v-if="!collapsed" class="text-xs text-stone-600 dark:text-neutral-400 group-hover:text-stone-900 dark:group-hover:text-neutral-200 transition-colors whitespace-nowrap">
              {{ lang === 'en' ? 'Switch to Kiswahili' : 'Switch to English' }}
            </span>
          </Transition>
        </button>

        <!-- Collapse toggle -->
        <button @click="collapsed = !collapsed"
          class="flex items-center justify-center w-full py-2 rounded-lg
                 hover:bg-stone-200/50 dark:hover:bg-white/5
                 text-stone-400 dark:text-neutral-600 hover:text-stone-700 dark:hover:text-neutral-400 transition-all duration-200">
          <ChevronLeft class="w-4 h-4 transition-transform duration-300" :class="collapsed ? 'rotate-180' : ''" />
        </button>
      </div>
    </aside>

    <!-- ─── Main Content ──────────────────────────────────────── -->
    <main
      class="flex-1 min-w-0 transition-all duration-300"
      :class="collapsed ? 'ml-[68px]' : 'ml-64'"
    >
      <slot />

      <!-- Footer -->
      <footer class="border-t border-stone-100 dark:border-white/5 py-7 transition-colors">
        <div class="max-w-5xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-stone-400 dark:text-neutral-600 text-sm transition-colors">
            <span>Amboseli Ecosystem Data Portal (AEDP)</span>
          </div>
          <div class="text-stone-400 dark:text-neutral-700 text-xs transition-colors">Powered by Open-Meteo · ILRI · Community Science</div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, inject, provide } from 'vue'
import { Sun, Moon, Leaf, Globe, ChevronLeft, Home, Sprout, Trees, BookOpen, Cloud, BarChart2, AlertTriangle, Heart } from 'lucide-vue-next'

const lang = ref('en')
const collapsed = ref(false)
const activeSection = inject('activeSection', ref(''))
const isDark = inject('isDark')
const toggleTheme = inject('toggleTheme')

provide('lang', lang)

const toggleLang = () => { lang.value = lang.value === 'en' ? 'sw' : 'en' }

const navLinks = [
  { id: 'pasture',   en: 'Pasture',      sw: 'Nyasi',       icon: Sprout },
  { id: 'habitat',   en: 'Habitat',      sw: 'Makazi',      icon: Trees },
  { id: 'diaries',   en: 'Diaries',      sw: 'Maoni',       icon: BookOpen },
  { id: 'weather',   en: 'Weather',      sw: 'Hali ya Anga', icon: Cloud },
  { id: 'outlook',   en: 'Outlook',      sw: 'Taarifa',     icon: BarChart2 },
  { id: 'drought',   en: 'Drought',      sw: 'Kiangazi',    icon: AlertTriangle },
  { id: 'onehealth', en: 'One Health',   sw: 'Afya Moja',   icon: Heart },
]

const scrollTo = (id) => {
  if (id === '__top') {
    activeSection.value = ''
  } else {
    activeSection.value = id
  }
  window.scrollTo({ top: 0, behavior: 'instant' })
}
</script>

<style scoped>
/* Sidebar link states — more hand-crafted feel with sage green accent on active */
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  color: #000000; /* changed to black */
  cursor: pointer;
  background: transparent;
  transition: all 0.2s ease;
  text-align: left;
}
:global(.dark) .sidebar-link {
  color: rgba(255, 255, 255, 0.82);
}

.sidebar-link:hover {
  background: rgba(101, 120, 60, 0.06);
  border-color: rgba(101, 120, 60, 0.1);
  color: #000000;
  transform: translateX(2px);
}
:global(.dark) .sidebar-link:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* Active — orange left bar accent */
.sidebar-link.active {
  background: rgba(249, 115, 22, 0.08);
  border-color: rgba(249, 115, 22, 0.15);
  color: #000000; /* changed to black */
  box-shadow: inset 3px 0 0 rgba(249, 115, 22, 0.45);
}
:global(.dark) .sidebar-link.active {
  background: rgba(249, 115, 22, 0.1);
  border-color: rgba(249, 115, 22, 0.2);
  color: #ffffff;
  box-shadow: inset 3px 0 0 rgba(249, 115, 22, 0.55);
}
.sidebar-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  transition: color 0.3s;
}
.sidebar-label {
  font-size: 15px; /* increased from 13px */
  font-weight: 500;
  letter-spacing: 0.01em;
  white-space: nowrap;
  line-height: 1.2;
}

/* Sidebar collapse transition */
.fade-side-enter-active,
.fade-side-leave-active {
  transition: opacity 0.15s ease, max-width 0.25s ease;
  max-width: 180px;
  overflow: hidden;
}
.fade-side-enter-from,
.fade-side-leave-to {
  opacity: 0;
  max-width: 0;
}
</style>
