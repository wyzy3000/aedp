<template>
  <section class="relative min-h-screen overflow-hidden">
    <div class="absolute inset-0 pointer-events-none"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 50% 30%, rgba(251,176,58,0.06) 0%, transparent 60%)" />

    <div class="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-12 py-12">

      <!-- Header -->
      <div class="mb-10 fade-up">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full bg-[#FBB03A]" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Community Portal</span>
        </div>
        <h1 class="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight">My Dashboard</h1>
        <p class="mt-2 text-[#FBB03A]/70 font-medium text-base">{{ user?.email }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- ─ LEFT: Post / Edit Form ──────────────────────── -->
        <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7 fade-up">
          <div class="flex items-center gap-2.5 mb-6">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(251,176,58,0.15);">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#FBB03A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 class="text-white font-display font-bold text-xl">
              {{ editingEntry ? 'Edit Diary Entry' : 'Post New Diary Entry' }}
            </h2>
            <button v-if="editingEntry" @click="cancelEdit"
                    class="ml-auto text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
              ✕ Cancel
            </button>
          </div>

          <form @submit.prevent="editingEntry ? updateDiary() : submitDiary()" class="space-y-5">
            <!-- Location -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">📍 Location</label>
              <input v-model="form.location" type="text" required
                     placeholder="e.g. Olgulului, Kimana, Rombo..."
                     class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-[#FBB03A]/50 focus:border-[#FBB03A] outline-none transition-all" />
            </div>

            <!-- Date -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">📅 Date of Observation</label>
              <input v-model="form.date" type="date" required
                     class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#FBB03A]/50 focus:border-[#FBB03A] outline-none transition-all" />
            </div>

            <!-- Content -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">📝 Field Observation</label>
              <textarea v-model="form.content" required rows="4"
                        placeholder="Describe what you observed — water sources, pasture condition, wildlife, livestock health..."
                        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 resize-none focus:ring-2 focus:ring-[#FBB03A]/50 focus:border-[#FBB03A] outline-none transition-all" />
              <p class="text-right text-[10px] text-white/25 mt-1">{{ form.content.length }} / 2000</p>
            </div>

            <!-- Sentiment Slider -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                🌡 Sentiment — <span :style="{ color: sentimentColor }">{{ sentimentLabel }}</span> ({{ form.sentiment }}/10)
              </label>
              <div class="relative mb-3">
                <div class="w-full h-3 rounded-full mb-1" style="background: linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16, #22c55e)" />
                <input v-model.number="form.sentiment" type="range" min="1" max="10" step="1" class="sentiment-slider w-full" />
              </div>
              <div class="flex justify-between text-[10px] text-white/40 px-0.5">
                <span>1 – Alarming</span><span>5 – Uncertain</span><span>10 – Hopeful</span>
              </div>
              <div class="mt-3 px-3 py-2 rounded-lg border text-xs transition-all duration-300"
                   :style="{ borderColor: sentimentColor + '40', background: sentimentColor + '12', color: sentimentColor }">
                {{ sentimentDescription }}
              </div>
            </div>

            <!-- Error / Success -->
            <div v-if="submitError" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{{ submitError }}</div>
            <div v-if="submitSuccess" class="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              {{ editingEntry ? 'Entry updated!' : 'Entry posted successfully!' }}
            </div>

            <button type="submit" :disabled="submitting"
                    class="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-300 bg-[#FBB03A] hover:bg-[#e09e34] shadow-lg shadow-[#FBB03A]/20 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2">
              <span v-if="submitting" class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              {{ submitting ? (editingEntry ? 'Updating...' : 'Posting...') : (editingEntry ? 'Save Changes' : 'Submit Diary Entry') }}
            </button>
          </form>
        </div>

        <!-- ─ RIGHT: My Submissions ───────────────────────── -->
        <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7 fade-up">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(59,130,246,0.15);">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 class="text-white font-display font-bold text-xl">My Submissions</h2>
            </div>
            <span class="text-xs text-white/40 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">{{ myEntries.length }} entries</span>
          </div>

          <!-- Loading -->
          <div v-if="loadingEntries" class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-20 rounded-xl bg-white/5 animate-pulse" />
          </div>

          <!-- Empty -->
          <div v-else-if="!myEntries.length" class="flex flex-col items-center justify-center py-16 text-center">
            <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <svg class="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-white/40 text-sm">No entries yet.</p>
            <p class="text-white/25 text-xs mt-1">Submit your first diary entry on the left!</p>
          </div>

          <!-- Entries list -->
          <div v-else class="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            <div v-for="entry in myEntries" :key="entry.id"
                 class="rounded-xl border border-white/8 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors group">

              <!-- Top row: location, date, sentiment -->
              <div class="flex items-start justify-between gap-3 mb-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-medium text-white/60 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    📍 {{ entry.location }}
                  </span>
                  <span class="text-xs text-white/40">
                    {{ new Date(entry.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5 flex-shrink-0">
                  <div class="w-2 h-2 rounded-full" :style="{ background: getSentimentColor(entry.sentiment) }" />
                  <span class="text-[10px] font-semibold" :style="{ color: getSentimentColor(entry.sentiment) }">{{ entry.sentiment }}/10</span>
                </div>
              </div>

              <!-- Content preview -->
              <p class="text-sm text-white/70 leading-relaxed line-clamp-2 mb-3">{{ entry.content }}</p>

              <!-- Sentiment bar -->
              <div class="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                <div class="h-full rounded-full transition-all duration-500"
                     :style="{ width: (entry.sentiment * 10) + '%', background: getSentimentColor(entry.sentiment) }" />
              </div>

              <!-- Action buttons: Preview | Edit | Delete -->
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button @click="openPreview(entry)"
                        class="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  Preview
                </button>
                <button @click="startEdit(entry)"
                        class="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#FBB03A]/70 hover:text-[#FBB03A] hover:bg-[#FBB03A]/10 transition-all border border-white/5">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  Edit
                </button>
                <button @click="confirmDelete(entry)"
                        class="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Preview Modal ──────────────────────────────────── -->
    <Transition name="modal">
      <div v-if="previewEntry" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="previewEntry = null">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="previewEntry = null" />
        <div class="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a160c] p-7 shadow-2xl">
          <button @click="previewEntry = null" class="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div class="mb-4">
            <span class="text-xs font-semibold uppercase tracking-[0.15em] text-[#FBB03A]/70">Diary Entry Preview</span>
          </div>
          <div class="flex items-center gap-3 flex-wrap mb-4">
            <span class="text-sm font-medium text-white/80 bg-white/5 px-3 py-1 rounded-full border border-white/10">📍 {{ previewEntry.location }}</span>
            <span class="text-sm text-white/50">{{ new Date(previewEntry.date).toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' }) }}</span>
          </div>
          <p class="text-white/80 text-sm leading-relaxed mb-5 whitespace-pre-wrap">{{ previewEntry.content }}</p>
          <div class="border-t border-white/5 pt-4 flex items-center gap-3">
            <span class="text-xs text-white/40 uppercase tracking-wider">Sentiment</span>
            <div class="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full rounded-full" :style="{ width: (previewEntry.sentiment * 10) + '%', background: getSentimentColor(previewEntry.sentiment) }" />
            </div>
            <span class="text-xs font-bold" :style="{ color: getSentimentColor(previewEntry.sentiment) }">{{ previewEntry.sentiment }}/10</span>
          </div>
          <div class="flex gap-3 mt-5">
            <button @click="startEdit(previewEntry); previewEntry = null"
                    class="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#FBB03A] border border-[#FBB03A]/30 hover:bg-[#FBB03A]/10 transition-all">
              Edit Entry
            </button>
            <button @click="previewEntry = null"
                    class="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ─── Delete Confirm Modal ───────────────────────────── -->
    <Transition name="modal">
      <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="deleteTarget = null" />
        <div class="relative z-10 w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0a160c] p-7 shadow-2xl text-center">
          <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </div>
          <h3 class="text-white font-bold text-lg mb-2">Delete Entry?</h3>
          <p class="text-white/50 text-sm mb-6">This will permanently remove your diary entry from <strong class="text-white/70">{{ deleteTarget?.location }}</strong>. This cannot be undone.</p>
          <div class="flex gap-3">
            <button @click="deleteTarget = null" class="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 transition-all">Cancel</button>
            <button @click="deleteEntry" :disabled="deleting"
                    class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              <span v-if="deleting" class="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, inject, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabase'
import { sanitizeText } from '../utils/sanitize'

const user   = inject('user')
const isDark = inject('isDark')
const today  = new Date().toISOString().split('T')[0]

// ─── Form state ──────────────────────────────────────────────
const form = ref({ location: '', date: today, content: '', sentiment: 5 })
const submitting   = ref(false)
const submitError  = ref('')
const submitSuccess = ref(false)
const editingEntry = ref(null)   // holds entry being edited

// ─── Entries state ───────────────────────────────────────────
const myEntries     = ref([])
const loadingEntries = ref(true)
const previewEntry  = ref(null)
const deleteTarget  = ref(null)
const deleting      = ref(false)

// ─── Sentiment helpers ───────────────────────────────────────
const sentimentColor = computed(() => getSentimentColor(form.value.sentiment))

function getSentimentColor(val) {
  if (val <= 3) return '#ef4444'
  if (val <= 5) return '#f97316'
  if (val <= 7) return '#eab308'
  return '#22c55e'
}

const sentimentLabel = computed(() => {
  const v = form.value.sentiment
  if (v <= 2) return 'Alarming'
  if (v <= 4) return 'Concerned'
  if (v <= 6) return 'Uncertain'
  if (v <= 8) return 'Optimistic'
  return 'Hopeful'
})

const sentimentDescription = computed(() => {
  const v = form.value.sentiment
  if (v <= 2) return 'Situation is alarming — urgent action or intervention may be needed.'
  if (v <= 4) return 'Conditions are concerning and showing signs of stress.'
  if (v <= 6) return 'Mixed signals — some improvement but uncertainty remains.'
  if (v <= 8) return 'Things are looking more positive and trending in the right direction.'
  return 'Conditions are hopeful — strong recovery or healthy ecosystem state.'
})

let subscription = null

// ─── Fetch my entries ────────────────────────────────────────
const fetchMyEntries = async () => {
  if (!supabase || !user.value) return
  loadingEntries.value = true
  const { data, error } = await supabase
    .from('diaries')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })
  if (!error) myEntries.value = data || []
  loadingEntries.value = false
}

const setupRealtime = () => {
  if (!supabase || !user.value) return
  
  subscription = supabase
    .channel('dashboard_diaries_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'diaries',
      filter: `user_id=eq.${user.value.id}` 
    }, (payload) => {
      // Handle events in-place without triggering a loading state
      if (payload.eventType === 'INSERT') {
        myEntries.value.unshift(payload.new)
      } else if (payload.eventType === 'UPDATE') {
        const idx = myEntries.value.findIndex(e => e.id === payload.new.id)
        if (idx !== -1) myEntries.value[idx] = payload.new
      } else if (payload.eventType === 'DELETE') {
        myEntries.value = myEntries.value.filter(e => e.id !== payload.old.id)
      }
    })
    .subscribe()
}

onMounted(() => {
  fetchMyEntries()
  setupRealtime()
})

onUnmounted(() => {
  if (subscription) {
    supabase.removeChannel(subscription)
  }
})

// ─── Submit new entry ────────────────────────────────────────
const submitDiary = async () => {
  if (!supabase || !user.value) { submitError.value = 'You must be logged in to post.'; return }
  const safeLocation = sanitizeText(form.value.location, 100)
  const safeContent  = sanitizeText(form.value.content, 2000)
  if (!safeLocation || safeLocation.length < 2) { submitError.value = 'Please enter a valid location (min. 2 chars).'; return }
  if (!safeContent || safeContent.length < 10)  { submitError.value = 'Observation must be at least 10 characters.'; return }

  submitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  const { error } = await supabase.from('diaries').insert({
    user_id:   user.value.id,
    location:  safeLocation,
    date:      form.value.date,
    content:   safeContent,
    sentiment: form.value.sentiment,
  })
  submitting.value = false
  if (error) {
    submitError.value = 'Failed to save your entry. Please try again.'
    console.error('Diary insert error:', error.message)
  } else {
    submitSuccess.value = true
    form.value = { location: '', date: today, content: '', sentiment: 5 }
    await fetchMyEntries()
    setTimeout(() => { submitSuccess.value = false }, 4000)
  }
}

// ─── Edit entry ──────────────────────────────────────────────
const startEdit = (entry) => {
  editingEntry.value = entry
  form.value = {
    location:  entry.location,
    date:      entry.date,
    content:   entry.content,
    sentiment: entry.sentiment,
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  editingEntry.value = null
  form.value = { location: '', date: today, content: '', sentiment: 5 }
  submitError.value = ''
  submitSuccess.value = false
}

const updateDiary = async () => {
  if (!supabase || !user.value || !editingEntry.value) return
  const safeLocation = sanitizeText(form.value.location, 100)
  const safeContent  = sanitizeText(form.value.content, 2000)
  if (!safeLocation || safeLocation.length < 2) { submitError.value = 'Please enter a valid location.'; return }
  if (!safeContent || safeContent.length < 10)  { submitError.value = 'Observation must be at least 10 characters.'; return }

  submitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  const { error } = await supabase.from('diaries').update({
    location:  safeLocation,
    date:      form.value.date,
    content:   safeContent,
    sentiment: form.value.sentiment,
  }).eq('id', editingEntry.value.id).eq('user_id', user.value.id)

  submitting.value = false
  if (error) {
    submitError.value = 'Failed to update. Please try again.'
  } else {
    submitSuccess.value = true
    editingEntry.value = null
    form.value = { location: '', date: today, content: '', sentiment: 5 }
    await fetchMyEntries()
    setTimeout(() => { submitSuccess.value = false }, 4000)
  }
}

// ─── Preview ─────────────────────────────────────────────────
const openPreview = (entry) => { previewEntry.value = entry }

// ─── Delete ──────────────────────────────────────────────────
const confirmDelete = (entry) => { deleteTarget.value = entry }

const deleteEntry = async () => {
  if (!supabase || !deleteTarget.value) return
  deleting.value = true
  const { error } = await supabase.from('diaries')
    .delete()
    .eq('id', deleteTarget.value.id)
    .eq('user_id', user.value.id)
  deleting.value = false
  if (!error) {
    deleteTarget.value = null
    await fetchMyEntries()
  }
}
</script>

<style scoped>
.fade-up { animation: fadeUp 0.5s ease-out both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

.sentiment-slider {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 3px; background: transparent;
  outline: none; margin-top: -16px; position: relative; cursor: pointer;
}
.sentiment-slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 22px; height: 22px; border-radius: 50%;
  background: white; border: 3px solid #FBB03A; cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4); transition: transform 0.15s ease;
}
.sentiment-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }

.max-h-\[520px\]::-webkit-scrollbar { width: 4px; }
.max-h-\[520px\]::-webkit-scrollbar-track { background: transparent; }
.max-h-\[520px\]::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
