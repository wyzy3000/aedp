import { ref } from 'vue'
import { supabase } from '../supabase'

const user = ref(null)
const loading = ref(true)

if (supabase) {
    supabase.auth.getSession().then(({ data }) => {
        user.value = data.session?.user ?? null
        loading.value = false
    })

    supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
    })
} else {
    loading.value = false
}

export function useAuth() {
    const signOut = async () => {
        if (supabase) {
            await supabase.auth.signOut()
        }
        user.value = null
    }

    return { user, loading, signOut }
}
