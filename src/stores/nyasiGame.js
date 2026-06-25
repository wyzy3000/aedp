import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNyasiGameStore = defineStore('nyasiGame', () => {
  const TOTAL_TURNS = 12 // 3 Years (4 seasons each) - quick and simple
  const MILK_INCOME = 1000 // KES per cow per season
  const COW_BUY_PRICE = 8000 // KES
  const COW_SELL_PRICE = 5000 // KES

  // Game Status
  const gameStatus = ref('playing') // idle, playing, victory, gameover
  const turn = ref(1)
  const weatherType = ref('Normal') // Drought, Normal, Wet
  const activeEvent = ref(null) // Event text for current turn
  const logs = ref([])

  // Player Stats
  const player = ref({
    herdSize: 10,
    cash: 10000,
    position: 'grazing',
    cattleHealth: 100
  })

  // Zones representation
  const zones = ref({
    grazing: {
      id: 'grazing',
      name: 'Grazing Lands',
      swName: 'Malisho ya Jamii',
      biomass: 60,
      maxBiomass: 100,
      water: 'Medium',
      isReserve: false,
      isProtected: false,
      description: 'Communal grazing lands. Free and safe, but grass is eaten quickly.',
      swDescription: 'Malisho ya kawaida ya jamii. Ni bure na salama, lakini nyasi huliwa haraka.'
    },
    swamp: {
      id: 'swamp',
      name: 'Swamp',
      swName: 'Dimbwi la Maji',
      biomass: 90,
      maxBiomass: 100,
      water: 'High',
      isReserve: false,
      isProtected: false,
      description: 'Permanent wetland. Always has water and grass, but high disease risk during wet seasons.',
      swDescription: 'Chanzo cha maji cha kudumu. Nyasi ni nyingi, lakini kuna hatari ya magonjwa wakati wa mvua.'
    },
    foothills: {
      id: 'foothills',
      name: 'Foothills',
      swName: 'Chini ya Mlima',
      biomass: 75,
      maxBiomass: 100,
      water: 'Medium',
      isReserve: false,
      isProtected: false,
      description: 'Fertile hills near Mt. Kilimanjaro. Great grass, but wildlife may eat it.',
      swDescription: 'Milima yenye rutuba chini ya Mlima Kilimanjaro. Nyasi nzuri, lakini wanyama pori wanaweza kuzila.'
    },
    reserve: {
      id: 'reserve',
      name: 'Reserve',
      swName: 'Hifadhi ya Kiangazi',
      biomass: 80,
      maxBiomass: 100,
      water: 'Medium',
      isReserve: true,
      isProtected: false,
      description: 'Reserved grass for droughts. Grazing here in Wet seasons results in a fine.',
      swDescription: 'Malisho yaliyotengwa kwa ajili ya ukame. Kulisha hapa wakati wa mvua kuna faini.'
    },
    park: {
      id: 'park',
      name: 'Amboseli Park',
      swName: 'Hifadhi ya Amboseli',
      biomass: 100,
      maxBiomass: 100,
      water: 'High',
      isReserve: false,
      isProtected: true,
      description: 'Protected national park. Abundant grass, but illegal grazing risks heavy ranger fines.',
      swDescription: 'Hifadhi ya taifa. Nyasi ni tele, lakini kulisha huko ni marufuku na kuna doria ya walinzi.'
    },
    perimeter: {
      id: 'perimeter',
      name: 'Perimeter',
      swName: 'Ukingo wa Hifadhi',
      biomass: 50,
      maxBiomass: 100,
      water: 'Low',
      isReserve: false,
      isProtected: false,
      description: 'Buffer zone around the park. Low water, moderate grass.',
      swDescription: 'Ukanda wa mpakani mwa hifadhi. Maji ni machache, nyasi za wastani.'
    }
  })

  // Computed Values
  const currentYear = computed(() => Math.floor((turn.value - 1) / 4) + 1)
  const currentSeasonIndex = computed(() => (turn.value - 1) % 4)
  
  const currentSeasonName = computed(() => {
    const names = [
      { en: 'Wet Season (Long Rains)', sw: 'Msimu wa Mvua Nyingi' },
      { en: 'Cool Dry Season', sw: 'Msimu wa Kiangazi Baridi' },
      { en: 'Wet Season (Short Rains)', sw: 'Msimu wa Mvua Chache' },
      { en: 'Hot Dry Season', sw: 'Msimu wa Kiangazi Moto' }
    ]
    return names[currentSeasonIndex.value]
  })

  const cowSellPrice = computed(() => {
    const factor = player.value.cattleHealth / 100
    return Math.max(2000, Math.round(COW_SELL_PRICE * factor))
  })

  const milkIncome = computed(() => {
    const factor = player.value.cattleHealth / 100
    return Math.max(200, Math.round(MILK_INCOME * factor))
  })

  // Helper to add log
  function addLog(enText, swText) {
    logs.value.unshift({
      id: Date.now() + Math.random(),
      en: `[Year ${currentYear.value} S${currentSeasonIndex.value + 1}] ${enText}`,
      sw: `[Mwaka ${currentYear.value} M${currentSeasonIndex.value + 1}] ${swText}`
    })
    if (logs.value.length > 25) logs.value.pop()
  }

  // Initialize Game
  function initGame() {
    gameStatus.value = 'playing'
    turn.value = 1
    activeEvent.value = null
    weatherType.value = 'Normal'
    logs.value = []

    player.value = {
      herdSize: 10,
      cash: 10000,
      position: 'grazing',
      cattleHealth: 100
    }

    // Reset biomass
    zones.value.grazing.biomass = 60
    zones.value.swamp.biomass = 90
    zones.value.foothills.biomass = 75
    zones.value.reserve.biomass = 80
    zones.value.park.biomass = 100
    zones.value.perimeter.biomass = 50

    addLog('Game started. Tap a zone on the map to migrate your herd.', 'Mchezo umeanza. Gonga eneo kwenye ramani ili kulisha kundi lako.')
  }

  // One-click migration & turn resolution
  function migrateAndResolve(zoneId) {
    if (gameStatus.value !== 'playing' || !zones.value[zoneId]) return

    player.value.position = zoneId
    const targetZone = zones.value[zoneId]

    // 1. Roll Turn Weather & Event
    let rolledWeather = 'Normal'
    let eventText = null
    let eventType = null

    const randVal = Math.random()
    if (randVal < 0.2) {
      rolledWeather = 'Drought'
      eventType = 'drought'
      eventText = {
        en: '⚠️ Drought: Pasture dried up in all zones!',
        sw: '⚠️ Ukame: Nyasi zimekauka katika maeneo yote!'
      }
    } else if (randVal > 0.8) {
      rolledWeather = 'Wet'
      eventType = 'wet'
      eventText = {
        en: '⚠️ Good Rains: Pastures grew rapidly!',
        sw: '⚠️ Mvua Nzuri: Nyasi zimeongezeka kwa kasi!'
      }
    }

    // Random simple seasonal risks
    const randEvent = Math.random()
    if (randEvent < 0.2 && !eventText) {
      eventType = 'disease'
      eventText = {
        en: '⚠️ Foot-rot outbreak in damp Swamp!',
        sw: '⚠️ Mlipuko wa ugonjwa wa kuoza kwato Dimbwini!'
      }
    } else if (randEvent > 0.8 && !eventText) {
      eventType = 'patrol'
      eventText = {
        en: '⚠️ Rangers patrolling protected Park!',
        sw: '⚠️ Walinzi wanafanya doria Hifadhini!'
      }
    }

    weatherType.value = rolledWeather
    activeEvent.value = eventText

    if (eventText) {
      addLog(`Event: ${eventText.en}`, `Tukio: ${eventText.sw}`)
    }

    // 2. Consume Grass
    targetZone.biomass = Math.max(0, targetZone.biomass - (player.value.herdSize * 2.5))

    // 3. Calculate Health changes
    let healthChange = 0
    let healthLogEn = ''
    let healthLogSw = ''

    const isWetSeason = (currentSeasonIndex.value === 0 || currentSeasonIndex.value === 2)

    if (rolledWeather === 'Drought') {
      if (zoneId === 'swamp') {
        healthChange = -5
        healthLogEn = 'Drought dried pastures, but Swamp water kept cattle stable (-5% health).'
        healthLogSw = 'Ukame ulikausha malisho, lakini maji ya Dimbwi yalisaidia mifugo (-5% afya).'
      } else {
        healthChange = -15
        healthLogEn = 'Severe drought! Lack of green pasture reduced cattle health (-15%).'
        healthLogSw = 'Ukame mkali! Ukosefu wa malisho mabichi ulipunguza afya ya mifugo (-15%).'
      }
    } else if (zoneId === 'swamp' && isWetSeason) {
      healthChange = -25
      healthLogEn = 'Cattle got foot-rot and waterborne sickness in the wet swamp (-25% health).'
      healthLogSw = 'Mifugo ilipata ugonjwa wa kuoza kwato na magonjwa ya majini dimbwi lenye unyevu (-25% afya).'
    } else if (targetZone.water === 'Low') {
      healthChange = -10
      healthLogEn = 'Buffer zone lacks sufficient water and nutrition (-10% health).'
      healthLogSw = 'Eneo la ukingo halina maji na lishe ya kutosha (-10% afya).'
    } else if (targetZone.biomass < 15) {
      healthChange = -15
      healthLogEn = 'Starvation! Almost no grass left in this zone (-15% health).'
      healthLogSw = 'Njaa! Hakuna nyasi zilizobaki katika eneo hili (-15% afya).'
    } else if (targetZone.biomass > 60) {
      healthChange = 10
      healthLogEn = 'Abundant fresh grass! Cattle health improved (+10%).'
      healthLogSw = 'Nyasi nyingi mbichi! Afya ya mifugo imeimarika (+10%).'
    } else {
      healthChange = 5
      healthLogEn = 'Decent pasture and water kept cattle healthy (+5%).'
      healthLogSw = 'Malisho na maji ya kutosha yaliweka mifugo katika hali nzuri (+5%).'
    }

    player.value.cattleHealth = Math.max(0, Math.min(100, player.value.cattleHealth + healthChange))
    if (healthLogEn) {
      addLog(healthLogEn, healthLogSw)
    }

    // 4. Resolve Grazing Outcomes
    if (targetZone.biomass < 15) {
      const death = Math.max(1, Math.floor(player.value.herdSize * 0.15))
      player.value.herdSize = Math.max(0, player.value.herdSize - death)
      addLog(`Cattle starved! ${targetZone.name} has no grass. Lost ${death} cattle.`, `Ng'ombe wamekosa chakula! Malisho ya ${targetZone.swName} yameisha. Umepoteza ng'ombe ${death}.`)
    } else {
      // Well fed: Milk income based on dynamic milk value
      const milkRev = player.value.herdSize * milkIncome.value
      player.value.cash += milkRev
      addLog(`Earned ${milkRev} KES from milk. Cattle fed in ${targetZone.name}.`, `Umejipatia KES ${milkRev} kutokana na maziwa. Ng'ombe wamelishwa ${targetZone.swName}.`)

      // Birth chance (only if healthy!)
      if (player.value.herdSize >= 5 && player.value.cattleHealth >= 70 && Math.random() > 0.5) {
        player.value.herdSize += 1
        addLog('A healthy calf was born! Herd size +1.', 'Ndama mpya amezaliwa! Ukubwa wa kundi +1.')
      }
    }

    // 5. Weakness / Sickness mortality risks
    if (player.value.cattleHealth < 40 && player.value.herdSize > 0) {
      let dieChance = 0.2
      if (player.value.cattleHealth < 20) dieChance = 0.4
      if (player.value.cattleHealth === 0) dieChance = 1.0

      if (Math.random() < dieChance) {
        const sickDead = player.value.cattleHealth === 0 ? Math.min(player.value.herdSize, 2) : 1
        player.value.herdSize = Math.max(0, player.value.herdSize - sickDead)
        addLog(`Lost ${sickDead} cattle due to severe weakness/disease (Health: ${player.value.cattleHealth}%).`, `Kundi limepoteza ng'ombe ${sickDead} kutokana na udhaifu/ugonjwa mkali (Afya: ${player.value.cattleHealth}%).`)
      }
    }

    // 6. Resolve Penalties
    if (eventType === 'disease' && zoneId === 'swamp') {
      player.value.herdSize = Math.max(0, player.value.herdSize - 1)
      addLog('Lost 1 cow to disease outbreak in the Swamp.', 'Umepoteza ng\'ombe 1 kutokana na ugonjwa Dimbwini.')
    }

    if (targetZone.isProtected) {
      const fineProb = (eventType === 'patrol') ? 0.8 : 0.3
      if (Math.random() < fineProb) {
        const fineCost = player.value.herdSize * 1000
        if (player.value.cash >= fineCost) {
          player.value.cash -= fineCost
          addLog(`Rangers caught you in Park! Fined ${fineCost} KES.`, `Walinzi wamekukamata Hifadhini! Umetozwa faini ya KES ${fineCost}.`)
        } else {
          player.value.herdSize = Math.max(0, player.value.herdSize - 1)
          player.value.cash = 0
          addLog('Rangers caught you in Park! No cash, 1 cow confiscated.', 'Walinzi wamekukamata Hifadhini! Huna hela, ng\'ombe 1 ametwaliwa.')
        }
      }
    }

    if (targetZone.isReserve && isWetSeason) {
      player.value.cash = Math.max(0, player.value.cash - 1000)
      addLog('Fined 1,000 KES for grazing in Reserve during Wet Season.', 'Umetozwa faini ya KES 1,000 kwa kulisha Hifadhini msimu wa mvua.')
    }

    // 7. Recover biomass for next turn
    Object.keys(zones.value).forEach(k => {
      const z = zones.value[k]
      let recovery = 20
      if (rolledWeather === 'Drought') recovery = 5
      if (rolledWeather === 'Wet') recovery = 35
      z.biomass = Math.min(z.maxBiomass, z.biomass + recovery)
    })

    // 8. Advance Turn
    turn.value += 1
    checkGameEnd()
  }

  function buyCow() {
    if (player.value.cash < COW_BUY_PRICE) return false
    player.value.herdSize += 1
    player.value.cash -= COW_BUY_PRICE
    // Averaging health of bought cow (100% health)
    player.value.cattleHealth = Math.round(((player.value.herdSize - 1) * player.value.cattleHealth + 100) / player.value.herdSize)
    addLog(`Bought 1 cow for ${COW_BUY_PRICE} KES.`, `Umenunua ng'ombe 1 kwa KES ${COW_BUY_PRICE}.`)
    return true
  }

  function sellCow() {
    if (player.value.herdSize <= 1) return false
    player.value.herdSize -= 1
    player.value.cash += cowSellPrice.value
    addLog(`Sold 1 cow for ${cowSellPrice.value} KES.`, `Umeuza ng'ombe 1 kwa KES ${cowSellPrice.value}.`)
    return true
  }

  function checkGameEnd() {
    if (player.value.herdSize <= 0) {
      gameStatus.value = 'gameover'
      addLog('Game Over: Your herd was fully depleted.', 'Mchezo Umekwisha: Kundi lako lote limeisha.')
      return
    }

    if (turn.value > TOTAL_TURNS) {
      gameStatus.value = 'victory'
      addLog('Victory! You successfully survived 3 years in Amboseli.', 'Ushindi! Umefanikiwa kuishi miaka 3 huko Amboseli.')
    }
  }

  // Auto-initialize game state
  initGame()

  return {
    TOTAL_TURNS,
    COW_BUY_PRICE,
    COW_SELL_PRICE,
    MILK_INCOME,

    gameStatus,
    turn,
    weatherType,
    activeEvent,
    logs,
    player,
    zones,

    currentYear,
    currentSeasonIndex,
    currentSeasonName,
    cowSellPrice,
    milkIncome,

    initGame,
    migrateAndResolve,
    buyCow,
    sellCow
  }
})
