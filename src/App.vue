<template>
  <MainLayout>
    <router-view :class="route.path === '/' || route.path === '/login' || route.path === '/dashboard' ? '' : 'min-h-screen pt-4 lg:pt-10'" />
  </MainLayout>
</template>

<script setup>
import { ref, provide, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'
import { useAuth } from './composables/useAuth'

const route = useRoute()
const activeSection = ref('')
provide('activeSection', activeSection)

// Provide auth state to all child components
const { user, signOut, loading } = useAuth()
provide('user', user)
provide('signOut', signOut)
provide('authLoading', loading)

// Sync route with activeSection for sidebar highlighting
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/') activeSection.value = ''
    else activeSection.value = newPath.replace('/', '')
  },
  { immediate: true }
)

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
</script>
