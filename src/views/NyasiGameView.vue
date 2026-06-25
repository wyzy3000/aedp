<template>
  <div class="nyasi-root font-sans min-h-screen relative overflow-hidden">
    
    <!-- Background element to match other pages -->
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 25% 40%, rgba(59,130,246,0.07) 0%, transparent 55%)" />

    <div class="relative z-10 max-w-[1240px] mx-auto px-8 lg:px-12 w-full pt-[6vh] lg:pt-[12vh] pb-28">

      <!-- ─── GAME TITLE HEADER ─── -->
      <div class="mb-10 w-full text-left">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-1 h-8 rounded-full" style="background-color: #E09E34;" />
          <span class="text-xs font-semibold uppercase tracking-[0.2em]" style="color: white;">
            {{ lang === 'en' ? 'Module 08 · Nyasi Game' : 'Moduli 08 · Mchezo wa Nyasi' }}
          </span>
        </div>
        <h2 class="module-title" style="letter-spacing:-0.02em">
          {{ lang === 'en' ? 'Nyasi Game' : 'Mchezo wa Nyasi' }}
        </h2>
        <p class="mt-3 text-white text-[15px] leading-relaxed max-w-2xl" style="color: white;">
          {{ lang === 'en'
            ? 'The Pasture & Livestock Adventure. A community-driven decision support simulation.'
            : 'Hadithi ya Malisho na Mifugo. Simulizi ya usaidizi wa maamuzi inayoendeshwa na jamii.'
          }}
        </p>
      </div>

      <!-- Layout Grid: stacked on mobile, side-by-side on desktop -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        <!-- LEFT COLUMN: Map Board, Board Action Buttons -->
        <div class="lg:col-span-6 space-y-5 flex flex-col items-center">

          <!-- ─── THE BOARD ─── -->
          <div class="relative w-full max-w-[420px] mx-auto aspect-square">
            <!-- Board outer glow ring -->
            <div class="absolute inset-0 rounded-full" style="box-shadow: 0 0 60px rgba(93,193,62,0.08), 0 0 120px rgba(201,168,76,0.05);"></div>

            <div class="relative w-full h-full rounded-full"
                 style="background: radial-gradient(ellipse at center, #1e2d18 0%, #0f1a0a 60%, #080e06 100%); border: 1.5px solid rgba(201,168,76,0.15); box-shadow: 0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)">
              
              <svg viewBox="0 0 300 300" class="w-full h-full select-none">
                <defs>
                  <!-- Zone fills - earthy natural palette -->
                  <radialGradient id="parkCenter" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#2a6e45"/>
                    <stop offset="100%" stop-color="#16421f"/>
                  </radialGradient>
                  <radialGradient id="parkCenterGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#3a8e55"/>
                    <stop offset="100%" stop-color="#1f5a2a"/>
                  </radialGradient>

                  <!-- Glow filter for selected zone -->
                  <filter id="zoneGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                  </filter>

                  <!-- Outer border gradient -->
                  <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#c9a84c" stop-opacity="0.6"/>
                    <stop offset="50%" stop-color="#e8d090" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#c9a84c" stop-opacity="0.6"/>
                  </linearGradient>

                  <!-- Biomass progress gradient for center ring -->
                  <linearGradient id="biomassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#5DC13E"/>
                    <stop offset="100%" stop-color="#3a9c20"/>
                  </linearGradient>
                </defs>

                <!-- Decorative outer dotted ring -->
                <circle cx="150" cy="150" r="147" fill="none" stroke="url(#borderGrad)" stroke-width="1" stroke-dasharray="3 4"/>

                <!-- Zone sectors -->
                <path
                  v-for="sector in outerSectors"
                  :key="sector.id"
                  :d="getSectorPath(150, 150, 50, 140, sector.start, sector.end)"
                  :fill="getSectorFill(sector.id)"
                  :stroke="selectedZoneId === sector.id ? '#e8d090' : (store.player.position === sector.id ? '#5DC13E' : 'rgba(0,0,0,0.5)')"
                  :stroke-width="selectedZoneId === sector.id ? 2.5 : (store.player.position === sector.id ? 2 : 1.5)"
                  :filter="selectedZoneId === sector.id ? 'url(#zoneGlow)' : ''"
                  :opacity="selectedZoneId === sector.id ? 1 : 0.88"
                  class="cursor-pointer transition-all duration-300"
                  @click="selectZone(sector.id)"
                />

                <!-- Divider lines between sectors -->
                <g v-for="sector in outerSectors" :key="'div-' + sector.id" class="pointer-events-none">
                  <line
                    :x1="polarToCartesian(150, 150, 50, sector.start).x"
                    :y1="polarToCartesian(150, 150, 50, sector.start).y"
                    :x2="polarToCartesian(150, 150, 140, sector.start).x"
                    :y2="polarToCartesian(150, 150, 140, sector.start).y"
                    stroke="rgba(0,0,0,0.6)" stroke-width="1.5"
                  />
                </g>

                <!-- Inner separation ring -->
                <circle cx="150" cy="150" r="50" fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="1.5"/>
                <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="1"/>

                <!-- Zone name labels -->
                <g v-for="sector in outerSectors" :key="'label-' + sector.id" class="pointer-events-none">
                  <!-- First line of name -->
                  <text
                    :x="polarToCartesian(150, 150, 102, (sector.start + sector.end) / 2).x"
                    :y="polarToCartesian(150, 150, 102, (sector.start + sector.end) / 2).y - 4"
                    fill="rgba(255,255,255,0.95)"
                    font-size="7.5"
                    font-weight="900"
                    text-anchor="middle"
                    font-family="Outfit, sans-serif"
                    letter-spacing="0.5"
                  >{{ getZoneLabel(sector.id, lang).line1 }}</text>
                  <!-- Second line of name -->
                  <text
                    :x="polarToCartesian(150, 150, 102, (sector.start + sector.end) / 2).x"
                    :y="polarToCartesian(150, 150, 102, (sector.start + sector.end) / 2).y + 5.5"
                    fill="rgba(255,255,255,0.75)"
                    font-size="6"
                    font-weight="700"
                    text-anchor="middle"
                    font-family="Outfit, sans-serif"
                    letter-spacing="0.3"
                  >{{ getZoneLabel(sector.id, lang).line2 }}</text>

                  <!-- Biomass indicator arc mini -->
                  <circle
                    :cx="polarToCartesian(150, 150, 128, (sector.start + sector.end) / 2).x"
                    :cy="polarToCartesian(150, 150, 128, (sector.start + sector.end) / 2).y"
                    r="6"
                    :fill="getBiomassDotColor(sector.id)"
                    stroke="rgba(0,0,0,0.6)"
                    stroke-width="1"
                  />
                  <text
                    :x="polarToCartesian(150, 150, 128, (sector.start + sector.end) / 2).x"
                    :y="polarToCartesian(150, 150, 128, (sector.start + sector.end) / 2).y + 2.5"
                    fill="white"
                    font-size="5"
                    font-weight="900"
                    text-anchor="middle"
                    font-family="Outfit, sans-serif"
                  >{{ Math.round(store.zones[sector.id].biomass) }}</text>
                </g>

                <!-- Central Park area -->
                <circle
                  cx="150" cy="150" r="49"
                  :fill="selectedZoneId === 'park' ? 'url(#parkCenterGlow)' : 'url(#parkCenter)'"
                  :stroke="selectedZoneId === 'park' ? '#e8d090' : '#5DC13E'"
                  :stroke-width="selectedZoneId === 'park' ? 2.5 : 1.5"
                  :filter="selectedZoneId === 'park' ? 'url(#zoneGlow)' : ''"
                  class="cursor-pointer transition-all duration-300"
                  @click="selectZone('park')"
                />

                <!-- Park text -->
                <text x="150" y="142" fill="white" font-size="8.5" font-weight="900" text-anchor="middle" font-family="Outfit, sans-serif" class="pointer-events-none" letter-spacing="1">AMBOSELI</text>
                <text x="150" y="152" fill="#5DC13E" font-size="7.5" font-weight="900" text-anchor="middle" font-family="Outfit, sans-serif" class="pointer-events-none" letter-spacing="0.5">PARK</text>

                <!-- Park biomass badge -->
                <circle cx="150" cy="162" r="7" fill="#1a4028" stroke="#5DC13E" stroke-width="1" class="pointer-events-none"/>
                <text x="150" y="164.5" fill="#5DC13E" font-size="5.5" font-weight="900" text-anchor="middle" font-family="Outfit, sans-serif" class="pointer-events-none">
                  {{ Math.round(store.zones['park'].biomass) }}
                </text>

                <!-- Player token - outer zones -->
                <g v-for="zKey in Object.keys(store.zones)" :key="'tok-' + zKey" class="pointer-events-none">
                  <g v-if="store.player.position === zKey && zKey !== 'park'"
                     :transform="`translate(${polarToCartesian(150, 150, 78, getMidAngle(zKey)).x}, ${polarToCartesian(150, 150, 78, getMidAngle(zKey)).y})`">
                    <!-- Token shadow -->
                    <circle cx="1" cy="2" r="12" fill="rgba(0,0,0,0.5)"/>
                    <!-- Token base (bottle cap style) -->
                    <circle cx="0" cy="0" r="12" fill="#e8c840" stroke="#a07820" stroke-width="2"/>
                    <circle cx="0" cy="0" r="9" fill="none" stroke="#a07820" stroke-width="1" stroke-dasharray="2 2"/>
                    <text x="0" y="3.5" fill="#1a0f00" font-size="9" font-weight="900" text-anchor="middle" font-family="Outfit, sans-serif">
                      {{ store.player.herdSize }}
                    </text>
                  </g>
                  <!-- Park center token -->
                  <g v-if="store.player.position === zKey && zKey === 'park'" transform="translate(150, 150)">
                    <circle cx="0" cy="0" r="12" fill="rgba(0,0,0,0.5)" transform="translate(1,2)"/>
                    <circle cx="0" cy="0" r="12" fill="#e8c840" stroke="#a07820" stroke-width="2"/>
                    <circle cx="0" cy="0" r="9" fill="none" stroke="#a07820" stroke-width="1" stroke-dasharray="2 2"/>
                    <text x="0" y="3.5" fill="#1a0f00" font-size="9" font-weight="900" text-anchor="middle" font-family="Outfit, sans-serif">
                      {{ store.player.herdSize }}
                    </text>
                  </g>
                </g>

                <!-- Decorative cattle silhouettes -->
                <text x="150" y="18" fill="rgba(255,255,255,0.08)" font-size="14" text-anchor="middle">🐄</text>
                <text x="282" y="155" fill="rgba(255,255,255,0.08)" font-size="14" text-anchor="middle">🦁</text>

              </svg>
            </div>
          </div>

          <!-- Header action row (restart / rules) -->
          <div class="flex gap-3 w-full max-w-[420px]">
            <button @click="showRulesModal = true"
                    class="flex-1 py-3 rounded-xl text-black border-0 text-xs font-black uppercase tracking-wider bg-[#c9a84c] hover:bg-[#e8c840] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <HelpCircle class="w-3.5 h-3.5"/>
              {{ lang === 'en' ? 'Rules' : 'Sheria' }}
            </button>
            <button @click="handleRestart"
                    class="flex-1 py-3 rounded-xl text-white border-0 text-xs font-black uppercase tracking-wider bg-[#EF4444] hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <RotateCcw class="w-3.5 h-3.5"/>
              {{ lang === 'en' ? 'Restart' : 'Anza Upya' }}
            </button>
          </div>

        </div>

        <!-- RIGHT COLUMN: Stats & Controls -->
        <div class="lg:col-span-6 space-y-4 w-full">

          <!-- Contextual header row: Season / Year / Weather -->
          <div class="grid grid-cols-3 gap-3">
            <div class="stat-card">
              <span class="stat-label">{{ lang === 'en' ? 'Year' : 'Mwaka' }}</span>
              <span class="stat-value">{{ store.currentYear }} <span class="text-xs text-[#9a8a60]">/3</span></span>
              <span class="stat-sub">{{ lang === 'en' ? 'Season' : 'Msimu' }} {{ (store.turn - 1) % 4 + 1 }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">{{ lang === 'en' ? 'Season' : 'Msimu' }}</span>
              <span class="stat-value text-[#c9a84c] text-sm leading-tight mt-1">
                {{ (lang === 'en' ? store.currentSeasonName.en : store.currentSeasonName.sw).split(' ').slice(0, 2).join(' ') }}
              </span>
            </div>
            <div class="stat-card"
                 :class="{
                   'border-red-600/30 bg-red-950/30': store.weatherType === 'Drought',
                   'border-sky-500/30 bg-sky-950/20': store.weatherType === 'Wet',
                   'border-[#5DC13E]/20 bg-[#5DC13E]/5': store.weatherType === 'Normal'
                 }">
              <span class="stat-label">{{ lang === 'en' ? 'Weather' : 'Hali ya Hewa' }}</span>
              <span class="stat-value text-sm mt-1"
                    :class="{
                      'text-red-400': store.weatherType === 'Drought',
                      'text-sky-300': store.weatherType === 'Wet',
                      'text-[#5DC13E]': store.weatherType === 'Normal'
                    }">
                <span v-if="store.weatherType === 'Drought'">☀️ {{ lang === 'en' ? 'Drought' : 'Ukame' }}</span>
                <span v-else-if="store.weatherType === 'Wet'">🌧️ {{ lang === 'en' ? 'Wet' : 'Mvua' }}</span>
                <span v-else>🌤️ {{ lang === 'en' ? 'Normal' : 'Kawaida' }}</span>
              </span>
            </div>
          </div>

          <!-- Event banner -->
          <div v-if="store.activeEvent"
               class="px-4 py-3 rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/8 flex items-start gap-3"
               style="background: rgba(201,168,76,0.07)">
            <span class="text-xl flex-shrink-0">📢</span>
            <p class="text-sm text-[#e0c87a] font-bold leading-relaxed">
              {{ lang === 'en' ? store.activeEvent.en : store.activeEvent.sw }}
            </p>
          </div>

          <!-- ─── SELECTED ZONE CARD ─── -->
          <div class="zone-card space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full flex-shrink-0" :style="{ background: getSectorFill(selectedZoneId) }"></div>
                <h3 class="text-sm font-black text-white uppercase tracking-wide font-display">
                  {{ lang === 'en' ? store.zones[selectedZoneId].name : store.zones[selectedZoneId].swName }}
                </h3>
              </div>
              <div class="flex items-center gap-1.5">
                <div v-if="store.player.position === selectedZoneId"
                     class="px-2 py-0.5 rounded-full bg-[#e8c840]/15 border border-[#e8c840]/30 text-[10px] font-black text-[#e8c840] uppercase tracking-wider">
                  🐄 {{ lang === 'en' ? 'Herd Here' : 'Mifugo' }}
                </div>
                <div v-if="store.zones[selectedZoneId].isProtected"
                     class="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-[10px] font-black text-red-400 uppercase tracking-wider">
                  🚫 {{ lang === 'en' ? 'Protected' : 'Hifadhi' }}
                </div>
              </div>
            </div>

            <p class="text-sm text-[#b0a080] leading-relaxed">
              {{ lang === 'en' ? store.zones[selectedZoneId].description : store.zones[selectedZoneId].swDescription }}
            </p>

            <!-- Zone stats row -->
            <div class="grid grid-cols-3 gap-2">
              <div class="zone-stat">
                <span class="zone-stat-label">🍃 {{ lang === 'en' ? 'Biomass' : 'Nyasi' }}</span>
                <div class="zone-stat-bar-bg">
                  <div class="zone-stat-bar" :style="{ width: store.zones[selectedZoneId].biomass + '%', background: getBiomassDotColor(selectedZoneId) }"></div>
                </div>
                <span class="zone-stat-value">{{ Math.round(store.zones[selectedZoneId].biomass) }}%</span>
              </div>
              <div class="zone-stat">
                <span class="zone-stat-label">💧 {{ lang === 'en' ? 'Water' : 'Maji' }}</span>
                <span class="text-[12px] font-black mt-1"
                      :class="{
                        'text-sky-300': store.zones[selectedZoneId].water === 'High',
                        'text-yellow-400': store.zones[selectedZoneId].water === 'Medium',
                        'text-red-400': store.zones[selectedZoneId].water === 'Low'
                      }">
                  {{ store.zones[selectedZoneId].water }}
                </span>
              </div>
              <div class="zone-stat">
                <span class="zone-stat-label">⚠️ {{ lang === 'en' ? 'Risk' : 'Hatari' }}</span>
                <span class="text-[12px] font-black mt-1"
                      :class="store.zones[selectedZoneId].isProtected || store.zones[selectedZoneId].isReserve ? 'text-red-400' : 'text-[#5DC13E]'">
                  {{ store.zones[selectedZoneId].isProtected ? (lang === 'en' ? 'Fine' : 'Faini') : (store.zones[selectedZoneId].isReserve ? (lang === 'en' ? 'Seasonal' : 'Msimu') : (lang === 'en' ? 'Safe' : 'Salama')) }}
                </span>
              </div>
            </div>

            <!-- Migrate CTA -->
            <button
              @click="store.migrateAndResolve(selectedZoneId)"
              class="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider active:scale-[0.97] transition-all flex items-center justify-center gap-2 shadow-none border-0 cursor-pointer"
              :class="store.player.position === selectedZoneId 
                ? 'bg-[#5DC13E] text-[#0E110F]'
                : 'text-black shadow-none'"
              :style="store.player.position !== selectedZoneId ? 'background: linear-gradient(135deg, #c9a030 0%, #e8c840 50%, #d4a820 100%)' : ''"
            >
              <ArrowRightLeft class="w-4 h-4"/>
              {{ store.player.position === selectedZoneId ? (lang === 'en' ? 'Graze Here (Stay)' : 'Lisha Hapa (Kaa)') : (lang === 'en' ? 'Migrate & Resolve Turn' : 'Hamisha na Uhesabu Zamu') }}
            </button>
          </div>

          <!-- ─── STATS & ACTIONS ROW ─── -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Herd & Cash -->
            <div class="zone-card space-y-3">
              <h3 class="text-[11px] font-black text-[#9a8a60] uppercase tracking-[0.2em]">{{ lang === 'en' ? 'Herd Stats' : 'Hali ya Kundi' }}</h3>
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg border border-[#5DC13E]/20" style="background: rgba(93,193,62,0.08)">🐄</div>
                <div>
                  <div class="text-[11px] text-white/40 font-black uppercase tracking-widest">{{ lang === 'en' ? 'Herd' : 'Kundi' }}</div>
                  <div class="text-2xl font-black text-white leading-none font-display">{{ store.player.herdSize }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg border border-[#c9a84c]/20" style="background: rgba(201,168,76,0.08)">💰</div>
                <div>
                  <div class="text-[11px] text-white/40 font-black uppercase tracking-widest">KES</div>
                  <div class="text-sm font-black text-[#c9a84c] leading-none font-mono">{{ store.player.cash.toLocaleString() }}</div>
                </div>
              </div>
            </div>

            <!-- Buy / Sell -->
            <div class="zone-card space-y-2">
              <h3 class="text-[11px] font-black text-[#9a8a60] uppercase tracking-[0.2em]">{{ lang === 'en' ? 'Trade Cattle' : 'Biashara ya Ng\'ombe' }}</h3>
              <button @click="store.buyCow" :disabled="store.player.cash < store.COW_BUY_PRICE"
                      class="w-full py-2.5 rounded-xl font-black text-xs bg-[#5DC13E] text-[#0E110F] border-0 uppercase tracking-wide active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer">
                +1 🐄 {{ lang === 'en' ? 'Buy' : 'Nunua' }}
                <span class="block text-[10px] text-[#0E110F]/70 font-medium normal-case">{{ store.COW_BUY_PRICE.toLocaleString() }} KES</span>
              </button>
              <button @click="store.sellCow" :disabled="store.player.herdSize <= 1"
                      class="w-full py-2.5 rounded-xl font-black text-xs bg-[#EF4444] text-white border-0 uppercase tracking-wide active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer">
                -1 🐄 {{ lang === 'en' ? 'Sell' : 'Uza' }}
                <span class="block text-[10px] text-white/80 font-medium normal-case">+{{ store.COW_SELL_PRICE.toLocaleString() }} KES</span>
              </button>
            </div>
          </div>

          <!-- ─── TURN PROGRESS BAR ─── -->
          <div class="zone-card space-y-2">
            <div class="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
              <span class="text-[#9a8a60]">{{ lang === 'en' ? 'Progress' : 'Maendeleo' }}</span>
              <span class="text-white/40">{{ store.turn - 1 }} / {{ store.TOTAL_TURNS }} {{ lang === 'en' ? 'Seasons' : 'Misimu' }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-black/40 border border-white/5 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500"
                   :style="{ width: ((store.turn - 1) / store.TOTAL_TURNS * 100) + '%', background: 'linear-gradient(90deg, #5DC13E, #c9a84c)' }">
              </div>
            </div>
            <div class="flex gap-1">
              <div v-for="s in store.TOTAL_TURNS" :key="s"
                   class="flex-1 h-1 rounded-full transition-all duration-300"
                   :class="s <= store.turn - 1 ? 'bg-[#5DC13E]/60' : 'bg-white/5'"></div>
            </div>
          </div>

          <!-- ─── EVENT LOG ─── -->
          <div class="zone-card space-y-2 h-[200px] flex flex-col">
            <h3 class="text-[11px] font-black text-[#9a8a60] uppercase tracking-[0.2em] flex-shrink-0 border-b border-white/5 pb-2">
              📜 {{ lang === 'en' ? 'Season Log' : 'Kumbukumbu ya Misimu' }}
            </h3>
            <div class="overflow-y-auto flex-1 space-y-1.5 pr-1" style="scrollbar-width: thin; scrollbar-color: rgba(201,168,76,0.3) transparent">
              <div v-for="log in store.logs" :key="log.id"
                   class="text-xs text-[#9a9080] leading-relaxed border-b border-white/[0.03] pb-1">
                {{ lang === 'en' ? log.en : log.sw }}
              </div>
              <div v-if="store.logs.length === 0" class="text-center py-4 text-white/20 text-xs italic">
                {{ lang === 'en' ? 'Tap a zone to migrate your herd.' : 'Gonga eneo kulisha kundi lako.' }}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- ─── RULES MODAL ─── -->
    <Transition name="fade">
      <div v-if="showRulesModal" class="fixed inset-0 z-[200] flex items-end justify-center">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-md" @click="showRulesModal = false"></div>
        <div class="relative w-full max-w-[520px] rounded-t-[32px] overflow-hidden shadow-[0_-20px_60px_rgba(0,0,0,0.8)]"
             style="background: linear-gradient(160deg, #1e1a0a 0%, #0f1a0c 100%); border-top: 1.5px solid rgba(201,168,76,0.2)">
          <!-- Handle -->
          <div class="flex justify-center pt-3 pb-1">
            <div class="w-10 h-1 rounded-full bg-white/20"></div>
          </div>
          <div class="px-5 pb-2 flex items-center justify-between">
            <h3 class="text-base font-black text-white uppercase tracking-wide font-display">
              🌿 {{ lang === 'en' ? 'How to Play Nyasi' : 'Jinsi ya Kucheza Nyasi' }}
            </h3>
            <button @click="showRulesModal = false" class="p-2 rounded-full border-0 bg-[#242A25] text-white/50 hover:bg-[#343D36] hover:text-white active:scale-90 transition-all flex items-center justify-center">
              <X class="w-4 h-4"/>
            </button>
          </div>

          <div class="px-5 pb-8 overflow-y-auto max-h-[60vh] space-y-3 mt-2">
            <div v-for="(rule, idx) in rulesLines" :key="idx"
                 class="flex items-start gap-3 p-3 rounded-2xl"
                 :style="{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.08)' }">
              <div class="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs text-black flex-shrink-0"
                   style="background: linear-gradient(135deg, #c9a030 0%, #e8c840 100%)">
                {{ idx + 1 }}
              </div>
              <p class="text-[13px] text-[#b0a080] leading-relaxed font-medium pt-0.5">{{ rule }}</p>
            </div>

            <!-- Zone legend -->
            <div class="mt-4 space-y-2">
              <h4 class="text-xs font-black text-[#9a8a60] uppercase tracking-wider">{{ lang === 'en' ? 'Zone Guide' : 'Mwongozo wa Maeneo' }}</h4>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="zl in zoneLegend" :key="zl.id"
                     class="flex items-center gap-2 p-2.5 rounded-xl border border-white/5"
                     :style="{ background: zl.bg + '80' }">
                  <div class="w-3 h-3 rounded-full flex-shrink-0" :style="{ background: zl.dot }"></div>
                  <span class="text-xs font-bold" :style="{ color: zl.text }">{{ lang === 'en' ? zl.en : zl.sw }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ─── VICTORY / GAMEOVER OVERLAY ─── -->
    <Transition name="fade">
      <div v-if="store.gameStatus === 'victory' || store.gameStatus === 'gameover'"
           class="fixed inset-0 z-[250] flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/85 backdrop-blur-xl"></div>

        <div class="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)] text-center"
             :style="store.gameStatus === 'victory'
               ? 'background: linear-gradient(160deg, #1a2e10 0%, #0e1a08 100%); border: 1.5px solid rgba(93,193,62,0.3)'
               : 'background: linear-gradient(160deg, #2a0e0e 0%, #1a0808 100%); border: 1.5px solid rgba(239,68,68,0.3)'">

          <!-- Decorative top accent -->
          <div class="h-1 w-full" :style="store.gameStatus === 'victory' ? 'background: linear-gradient(90deg, #5DC13E, #c9a84c, #5DC13E)' : 'background: linear-gradient(90deg, #ef4444, #dc2626)'"></div>

          <div class="p-7 space-y-5">
            <div class="text-5xl">{{ store.gameStatus === 'victory' ? '🏆' : '💀' }}</div>

            <div class="space-y-2">
              <h2 class="text-2xl font-black uppercase tracking-tight text-white font-display">
                {{ store.gameStatus === 'victory' ? (lang === 'en' ? 'Victory!' : 'Ushindi!') : (lang === 'en' ? 'Game Over' : 'Mchezo Umekwisha') }}
              </h2>
              <p class="text-sm leading-relaxed font-medium"
                 :class="store.gameStatus === 'victory' ? 'text-[#a0c880]' : 'text-red-300/70'">
                {{ store.gameStatus === 'victory'
                  ? (lang === 'en' ? 'Congratulations! You successfully guided your herd through 3 years in Amboseli.' : 'Hongera! Umefanikisha kuongoza kundi lako kwa miaka 3 Amboseli.')
                  : (lang === 'en' ? 'Your herd was depleted. Try a different grazing strategy!' : 'Kundi lako limeisha. Jaribu mbinu mpya ya kulisha!') }}
              </p>
            </div>

            <!-- Final stats -->
            <div class="rounded-2xl border border-white/5 overflow-hidden" style="background: rgba(0,0,0,0.3)">
              <div class="grid grid-cols-3 divide-x divide-white/5">
                <div class="p-3 text-center">
                  <div class="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">{{ lang === 'en' ? 'Herd' : 'Kundi' }}</div>
                  <div class="text-2xl font-black text-white font-display">{{ store.player.herdSize }}</div>
                  <div class="text-[10px] text-white/30">🐄</div>
                </div>
                <div class="p-3 text-center">
                  <div class="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">KES</div>
                  <div class="text-base font-black text-[#c9a84c] font-mono">{{ Math.round(store.player.cash / 1000) }}K</div>
                  <div class="text-[10px] text-white/30">💰</div>
                </div>
                <div class="p-3 text-center">
                  <div class="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">{{ lang === 'en' ? 'Seasons' : 'Misimu' }}</div>
                  <div class="text-2xl font-black text-white font-display">{{ store.turn - 1 }}</div>
                  <div class="text-[10px] text-white/30">/ {{ store.TOTAL_TURNS }}</div>
                </div>
              </div>
            </div>

            <button @click="handleRestart"
                    class="w-full py-4 rounded-2xl font-black border-0 text-sm uppercase tracking-[0.2em] active:scale-[0.97] transition-all shadow-none"
                    :style="store.gameStatus === 'victory'
                      ? 'background: linear-gradient(135deg, #5DC13E, #4caa2e); color: white'
                      : 'background: linear-gradient(135deg, #c9a030, #e8c840); color: black'">
              🔄 {{ lang === 'en' ? 'Play Again' : 'Cheza Tena' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useNyasiGameStore } from '../stores/nyasiGame'
import { HelpCircle, RotateCcw, X, ArrowRightLeft } from 'lucide-vue-next'

const lang = inject('lang')
const isDark = inject('isDark')
const store = useNyasiGameStore()

const showRulesModal = ref(false)
const selectedZoneId = ref('grazing')

// ── Board Geometry ──
const outerSectors = [
  { id: 'grazing',   start: 0,   end: 72  },
  { id: 'swamp',     start: 72,  end: 144 },
  { id: 'foothills', start: 144, end: 216 },
  { id: 'reserve',   start: 216, end: 288 },
  { id: 'perimeter', start: 288, end: 360 },
]

const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const rad = (angleInDegrees - 90) * Math.PI / 180.0
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

const getSectorPath = (cx, cy, r1, r2, startAngle, endAngle) => {
  const s1 = polarToCartesian(cx, cy, r2, startAngle)
  const e1 = polarToCartesian(cx, cy, r2, endAngle)
  const s2 = polarToCartesian(cx, cy, r1, startAngle)
  const e2 = polarToCartesian(cx, cy, r1, endAngle)
  const arc = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${s1.x} ${s1.y} A ${r2} ${r2} 0 ${arc} 1 ${e1.x} ${e1.y} L ${e2.x} ${e2.y} A ${r1} ${r1} 0 ${arc} 0 ${s2.x} ${s2.y} Z`
}

const getMidAngle = (zoneId) => {
  const s = outerSectors.find(s => s.id === zoneId)
  return s ? (s.start + s.end) / 2 : 0
}

// ── Zone Colors (earthy, natural, board-faithful) ──
const zoneColors = {
  grazing:   { base: '#4a7d2a', mid: '#3d6e22', low: '#6b3a1a' },
  swamp:     { base: '#2a6e5a', mid: '#1f5a44', low: '#1f3d3a' },
  foothills: { base: '#5a7030', mid: '#4a6020', low: '#4a3010' },
  reserve:   { base: '#8a7030', mid: '#6a5020', low: '#5a3010' },
  perimeter: { base: '#6a5a28', mid: '#5a4818', low: '#4a2a10' },
  park:      { base: '#2d6e45', mid: '#1f5a30', low: '#163d20' },
}

const getSectorFill = (zoneId) => {
  const z = store.zones[zoneId]
  if (!z) return '#1B1F1C'
  const c = zoneColors[zoneId] || { base: '#3a3a2a', mid: '#2a2a1a', low: '#1a1a0a' }
  if (z.biomass > 60) return c.base
  if (z.biomass >= 20) return c.mid
  return c.low
}

const getBiomassDotColor = (zoneId) => {
  const b = store.zones[zoneId]?.biomass ?? 0
  if (b > 60) return '#5DC13E'
  if (b >= 30) return '#c9a84c'
  if (b >= 10) return '#e07030'
  return '#e03030'
}

// ── Zone Labels (two-line for SVG) ──
const getZoneLabel = (zoneId, langRef) => {
  const labels = {
    grazing:   { en: ['Grazing', 'Lands'],    sw: ['Malisho', 'ya Jamii'] },
    swamp:     { en: ['Swamp',  ''],          sw: ['Dimbwi', 'la Maji']  },
    foothills: { en: ['Foothills', 'Kilim.'], sw: ['Chini', 'ya Mlima']  },
    reserve:   { en: ['Dry Season', 'Reserve'],sw: ['Hifadhi', 'Kiangazi']},
    perimeter: { en: ['Park', 'Perimeter'],   sw: ['Ukingo', 'Hifadhi']  },
  }
  const l = labels[zoneId] || { en: [zoneId, ''], sw: [zoneId, ''] }
  const lines = langRef.value === 'sw' ? l.sw : l.en
  return { line1: lines[0], line2: lines[1] }
}

// ── Zone Legend Data ──
const zoneLegend = [
  { id: 'grazing',   en: 'Grazing Lands', sw: 'Malisho ya Jamii', bg: 'rgba(74,125,42,0.2)',  dot: '#4a7d2a', text: '#8dc85a' },
  { id: 'swamp',     en: 'Swamp',         sw: 'Dimbwi',           bg: 'rgba(42,110,90,0.2)',  dot: '#2a6e5a', text: '#5abaa0' },
  { id: 'foothills', en: 'Foothills',     sw: 'Chini ya Mlima',   bg: 'rgba(90,112,48,0.2)',  dot: '#5a7030', text: '#9ab058' },
  { id: 'reserve',   en: 'Dry Reserve',   sw: 'Hifadhi Kiangazi', bg: 'rgba(138,112,48,0.2)', dot: '#8a7030', text: '#c9a84c' },
  { id: 'perimeter', en: 'Park Perimeter',sw: 'Ukingo Hifadhi',   bg: 'rgba(106,90,40,0.2)',  dot: '#6a5a28', text: '#b09040' },
  { id: 'park',      en: 'Amboseli Park', sw: 'Hifadhi ya Ambo.', bg: 'rgba(45,110,69,0.2)',  dot: '#2d6e45', text: '#5DC13E' },
]

// ── Actions ──
const selectZone = (id) => { selectedZoneId.value = id }

const handleRestart = () => {
  store.initGame()
  selectedZoneId.value = 'grazing'
}

// ── Computed rules text ──
const rulesLines = computed(() => {
  const raw = lang.value === 'sw'
    ? ['Chagua eneo kwenye ramani.', 'Gonga "Hamisha na Uhesabu Zamu" ili kulisha kundi lako, kubadilisha hali ya hewa, na kuendeleza msimu.', 'Lisha kwenye maeneo yenye rangi ya kijani. Maeneo nyekundu/kahawia huleta njaa!', 'Nunua au Uza Ng\'ombe kulingana na mabadiliko ya msimu.', 'Hifadhi ya Amboseli ina nyasi nyingi lakini kulisha huko ni marufuku — walinzi wanatoza faini.']
    : ['Select a zone on the map by tapping it.', 'Tap "Migrate & Resolve Turn" to move your herd, earn milk income, trigger weather events, and advance the season.', 'Keep your herd in lush green zones. Moving to barren red/brown zones causes starvation and cattle loss!', 'Buy or Sell cattle to adapt your herd size to seasonal conditions.', 'Amboseli Park has abundant grass but illegal grazing risks heavy ranger fines.']
  return raw
})
</script>

<style scoped>
/* Root font */
.nyasi-root {
  font-family: 'Inter', system-ui, sans-serif;
}
.font-display { font-family: 'Outfit', sans-serif; }

/* Stat cards */
.stat-card {
  padding: 10px 12px;
  border-radius: 16px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(201,168,76,0.1);
  display: flex;
  flex-direction: column;
  gap: 2px;
  backdrop-filter: blur(8px);
}
.stat-label {
  font-size: 11px;
  font-weight: 900;
  color: #7a6a40;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}
.stat-value {
  font-size: 20px;
  font-weight: 900;
  color: white;
  line-height: 1.1;
}
.stat-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.25);
  font-weight: 700;
}

/* Zone card */
.zone-card {
  padding: 14px 16px;
  border-radius: 20px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(201,168,76,0.12);
  backdrop-filter: blur(10px);
}

/* Zone stat pill */
.zone-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 6px;
  border-radius: 12px;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.04);
}
.zone-stat-label {
  font-size: 10px;
  font-weight: 900;
  color: #7a6a40;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}
.zone-stat-bar-bg {
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  background: rgba(255,255,255,0.05);
  overflow: hidden;
}
.zone-stat-bar {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease;
}
.zone-stat-value {
  font-size: 13px;
  font-weight: 900;
  color: white;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
