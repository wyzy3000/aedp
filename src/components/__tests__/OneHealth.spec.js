import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OneHealth from '../OneHealth.vue'

describe('OneHealth.vue TestSuite', () => {

    it('renders English text by default', () => {
        const wrapper = mount(OneHealth, {
            global: {
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })
        expect(wrapper.text()).toContain('Explore the One Health Dashboard')
    })

    it('renders Kiswahili text when lang is sw', () => {
        const wrapper = mount(OneHealth, {
            global: {
                provide: {
                    lang: 'sw',
                    isDark: false
                }
            }
        })
        expect(wrapper.text()).toContain('Angalia Dashibodi ya Afya Moja')
    })
})
