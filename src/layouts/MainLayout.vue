<template>
  <div class="flex min-h-screen">



    <!-- ─── Left Sidebar ─────────────────────────────────────── -->
    <aside
      class="fixed left-0 top-0 h-screen z-50 flex flex-col transition-[width] duration-300
             border-r bg-slate-50 dark:bg-[#050e07]/80
             border-black/5 dark:border-white/5
             shadow-[2px_0_12px_rgba(0,0,0,0.06)]
             backdrop-blur-sm"
      :class="collapsed ? 'w-[68px]' : 'w-64'"
    >
      <!-- Logo / Brand -->
      <div class="flex items-center justify-center gap-3 px-2 pt-0 pb-0 -mt-[5px] border-b border-stone-200/60 dark:border-white/5 flex-shrink-0 transition-all duration-300">
        <img src="../assets/aedp-logo.png" alt="AEDP Logo" class="w-full object-contain transition-all duration-300 scale-105" :class="collapsed ? 'h-12 max-w-[48px]' : 'h-40 max-w-[240px]'" />
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
        
        <!-- ======================= -->
        <!-- PUBLIC PORTAL SIDEBAR   -->
        <!-- ======================= -->
        <template v-if="!isDashboard">
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
        </template>

        <!-- ======================= -->
        <!-- DASHBOARD SIDEBAR       -->
        <!-- ======================= -->
        <template v-else>
          <!-- Back to Portal link (top of Dashboard sidebar) -->
          <button @click="router.push('/')"
            class="sidebar-link group w-full mb-2"
            :title="collapsed ? 'Back to Portal' : ''">
            <ArrowLeft class="sidebar-icon group-hover:-translate-x-0.5 transition-transform" />
            <Transition name="fade-side">
              <span v-if="!collapsed" class="sidebar-label">Back to Portal</span>
            </Transition>
          </button>

          <div v-if="!collapsed" class="mb-2 px-2">
            <p class="text-[9px] text-stone-400 dark:text-neutral-600 uppercase tracking-widest font-semibold transition-colors">My Account</p>
          </div>

          <button @click="router.push('/dashboard')"
            class="sidebar-link group w-full"
            :class="route.path === '/dashboard' ? 'active' : ''"
            :title="collapsed ? 'My Diaries' : ''">
            <BookOpen class="sidebar-icon" />
            <Transition name="fade-side">
              <span v-if="!collapsed" class="sidebar-label">My Diaries</span>
            </Transition>
          </button>
          
          <button @click="router.push('/dashboard/one-health')"
            class="sidebar-link group w-full"
            :class="route.path === '/dashboard/one-health' ? 'active' : ''"
            :title="collapsed ? 'One Health Map' : ''">
            <Heart class="sidebar-icon" />
            <Transition name="fade-side">
              <span v-if="!collapsed" class="sidebar-label">One Health Map</span>
            </Transition>
          </button>
          
          <button @click="router.push('/dashboard/settings')"
            class="sidebar-link group w-full"
            :class="route.path === '/dashboard/settings' ? 'active' : ''"
            :title="collapsed ? 'Settings' : ''">
            <Settings class="sidebar-icon" />
            <Transition name="fade-side">
              <span v-if="!collapsed" class="sidebar-label">Settings</span>
            </Transition>
          </button>
        </template>
      </nav>

      <!-- Bottom controls -->
      <div class="flex-shrink-0 border-t border-black/5 dark:border-white/5 p-3 flex flex-col gap-2.5 transition-colors">
        
        <template v-if="!authLoading && !isDashboard && !user">
          <button @click="router.push('/login')"
            class="premium-orange-button w-full mb-1"
            :title="collapsed ? 'Login' : ''">
            <UserCircle class="w-5 h-5 flex-shrink-0" />
            <Transition name="fade-side">
              <span v-if="!collapsed" class="font-bold text-sm tracking-wide">Login</span>
            </Transition>
          </button>
        </template>

        <!-- Sign Out — shown when logged in, on all pages -->
        <template v-if="!authLoading && user">
          <!-- My Dashboard Button in Sidebar -->
          <button v-if="!isDashboard" @click="router.push('/dashboard')"
            class="sidebar-link group w-full border-l-2 border-[#FBB03A]/60 hover:border-[#FBB03A] mb-1 text-[#FBB03A]"
            :title="collapsed ? 'My Dashboard' : ''">
            <LayoutDashboard class="sidebar-icon text-[#FBB03A]" />
            <Transition name="fade-side">
              <span v-if="!collapsed" class="sidebar-label text-[#FBB03A]">My Dashboard</span>
            </Transition>
          </button>
          <button @click="handleSignOut"
            class="sidebar-link group w-full border-l-2 border-red-400/40 hover:border-red-500 mb-1 text-red-500"
            :title="collapsed ? 'Sign Out' : ''">
            <LogOut class="sidebar-icon text-red-500" />
            <Transition name="fade-side">
              <span v-if="!collapsed" class="sidebar-label text-red-500">Sign Out</span>
            </Transition>
          </button>
        </template>


        <!-- Lang toggle -->
        <button @click="toggleLang"
          class="flex items-center gap-2.5 px-3 py-2 rounded-lg w-full
                 bg-stone-100/80 border border-stone-200/60
                 dark:bg-white/[0.04] dark:border-white/[0.08]
                 transition-all duration-200 group"
          :title="collapsed ? 'Language' : ''">
          <Globe class="w-4 h-4 text-stone-400 dark:text-neutral-500 flex-shrink-0" />
          <Transition name="fade-side">
            <span v-if="!collapsed" class="text-xs text-black font-medium whitespace-nowrap">
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
        <div class="max-w-5xl mx-auto px-8 flex justify-center text-center">
          <div class="text-white text-sm font-medium transition-colors">
            Amboseli Ecosystem Data Portal (AEDP)
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, inject, provide, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Sun, Moon, Leaf, Globe, ChevronLeft, Home, Sprout, Trees, BookOpen, Cloud, BarChart2, AlertTriangle, Heart, LayoutDashboard, ArrowLeft, LogOut, UserCircle, Settings } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const lang = ref('en')
const collapsed = ref(false)
const activeSection = inject('activeSection', ref(''))
const isDark = inject('isDark')
const toggleTheme = inject('toggleTheme')
const user = inject('user', ref(null))
const signOut = inject('signOut', () => {})
const authLoading = inject('authLoading', ref(false))

