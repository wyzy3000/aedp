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
          <div class="w-1 h-8 rounded-full transition-colors" style="background-color: #E09E34;" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] transition-colors" style="color: white;">
            {{ lang === 'en' ? 'Module 07 · One Health' : 'Moduli 07 · Afya Moja' }}
          </span>
        </div>
        <h2 class="font-sans font-extrabold text-white leading-tight transition-colors" style="letter-spacing:-0.02em; font-size: 40px;">
          {{ lang === 'en' ? 'One Health Indicators' : 'Viashiria vya Afya Moja' }}
        </h2>
       
        <p class="mt-3 text-white text-[15px] leading-relaxed max-w-2xl transition-colors" style="color: white;">
          {{ lang === 'en'
            ? 'Interactive Household Research Dissemination Explorer.'
            : 'Kivinjari Shirikishi cha Kusambaza Utafiti wa Kaya.'
          }}
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-8 fade-up" ref="mapSectionRef">
        
        <div class="flex-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-2xl relative min-h-[500px] lg:h-[600px] flex flex-col">
          <div v-if="loadingData" class="absolute inset-0 z-[400] bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
            <div class="w-10 h-10 border-4 border-forest-500/30 border-t-forest-500 rounded-full animate-spin mb-4" />
            <span class="text-white text-sm font-medium">Loading Map Data...</span>
          </div>

          <div id="public-onehealth-map" class="flex-1 w-full bg-[#e5e3df] z-0"></div>

          <!-- Toggle Points Visibility Control -->
          <div class="absolute top-4 right-4 z-[400]">
            <button @click="toggleShowSelectedOnly"
                    class="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-sm select-none">
              <span class="material-symbols-outlined text-[16px]">
                {{ showSelectedOnly ? 'map' : 'location_searching' }}
              </span>
              <span>
                {{ lang === 'en'
                    ? (showSelectedOnly ? 'Show All Points' : 'Show Selected Only')
                    : (showSelectedOnly ? 'Onyesha Zote' : 'Onyesha Iliyochaguliwa Tu')
                }}
              </span>
            </button>
          </div>

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
          <div class="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 lg:p-8 min-h-[350px] lg:h-[600px] shadow-2xl lg:sticky lg:top-8 overflow-y-auto custom-scroll relative">
            
            <div v-if="!selectedPoint && !loadingData" class="flex flex-col items-center justify-center py-12 text-center h-full opacity-60">
               <span class="material-symbols-outlined text-5xl text-white/30 mb-4 animate-bounce">touch_app</span>
               <p class="text-white/70 text-sm max-w-[200px]">Click on any blue marker on the map to view data collected from that location.</p>
            </div>

            <div v-if="selectedPoint" class="space-y-5 animate-fade-in">
                <div class="pb-4 border-b border-white/10">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <h4 class="text-lg font-bold text-white">{{ selectedPoint.location_name.replace(/ area/i, '') }}</h4>
                      <p class="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                        Lat: {{ selectedPoint.latitude.toFixed(4) }} | Lng: {{ selectedPoint.longitude.toFixed(4) }}
                      </p>
                    </div>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <span class="text-[11px] text-white/50 font-medium mr-1">{{ currentPointIndex + 1 }}/{{ mapPoints.length }}</span>
                      <button @click="navigatePoint(-1)" class="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10" title="Previous Point">
                        <span class="material-symbols-outlined text-[16px]">chevron_left</span>
                      </button>
                      <button @click="navigatePoint(1)" class="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10" title="Next Point">
                        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
                      </button>
                    </div>
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
import { ref, inject, computed, onMounted, onUnmounted } from 'vue'
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
const showSelectedOnly = ref(false)

let map = null
const markersLayerGroup = L.layerGroup()
const markersMap = new Map()
let currentSelectedMarker = null

const defaultIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '',
  shadowSize: [0, 0]
})

const selectedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '',
  shadowSize: [0, 0]
})

