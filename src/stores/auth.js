import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(true)

  const fetchProfile = async (userId) => {
    if (!userId || !supabase) {
      profile.value = null
      return
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      if (!error && data) {
        profile.value = data
      } else {
        profile.value = null
      }
    } catch (e) {
      console.error('Error fetching user profile:', e)
      profile.value = null
    }
  }

  const initAuth = () => {
    if (!supabase) {
      loading.value = false
      return
    }
    supabase.auth.getSession().then(async ({ data }) => {
      user.value = data.session?.user || null
      if (user.value) {
        await fetchProfile(user.value.id)
      }
      loading.value = false
    }).catch(err => {
      console.error('Error during initAuth getSession:', err)
      loading.value = false
    })

    supabase.auth.onAuthStateChange(async (_, session) => {
      user.value = session?.user || null
      if (user.value) {
        await fetchProfile(user.value.id)
      } else {
        profile.value = null
      }
    })
  }

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    user.value = null
    profile.value = null
  }

  return { user, profile, loading, initAuth, signOut }
})
