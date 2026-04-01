<template>
  <MainLayout>
    <router-view :class="route.path === '/' || route.path === '/login' || route.path === '/dashboard' ? '' : 'min-h-screen pt-4 lg:pt-10'" />
  </MainLayout>
</template>

<script setup>
import { ref, provide, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import { useDevice } from './composables/useDevice'

const route = useRoute()
const { isMobile } = useDevice()
const activeSection = ref('')
provide('activeSection', activeSection)
provide('isMobile', isMobile)

const authStore = useAuthStore()
const themeStore = useThemeStore()

provide('isDark', computed(() => themeStore.isDark))
provide('user', computed(() => authStore.user))

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/') activeSection.value = ''
    else activeSection.value = newPath.replace('/', '')
  },
  { immediate: true }
)

onMounted(() => {
  authStore.initAuth()
  themeStore.initTheme()
})
</script>
