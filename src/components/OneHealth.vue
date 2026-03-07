<template>
  <section id="onehealth" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <div class="mb-10 fade-up" ref="headerRef">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full transition-colors" style="background-color: #FBB03A;" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] transition-colors" style="color: white;">Module 07 · One Health</span>
        </div>
        <h2 class="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight transition-colors" style="letter-spacing:-0.02em">
          Ecosystem One Health Indicators
        </h2>
       
        <p class="mt-3 text-white text-[15px] leading-relaxed max-w-2xl transition-colors" style="color: white;">
          Interactive Household Research Dissemination Explorer.
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8 fade-up" ref="mapSectionRef">
        
        <div class="flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl relative min-h-[600px] lg:h-[700px] flex flex-col">
          <div v-if="loadingData" class="absolute inset-0 z-[400] bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
            <div class="w-10 h-10 border-4 border-forest-500/30 border-t-forest-500 rounded-full animate-spin mb-4" />
            <span class="text-white text-sm font-medium">Loading Map Data...</span>
          </div>

          <div id="public-onehealth-map" class="flex-1 w-full bg-[#e5e3df] z-0"></div>

          <div class="bg-white/5 border-t border-white/10 px-4 py-3 flex items-center justify-between z-10">
            <div class="flex items-center gap-4 hidden sm:flex">
              <span class="flex items-center gap-1.5 text-xs text-white/50">
                <span class="w-3 h-3 rounded-full bg-blue-600 block"></span> Observation Point
              </span>
              <span class="flex items-center gap-1.5 text-xs text-white/50">
                <span class="w-3 h-3 rounded-full bg-red-600 block"></span> Selected
              </span>
            </div>
            <span class="text-[10px] text-white/30 truncate">
              Powered by AEDP Community Science
            </span>
          </div>
        </div>

        <div class="w-full lg:w-[380px] flex-shrink-0">
          <div class="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 lg:p-8 min-h-[400px] lg:h-[700px] shadow-2xl lg:sticky lg:top-8 overflow-y-auto custom-scroll relative">
            
            <div v-if="!selectedPoint && !loadingData" class="flex flex-col items-center justify-center py-12 text-center h-full opacity-60">
               <span class="material-symbols-outlined text-5xl text-white/30 mb-4 animate-bounce">touch_app</span>
               <p class="text-white/70 text-sm max-w-[200px]">Click on any blue marker on the map to view data collected from that location.</p>
            </div>

            <div v-if="selectedPoint" class="space-y-5 animate-fade-in pb-16">
               <div class="pb-4 border-b border-white/10">
                 <div class="flex items-start justify-between">
                   <div>
                     <h4 class="text-lg font-bold" style="color: #FBB03A;">{{ selectedPoint.location_name }}</h4>
                     <p class="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                       Lat: {{ selectedPoint.latitude.toFixed(4) }} | Lng: {{ selectedPoint.longitude.toFixed(4) }}
                     </p>
                   </div>
                   <span v-if="selectedPoint.point_label" class="text-xs font-semibold text-forest-400 bg-forest-900/30 px-2 py-1 rounded-full border border-forest-500/30">
                     {{ selectedPoint.point_label }}
                   </span>
                 </div>
                 <p class="text-xs text-white/50 mt-3 flex items-center gap-1">
                  
                   Recorded on: {{ new Date(selectedPoint.created_at).toLocaleDateString() }}
                 </p>
               </div>

               <div class="space-y-4">
                 <div class="info-group">
                   <label class="info-label">Main economic activity</label>
                   <p class="info-val">{{ selectedPoint.economic_activity }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label text-orange-400">Livestock diseases in area</label>
                   <p class="info-val">{{ selectedPoint.livestock_diseases }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label text-red-400">Human diseases mentioned</label>
                   <p class="info-val">{{ selectedPoint.human_diseases }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label text-blue-400">Wildlife trends</label>
                   <p class="info-val">
                     <span class="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10"
                           :class="{'text-green-400': selectedPoint.wildlife_trends === 'Increased', 'text-red-400': selectedPoint.wildlife_trends === 'Decreased'}">
                       {{ selectedPoint.wildlife_trends }}
                     </span>
                   </p>
                 </div>
                 <div class="info-group">
                   <label class="info-label text-cyan-400">Water quality</label>
                   <p class="info-val">{{ selectedPoint.water_quality }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label">Drought preparedness</label>
                   <p class="info-val">{{ selectedPoint.drought_preparedness }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label">Major life stressors</label>
                   <p class="info-val">{{ selectedPoint.major_stressors }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label">Response to extreme climate</label>
                   <p class="info-val">{{ selectedPoint.extreme_climate_response }}</p>
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
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabase'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const lang = inject('lang')
const isDark = inject('isDark')
const headerRef = ref(null)
const mapSectionRef = ref(null)

const loadingData = ref(true)
const mapPoints = ref([])
const selectedPoint = ref(null)

let map = null
const markersLayerGroup = L.layerGroup()
let currentSelectedMarker = null

const defaultIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const selectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const fetchMapData = async () => {
  loadingData.value = true
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('one_health_data')
        .select('*')
        .order('created_at', { ascending: false })
        
      if (!error && data) {
        mapPoints.value = data
        plotMarkers()
      }
    }
  } catch (err) {
    console.error('Error fetching map data:', err)
  } finally {
    loadingData.value = false
  }
}

const plotMarkers = () => {
  markersLayerGroup.clearLayers()
  let point1Marker = null

  mapPoints.value.forEach((point, index) => {
    const marker = L.marker([point.latitude, point.longitude], { icon: defaultIcon })
    
    const label = point.point_label || `Point ${point.point_number || '?'}`;
    marker.bindPopup(`<b>${point.location_name}</b><br/><span style="font-size: 10px; color: rgba(255,255,255,0.7);">${label}</span>`)
    
    marker.on('click', () => {
      // Revert previous marker color
      if (currentSelectedMarker) {
        currentSelectedMarker.setIcon(defaultIcon)
      }
      marker.setIcon(selectedIcon)
      currentSelectedMarker = marker
      
      selectedPoint.value = point
      
      map.panTo([point.latitude, point.longitude], { animate: true, duration: 0.5 })
    })
    
    if (index === 0) {
      point1Marker = marker
    }

    markersLayerGroup.addLayer(marker)
  })

  if (point1Marker) {
    point1Marker.fire('click')
  }
}

onMounted(() => {
  map = L.map('public-onehealth-map', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([-2.6526, 37.2606], 9)
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 18,
  }).addTo(map)
  
  markersLayerGroup.addTo(map)

  fetchMapData()

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.1 })
  ;[headerRef.value, mapSectionRef.value].forEach(el => el && observer.observe(el))
  
  // Custom scrollbar css
  const style = document.createElement('style')
  style.textContent = `
    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: transparent; }
    .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    
    .leaflet-popup-content-wrapper { background: #0A4570; color: #fff; border-radius: 12px; }
    .leaflet-popup-tip { background: #0A4570; }
  `
  document.head.appendChild(style)
})

onUnmounted(() => {
  if (map) { map.remove() }
})
</script>

<style scoped>
.fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}

.info-group {
  @apply flex flex-col gap-1;
}
.info-label {
  @apply text-[11px] font-semibold uppercase tracking-wider text-white/50;
}
.info-val {
  @apply text-sm text-white/90 leading-relaxed max-w-sm;
}
</style>
