import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DroughtStory from '../DroughtStory.vue'

describe('DroughtStory.vue TestSuite', () => {

    it('renders the header correctly', () => {
        const wrapper = mount(DroughtStory, {
            global: {
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })

        // Assert main header titles
        expect(wrapper.text()).toContain('Recent Droughts in Kajiado')
        expect(wrapper.text()).toContain('Kiangazi Katika Kaunti')
    })

    it('renders the correct number of drought timeline events', () => {
        const wrapper = mount(DroughtStory, {
            global: {
                provide: {
                    lang: 'en',
                    isDark: false
                }
            },
            // Optionally mock lucide-vue-next components if they cause issues
            global: {
                stubs: ['Satellite'],
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })

        // Grab all rendered cards for timeline events
        const eventCards = wrapper.findAll('.glass-card')
        // We expect 4 event cards based on timelineEvents data + 1 extra card at the bottom for Data source (Total = 5)
        expect(eventCards.length).toBe(5)

        // Test that specific event titles render
        expect(wrapper.text()).toContain('Worst Drought in 40 Years – La Niña Driver')

        // Test that the class !text-black was applied to the phase tags
        const firstTagPill = wrapper.find('.tag-pill')
        expect(firstTagPill.classes()).toContain('!text-black')
    })
})
