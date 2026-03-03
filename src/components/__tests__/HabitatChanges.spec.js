import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HabitatChanges from '../HabitatChanges.vue'

describe('HabitatChanges.vue TestSuite', () => {

    it('renders the header and context properly', () => {
        const wrapper = mount(HabitatChanges, {
            global: {
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })

        // Check if the title text exists
        expect(wrapper.text()).toContain('Habitat Dynamics')
        // Check if default year context renders
        expect(wrapper.text()).toContain('2023')
    })

    it('changes selected year when clicking a year button', async () => {
        const wrapper = mount(HabitatChanges, {
            global: {
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })

        // Find the button for year 1993 (should be the first button matching the class containing "1993" text)
        const buttons = wrapper.findAll('.year-btn')
        const button1993 = buttons.find(b => b.text().includes('1993'))

        // Assert we found it
        expect(button1993).toBeDefined()

        // Click it
        await button1993.trigger('click')

        // Find if the text has dynamically updated to the 1993 context
        expect(wrapper.text()).toContain('1993')
        // Ensure the clicked button now has the 'selected' class
        expect(button1993.classes()).toContain('selected')
    })
})
