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
        <h2 class="module-title transition-colors" style="letter-spacing:-0.02em">
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
                <span class="w-3 h-3 rounded-full bg-blue-600 block"></span>
                {{ lang === 'en' ? 'Observation Point' : 'Kituo cha Uchunguzi' }}
              </span>
              <span class="flex items-center gap-1.5 text-xs text-white/50">
                <span class="w-3 h-3 rounded-full bg-red-600 block"></span>
                {{ lang === 'en' ? 'Selected' : 'Iliyochaguliwa' }}
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
               <p class="text-white/70 text-sm max-w-[200px]">
                 {{ lang === 'en'
                   ? 'Click on any blue marker on the map to view data collected from that location.'
                   : 'Bonyeza alama yoyote ya bluu kwenye ramani ili kuona data iliyokusanywa kutoka eneo hilo.'
                 }}
               </p>
            </div>

            <div v-if="selectedPoint" class="space-y-5 animate-fade-in">
                <div class="pb-4 border-b border-white/10">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <h4 class="text-lg font-bold text-white">{{ translateLocationName(selectedPoint.location_name.replace(/ area/i, '')) }}</h4>
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
                  
                   {{ lang === 'en' ? 'Recorded on:' : 'Imerekodiwa tarehe:' }} {{ new Date(selectedPoint.created_at).toLocaleDateString() }}
                 </p>
               </div>

               <div class="space-y-4">
                 <div class="info-group">
                   <label class="info-label">{{ lang === 'en' ? 'Main economic activity' : 'Shughuli kuu ya kiuchumi' }}</label>
                   <p class="info-val">{{ translate(selectedPoint.economic_activity) }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label text-orange-400">{{ lang === 'en' ? 'Livestock diseases in area' : 'Magonjwa ya mifugo katika eneo' }}</label>
                   <p class="info-val">{{ translate(selectedPoint.livestock_diseases) }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label text-red-400">{{ lang === 'en' ? 'Human diseases mentioned' : 'Magonjwa ya binadamu yaliyotajwa' }}</label>
                   <p class="info-val">{{ translate(selectedPoint.human_diseases) }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label text-blue-400">{{ lang === 'en' ? 'Wildlife trends' : 'Mwelekeo wa wanyamapori' }}</label>
                   <p class="info-val">
                     <span class="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10"
                           :class="{'text-green-400': selectedPoint.wildlife_trends === 'Increased', 'text-red-400': selectedPoint.wildlife_trends === 'Decreased'}">
                       {{ translate(selectedPoint.wildlife_trends) }}
                     </span>
                   </p>
                 </div>
                 <div class="info-group">
                   <label class="info-label text-cyan-400">{{ lang === 'en' ? 'Water quality' : 'Ubora wa maji' }}</label>
                   <p class="info-val">{{ translate(selectedPoint.water_quality) }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label">{{ lang === 'en' ? 'Drought preparedness' : 'Kujiandaa kwa ukame' }}</label>
                   <p class="info-val">{{ translate(selectedPoint.drought_preparedness) }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label">{{ lang === 'en' ? 'Major life stressors' : 'Changamoto kuu za maisha' }}</label>
                   <p class="info-val">{{ translate(selectedPoint.major_stressors) }}</p>
                 </div>
                 <div class="info-group">
                   <label class="info-label">{{ lang === 'en' ? 'Response to extreme climate' : 'Majibu kwa hali mbaya ya hewa' }}</label>
                   <p class="info-val">{{ translate(selectedPoint.extreme_climate_response) }}</p>
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
import { ref, inject, computed, watch, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabase'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const lang = inject('lang')
const isDark = inject('isDark')
const headerRef = ref(null)

const safeGetLocalStorage = (key) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
      return window.localStorage.getItem(key)
    }
  } catch (e) {}
  return null
}

const safeSetLocalStorage = (key, value) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
      window.localStorage.setItem(key, value)
    }
  } catch (e) {}
}
const mapSectionRef = ref(null)

