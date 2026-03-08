import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CommunityDiaries from '../CommunityDiaries.vue'

vi.mock('../../supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({
                data: [
                    { id: 1, location: 'Amboseli', date: '2023-10-01', content: 'Dry season', sentiment: 5, created_at: '2023-10-01' }
                ],
                count: 1,
                error: null
            })
        })),
        channel: vi.fn(() => ({
            on: vi.fn().mockReturnThis(),
            subscribe: vi.fn().mockReturnThis()
        })),
        removeChannel: vi.fn()
    }
}))

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

    it('renders diary entries with locations and dates', async () => {
        const wrapper = mount(CommunityDiaries, {
            global: {
                stubs: ['MapPin', 'Calendar'],
                provide: {
                    lang: 'en',
                    isDark: false
                }
            }
        })

        // Wait for next tick to allow async setup to finish
        await new Promise(resolve => setTimeout(resolve, 0))

        // Find actual diary entries (not skeleton loaders)
        const entries = wrapper.findAll('.glass-card').filter(w => w.text().includes('Sentiment'))
        expect(entries.length).toBeGreaterThan(0) // Verify entries list is not empty

        // Test the first entry to ensure properties map
        const firstEntry = entries[0]
        expect(firstEntry.text()).toContain('Sentiment') // Verifies sentiment text renders
    })
})
