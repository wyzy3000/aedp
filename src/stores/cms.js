import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useCmsStore = defineStore('cms', () => {
  const pageContents = ref({})
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  const fetchCmsData = async (force = false) => {
    if (initialized.value && !force) return
    if (!supabase) return
    
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('portal_content')
        .select('*')
      if (err) throw err
      
      const contents = {}
      if (data) {
        data.forEach(row => {
          contents[row.id] = row.content
        })
      }
      pageContents.value = contents
      initialized.value = true
    } catch (err) {
      console.error('Failed to fetch CMS data:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const saveCmsData = async (pageKey, newContent) => {
    if (!supabase) return false
    loading.value = true
    error.value = null
    try {
      // Get current user ID
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || null

      const { error: err } = await supabase
        .from('portal_content')
        .upsert({
          id: pageKey,
          content: newContent,
          updated_at: new Date().toISOString(),
          updated_by: userId
        })
      if (err) throw err
      
      // Update local state
      pageContents.value[pageKey] = JSON.parse(JSON.stringify(newContent))
      return true
    } catch (err) {
      console.error(`Failed to save CMS data for ${pageKey}:`, err)
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  const getContent = (pageKey, defaultVal) => {
    const val = pageContents.value[pageKey]
    if (val === undefined || val === null) {
      return defaultVal
    }
    // Perform deep-merge or return val with default fallbacks for nested structures
    return val
  }

  return { pageContents, loading, error, initialized, fetchCmsData, saveCmsData, getContent }
})
