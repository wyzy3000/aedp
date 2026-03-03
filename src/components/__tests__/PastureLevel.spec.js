import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PastureLevel from '../PastureLevel.vue'

describe('PastureLevel.vue TestSuite', () => {

    it('renders the header correctly', () => {
        const wrapper = mount(PastureLevel, {
            global: {
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })

        // Assert main header titles
        expect(wrapper.text()).toContain('The Grass Story of Amboseli')
    })

    it('displays the default year and allows toggling to a different year', async () => {
        const wrapper = mount(PastureLevel, {
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

        // Assert default renders text about the recent year summary
        // Looking at the SVG context render, 2024 displays baseline 75 NDVI text
        expect(wrapper.text()).toContain('2024')
        expect(wrapper.text()).toContain('NDVI')

        // Find the button for year 2021
        const buttons = wrapper.findAll('.year-btn')
        const button2021 = buttons.find(b => b.text().includes('2021'))

        // Assert we found it
        expect(button2021).toBeDefined()

        // Click it to switch contexts
        await button2021.trigger('click')

        // Find if the text has dynamically updated to the 2021 context
        expect(wrapper.text()).toContain('2021')
        // Ensure the clicked button now has the 'selected' class marking state
        expect(button2021.classes()).toContain('selected')
    })
})
