<template>
  <section class="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none transition-colors duration-700"
         :class="themeStore.isDark ? 'bg-[#050e07]' : 'bg-slate-50'"
         :style="themeStore.isDark ? 'background: linear-gradient(180deg, #050e07 0%, #060d1a 50%, #050e07 100%)' : 'background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 50%, #f8fafc 100%)'" />
    <div class="absolute inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 60%)" />

    <div class="relative z-10 w-full max-w-md">
      <div class="rounded-2xl border border-black/5 dark:border-white/8 overflow-hidden bg-white/80 dark:bg-[#0a160c]/80 backdrop-blur-md shadow-2xl p-8 fade-up">

        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
               style="background: rgba(251,176,58,0.1); border: 1px solid rgba(251,176,58,0.2);">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-[#FBB03A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 class="font-display font-bold text-3xl text-slate-900 dark:text-white mb-2">Welcome Back</h2>
          <p class="text-slate-500 dark:text-neutral-400 text-sm">Sign in to access your dashboard</p>
        </div>

        <div v-if="isLocked" class="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
          <div class="text-2xl mb-1">🔒</div>
          <p class="text-red-400 font-semibold text-sm">Too many attempts</p>
          <p class="text-red-400/80 text-xs mt-1">Please wait <strong>{{ lockCountdown }}s</strong> before trying again.</p>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-4" novalidate>

          <BaseInput
            label="Email Address"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            maxlength="254"
            :error="fieldErrors.email"
          />

          <BaseInput
            label="Password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            placeholder="••••••••"
            maxlength="128"
            :error="fieldErrors.password"
          >
            <template #suffix>
              <button type="button" @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 transition-colors">
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
              </button>
            </template>
          </BaseInput>

          <div v-if="attemptWarning" class="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs text-center">
            {{ attemptWarning }}
          </div>

          <div v-if="errorMsg" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
            {{ errorMsg }}
          </div>

          <BaseButton type="submit" :loading="loading" variant="primary" class="mt-2">
            Sign In
          </BaseButton>
        </form>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import { validateEmail, validatePassword, createRateLimiter } from '../utils/sanitize'
import { useThemeStore } from '../stores/theme'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const props = defineProps({ mode: { type: String, default: 'login' } })

const router  = useRouter()
const themeStore = useThemeStore()

const email        = ref('')
const password     = ref('')
const showPassword = ref(false)
const loading      = ref(false)
const errorMsg     = ref('')
const fieldErrors  = ref({ email: '', password: '' })

const limiter      = createRateLimiter(5, 10 * 60 * 1000)
const isLocked     = ref(false)
const lockCountdown = ref(0)
let countdownTimer  = null

function startCountdown() {
  isLocked.value = true
  countdownTimer = setInterval(() => {
    lockCountdown.value = limiter.secondsRemaining()
    if (lockCountdown.value <= 0) {
      isLocked.value = false
      clearInterval(countdownTimer)
    }
  }, 1000)
}

onBeforeUnmount(() => clearInterval(countdownTimer))

const attemptWarning = computed(() => {
  const remaining = limiter.isLocked() ? 0 : null
  return null
})

const passwordStrength = computed(() => {
  const pw = password.value
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/\d/.test(pw) && /[a-zA-Z]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  return score
})

const strengthColor = computed(() => {
  const c = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
  return c[passwordStrength.value - 1] || 'bg-white/10'
})

const strengthTextColor = computed(() => {
  const c = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400']
  return c[passwordStrength.value - 1] || 'text-white/30'
})

const strengthLabel = computed(() => {
  const l = ['Weak', 'Fair', 'Good', 'Strong']
  return l[passwordStrength.value - 1] || ''
})

const toggleMode = () => {
  fieldErrors.value = { email: '', password: '' }
  errorMsg.value = ''
  if (props.mode === 'login') router.push('/signup')
  else router.push('/login')
}

const handleSubmit = async () => {
  if (isLocked.value) return
  if (!limiter.allow()) {
    lockCountdown.value = limiter.secondsRemaining()
    startCountdown()
    return
  }

  fieldErrors.value = { email: '', password: '' }
  errorMsg.value    = ''

  const emailCheck = validateEmail(email.value)
  if (!emailCheck.valid) {
    fieldErrors.value.email = emailCheck.message
    return
  }

  if (props.mode === 'signup') {
    const pwCheck = validatePassword(password.value)
    if (!pwCheck.valid) {
      fieldErrors.value.password = pwCheck.message
      return
    }
  }

  loading.value = true
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value.trim().toLowerCase(),
      password: password.value,
    })
    if (error) throw error
    limiter.reset()
    router.push('/dashboard')
  } catch (err) {
    const msg = err.message || ''
    if (msg.includes('Invalid login credentials')) {
      errorMsg.value = 'Incorrect email or password. Please try again.'
    } else if (msg.includes('Email not confirmed')) {
      errorMsg.value = 'Please confirm your email address before signing in.'
    } else {
      errorMsg.value = msg || 'Something went wrong. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-up {
  animation: fadeUp 0.6s ease-out forwards;
}
@keyframes fadeUp {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
