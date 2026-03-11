import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  const initAuth = () => {
    supabase.auth.getSession().then(({ data }) => {
      user.value = data.session?.user || null
      loading.value = false
    })

    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user || null
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, loading, initAuth, signOut }
})