const translationMap = {
  // Field values
  'Increased': 'Imeongezeka',
  'Decreased': 'Imepungua',
  'No Change': 'Hakuna mabadiliko',
  'Good': 'Nzuri',
  'Fair': 'Wastani',
  'Poor': 'Mbaya',
  'Fully prepared': 'Kujitayarisha kikamilifu',
  'Somehow prepared': 'Kujitayarisha kiasi',
  'Not prepared at all': 'Hajajitayarisha kabisa',
  'N/A': 'N/A',
  'None': 'Hakuna',
  'No response': 'Hakuna jibu',
  
  // Economic activities
  'Casual labourer': 'Kibarua',
  'Crop farmer': 'Mkulima wa mazao',
  'Formal employment': 'Ajira rasmi',
  'Livestock & crop farming': 'Ufugaji wa mifugo na ukulima',
  'Livestock keeping': 'Ufugaji wa mifugo',
  'Tourism activity': 'Shughuli za utalii',
  'farming': 'ukulima',
  
  // Livestock diseases
  'Anthrax': 'Kimeta (Anthrax)',
  'Arbotions': 'Kuharibika kwa mimba',
  'Black quarter': 'Homa ya vipindi (Black quarter)',
  'CCPP': 'CCPP (Homa ya mapafu ya mbuzi)',
  'East Coast Fever': 'Homa ya Bonde la Ufa (East Coast Fever)',
  'Enterotoxaemia': 'Enterotoxaemia',
  'Ephemeral fever': 'Homa ya siku tatu (Ephemeral fever)',
  'Foot and mouth': 'Ugonjwa wa miguu na midomo',
  'Foot and mouth disease': 'Ugonjwa wa miguu na midomo',
  'Foot rot': 'Ugonjwa wa kuoza miguu (Foot rot)',
  'Glaucoma': 'Glaucoma (Shinikizo la jicho)',
  'Heart water': 'Maji kwenye moyo (Heart water)',
  'Liver fluke': 'Minyoo ya ini (Liver fluke)',
  'Lumpy skin disease': 'Ugonjwa wa ngozi (Lumpy skin disease)',
  'Malignant catarrh': 'Homa ya mafua ya ng\'ombe (Malignant catarrh)',
  'Mastitis': 'Ugonjwa wa kiwele (Mastitis)',
  'Rinderpest': 'Sotoka ya ng\'ombe (Rinderpest)',
  'Ringworms': 'Masundosundo (Ringworms)',
  'Sleeping sickness': 'Ugonjwa wa kulala (Sleeping sickness)',
  'Trypanasomiasis': 'Trypanasomiasis (Ugonjwa wa ndorobo)',
  
  // Human diseases
  'Blood pressure': 'Shinikizo la damu',
  'Brucellosis': 'Ugonjwa wa kutupa mimba (Brucellosis)',
  'COVID': 'COVID',
  'Cold and flu': 'Mafua na homa',
  'Coughing': 'Kukohoa',
  'Diabetes': 'Ugonjwa wa kisukari',
  'Diarrhoea': 'Kuhara',
  'Eye infection': 'Maambukizi ya macho',
  'Malaria': 'Malaria',
  'Tracoma': 'Trakoma (Vikope)',
  'Typhoid': 'Homa ya matumbo (Typhoid)',
  
  // Major stressors
  'Accessing health facilities': 'Kufikia vituo vya afya',
  'Access to health facilities': 'Kufikia vituo vya afya',
  'Access to hospitals': 'Kufikia hospitali',
  'Accessing hospitals': 'Kufikia hospitali',
  'Crop disease': 'Magonjwa ya mazao',
  'Droughts': 'Ukame',
  'High temperature': 'Joto la juu',
  'Lack of money': 'Ukosefu wa pesa',
  'Employment opportunity': 'Fursa za ajira',
  'Frequent droughts': 'Ukame wa mara kwa mara',
  'Lack of basic needs': 'Ukosefu wa mahitaji ya msingi',
  'Livestock diseases': 'Magonjwa ya mifugo',
  'Household food': 'Chakula cha kaya',
  'School fees': 'Ada ya shule',
  'Lack of school fees': 'Ukosefu wa ada ya shule',
  'Lacking school fees': 'Ukosefu wa ada ya shule',
  'Livestock predation': 'Mifugo kuliwa na wanyamapori',
  'Human diseases': 'Magonjwa ya binadamu',
  'Lack of health facilities': 'Ukosefu wa vituo vya afya',
  'Lack of water': 'Ukosefu wa maji',
  'Reduced herd sizes': 'Kupungua kwa saizi ya mifugo',
  'Reduced herd size': 'Kupungua kwa saizi ya mifugo',
  'Unreliable rainfall': 'Mvua isiyotabirika',
  'Land subdivision': 'Mgawanyiko wa ardhi',
  'Settling down': 'Kutulia / Makazi ya kudumu',
  'Lack of early warnings': 'Ukosefu wa tahadhari za mapema',
  'Severe livestock death': 'Vifo vikubwa vya mifugo',
  'Severe livestock deaths': 'Vifo vikubwa vya mifugo',
  'Where to move to': 'Pa kuhamia',
  'Poor infrastructure': 'Miundombinu mibovu',
  'Poor livestock health': 'Afya duni ya mifugo',
  'Poor rains': 'Mvua duni',
  'Ready market for produce': 'Soko tayari kwa mazao',
  'Reduced pastures': 'Kupungua kwa malisho',
  'Drought': 'Ukame',
  'Sickness': 'Ugonjwa',
  'Testing stressors': 'Majaribio ya changamoto',
  'Wildlife conflicts': 'Migogoro ya wanyamapori',
  'Market access': 'Upatikanaji wa soko',
  'Food insecurity': 'Uhaba wa chakula',
  'Pasture decline': 'Kupungua kwa malisho',
  'Loss of livestock': 'Kupoteza mifugo',
  'Climate change': 'Mabadiliko ya tabianchi',
  'Flooding': 'Mafuriko',
  'Lack of pasture': 'Ukosefu wa malisho',
  'Conflict': 'Mgongano',
  'Insecurity': 'Kutokuwa salama',
  'Poverty': 'Umaskini',
  
  // Extreme climate responses
  'Migrate with livestock': 'Hama na mifugo',
  'Sell livestock': 'Uza mifugo',
  'Destocking': 'Kupunguza mifugo',
  'Supplementary feeding': 'Kulisha ziada',
  'Water trucking': 'Usafirishaji wa maji',
  'Seek alternative livelihood': 'Tafuta njia mbadala ya maisha',
  'Plant drought resistant crops': 'Panda mazao yanayostahimili ukame',
  'Diversify income': 'Tofautisha mapato',
  'Save money': 'Weka akiba',
  'Pray for rain': 'Omba mvua',
  'Do nothing': 'Fanya chochote',
  'Nothing': 'Hakuna hatua',
  'Seeking food aid': 'Tafuta msaada wa chakula',
  'Food aid': 'Msaada wa chakula',
  'Move to other areas': 'Hamia maeneo mengine',
  'Move livestock': 'Hamia na mifugo',
  'Reduce household expenditure': 'Punguza matumizi ya kaya',
  'Buy food': 'Nunua chakula',
  'Borrow money': 'Kukopa pesa',
  'Engage in casual labour': 'Fanya kazi ya kibarua',
  'Irrigation': 'Umwagiliaji',
  'Practice irrigation': 'Fanya umwagiliaji',
  'Testing response': 'Majaribio ya majibu',
  
  // Common compound space-separated phrases from database
  'Frequent droughts Livestock diseases Household food School fees Employment opportunity': 'Ukame wa mara kwa mara, Magonjwa ya mifugo, Chakula cha kaya, Ada ya shule, Fursa za ajira',
  'Trypanasomiasis Foot and mouth Black quarter': 'Ugonjwa wa ndorobo, Ugonjwa wa miguu na midomo, Homa ya vipindi'
}

