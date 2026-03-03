import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OutlookReports from '../OutlookReports.vue'

describe('OutlookReports.vue TestSuite', () => {

    it('renders the header correctly', () => {
        const wrapper = mount(OutlookReports, {
            global: {
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })

        // Assert main header titles
        expect(wrapper.text()).toContain('Amboseli Outlook Report')
    })

    it('displays the mock data metrics and translates properly to swahili', () => {
        const wrapper = mount(OutlookReports, {
            global: {
                provide: {
                    lang: 'sw',
                    isDark: false
                }
            },
            // Optionally mock lucide-vue-next components if they cause issues
            global: {
                stubs: ['CloudRain', 'Droplets', 'Wind', 'ThermometerSun'],
                provide: {
                    lang: 'sw',
                    isDark: false
                }
            }
        })

        // Assert Swahili header title mapped locally
        expect(wrapper.text()).toContain('Taarifa za Amboseli')

        // The metric conditions are bound to the `conditions` computed data array.
        // Let's verify that a specific condition label (like Rainfall in Swahili -> Mvua) renders on the DOM.
        expect(wrapper.text()).toContain('Mvua')
    })
})
