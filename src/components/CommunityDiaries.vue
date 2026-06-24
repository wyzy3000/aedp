<template>
  <section id="diaries" class="relative py-20 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="max-w-[1240px] mx-auto px-8 lg:px-12 w-full relative z-10">
      <!-- Title Block -->
      <div class="mb-8 fade-up animate-fade-in" ref="headerRef">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-1 h-6 rounded-full transition-colors" style="background-color: #E09E34;" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-400">Module 03 · Diaries</span>
        </div>
        <h2 class="module-title transition-colors">
          Community Diaries <span class="text-sm font-medium italic block md:inline md:ml-2 text-[#E09E34]">(Maoni ya wenyeji)</span>
        </h2>
      </div>

      <!-- Main Video Portal Section (YouTube Watch Layout) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <!-- Main Player Area (Left 2 Columns) -->
        <div class="lg:col-span-2 flex flex-col">
          <!-- Video Player -->
          <div id="main-video-player" class="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-black/10 dark:border-white/10 shadow-2xl transition-all duration-300">
            <!-- Error state -->
            <div v-if="videoError" class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 z-10 px-8 text-center animate-fade-in">
              <div class="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <AlertCircle class="w-7 h-7 text-[#E09E34]" />
              </div>
              <p class="text-white font-semibold text-lg">Video Unavailable</p>
              <p class="text-white/50 text-sm max-w-sm">The video could not be loaded. The server may be temporarily offline or the file path is incorrect.</p>
              <button @click="retryVideo" class="mt-2 px-5 py-2 rounded-xl bg-[#E09E34] text-white text-sm font-semibold hover:bg-[#c88a2a] transition-all hover:scale-105 active:scale-95 duration-200">
                Retry
              </button>
            </div>

            <!-- Poster/loading state before video loads -->
            <div v-if="!videoReady && !videoError" class="absolute inset-0 flex items-center justify-center bg-black/75 z-10">
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

          <!-- Video Details (YouTube-Style) -->
          <div class="mt-4 flex-1 flex flex-col">
            <!-- Title -->
            <h1 class="text-xl md:text-2xl font-bold font-display leading-snug text-slate-900 dark:text-neutral-50">
              {{ activeVideo.title }}
            </h1>

            <!-- Channel and Actions Row -->
            <div class="mt-3 flex flex-wrap items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
              <!-- Channel Info -->
              <div class="flex items-center gap-3">
                <!-- Avatar / Logo -->
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md select-none bg-gradient-to-tr from-emerald-600 to-[#E09E34]">
                  AV
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm font-bold text-slate-800 dark:text-neutral-100">AEDP Voices</span>
                    <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold" title="Verified source">✓</span>
                  </div>
                  <span class="text-xs text-slate-500 dark:text-neutral-400">Amboseli Community • 2.4K observers</span>
                </div>

                <!-- Subscribe (Observe) Button -->
                <button
                  @click="toggleSubscribe"
                  class="ml-4 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-sm"
                  :class="isSubscribed
                    ? 'bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 hover:bg-slate-300 dark:hover:bg-neutral-700'
                    : 'bg-slate-950 dark:bg-white text-white dark:text-black hover:opacity-90'"
                >
                  {{ isSubscribed ? 'Observing' : 'Observe' }}
                </button>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2">
                <!-- Like / Dislike pill group -->
                <div class="flex items-center bg-slate-100 dark:bg-white/5 rounded-full p-0.5 border border-black/5 dark:border-white/5">
                  <button
                    @click="toggleLike"
                    class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-l-full text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    :title="isLiked ? 'Unlike' : 'Like this diary'"
                  >
                    <ThumbsUp class="w-3.5 h-3.5" :class="isLiked ? 'text-[#E09E34] fill-current' : ''" />
                    <span>{{ likeCount }}</span>
                  </button>
                  <div class="w-[1px] h-4 bg-slate-300 dark:bg-white/10" />
                  <button
                    @click="toggleDislike"
                    class="px-3.5 py-1.5 rounded-r-full text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    :title="isDisliked ? 'Remove dislike' : 'Dislike this diary'"
                  >
                    <ThumbsDown class="w-3.5 h-3.5" :class="isDisliked ? 'text-red-500 fill-current' : ''" />
                  </button>
                </div>

                <!-- Share Button -->
                <button
                  @click="copyShareLink"
                  class="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-full text-xs font-semibold text-slate-700 dark:text-neutral-200 transition-all active:scale-95 duration-150 relative"
                >
                  <component :is="shareCopied ? Check : Share2" class="w-3.5 h-3.5" :class="shareCopied ? 'text-emerald-500 animate-pulse' : ''" />
                  <span>{{ shareCopied ? 'Copied' : 'Share' }}</span>
                </button>

                <!-- Download Button -->
                <a
                  :href="activeVideo.video_url"
                  download
                  target="_blank"
                  class="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-full text-xs font-semibold text-slate-700 dark:text-neutral-200 transition-all active:scale-95 duration-150"
                  title="Download MP4 source"
                >
                  <Download class="w-3.5 h-3.5" />
                  <span class="hidden sm:inline">Download</span>
                </a>
              </div>
            </div>

            <!-- Expandable Description Box -->
            <div
              class="mt-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/[0.08] transition-all duration-300 rounded-xl p-4 cursor-pointer"
              @click="isExpanded = !isExpanded"
            >
              <!-- Info summary -->
              <div class="flex items-center gap-3 text-xs font-bold text-slate-800 dark:text-neutral-100 mb-1.5">
                <div class="flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5 text-[#E09E34]" />
                  <span>{{ activeVideo.date }}</span>
                </div>
                <span>&bull;</span>
                <div class="flex items-center gap-1">
                  <MapPin class="w-3.5 h-3.5 text-[#E09E34]" />
                  <span>{{ activeVideo.location }}</span>
                </div>
                <span class="ml-auto text-[#E09E34] text-[10px] uppercase tracking-wider font-extrabold">{{ isExpanded ? 'Show less' : 'Show more' }}</span>
              </div>

              <!-- Main text description -->
              <p
                class="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-line"
                :class="isExpanded ? '' : 'line-clamp-2'"
              >
                {{ activeVideo.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Sidebar / Related logs (Right Column) -->
        <div class="lg:col-span-1 flex flex-col">
          <div class="glass-card p-5 rounded-2xl border border-black/5 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-md flex-1 flex flex-col">
            <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400 mb-4 px-1 flex items-center justify-between">
              <span>Related Logs</span>
              <span class="text-[10px] font-medium text-slate-400 dark:text-neutral-500 normal-case">{{ videos.length }} videos</span>
            </h3>

            <!-- Playlist items -->
            <div class="space-y-3.5 overflow-y-auto max-h-[600px] pr-1">
              <div
                v-for="video in videos"
                :key="video.id"
                @click="selectVideo(video)"
                class="group cursor-pointer flex gap-3 transition-all duration-300 rounded-xl p-2 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                :class="activeVideo.id === video.id ? 'bg-black/[0.04] dark:bg-white/5 border-slate-200 dark:border-white/5' : ''"
              >
                <!-- Thumbnail wrapper -->
                <div class="relative w-32 aspect-video rounded-lg overflow-hidden bg-black flex-shrink-0 border border-black/10 dark:border-white/10 shadow-sm">
                  <img
                    :src="getLocalThumbnail(video.video_url) || video.thumbnail_url"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    @error="(e) => e.target.style.display = 'none'"
                  />
                  <!-- Hover play overlay -->
                  <div class="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="w-8 h-8 rounded-full bg-[#E09E34] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play class="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <!-- Duration Badge (Floating bottom-right) -->
                  <div class="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow tracking-wide select-none">
                    {{ video.duration || '05:00' }}
                  </div>
                </div>

                <!-- Info panel -->
                <div class="flex flex-col justify-start min-w-0 flex-1 py-0.5">
                  <h4
                    class="text-xs font-bold leading-snug line-clamp-2 text-slate-800 dark:text-neutral-100 group-hover:text-[#E09E34] transition-colors"
                    :class="activeVideo.id === video.id ? 'text-[#E09E34] dark:text-[#E09E34]' : ''"
                  >
                    {{ video.title }}
                  </h4>
                  <span class="text-[10px] font-medium text-slate-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                    <span class="truncate">{{ video.location }}</span>
                  </span>
                  <span class="text-[9px] text-slate-400 dark:text-neutral-500 mt-0.5">{{ video.date }}</span>
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
import { ref, inject, onMounted, computed } from 'vue'
import { Calendar, MapPin, Play, AlertCircle, ThumbsUp, ThumbsDown, Share2, Download, Check } from 'lucide-vue-next'
import { supabase } from '../supabase'

const isDark = inject('isDark')
const headerRef = ref(null)
const videoRef = ref(null)
const videoReady = ref(false)
const videoError = ref(false)
const isExpanded = ref(false)
const isSubscribed = ref(false)

const likedStates = ref({})
const dislikedStates = ref({})
const videoLikes = ref({
  'fallback-1': 42,
  'fallback-2': 18
})

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

const isLiked = computed(() => !!likedStates.value[activeVideo.value.id])
const isDisliked = computed(() => !!dislikedStates.value[activeVideo.value.id])

const getLikeCount = (videoId) => {
  if (!videoLikes.value[videoId]) {
    let hash = 0
    for (let i = 0; i < videoId.length; i++) {
      hash = videoId.charCodeAt(i) + ((hash << 5) - hash)
    }
    videoLikes.value[videoId] = Math.abs(hash % 100) + 5
  }
  return videoLikes.value[videoId] + (likedStates.value[videoId] ? 1 : -0)
}

const likeCount = computed(() => getLikeCount(activeVideo.value.id))

const toggleLike = () => {
  const vid = activeVideo.value.id
  if (likedStates.value[vid]) {
    likedStates.value[vid] = false
  } else {
    likedStates.value[vid] = true
    dislikedStates.value[vid] = false
  }
}

const toggleDislike = () => {
  const vid = activeVideo.value.id
  if (dislikedStates.value[vid]) {
    dislikedStates.value[vid] = false
  } else {
    dislikedStates.value[vid] = true
    likedStates.value[vid] = false
  }
}

const toggleSubscribe = () => {
  isSubscribed.value = !isSubscribed.value
}

const shareCopied = ref(false)
const copyShareLink = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    shareCopied.value = true
    setTimeout(() => {
      shareCopied.value = false
    }, 2000)
  }).catch(err => {
    console.error('Failed to copy link: ', err)
  })
}

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
    mapped.duration = '06:45'
  } else if (record.video_url?.includes('DiariesClimate2.mp4')) {
    if (!record.title || record.title === 'Community Climate Diaries') {
      mapped.title = 'Maasai Adaptations To Climate Change'
    }
    if (!record.thumbnail_url) mapped.thumbnail_url = 'https://aedp.brandika.co.ke/DiariesClimate2_Thumb.jpg'
    mapped.description = record.description || fallbackLogs[1].description
    mapped.duration = '03:15'
  }
  return mapped
}

const selectVideo = (video) => {
  videoReady.value = false
  videoError.value = false
  activeVideo.value = video
  isExpanded.value = false // reset description expand/collapse
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
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

