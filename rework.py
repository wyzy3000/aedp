import re
import sys

file_path = 'src/views/DashboardOneHealth.vue'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Header text
content = re.sub(
    r'<div class="mb-10 fade-up">.*?</div>\n\s*<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">',
    r'<div class="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">',
    content,
    flags=re.DOTALL
)

# 2. Extract Area Info
area_info_match = re.search(r'(<div v-if="viewMode === \'info\'".*?)\n\s*<form v-else', content, re.DOTALL)
if not area_info_match:
    print("Could not find Area Info block")
    sys.exit(1)

area_info_html = area_info_match.group(1)

# Modify Area Info to fit Left Column and add edit/delete
area_info_html = area_info_html.replace(
    '''<div v-if="viewMode === 'info'" class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-7 xl:p-10 relative min-h-[500px]">''',
    '''<div class="rounded-2xl border border-white/10 bg-[#0a160c] p-6 shadow-xl flex-1 flex flex-col relative h-[500px] overflow-y-auto custom-scroll">'''
)
area_info_html = area_info_html.replace('text-forest-400', 'text-[#Fbb03a]')
area_info_html = area_info_html.replace('bg-forest-900/30', 'bg-[#Fbb03a]/20')
area_info_html = area_info_html.replace('border-forest-500/30', 'border-[#Fbb03a]/30')

# Inject correct user-facing Edit / Delete buttons that replace the feature from "My Map Points"
edit_buttons_html = """
                    </div>
                 </h2>
                 <div v-if="selectedInfo && user" class="flex items-center gap-2 mb-4 justify-end">
                    <button type="button" @click="editEntry(selectedInfo)" class="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg font-semibold transition-colors text-white">Edit Selection</button>
                    <button type="button" @click="deleteEntry(selectedInfo.id)" class="text-xs border border-red-500/20 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-semibold transition-colors">Delete Selection</button>
                 </div>
"""
area_info_html = re.sub(r'</div>\n\s*</h2>', edit_buttons_html, area_info_html)


# 3. Replace My Map Points with the modified Area Info
my_map_points_pattern = r'<div class="rounded-2xl border border-white/10 bg-\[#0a160c\] p-6 shadow-xl flex-1 flex flex-col">.*?</div>\n\s*</div>\n\s*</div>\n\s*</div>\n\s*<div class="lg:col-span-7 fade-up" style="animation-delay: 100ms;">'

content = re.sub(
    my_map_points_pattern,
    f'{area_info_html}\n        </div>\n\n        <div class="fade-up" style="animation-delay: 100ms;">',
    content,
    flags=re.DOTALL
)

# 4. Remove right-column toggle buttons and Area info block that is still there
content = re.sub(
    r'<div class="flex justify-end mb-4">.*?<form v-else ',
    '<form ',
    content,
    flags=re.DOTALL
)

# 5. Fix giant submit button with a smaller orange one, and general cleanup
old_btn = '''<button type="submit"
                    class="mt-8 w-full py-4 rounded-xl font-bold text-white transition-all duration-300 bg-forest-600 hover:bg-forest-500 shadow-lg shadow-forest-900/50 flex items-center justify-center gap-2 text-lg">
              <span class="material-symbols-outlined">{{ isEditing ? 'save_as' : 'cloud_upload' }}</span>
              {{ isEditing ? 'Update Map Point' : 'Publish to Map' }}
            </button>'''

new_btn = '''<div class="flex justify-end mt-8">
              <button type="submit"
                      class="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 bg-[#Fbb03a] hover:bg-[#e09e34] shadow-lg shadow-[#Fbb03a]/25 flex items-center justify-center gap-2 text-sm">
                <span class="material-symbols-outlined">{{ isEditing ? 'save_as' : 'check_circle' }}</span>
                {{ isEditing ? 'Save Changes' : 'Submit Survey' }}
              </button>
            </div>'''
content = content.replace(old_btn, new_btn)

# Ensure form title matches
content = content.replace('Area Information Survey', 'Area Information')

# Fix selection styling issues: make border focus orange
content = content.replace('focus:border-forest-500', 'focus:border-[#Fbb03a]')
content = content.replace('focus:border-forest-400', 'focus:border-[#Fbb03a]')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
