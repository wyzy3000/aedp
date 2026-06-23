<template>
  <section id="diaries" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <!-- Title Block -->
      <div class="mb-10 fade-up" ref="headerRef">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full transition-colors" style="background-color: #E09E34;" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors">Module 03 · Diaries</span>
        </div>
        <h2 class="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight transition-colors" style="letter-spacing:-0.02em">
          Community Diaries
        </h2>
        <p class="mt-2 font-display font-medium text-lg italic transition-colors" style="color: #E09E34;">Maoni ya wenyeji</p>
        <p class="mt-3 text-white text-[15px] leading-relaxed max-w-2xl transition-colors" style="color: #ffffff;">
          First-hand seasonal observations from pastoralist and farming communities
          across the Amboseli ecosystem, recorded as structured field notes and video logs.
        </p>
      </div>

      <!-- Main Video Portal Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-stretch">
        <!-- Main Player (Left 2 Columns) -->
        <div class="lg:col-span-2">
          <!-- Video Player -->
          <div id="main-video-player" class="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            <!-- Error state -->
            <div v-if="videoError" class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 z-10 px-8 text-center">
              <div class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <AlertCircle class="w-8 h-8 text-[#E09E34]" />
              </div>
              <p class="text-white font-semibold text-lg">Video Unavailable</p>
              <p class="text-white/50 text-sm max-w-sm">The video could not be loaded. The server may be temporarily unavailable or the file is being uploaded.</p>
              <button @click="retryVideo" class="mt-2 px-6 py-2.5 rounded-xl bg-[#E09E34] text-white text-sm font-semibold hover:bg-[#c88a2a] transition-colors">
                Retry
              </button>
            </div>

            <!-- Poster/loading state before video loads -->
            <div v-if="!videoReady && !videoError" class="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
              <div class="flex flex-col items-center gap-3">
                <div class="w-12 h-12 border-2 border-[#E09E34]/30 border-t-[#E09E34] rounded-full animate-spin" />
                <span class="text-white/60 text-xs uppercase tracking-widest font-semibold">Loading video...</span>
              </div>
            </div>

            <video
              ref="videoRef"
              :key="activeVideo.id"
              :src="activeVideo.video_url"
              :poster="getLocalThumbnail(activeVideo.video_url) || activeVideo.thumbnail_url"
              controls
              preload="metadata"
              class="w-full h-full object-cover"
              @loadedmetadata="videoReady = true; videoError = false"
              @canplay="videoReady = true"
              @error="onVideoError"
              @waiting="videoReady = false"
              @playing="videoReady = true"
            ></video>
          </div>
        </div>

        <!-- Sidebar / Right Column (Control Panel) -->
        <div class="lg:col-span-1">
          <div class="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md h-full flex flex-col justify-between">
            <!-- Active Video Info (Top) -->
            <div class="space-y-4">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-[#E09E34]">Active Observation</span>
                <h3 class="text-xl font-display font-black text-slate-800 dark:text-white leading-snug mt-1.5">
                  {{ activeVideo.title }}
                </h3>

                <!-- Meta tags -->
                <div class="flex flex-wrap items-center gap-3 mt-3 text-xs font-semibold text-slate-500 dark:text-neutral-400">
                  <div class="flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5 text-[#E09E34]" />
                    <span>{{ activeVideo.date }}</span>
                  </div>
                  <span class="text-slate-300 dark:text-neutral-700">&bull;</span>
                  <div class="flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5 text-[#E09E34]" />
                    <span>{{ activeVideo.location }}</span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <p class="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed border-t border-black/5 dark:border-white/10 pt-3">
                {{ activeVideo.description }}
              </p>
            </div>

            <!-- Related Videos Playlist (Bottom) -->
            <div class="border-t border-black/5 dark:border-white/10 pt-4 mt-6">
              <h4 class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400 mb-3 px-1">Related Logs</h4>
              <div class="space-y-3">
                <div
                  v-for="video in videos"
                  :key="video.id"
                  @click="selectVideo(video)"
                  class="group cursor-pointer rounded-xl p-3 border transition-all duration-300 flex gap-3 bg-black/5 dark:bg-white/5"
                  :class="activeVideo.id === video.id
                    ? 'border-[#E09E34] bg-[#E09E34]/5 dark:bg-[#E09E34]/10'
                    : 'border-transparent hover:border-[#E09E34]/40'"
                >
                  <!-- Thumbnail -->
                  <div class="relative w-20 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10">
                    <img
                      :src="getLocalThumbnail(video.video_url) || video.thumbnail_url"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      @error="(e) => e.target.style.display = 'none'"
                    />
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                        <Play class="w-3 h-3 text-white fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <!-- Meta info -->
                  <div class="flex flex-col justify-center min-w-0">
                    <h5 class="text-xs font-bold leading-snug line-clamp-1 text-slate-800 dark:text-white group-hover:text-[#E09E34] transition-colors">
                      {{ video.title }}
                    </h5>
                    <span class="text-[10px] text-slate-500 dark:text-neutral-400 mt-0.5 truncate">
                      {{ video.location }} &bull; {{ video.date }}
                    </span>
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
import { ref, inject, onMounted } from 'vue'
import { Calendar, MapPin, Play, AlertCircle } from 'lucide-vue-next'
import { supabase } from '../supabase'

const isDark = inject('isDark')
const headerRef = ref(null)
const videoRef = ref(null)
const videoReady = ref(false)
const videoError = ref(false)

const fallbackLogs = [
  {
    id: 'fallback-1',
    title: 'Main Marsh Herd Movement',
    description: 'Community members in Kimana and nearby areas share how climate change affects grasslands, livestock, farming, markets, and health, while describing local adaptations such as irrigation, drought-resistant breeds, and livestock treatment.',
    location: 'Kimana Section',
    date: '10/11/2025',
    video_url: 'https://aedp.brandika.co.ke/Community%20Climate%20Diaries%20Video.mp4',
    thumbnail_url: 'https://aedp.brandika.co.ke/Community_Climate_Diaries_Thumb.jpg',
    duration: '06:45',
    is_hero: true
  },
  {
    id: 'fallback-2',
    title: 'Maasai Adaptations To Climate Change',
    description: 'Amboseli\'s Maasai community is combating climate change by adopting sedentary lifestyles and advanced livestock management. Through supplemental feeding and structured grazing, herders are preventing drought-related animal losses and better navigating human-wildlife interactions.',
    location: 'Amboseli Basin',
    date: '13/12/2025',
    video_url: 'https://aedp.brandika.co.ke/DiariesClimate2.mp4',
    thumbnail_url: 'https://aedp.brandika.co.ke/DiariesClimate2_Thumb.jpg',
    duration: '03:15',
    is_hero: false
  }
]

const videos = ref(fallbackLogs)
const activeVideo = ref(fallbackLogs[0])

const getLocalThumbnail = (videoUrl) => {
  if (!videoUrl) return null
  try {
    const fileName = decodeURIComponent(videoUrl.split('/').pop().replace(/\.[^/.]+$/, ""))
    const thumbMap = {
      'Community Climate Diaries Video': new URL('../assets/video-thumbails/Community Climate Diaries Video.png', import.meta.url).href,
      'DiariesClimate2': new URL('../assets/video-thumbails/DiariesClimate2.png', import.meta.url).href
    }
    return thumbMap[fileName] || null
  } catch (e) {
    return null
  }
}

const onVideoError = (e) => {
  console.error('Video load error:', e)
  videoError.value = true
  videoReady.value = true // hide spinner
}

const retryVideo = () => {
  videoError.value = false
  videoReady.value = false
  if (videoRef.value) {
    videoRef.value.load()
  }
}

const mapVideoRecord = (record) => {
  const mapped = { ...record }
  if (record.video_url?.includes('Community%20Climate%20Diaries%20Video.mp4') ||
      record.video_url?.includes('Community Climate Diaries Video.mp4')) {
    if (!record.title) mapped.title = 'Main Marsh Herd Movement'
    if (!record.thumbnail_url) mapped.thumbnail_url = 'https://aedp.brandika.co.ke/Community_Climate_Diaries_Thumb.jpg'
    mapped.description = record.description || fallbackLogs[0].description
  } else if (record.video_url?.includes('DiariesClimate2.mp4')) {
    if (!record.title || record.title === 'Community Climate Diaries') {
      mapped.title = 'Maasai Adaptations To Climate Change'
    }
    if (!record.thumbnail_url) mapped.thumbnail_url = 'https://aedp.brandika.co.ke/DiariesClimate2_Thumb.jpg'
    mapped.description = record.description || fallbackLogs[1].description
  }
  return mapped
}

const selectVideo = (video) => {
  videoReady.value = false
  videoError.value = false
  activeVideo.value = video
  if (window.innerWidth < 1024) {
    const player = document.getElementById('main-video-player')
    if (player) player.scrollIntoView({ behavior: 'smooth' })
  }
}

const fetchVideos = async () => {
  try {
    if (!supabase) return
    const { data, error } = await supabase
      .from('voices')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) {
      const mappedData = data.map(mapVideoRecord)
      videos.value = mappedData
      const hero = mappedData.find(v => v.is_hero) || mappedData[0]
      activeVideo.value = hero
    }
  } catch (err) {
    console.error('Error fetching videos:', err)
  }
}

onMounted(() => {
  fetchVideos()
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
  }, { threshold: 0.1 })
  if (headerRef.value) observer.observe(headerRef.value)
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
