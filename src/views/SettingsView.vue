<template>
  <div class="px-6 lg:px-10 py-8 max-w-4xl mx-auto animation-fade-in pb-24">
    
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-white mb-2">Account Settings</h1>
      <p class="text-stone-400 text-sm">Manage your security credentials and view your system status.</p>
    </div>

    <!-- Live Date and Time -->
    <div class="bg-[#1C1C1E] border border-white/5 shadow-2xl rounded-2xl p-6 mb-6">
      <h2 class="text-sm font-semibold text-stone-300 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Clock class="w-4 h-4 text-[#FBB03A]" /> 
        System Time
      </h2>
      <div class="text-white text-lg font-medium tabular-nums">
        {{ formattedTime }}
      </div>
      <div class="text-stone-400 text-sm mt-1">
        {{ formattedDate }}
      </div>
    </div>

    <!-- Account Details (Read Only) -->
    <div class="bg-[#1C1C1E] border border-white/5 shadow-2xl rounded-2xl p-6 mb-6">
      <h2 class="text-sm font-semibold text-stone-300 uppercase tracking-widest mb-4 flex items-center gap-2">
        <UserCircle class="w-4 h-4 text-[#FBB03A]" /> 
        Account Identification
      </h2>
      
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1">
          <label class="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">
            Universal Identifier (Email)
          </label>
          <input 
            type="email" 
            :value="user?.email" 
            readonly
            disabled
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-stone-400 outline-none cursor-not-allowed"
          />
          <p class="text-xs text-stone-500 mt-2">Your email address cannot be changed as it serves as your universal identifier.</p>
        </div>

        <div class="flex-1 md:max-w-xs">
          <label class="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">
            Assigned Role
          </label>
          <div class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#FBB03A] font-semibold outline-none">
            {{ userProfile?.role || 'Loading...' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Security: Change Password -->
    <div class="bg-[#1C1C1E] border border-white/5 shadow-2xl rounded-2xl p-6">
      <h2 class="text-sm font-semibold text-stone-300 uppercase tracking-widest mb-4 flex items-center gap-2">
        <ShieldCheck class="w-4 h-4 text-[#FBB03A]" /> 
        Security
      </h2>
      
      <form @submit.prevent="updatePassword" class="space-y-5">
        
        <div v-if="errorMsg" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2 items-center">
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          {{ errorMsg }}
        </div>

        <div v-if="successMsg" class="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex gap-2 items-center">
          <CheckCircle2 class="w-4 h-4 flex-shrink-0" />
          {{ successMsg }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wide">
            New Password
          </label>
          <input 
            v-model="passwordForm.newPassword"
            type="password" 
            placeholder="Min. 8 characters"
            required
            class="w-full bg-white/5 border border-white/10 focus:border-[#FBB03A] focus:ring-1 focus:ring-[#FBB03A] rounded-xl px-4 py-3 text-white placeholder:text-stone-600 outline-none transition-all"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wide">
            Confirm New Password
          </label>
          <input 
            v-model="passwordForm.confirmPassword"
            type="password" 
            placeholder="Retype new password"
            required
            class="w-full bg-white/5 border border-white/10 focus:border-[#FBB03A] focus:ring-1 focus:ring-[#FBB03A] rounded-xl px-4 py-3 text-white placeholder:text-stone-600 outline-none transition-all"
          />
        </div>

        <div class="pt-2">
          <button 
            type="submit" 
            :disabled="updating"
            class="bg-[#FBB03A] hover:bg-[#e09e34] text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="updating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ updating ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </form>
    </div>

    <!-- User Management (Admins Only) -->
    <div v-if="userProfile?.role === 'Admin'" class="bg-[#1C1C1E] border border-[#FBB03A]/20 shadow-2xl rounded-2xl p-6 mt-6">
      <h2 class="text-sm font-semibold text-[#FBB03A] uppercase tracking-widest mb-4 flex items-center gap-2">
        <Users class="w-4 h-4" /> 
        User Management (Admin)
      </h2>
      
      <div v-if="loadingUsers" class="text-stone-400 text-sm">Loading users...</div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm text-stone-300">
          <thead class="text-xs uppercase bg-white/5 text-stone-400 border-b border-white/10">
            <tr>
              <th scope="col" class="px-4 py-3 font-semibold">Email</th>
              <th scope="col" class="px-4 py-3 font-semibold">Current Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in allUsers" :key="u.id" class="border-b border-white/5 hover:bg-white/[0.02]">
              <td class="px-4 py-3 font-medium">{{ u.email || 'N/A' }}</td>
              <td class="px-4 py-3">
                <select 
                  v-model="u.role"
                  @change="updateRole(u.id, u.role)"
                  class="bg-[#2A2A2E] border border-white/10 text-white text-sm rounded-lg focus:ring-[#FBB03A] focus:border-[#FBB03A] block w-full p-2 outline-none"
                  :disabled="updatingRole === u.id"
                >
                  <option value="Admin">Admin</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Resource Assessor">Resource Assessor</option>
                  <option value="User">User</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add New User (Admin) -->
      <div class="mt-6 pt-6 border-t border-white/5">
        <h3 class="text-sm font-semibold text-stone-300 uppercase tracking-widest mb-4 flex items-center gap-2">
          <UserPlus class="w-4 h-4 text-[#FBB03A]" />
          Add New User
        </h3>
        <div class="flex flex-col sm:flex-row gap-3">
          <input v-model="newUserEmail" type="email" placeholder="user@example.com"
            class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:ring-2 focus:ring-[#FBB03A]/40 focus:border-[#FBB03A] outline-none transition-all" />
          <input v-model="newUserPassword" type="password" placeholder="Temporary password (min 8 chars)"
            class="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:ring-2 focus:ring-[#FBB03A]/40 focus:border-[#FBB03A] outline-none transition-all" />
          <button @click="addUser" :disabled="addingUser"
            class="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#FBB03A] hover:bg-[#e09e34] disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap">
            {{ addingUser ? 'Creating...' : 'Create Account' }}
          </button>
        </div>
        <p v-if="addUserError" class="text-red-400 text-xs mt-2">{{ addUserError }}</p>
        <p v-if="addUserSuccess" class="text-green-400 text-xs mt-2">{{ addUserSuccess }}</p>
        <p class="text-stone-500 text-xs mt-2">The user will receive a confirmation email. You can assign their role above after they appear in the list.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { Clock, UserCircle, ShieldCheck, AlertCircle, CheckCircle2, Users, UserPlus } from 'lucide-vue-next'
import { supabase } from '../supabase'

const user = inject('user')
const userProfile = ref(null)
const allUsers = ref([])
const loadingUsers = ref(false)
const updatingRole = ref(null)

// ─── Live Clock Logic ─────────────────────────────────────────
const currentTime = ref(new Date())
let timer = null

const formattedTime = ref('')
const formattedDate = ref('')

const updateClock = () => {
  const now = new Date()
  formattedTime.value = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true 
  })
  formattedDate.value = now.toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  })
}

onMounted(async () => {
  updateClock()
  timer = setInterval(updateClock, 1000)

  if (user.value) {
    // Fetch current user's profile to check role
    const { data } = await supabase.from('profiles').select('*').eq('id', user.value.id).single()
    userProfile.value = data

    if (data?.role === 'Admin') {
      await fetchUsers()
    }
  }
})

const fetchUsers = async () => {
  loadingUsers.value = true
  const { data, error } = await supabase.from('profiles').select('*').order('email')
  if (data) allUsers.value = data
  loadingUsers.value = false
}

const updateRole = async (userId, newRole) => {
  updatingRole.value = userId
  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
  updatingRole.value = null
  if (error) {
    alert('Failed to update role: ' + error.message)
    await fetchUsers()
  }
}

// ─── Add User Logic (Admin only) ─────────────────────────────
const newUserEmail    = ref('')
const newUserPassword = ref('')
const addingUser      = ref(false)
const addUserError    = ref('')
const addUserSuccess  = ref('')

const addUser = async () => {
  addUserError.value   = ''
  addUserSuccess.value = ''
  if (!newUserEmail.value || !newUserPassword.value) {
    addUserError.value = 'Please enter both email and a temporary password.'
    return
  }
  if (newUserPassword.value.length < 8) {
    addUserError.value = 'Password must be at least 8 characters.'
    return
  }
  addingUser.value = true
  const { data, error } = await supabase.auth.signUp({
    email: newUserEmail.value.trim().toLowerCase(),
    password: newUserPassword.value,
  })
  if (error) {
    addUserError.value = error.message
  } else {
    addUserSuccess.value = `Account created for ${newUserEmail.value}. They will receive a confirmation email.`
    newUserEmail.value    = ''
    newUserPassword.value = ''
    await fetchUsers()
  }
  addingUser.value = false
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// ─── Password Update Logic ────────────────────────────────────
const passwordForm = ref({
  newPassword: '',
  confirmPassword: ''
})

const updating = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const updatePassword = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  if (passwordForm.value.newPassword.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters long.'
    return
  }

  updating.value = true

  const { error } = await supabase.auth.updateUser({
    password: passwordForm.value.newPassword
  })

  updating.value = false

  if (error) {
    errorMsg.value = error.message || 'Failed to update password. Please try again later.'
  } else {
    successMsg.value = 'Your password has been successfully updated.'
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
  }
}
</script>

<style scoped>
.animation-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