const isDashboard = computed(() => route.path.startsWith('/dashboard'))

provide('lang', lang)

const toggleLang = () => { lang.value = lang.value === 'en' ? 'sw' : 'en' }

const handleSignOut = async () => {
  await signOut()
  router.push('/')
}

const navLinks = [
  { id: 'pasture',   en: 'Pasture',      sw: 'Nyasi',       icon: Sprout },
  { id: 'habitat',   en: 'Habitat',      sw: 'Makazi',      icon: Trees },
  { id: 'diaries',   en: 'Diaries',      sw: 'Maoni',       icon: BookOpen },
  { id: 'weather',   en: 'Weather',      sw: 'Hali ya Anga', icon: Cloud },
  { id: 'onehealth', en: 'One Health',   sw: 'Afya Moja',   icon: Heart },
]

const scrollTo = (id) => {
  if (id === '__top') {
    router.push('/')
  } else {
    router.push('/' + id)
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

/* Active — sage green left bar accent (matches brand) */
.sidebar-link.active {
  background: rgba(74, 125, 65, 0.09);
  border-color: rgba(74, 125, 65, 0.18);
  color: #000000;
  box-shadow: inset 3px 0 0 rgba(74, 125, 65, 0.55);
}
:global(.dark) .sidebar-link.active {
  background: rgba(74, 125, 65, 0.12);
  border-color: rgba(74, 125, 65, 0.22);
  color: #ffffff;
  box-shadow: inset 3px 0 0 rgba(74, 125, 65, 0.65);
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

/* Premium Orange Button */
.premium-orange-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #FBB03A;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(251, 176, 58, 0.2), 
              0 2px 4px -1px rgba(251, 176, 58, 0.1);
}

.premium-orange-button:hover {
  background: #f99e0b;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(251, 176, 58, 0.3), 
              0 4px 6px -2px rgba(251, 176, 58, 0.1);
}

.premium-orange-button:active {
  transform: translateY(0);
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