// Sort translation map keys by length descending for greedy matching
const sortedTranslationKeys = Object.keys(translationMap).sort((a, b) => b.length - a.length)

/**
 * Greedily parse space-separated tokens into known phrases.
 * This handles database values like "Frequent droughts Livestock diseases School fees"
 * where terms are joined by spaces without delimiters.
 */
const greedyParseSpaceSeparated = (text) => {
  const result = []
  let remaining = text.trim()
  let safetyBreak = 0

  while (remaining.length > 0 && safetyBreak < 50) {
    safetyBreak++
    let matched = false

    // Try to match from longest key to shortest
    for (const key of sortedTranslationKeys) {
      const keyLower = key.toLowerCase()
      const remLower = remaining.toLowerCase()
      if (remLower.startsWith(keyLower)) {
        // Make sure we're matching a full word boundary (next char is space or end)
        const nextChar = remaining[key.length]
        if (!nextChar || nextChar === ' ') {
          result.push(translationMap[key])
          remaining = remaining.slice(key.length).trimStart()
          matched = true
          break
        }
      }
    }

    if (!matched) {
      // No match found: consume the first word as-is
      const spaceIdx = remaining.indexOf(' ')
      if (spaceIdx === -1) {
        result.push(remaining)
        remaining = ''
      } else {
        result.push(remaining.slice(0, spaceIdx))
        remaining = remaining.slice(spaceIdx + 1).trimStart()
      }
    }
  }

  return result
}

