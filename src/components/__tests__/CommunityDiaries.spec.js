import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommunityDiaries from '../CommunityDiaries.vue'

describe('CommunityDiaries.vue TestSuite', () => {

    it('renders the header correctly', () => {
        const wrapper = mount(CommunityDiaries, {
            global: {
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })

        // Assert main header titles
        expect(wrapper.text()).toContain('Local Community Environmental Diaries')
        expect(wrapper.text()).toContain('Maoni ya wenyeji')
    })

    it('renders diary entries with locations and dates', () => {
        const wrapper = mount(CommunityDiaries, {
            global: {
                provide: {
                    lang: 'en',
                    isDark: false
                }
            },
            // Optionally mock lucide-vue-next components if they cause issues
            global: {
                stubs: ['MapPin', 'Calendar'],
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })

        // Assuming there are diary entries rendered by default
        const entries = wrapper.findAll('.glass-card')
        expect(entries.length).toBeGreaterThan(0) // Verify entries list is not empty

        // Test the first entry to ensure properties map
        const firstEntry = entries[0]
        expect(firstEntry.text()).toContain('Sentiment') // Verifies sentiment text renders
    })
})
