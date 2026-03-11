<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
      {{ label }}
    </label>
    <div class="relative">
      <input
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 outline-none transition-all"
        :class="error ? 'border-red-400 focus:ring-red-400/30' : 'border-slate-200 dark:border-white/10 focus:ring-[#FBB03A]/50 focus:border-[#FBB03A]'"
      />
      <slot name="suffix" />
    </div>
    <p v-if="error" class="text-red-400 text-xs mt-1.5 flex items-center gap-1">
      <span>⚠</span> {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  error: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>
