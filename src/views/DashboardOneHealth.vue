<template>
  <section class="relative min-h-screen overflow-hidden py-20">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <!-- HERO-STYLE HEADER -->
      <div class="mb-16 fade-up" :class="{ 'visible': isMounted }">
        <div class="flex flex-wrap items-start justify-between gap-6">
          <div class="max-w-3xl">
            <h2 class="font-display font-extrabold text-4xl md:text-5xl leading-tight transition-colors mb-4"
                :class="isDark ? 'text-white' : 'text-[#1a2a12]'">
              One Health Map
            </h2>
            <p class="text-[15px] font-medium leading-relaxed transition-colors"
               :class="isDark ? 'text-white/60' : 'text-[#4a4230]'">
              Manage environmental monitoring points and ecosystem health records. This dashboard allows you to track livestock and human health trends, wildlife movements, and water quality across the ecosystem.
            </p>
          </div>
          <div v-if="submitSuccess" class="p-3 px-5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center gap-2 shadow-none animate-bounce">
             <span class="material-symbols-outlined text-[18px]">check_circle</span>
             {{ isEditing ? 'Entry updated successfully' : 'New entry saved successfully' }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- LEFT COLUMN: MAP & FORM -->
        <div class="lg:col-span-8 space-y-6">
          <!-- MAP SECTION -->
          <div class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-0.5 shadow-lg relative overflow-hidden">
             <div id="dashboard-map" class="w-full h-[400px] rounded-lg z-0"></div>
          </div>
          
          <!-- COMPACT COORDINATE INPUTS -->
          <div class="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <div>
              <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Latitude</label>
              <input v-model.number="lat" type="number" step="0.00001" placeholder="0.00000"
                     @input="handleManualCoordChange"
                     class="w-full px-4 py-2 bg-[#1C1F22] rounded-lg text-white border border-white/5 focus:border-white/20 outline-none transition-all text-xs" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Longitude</label>
              <input v-model.number="lng" type="number" step="0.00001" placeholder="0.00000"
                     @input="handleManualCoordChange"
                     class="w-full px-4 py-2 bg-[#1C1F22] rounded-lg text-white border border-white/5 focus:border-white/20 outline-none transition-all text-xs" />
            </div>
          </div>

          <!-- REFINED OBSERVATION FORM -->
          <div class="bg-[#1C1F22] rounded-2xl border border-white/10 p-8 relative overflow-hidden">
            <div v-if="submitting" class="absolute inset-0 bg-[#1C1F22]/80 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center">
              <div class="w-8 h-8 border-3 border-gray-500/30 border-t-gray-500 rounded-full animate-spin mb-3" />
              <p class="text-white text-xs font-medium">Processing...</p>
            </div>

            <div class="mb-6 flex items-center justify-between">
              <h3 class="text-white font-bold text-lg">
                {{ isEditing ? 'Edit Observation' : 'New Observation' }}
              </h3>
              <button v-if="isEditing" @click="resetForm" class="text-[10px] text-[#Fbb03a] hover:underline uppercase font-bold tracking-wider">Create new entry instead</button>
            </div>

            <form @submit.prevent="submitForm" class="space-y-8">
              <!-- SECTION 1: BASIC INFORMATION -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-5">
                  <div>
                    <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Area Name</label>
                    <input v-model="form.location_name" type="text" placeholder="e.g. Olgulului Area" required
                           class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-white/30 outline-none transition-all text-sm" />
                  </div>
                  
                  <div>
                    <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Point Label / Number</label>
                    <input v-model="form.point_label" type="text" placeholder="e.g. PT-01" required
                           class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-white/30 outline-none transition-all text-sm" />
                  </div>
                </div>

                <div class="space-y-5">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Wildlife Trends</label>
                      <select v-model="form.wildlife_trends" required
                              class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all text-sm appearance-none cursor-pointer">
                        <option value="" disabled>Select trend...</option>
                        <option value="Increased">Increased</option>
                        <option value="Decreased">Decreased</option>
                        <option value="No Change">No Change</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Water Quality</label>
                      <select v-model="form.water_quality" required
                              class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all text-sm appearance-none cursor-pointer">
                        <option value="" disabled>Select quality...</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                     <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Drought readiness</label>
                     <select v-model="form.drought_preparedness" required
                            class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-white/30 outline-none transition-all text-sm appearance-none cursor-pointer">
                      <option value="" disabled>Select readiness...</option>
                      <option value="Fully prepared">Fully prepared</option>
                      <option value="Somehow prepared">Somehow prepared</option>
                      <option value="Not prepared at all">Not prepared at all</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- SECTION 2: DETAILED OBSERVATIONS (LARGE TEXTAREAS) -->
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Economic activity</label>
                    <textarea v-model="form.economic_activity" rows="4" required placeholder="Describe main economic activities (e.g. Livestock farming, charcoal burning)..."
                              class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-white/30 outline-none transition-all text-sm resize-none" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Major stressors</label>
                    <textarea v-model="form.major_stressors" rows="4" required placeholder="Describe major ecosystem stressors (e.g. habitat fragmentation, resource competition, weather extremes)..."
                              class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-white/30 outline-none transition-all text-sm resize-none" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Livestock Health</label>
                    <textarea v-model="form.livestock_diseases" rows="4" placeholder="e.g. FMD outbreaks, skin infections, recent vaccinations, cattle conditions..." required
                           class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-white/30 outline-none transition-all text-sm resize-none" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase text-white/50 mb-1.5 tracking-wider">Human Health</label>
                    <textarea v-model="form.human_diseases" rows="4" placeholder="e.g. Malaria cases, respiratory issues, health outreach, waterborne diseases..." required
                           class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-white/30 outline-none transition-all text-sm resize-none" />
                  </div>
                </div>
              </div>

              <div v-if="submitError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                {{ submitError }}
              </div>

              <div class="pt-6">
                <button type="submit"
                        class="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center gap-2 text-sm shadow-none outline-none">
                  {{ isEditing ? 'Update Entry' : 'Submit' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- RIGHT COLUMN: HISTORY -->
        <div class="lg:col-span-4 flex flex-col h-[850px]">
          <div class="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 flex flex-col h-full min-h-0">
            <div class="mb-8 flex items-center justify-between flex-shrink-0">
              <h3 class="text-white font-bold text-base uppercase tracking-wider">History</h3>
              <div class="flex items-center gap-2">
                <select v-model="sortOrder" 
                        class="bg-black/40 border border-white/10 rounded-lg text-[10px] text-white/70 px-3 py-1.5 outline-none cursor-pointer hover:border-[#Fbb03a]/50 transition-all uppercase font-bold tracking-tighter">
                  <option value="desc">Points (Desc)</option>
                  <option value="asc">Points (Asc)</option>
                </select>
              </div>
            </div>
            
            <div v-if="loadingEntries" class="py-10 flex justify-center flex-1 items-center">
              <div class="w-6 h-6 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
            </div>
            
            <div v-else-if="myEntries.length === 0" class="py-8 text-center text-white/30 text-xs italic flex-1 flex items-center justify-center">
              No previous entries found.
            </div>

            <div v-else class="flex-1 overflow-y-auto min-h-0 custom-scroll pr-2 relative">
              <div class="space-y-3 absolute inset-0 right-2">
                <div v-for="entry in myEntries" :key="entry.id" 
                     class="group flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5 hover:border-white/20 transition-all duration-300">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-white font-semibold text-sm truncate uppercase tracking-tight">{{ entry.location_name }}</span>
                    </div>
                    <div class="text-[11px] text-white/40 font-medium">
                      {{ entry.latitude.toFixed(5) }}, {{ entry.longitude.toFixed(5) }}
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 ml-4">
                    <button @click="editExistingEntry(entry)" 
                            class="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-all"
                            title="Edit Entry">
                      <span class="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button @click="deleteEntry(entry.id)" 
                            class="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-all"
                            title="Delete Entry">
                      <span class="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, inject, onUnmounted, computed } from 'vue'
import { supabase } from '../supabase'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const user = inject('user')
const isDark = inject('isDark')
const isMounted = ref(false)

let map = null
let formMarker = null
let mapMarkers = []
let selectedMarkerInstance = null
const lat = ref(null)
const lng = ref(null)

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  shadowUrl: '', shadowSize: [0, 0]
})

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  shadowUrl: '', shadowSize: [0, 0]
})

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  shadowUrl: '', shadowSize: [0, 0]
})

