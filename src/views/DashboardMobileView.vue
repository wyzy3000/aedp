<template>
  <div class="pb-10 text-white">
    <!-- Header -->
    <header class="pt-[5vh] px-[6vw] pb-[2vh]">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-1 h-6 rounded-full bg-[#FBB03A]" />
        <span class="text-[clamp(9px,2.2vw,10px)] font-bold uppercase tracking-widest text-white/50">{{ lang === 'en' ? 'My Dashboard' : 'Dashibodi Yangu' }}</span>
      </div>
      <h1 class="text-[clamp(26px,8vw,32px)] font-display font-extrabold text-white">{{ lang === 'en' ? 'Daily Diaries' : 'Shajara za Kila Siku' }}</h1>
      <p class="mt-1 text-[clamp(10px,2.5vw,12px)] text-[#FBB03A]/70 font-medium truncate">{{ user?.email }}</p>
    </header>

    <!-- Post Button -->
    <div class="px-[6vw] mb-8">
      <button @click="showForm = true" 
        class="w-full py-[3.8vw] rounded-2xl bg-[#FBB03A] text-white font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {{ lang === 'en' ? 'New Diary Entry' : 'Sajili Shajara Mpya' }}
      </button>
    </div>

    <!-- Recent Entries Section -->
    <div class="px-[6vw]">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-[clamp(16px,4.5vw,18px)] font-bold">{{ lang === 'en' ? 'My Submissions' : 'Maoni Yangu' }}</h2>
        <span class="text-[9px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white/40">
          {{ myEntries.length }} {{ lang === 'en' ? 'Total' : 'Jumla' }}
        </span>
      </div>

      <div v-if="loadingEntries" class="space-y-4">
        <div v-for="i in 3" :key="i" class="h-32 rounded-2xl bg-white/5 animate-pulse" />
      </div>

      <div v-else-if="!myEntries.length" class="py-12 flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-white/40 text-sm">{{ lang === 'en' ? 'No entries yet.' : 'Bado hakuna maingizo.' }}</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="entry in myEntries" :key="entry.id"
          class="p-[5vw] rounded-2xl bg-white/[0.03] border border-white/5 active:bg-white/[0.06] transition-colors"
          @click="openPreview(entry)">
          
          <div class="flex justify-between items-start mb-3">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-[#FBB03A]">📍 {{ entry.location }}</span>
              <span class="text-[10px] text-white/30">{{ formatDate(entry.date) }}</span>
            </div>
            <div class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/30 border border-white/5">
              <div class="w-1.5 h-1.5 rounded-full" :style="{ background: getSentimentColor(entry.sentiment) }" />
              <span class="text-[10px] font-bold" :style="{ color: getSentimentColor(entry.sentiment) }">{{ entry.sentiment }}/10</span>
            </div>
          </div>

          <p class="text-sm text-white/70 line-clamp-2 leading-relaxed mb-4">{{ entry.content }}</p>

          <div class="flex items-center gap-2">
            <button @click.stop="startEdit(entry)" class="flex-1 py-2 text-[11px] font-bold text-white/60 bg-white/5 rounded-lg border border-white/5">{{ lang === 'en' ? 'Edit' : 'Hariri' }}</button>
            <button @click.stop="confirmDelete(entry)" class="flex-1 py-2 text-[11px] font-bold text-red-400/60 bg-red-500/5 rounded-lg border border-red-500/10">{{ lang === 'en' ? 'Delete' : 'Futa' }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile-Specific Overlays (Forms & Previews) -->
    
    <!-- Entry Form Sheet (Slides up) -->
    <Transition name="sheet">
      <div v-if="showForm || editingEntry" class="fixed inset-0 z-[60] flex flex-col justify-end">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="cancelEditAndClose" />
        <div class="relative w-full bg-[#0a160c] rounded-t-[32px] border-t border-white/10 p-8 max-h-[90vh] overflow-y-auto">
          <div class="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" @click="cancelEditAndClose" />
          
          <h2 class="text-2xl font-bold mb-6">{{ editingEntry ? (lang === 'en' ? 'Edit Entry' : 'Hariri Shajara') : (lang === 'en' ? 'New Entry' : 'Shajara Mpya') }}</h2>
          
          <form @submit.prevent="editingEntry ? updateDiary() : submitDiary()" class="space-y-6">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">{{ lang === 'en' ? 'Location' : 'Eneo' }}</label>
              <input v-model="form.location" type="text" required :placeholder="lang === 'en' ? 'Where were you?' : 'Ulikuwa wapi?'"
                class="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#FBB03A]/30 outline-none" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">{{ lang === 'en' ? 'Date' : 'Tarehe' }}</label>
              <input v-model="form.date" type="date" required
                class="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">{{ lang === 'en' ? 'Observation' : 'Uchunguzi' }}</label>
              <textarea v-model="form.content" required rows="4" :placeholder="lang === 'en' ? 'What did you see?' : 'Umeona nini?'"
                class="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white resize-none outline-none" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">
                {{ lang === 'en' ? 'Sentiment' : 'Hisia' }} — <span :style="{ color: sentimentColor }">{{ sentimentLabel }}</span>
              </label>
              <input v-model.number="form.sentiment" type="range" min="1" max="10" step="1" class="mobile-slider w-full mb-2" />
              <div class="flex justify-between text-[9px] text-white/30 uppercase tracking-tighter">
                <span>{{ lang === 'en' ? 'Alarming' : 'Inatisha' }}</span><span>{{ lang === 'en' ? 'Uncertain' : 'Haikueleweka' }}</span><span>{{ lang === 'en' ? 'Hopeful' : 'Matumaini' }}</span>
              </div>
            </div>

            <div v-if="submitError" class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{{ submitError }}</div>

            <button type="submit" :disabled="submitting"
              class="w-full py-4 rounded-xl bg-[#FBB03A] text-white font-bold flex items-center justify-center gap-2">
              <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {{ submitting ? (lang === 'en' ? 'Saving...' : 'Inahifadhi...') : (editingEntry ? (lang === 'en' ? 'Update Entry' : 'Sasisha') : (lang === 'en' ? 'Post Entry' : 'Sajili')) }}
            </button>
            
            <button type="button" @click="cancelEditAndClose" class="w-full py-4 text-white/40 font-medium">{{ lang === 'en' ? 'Cancel' : 'Ghairi' }}</button>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="previewEntry" class="fixed inset-0 z-[60] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="previewEntry = null" />
        <div class="relative w-full max-w-sm bg-[#0a160c] rounded-3xl border border-white/10 p-8">
          <div class="mb-4">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#FBB03A]">{{ lang === 'en' ? 'Observation Detail' : 'Maelezo ya Uchunguzi' }}</span>
            <h3 class="text-xl font-bold mt-1">📍 {{ previewEntry.location }}</h3>
            <p class="text-white/40 text-xs">{{ formatDate(previewEntry.date) }}</p>
          </div>
          <p class="text-white/70 text-sm leading-relaxed mb-6">{{ previewEntry.content }}</p>
          <div class="flex gap-2">
             <button @click="previewEntry = null" class="flex-1 py-3 bg-white/5 rounded-xl text-xs font-bold border border-white/5">{{ lang === 'en' ? 'Close' : 'Funga' }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="deleteTarget" class="fixed inset-0 z-[60] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-black/80" @click="deleteTarget = null" />
        <div class="relative w-full max-w-sm bg-[#0a160c] rounded-3xl border border-red-500/20 p-8 text-center">
          <h3 class="text-xl font-bold mb-2 text-white">{{ lang === 'en' ? 'Delete Entry?' : 'Futa Shajara?' }}</h3>
          <p class="text-white/50 text-xs mb-6 px-4">{{ lang === 'en' ? 'This action cannot be undone. Permanent removal from records.' : 'Kitendo hiki hakiwezi kubadilishwa. Itaondolewa kabisa kwenye kumbukumbu.' }}</p>
          <div class="flex gap-3">
            <button @click="deleteTarget = null" class="flex-1 py-3 bg-white/5 rounded-xl text-xs font-bold">{{ lang === 'en' ? 'Cancel' : 'Ghairi' }}</button>
            <button @click="deleteEntry" class="flex-1 py-3 bg-red-600 rounded-xl text-xs font-bold">{{ lang === 'en' ? 'Delete' : 'Futa' }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { supabase } from '../supabase'
import { sanitizeText } from '../utils/sanitize'

const lang = inject('lang')
const user = inject('user')
const today = new Date().toISOString().split('T')[0]

const form = ref({ location: '', date: today, content: '', sentiment: 5 })
const showForm = ref(false)
const submitting = ref(false)
const submitError = ref('')
const editingEntry = ref(null)
const myEntries = ref([])
const loadingEntries = ref(true)
const previewEntry = ref(null)
const deleteTarget = ref(null)

const sentimentColor = computed(() => {
  const v = form.value.sentiment
  if (v <= 3) return '#ef4444'
  if (v <= 5) return '#f97316'
  if (v <= 7) return '#eab308'
  return '#22c55e'
})

const sentimentLabel = computed(() => {
  const v = form.value.sentiment
  if (v <= 2) return lang.value === 'en' ? 'Alarming' : 'Inatisha'
  if (v <= 4) return lang.value === 'en' ? 'Concerned' : 'Wasiwasi'
  if (v <= 6) return lang.value === 'en' ? 'Uncertain' : 'Haikueleweka'
  if (v <= 8) return lang.value === 'en' ? 'Optimistic' : 'Matumaini'
  return lang.value === 'en' ? 'Hopeful' : 'Matumaini Makuu'
})

const formatDate = (d) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
const getSentimentColor = (val) => val <= 3 ? '#ef4444' : val <= 5 ? '#f97316' : val <= 7 ? '#eab308' : '#22c55e'

const fetchMyEntries = async () => {
  if (!supabase || !user.value) return
  loadingEntries.value = true
  const { data, error } = await supabase.from('diaries').select('*').eq('user_id', user.value.id).order('created_at', { ascending: false })
  if (!error) myEntries.value = data || []
  loadingEntries.value = false
}

const submitDiary = async () => {
  const safeLocation = sanitizeText(form.value.location, 100)
  const safeContent = sanitizeText(form.value.content, 2000)
  if (!safeLocation || safeContent.length < 10) { submitError.value = 'Fill all fields correctly.'; return }
  submitting.value = true
  const { error } = await supabase.from('diaries').insert({ user_id: user.value.id, location: safeLocation, date: form.value.date, content: safeContent, sentiment: form.value.sentiment })
  submitting.value = false
  if (!error) { showForm.value = false; form.value = { location: '', date: today, content: '', sentiment: 5 }; fetchMyEntries() }
}

const startEdit = (e) => { editingEntry.value = e; form.value = { ...e } }
const updateDiary = async () => {
  submitting.value = true
  const { error } = await supabase.from('diaries').update({ location: form.value.location, date: form.value.date, content: form.value.content, sentiment: form.value.sentiment }).eq('id', editingEntry.value.id)
  submitting.value = false
  if (!error) { editingEntry.value = null; fetchMyEntries() }
}

const cancelEditAndClose = () => { editingEntry.value = null; showForm.value = false; form.value = { location: '', date: today, content: '', sentiment: 5 } }
const openPreview = (e) => previewEntry.value = e
const confirmDelete = (e) => deleteTarget.value = e
const deleteEntry = async () => {
  const { error } = await supabase.from('diaries').delete().eq('id', deleteTarget.value.id)
  if (!error) { deleteTarget.value = null; fetchMyEntries() }
}

onMounted(() => {
  if (user?.value) fetchMyEntries()
})
</script>

<style scoped>
.font-display { font-family: 'Outfit', sans-serif; }
.mobile-slider { -webkit-appearance: none; background: #ffffff10; height: 6px; border-radius: 10px; outline: none; }
.mobile-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #FBB03A; border: 4px solid #0a160c; }

.sheet-enter-active, .sheet-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.sheet-enter-from, .sheet-leave-to { transform: translateY(100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
