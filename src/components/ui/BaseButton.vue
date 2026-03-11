<template>
  <button :type="type" :disabled="disabled || loading"
          :class="[baseClasses, variantClasses, { 'opacity-70 cursor-not-allowed': disabled || loading }]">
    <span v-if="loading" class="w-4 h-4 rounded-full border-2 animate-spin"
          :class="spinnerClasses" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  variant: { type: String, default: 'primary' } // 'primary' | 'secondary' | 'danger'
})

const baseClasses = 'w-full py-3.5 rounded-xl font-semibold transition-all duration-300 flex justify-center items-center gap-2 text-sm shadow-none outline-none'

const variantClasses = computed(() => {
  if (props.variant === 'primary') return 'bg-[#FBB03A] hover:bg-[#e09e34] text-white border border-[#FBB03A]'
  if (props.variant === 'secondary') return 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
  if (props.variant === 'danger') return 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20'
  return ''
})

const spinnerClasses = computed(() => {
  if (props.variant === 'secondary') return 'border-white/30 border-t-white'
  return 'border-white/30 border-t-white'
})
</script>