const initialFormState = {
  location_name: '',
  point_label: '',
  economic_activity: '',
  livestock_diseases: '',
  human_diseases: '',
  wildlife_trends: '',
  water_quality: '',
  drought_preparedness: '',
  major_stressors: '',
  extreme_climate_response: 'N/A' // Defaulted for simplicity in compact UI
}
const form = ref({ ...initialFormState })

const submitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')
const isEditing = ref(false)
const editId = ref(null)

const allEntries = ref([])
const sortOrder = ref('desc')

const myEntries = computed(() => {
  if (!user.value) return []
  const mine = allEntries.value.filter(e => e.user_id === user.value.id)
  return mine.sort((a, b) => {
    // Extract only digits for true numeric comparison
    const valA = parseInt((a.point_label || '').toString().replace(/\D/g, '')) || 0
    const valB = parseInt((b.point_label || '').toString().replace(/\D/g, '')) || 0
    
    return sortOrder.value === 'asc' ? valA - valB : valB - valA
  })
})
const loadingEntries = ref(true)

onMounted(async () => {
  setTimeout(() => { isMounted.value = true }, 100)
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  map = L.map('dashboard-map').setView([-2.6526, 37.2606], 9)
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 18,
  }).addTo(map)

  map.on('click', (e) => {
    lat.value = Number(e.latlng.lat.toFixed(5))
    lng.value = Number(e.latlng.lng.toFixed(5))
    updateMarker(e.latlng)
    // If we were editing, stay in edit but marker moves
  })

  await fetchAllEntries()
  
  const style = document.createElement('style')
  style.textContent = `
    .custom-scroll::-webkit-scrollbar { width: 3px; }
    .custom-scroll::-webkit-scrollbar-track { background: transparent; }
    .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,176,58,0.2); border-radius: 10px; }
  `
  document.head.appendChild(style)
})