const fetchMapData = async () => {
  loadingData.value = true
  try {
      const { data, error } = await supabase
        .from('one_health_data')
        .select('*')
        
      if (!error && data) {
        // Sort numerically by point number extracted from location_name
        data.sort((a, b) => {
          const numA = parseInt(a.location_name.match(/Point\s+(\d+)/i)?.[1] || 0, 10)
          const numB = parseInt(b.location_name.match(/Point\s+(\d+)/i)?.[1] || 0, 10)
          return numA - numB
        })
        mapPoints.value = data
        plotMarkers()
      }
  } catch (err) {
    console.error('Error fetching map data:', err)
  } finally {
    loadingData.value = false
  }
}

const selectPointById = (id) => {
  const point = mapPoints.value.find(p => p.id === id)
  if (!point) return

  selectedPoint.value = point
  
  if (showSelectedOnly.value) {
    plotMarkers()
  } else {
    const marker = markersMap.get(id)
    if (marker) {
      if (currentSelectedMarker) {
        currentSelectedMarker.setIcon(defaultIcon)
      }
      marker.setIcon(selectedIcon)
      currentSelectedMarker = marker
      map.panTo([point.latitude, point.longitude], { animate: true, duration: 0.5 })
    }
  }
}

const plotMarkers = () => {
  markersLayerGroup.clearLayers()
  markersMap.clear()
  let point1Marker = null

  mapPoints.value.forEach((point, index) => {
    // If showSelectedOnly is true, only plot the selected point
    if (showSelectedOnly.value && selectedPoint.value && point.id !== selectedPoint.value.id) {
      return
    }

    const isSelected = selectedPoint.value && point.id === selectedPoint.value.id
    const marker = L.marker([point.latitude, point.longitude], { 
      icon: isSelected ? selectedIcon : defaultIcon 
    })
    
    const title = point.location_name.replace(/ area/i, '')
    marker.bindPopup(`<b>${title}</b>`, { closeButton: false })
    
    marker.on('click', () => {
      selectPointById(point.id)
    })
    
    if (index === 0) {
      point1Marker = marker
    }

    if (isSelected) {
      currentSelectedMarker = marker
    }

    markersMap.set(point.id, marker)
    markersLayerGroup.addLayer(marker)
  })

  if (showSelectedOnly.value && selectedPoint.value) {
    map.setView([selectedPoint.value.latitude, selectedPoint.value.longitude], 12, { animate: false })
  } else {
    // Auto-fit map to show all markers with padding so none are hidden behind others
    if (mapPoints.value.length > 1) {
      const bounds = L.latLngBounds(mapPoints.value.map(p => [p.latitude, p.longitude]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12, animate: false })
    }
  }

  // If no point was selected yet, select the first one
  if (!selectedPoint.value && point1Marker) {
    point1Marker.fire('click')
  }
}

const toggleShowSelectedOnly = () => {
  showSelectedOnly.value = !showSelectedOnly.value
  plotMarkers()
}

const currentPointIndex = computed(() => {
  if (!selectedPoint.value) return 0
  return mapPoints.value.findIndex(p => p.id === selectedPoint.value.id)
})

const navigatePoint = (direction) => {
  if (!mapPoints.value.length || !selectedPoint.value) return
  const currentIndex = currentPointIndex.value
  if (currentIndex === -1) return
  
  let nextIndex = currentIndex + direction
  if (nextIndex < 0) {
    nextIndex = mapPoints.value.length - 1
  } else if (nextIndex >= mapPoints.value.length) {
    nextIndex = 0
  }
  
  const nextPoint = mapPoints.value[nextIndex]
  selectPointById(nextPoint.id)
}

onMounted(() => {
  map = L.map('public-onehealth-map', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([-2.6526, 37.2606], 10)
  
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
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: transparent; margin: 8px 0; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #64748b; border-radius: 3px; }
    
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
