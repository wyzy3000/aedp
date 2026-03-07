import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PastureLevel from '../components/PastureLevel.vue'
import HabitatChanges from '../components/HabitatChanges.vue'
import CommunityDiaries from '../components/CommunityDiaries.vue'
import WeatherForecast from '../components/WeatherForecast.vue'
import OutlookReports from '../components/OutlookReports.vue'
import DroughtStory from '../components/DroughtStory.vue'
import OneHealth from '../components/OneHealth.vue'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import DashboardOneHealth from '../views/DashboardOneHealth.vue'
import SettingsView from '../views/SettingsView.vue'
import { supabase } from '../supabase'

const routes = [
    { path: '/', component: HomeView },
    { path: '/pasture', component: PastureLevel },
    { path: '/habitat', component: HabitatChanges },
    { path: '/diaries', component: CommunityDiaries },
    { path: '/weather', component: WeatherForecast },
    { path: '/outlook', component: OutlookReports },
    { path: '/drought', component: DroughtStory },
    { path: '/onehealth', component: OneHealth },
    { path: '/login', component: AuthView, props: { mode: 'login' } },
    { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/dashboard/one-health', component: DashboardOneHealth, meta: { requiresAuth: true } },
    { path: '/dashboard/settings', component: SettingsView, meta: { requiresAuth: true } }
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