onUnmounted(() => {
  if (map) { map.remove() }
})

const handleManualCoordChange = () => {
  if (lat.value && lng.value) {
    const latlng = [lat.value, lng.value]
    updateMarker(latlng)
    map.panTo(latlng)
  }
}

const updateMarker = (latlng) => {
  if (formMarker) {
    formMarker.setLatLng(latlng)
  } else {
    formMarker = L.marker(latlng, { icon: greenIcon }).addTo(map)
  }
}

const fetchAllEntries = async () => {
  loadingEntries.value = true
  const { data, error } = await supabase
    .from('one_health_data')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (!error && data) {
    allEntries.value = data
    renderMapMarkers()
  }
  loadingEntries.value = false
}

const renderMapMarkers = () => {
  mapMarkers.forEach(m => map.removeLayer(m))
  mapMarkers = []
  
  allEntries.value.forEach(entry => {
    const isMine = user.value && entry.user_id === user.value.id
    const m = L.marker([entry.latitude, entry.longitude], { 
      icon: isMine ? greenIcon : blueIcon 
    }).addTo(map)

    m.on('click', () => {
      if (isMine) {
        selectMine(entry, m)
      } else {
        selectOther(entry, m)
      }
    })
    
    mapMarkers.push(m)
  })
}

const selectMine = (entry, markerInstance) => {
  if (selectedMarkerInstance) {
     selectedMarkerInstance.setIcon(selectedMarkerInstance.isMine ? greenIcon : blueIcon)
  }
  
  markerInstance.setIcon(redIcon)
  markerInstance.isMine = true
  selectedMarkerInstance = markerInstance
  
  isEditing.value = true
  editId.value = entry.id
  lat.value = entry.latitude
  lng.value = entry.longitude
  
  form.value = { ...entry }
  if (formMarker) { map.removeLayer(formMarker); formMarker = null }
}

const editExistingEntry = (entry) => {
  // Find marker to highlight
  const m = mapMarkers.find(mark => mark.getLatLng().lat === entry.latitude && mark.getLatLng().lng === entry.longitude)
  if (m) {
    selectMine(entry, m)
    map.setView([entry.latitude, entry.longitude], 12)
  } else {
    // If not found (unlikely), just set form
    isEditing.value = true
    editId.value = entry.id
    lat.value = entry.latitude
    lng.value = entry.longitude
    form.value = { ...entry }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const selectOther = (entry, markerInstance) => {
  // Read-only essentially in this compact UI
  if (selectedMarkerInstance) {
     selectedMarkerInstance.setIcon(selectedMarkerInstance.isMine ? greenIcon : blueIcon)
  }
  markerInstance.setIcon(redIcon)
  markerInstance.isMine = false
  selectedMarkerInstance = markerInstance
  
  // Just show info? In this UI we focus on owner actions.
}

const resetForm = () => {
  isEditing.value = false
  editId.value = null
  form.value = { ...initialFormState }
  lat.value = null
  lng.value = null
  submitError.value = ''
  if (selectedMarkerInstance) {
    selectedMarkerInstance.setIcon(selectedMarkerInstance.isMine ? greenIcon : blueIcon)
    selectedMarkerInstance = null
  }
  if (formMarker) { map.removeLayer(formMarker); formMarker = null }
}

const submitForm = async () => {
  if (!user.value) { submitError.value = 'Must be logged in to save.'; return }
  if (lat.value === null || lng.value === null) {
    submitError.value = 'Please select a location on map.'; return
  }

  submitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  const dataPayload = {
    user_id: user.value.id,
    latitude: lat.value,
    longitude: lng.value,
    ...form.value
  }

  let error;
  if (isEditing.value && editId.value) {
    const res = await supabase.from('one_health_data').update(dataPayload).eq('id', editId.value)
    error = res.error
  } else {
    const  res = await supabase.from('one_health_data').insert(dataPayload)
    error = res.error
  }

  submitting.value = false

  if (error) {
    submitError.value = error.message
  } else {
    submitSuccess.value = true
    resetForm()
    await fetchAllEntries()
    setTimeout(() => { submitSuccess.value = false }, 3000)
  }
}

const deleteEntry = async (id) => {
  if (confirm("Are you sure you want to delete this map point?")) {
    const originalEntries = [...allEntries.value]
    
    // Optimistic UI Update: Remove immediately from local state
    allEntries.value = allEntries.value.filter(e => e.id !== id)
    if (editId.value === id) resetForm()

    // Scoped to current user's own entries — prevents deleting other users' data
    const { error } = await supabase.from('one_health_data').delete().eq('id', id).eq('user_id', user.value.id)
    
    if (error) {
      // Revert if deletion fails on server
      allEntries.value = originalEntries
      submitError.value = "Failed to delete entry: " + error.message
    } else {
      // Silent success since we already updated the UI
      renderMapMarkers()
    }
  }
}
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 3px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,176,58,0.2); border-radius: 10px; }

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Removed transition bloat */
</style>