const translate = (text) => {
  if (!text) return text
  if (lang.value !== 'sw') return text
  
  const trimmed = text.trim()
  
  const exactLookup = (val) => {
    const v = val.trim()
    if (!v) return ''
    const matchedKey = sortedTranslationKeys.find(k => k.toLowerCase() === v.toLowerCase())
    return matchedKey ? translationMap[matchedKey] : v
  }

  // First check for an exact full-string match in the translation map
  const fullMatch = sortedTranslationKeys.find(k => k.toLowerCase() === trimmed.toLowerCase())
  if (fullMatch) return translationMap[fullMatch]

  // Split by newlines, commas, or semicolons
  const parts = trimmed.split(/[\r\n,;]+/)
  if (parts.length > 1) {
    return parts
      .map(part => part.trim())
      .filter(part => part.length > 0)
      .map(part => {
        // Try exact lookup first, then greedy space-separated parsing
        const exact = exactLookup(part)
        if (exact !== part) return exact
        // If exact lookup failed, try greedy parse for space-separated multi-term values
        const parsed = greedyParseSpaceSeparated(part)
        return parsed.join(', ')
      })
      .join(', ')
  }

  // Single value: try exact lookup then greedy parse
  const single = exactLookup(trimmed)
  if (single !== trimmed) return single
  
  // Try greedy space-separated parsing for values like "Frequent droughts Livestock diseases"
  const parsed = greedyParseSpaceSeparated(trimmed)
  if (parsed.length > 1) return parsed.join(', ')
  
  return parsed[0] || trimmed
}

const translateLocationName = (name) => {
  if (!name) return name
  if (lang.value === 'sw') {
    return name.replace(/Point/i, 'Kituo')
  }
  return name
}

watch(() => (lang && lang.value ? lang.value : lang), () => {
  plotMarkers()
})

// Load cached data from localStorage if available
const cachedData = safeGetLocalStorage('one_health_map_points')
const initialPoints = []
if (cachedData) {
  try {
    const parsed = JSON.parse(cachedData)
    if (Array.isArray(parsed) && parsed.length > 0) {
      initialPoints.push(...parsed)
    }
  } catch (e) {
    console.error('Failed to parse cached map data:', e)
  }
}

const loadingData = ref(initialPoints.length === 0)
const mapPoints = ref(initialPoints)
const selectedPoint = ref(null)
const showSelectedOnly = ref(false)

let map = null
const markersLayerGroup = L.layerGroup()
const markersMap = new Map()
let currentSelectedMarker = null

const defaultMarkerOptions = {
  radius: 6,
  fillColor: '#3B82F6',
  color: '#FFFFFF',
  weight: 1.5,
  opacity: 1,
  fillOpacity: 0.6
}

const selectedMarkerOptions = {
  radius: 10,
  fillColor: '#EF4444',
  color: '#FFFFFF',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.95
}

const fetchMapData = async () => {
  if (mapPoints.value.length === 0) {
    loadingData.value = true
  }
  
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), 6000)
  )

  try {
    const fetchPromise = supabase.from('one_health_data').select('*')
    const result = await Promise.race([fetchPromise, timeoutPromise])
    
    if (result && !result.error && result.data) {
      const data = result.data
      data.sort((a, b) => {
        const numA = parseInt(a.location_name.match(/Point\s+(\d+)/i)?.[1] || 0, 10)
        const numB = parseInt(b.location_name.match(/Point\s+(\d+)/i)?.[1] || 0, 10)
        return numA - numB
      })
      mapPoints.value = data
      safeSetLocalStorage('one_health_map_points', JSON.stringify(data))
      plotMarkers()
    } else if (result && result.error) {
      console.error('Supabase error:', result.error)
    }
  } catch (err) {
    if (err.message === 'TIMEOUT') {
      console.warn('Supabase fetch timed out (possibly waking up). Fetching will continue in the background.')
      loadingData.value = false
      
      supabase.from('one_health_data').select('*').then(({ data, error }) => {
        if (!error && data) {
          data.sort((a, b) => {
            const numA = parseInt(a.location_name.match(/Point\s+(\d+)/i)?.[1] || 0, 10)
            const numB = parseInt(b.location_name.match(/Point\s+(\d+)/i)?.[1] || 0, 10)
            return numA - numB
          })
          mapPoints.value = data
          safeSetLocalStorage('one_health_map_points', JSON.stringify(data))
          plotMarkers()
        }
      }).catch(e => console.error('Background fetch error:', e))
    } else {
      console.error('Error fetching map data:', err)
    }
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
        currentSelectedMarker.setStyle(defaultMarkerOptions)
      }
      marker.setStyle(selectedMarkerOptions)
      marker.bringToFront()
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
    const marker = L.circleMarker([point.latitude, point.longitude], isSelected ? selectedMarkerOptions : defaultMarkerOptions)
    
    const title = translateLocationName(point.location_name.replace(/ area/i, ''))
    marker.bindPopup(`<b>${title}</b>`, { closeButton: false })
    
    marker.on('click', () => {
      selectPointById(point.id)
    })
    
    if (index === 0) {
      point1Marker = marker
    }

    if (isSelected) {
      currentSelectedMarker = marker
      setTimeout(() => {
        if (marker._map) {
          marker.bringToFront()
        }
      }, 0)
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

  if (mapPoints.value.length > 0) {
    plotMarkers()
  }

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
