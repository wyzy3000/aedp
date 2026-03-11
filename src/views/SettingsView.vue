<template>
  <div class="px-6 lg:px-10 py-8 max-w-4xl mx-auto animation-fade-in pb-24">
    
    <div class="mb-10">
      <h1 class="text-4xl font-extrabold tracking-tight text-white mb-3">Account Settings</h1>
      <p class="text-white/50 text-base">Manage your security credentials and view your system status.</p>
    </div>

    <div class="bg-[#1C1F22] border border-white/10 rounded-2xl p-6 mb-6">
      <h2 class="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <Clock class="w-4 h-4 text-white/40" /> 
        System Time
      </h2>
      <div class="text-white text-lg font-medium tabular-nums">
        {{ formattedTime }}
      </div>
      <div class="text-stone-400 text-sm mt-1">
        {{ formattedDate }}
      </div>
    </div>

    <div class="bg-[#1C1F22] border border-white/10 rounded-2xl p-6 mb-6">
      <h2 class="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <UserCircle class="w-4 h-4 text-white/40" /> 
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
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40 outline-none cursor-not-allowed text-sm"
          />
          <p class="text-[10px] text-white/30 mt-2 uppercase tracking-wide">Your email address cannot be changed as it serves as your universal identifier.</p>
        </div>

        <div class="flex-1 md:max-w-xs">
          <label class="block text-xs font-semibold text-stone-400 mb-2 uppercase tracking-wide">
            Assigned Role
          </label>
          <div class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-semibold outline-none text-sm">
            {{ userProfile?.role || 'Loading...' }}
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#1C1F22] border border-white/10 rounded-2xl p-6 mb-6">
      <h2 class="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <ShieldCheck class="w-4 h-4 text-white/40" /> 
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
          <label class="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em]">
            New Password
          </label>
          <input 
            v-model="passwordForm.newPassword"
            type="password" 
            placeholder="Min. 8 characters"
            required
            class="w-full bg-[#1C1F22] border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none transition-all text-sm"
          />
        </div>

        <div>
          <label class="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em]">
            Confirm New Password
          </label>
          <input 
            v-model="passwordForm.confirmPassword"
            type="password" 
            placeholder="Retype new password"
            required
            class="w-full bg-[#1C1F22] border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white placeholder:text-white/20 outline-none transition-all text-sm"
          />
        </div>

        <div class="pt-2">
          <button 
            type="submit" 
            :disabled="updating"
            class="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-sm uppercase tracking-widest"
          >
            <span v-if="updating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ updating ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="userProfile?.role === 'Admin'" class="bg-[#1C1F22] border border-white/10 rounded-2xl p-6 mt-10">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xs font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
          <Users class="w-4 h-4" /> 
          User Management (Admin)
        </h2>
        <span class="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
          {{ allUsers.length }} Total Users
        </span>
      </div>
      
      <div v-if="loadingUsers" class="flex items-center gap-2 text-white/30 text-xs py-10 justify-center">
        <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        Loading secure user data...
      </div>
      
      <div v-else class="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
        <table class="w-full text-left text-xs text-white/70">
          <thead class="text-[10px] uppercase bg-white/5 text-white/40 border-b border-white/10">
            <tr>
              <th scope="col" class="px-5 py-4 font-bold tracking-widest">User Profile</th>
              <th scope="col" class="px-5 py-4 font-bold tracking-widest">Status</th>
              <th scope="col" class="px-5 py-4 font-bold tracking-widest">Current Role</th>
              <th scope="col" class="px-5 py-4 font-bold tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="u in allUsers" :key="u.id" class="hover:bg-white/[0.04] transition-colors group">
              <td class="px-5 py-4">
                <div class="flex flex-col">
                  <span class="font-bold text-white text-sm">{{ u.email || 'N/A' }}</span>
                  <span class="text-[10px] text-white/20 font-mono mt-0.5 truncate max-w-[150px]">{{ u.id }}</span>
                </div>
              </td>
              <td class="px-5 py-4">
                <span :class="[
                  'px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border',
                  u.status === 'Activated' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                ]">
                  {{ u.status || 'Pending' }}
                </span>
              </td>
              <td class="px-5 py-4">
                <select 
                  v-model="u.role"
                  @change="updateRole(u.id, u.role)"
                  class="bg-[#1C1F22] border border-white/10 text-white text-xs rounded-lg focus:border-white/30 block w-full p-2 outline-none appearance-none cursor-pointer"
                  :disabled="updatingRole === u.id"
                >
                  <option value="Admin">Admin</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Resource Assessor">Resource Assessor</option>
                  <option value="User">User</option>
                </select>
              </td>
              <td class="px-5 py-4 text-right">
                <button @click="deleteUser(u.id, u.email)" 
                  class="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  title="Hard Delete User">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-10 pt-10 border-t border-white/10">
        <h3 class="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <UserPlus class="w-4 h-4 text-white/40" />
          Invite New Contributor
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-1">
            <input v-model="newUserEmail" type="email" placeholder="Email Address"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-white/30 outline-none transition-all" />
          </div>
          <div class="md:col-span-1">
            <input v-model="newUserPassword" type="password" placeholder="Temp Password"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-white/30 outline-none transition-all" />
          </div>
          <div class="md:col-span-1">
            <select v-model="newUserRole"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 outline-none transition-all appearance-none cursor-pointer">
              <option value="User">Standard User</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Resource Assessor">Resource Assessor</option>
              <option value="Admin">System Admin</option>
            </select>
          </div>
          <div class="md:col-span-1">
            <button @click="addUser" :disabled="addingUser"
              class="w-full h-full bg-[#FBB03A] text-white hover:bg-[#e09e34] disabled:opacity-50 disabled:cursor-not-allowed transition-all py-3 rounded-xl font-bold text-xs uppercase tracking-widest">
              {{ addingUser ? 'Inviting...' : 'Invite User' }}
            </button>
          </div>
        </div>
        <div class="mt-4 flex flex-col gap-2">
           <p v-if="addUserError" class="text-red-400 text-[10px] font-bold uppercase tracking-wider bg-red-400/10 p-2 rounded-lg border border-red-400/20 w-fit flex items-center gap-2">
             <AlertCircle class="w-3 h-3" /> {{ addUserError }}
           </p>
           <p v-if="addUserSuccess" class="text-green-400 text-[10px] font-bold uppercase tracking-wider bg-green-400/10 p-2 rounded-lg border border-green-500/20 w-fit flex items-center gap-2">
             <CheckCircle2 class="w-3 h-3" /> {{ addUserSuccess }}
           </p>
        </div>
        <p class="text-white/30 text-[10px] mt-4 uppercase tracking-[0.15em] leading-relaxed">The user will receive a system invitation. Once they sign in for the first time, their status will flip from "Pending" to "Activated". Role is assigned immediately upon registration.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { Clock, UserCircle, ShieldCheck, AlertCircle, CheckCircle2, Users, UserPlus, Trash2 } from 'lucide-vue-next'
