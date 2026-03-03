import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WeatherForecast from '../WeatherForecast.vue'

describe('WeatherForecast.vue TestSuite', () => {

    it('renders the header correctly', async () => {
        const wrapper = mount(WeatherForecast, {
            global: {
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })

        await wrapper.vm.$nextTick()
        // Assert main header titles
        expect(wrapper.text()).toContain('Weather Forecast')
        expect(wrapper.text()).toContain('Hali ya anga · Open-Meteo')
    })

    it('displays mock offline air temperature translations correctly', async () => {
        const wrapper = mount(WeatherForecast, {
            global: {
                stubs: ['Thermometer', 'Wind', 'CloudRain', 'Sun', 'Calendar', 'Droplets', 'Sunrise', 'Sunset'],
                provide: {
                    lang: 'sw',
                    isDark: false
                }
            }
        })

        // Force component state to not be loading and provide mock data to trigger the visual rendering
        wrapper.vm.isLoading = false
        wrapper.vm.weatherData = { current: { temperature_2m: 35, wind_speed_10m: 15 } }
        await wrapper.vm.$nextTick()

        // It should translate Air temperature to Joto la hewa
        expect(wrapper.text()).toContain('Joto la hewa')
        // It should translate Wind speed to Kasi ya upepo
        expect(wrapper.text()).toContain('Kasi ya upepo')
    })
})
