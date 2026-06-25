import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CommunityDiaries from '../CommunityDiaries.vue'

vi.mock('../../supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: [], error: null })
        }))
    }
}))

describe('CommunityDiaries.vue TestSuite', () => {
    it('renders the header and fallback video title correctly', () => {
        const wrapper = mount(CommunityDiaries, {
            global: {
                provide: { lang: 'en', isDark: false }
            }
        })

        expect(wrapper.text()).toContain('Community Diaries')
        expect(wrapper.text()).toContain('Main Marsh Herd Movement')
        expect(wrapper.text()).toContain('Kimana Section')
    })
})
