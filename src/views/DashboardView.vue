<template>
  <DashboardMobile v-if="isMobile" />
  <DashboardDesktop v-else />
</template>

<script setup>
import { inject } from 'vue'
import DashboardMobile from './DashboardMobileView.vue'
import DashboardDesktop from './DashboardDesktopView.vue'

const isMobile = inject('isMobile')
</script>
