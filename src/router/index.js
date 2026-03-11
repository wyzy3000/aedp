import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { supabase } from '../supabase'

const routes = [
    { path: '/', component: HomeView },
    { path: '/pasture', component: () => import('../components/PastureLevel.vue') },
    { path: '/habitat', component: () => import('../components/HabitatChanges.vue') },
    { path: '/diaries', component: () => import('../components/CommunityDiaries.vue') },
    { path: '/weather', component: () => import('../components/WeatherForecast.vue') },
    { path: '/outlook', component: () => import('../components/OutlookReports.vue') },
    { path: '/drought', component: () => import('../components/DroughtStory.vue') },
    { path: '/onehealth', component: () => import('../components/OneHealth.vue') },
    { path: '/login', component: () => import('../views/AuthView.vue'), props: { mode: 'login' } },
    { path: '/dashboard', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/dashboard/one-health', component: () => import('../views/DashboardOneHealth.vue'), meta: { requiresAuth: true } },
    { path: '/dashboard/settings', component: () => import('../views/SettingsView.vue'), meta: { requiresAuth: true } },
    { path: '/about', component: () => import('../views/AboutView.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to) => {
    if (to.meta.requiresAuth) {
        if (!supabase) return { path: '/login' }
        const { data } = await supabase.auth.getSession()
        if (!data.session) return { path: '/login' }
    }
})

export default router