import { supabase } from '../supabase'

// Admin operations are handled server-side via the admin-user-action Edge Function.
// The service_role key is stored as a Deno secret and never reaches the browser.

const user = inject('user')
const userProfile = ref(null)
const allUsers = ref([])
const loadingUsers = ref(false)
const updatingRole = ref(null)

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
    // Use maybeSingle() to avoid 406 when no profile row exists yet
    let { data } = await supabase.from('profiles').select('*').eq('id', user.value.id).maybeSingle()
    
    // If no profile exists, create one (first-time admin bootstrap)
    if (!data) {
      const { data: upserted } = await supabase.from('profiles').upsert({
        id: user.value.id,
        email: user.value.email,
        role: user.value.email === 'wycliff.ontiri@gmail.com' ? 'Admin' : 'User',
        status: 'Activated'
      }).select().maybeSingle()
      data = upserted
    }
    
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

const newUserEmail    = ref('')
const newUserPassword = ref('')
const newUserRole     = ref('User')
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

  try {
    const { data, error } = await supabase.functions.invoke('admin-user-action', {
      body: {
        action: 'createUser',
        email: newUserEmail.value.trim().toLowerCase(),
        password: newUserPassword.value,
        role: newUserRole.value
      }
    })

    if (error || data?.error) {
      addUserError.value = data?.error || error.message
    } else {
      addUserSuccess.value = `User ${newUserEmail.value} added and activated successfully.`
      newUserEmail.value    = ''
      newUserPassword.value = ''
      await fetchUsers()
    }
  } catch (e) {
    addUserError.value = 'Network error: ' + e.message
  }
  addingUser.value = false
}

const deleteUser = async (userId, email) => {
  if (userId === user.value.id) {
    alert('You cannot delete your own admin account.')
    return
  }
  if (!confirm(`Permanently delete ${email}? This cannot be undone.`)) return

  try {
    const { data, error } = await supabase.functions.invoke('admin-user-action', {
      body: { action: 'deleteUser', userId }
    })
    if (error || data?.error) {
      alert('Failed to delete user: ' + (data?.error || error.message))
    } else {
      await fetchUsers()
    }
  } catch (e) {
    alert('Network error: ' + e.message)
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

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

/* Fix native dropdown option text visibility on dark backgrounds */
select option {
  background-color: #1C1F22;
  color: #ffffff;
}
</style>
