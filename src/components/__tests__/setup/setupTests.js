import { vi } from 'vitest'
import 'intersection-observer'

global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() {
        return null;
    }
    unobserve() {
        return null;
    }
    disconnect() {
        return null;
    }
};

// Leaflet Mock
vi.mock('leaflet', () => ({
    default: {
        map: vi.fn(() => ({
            setView: vi.fn().mockReturnThis(),
            remove: vi.fn(),
            addTo: vi.fn().mockReturnThis(),
            panTo: vi.fn(),
            on: vi.fn(),
            fire: vi.fn()
        })),
        tileLayer: vi.fn(() => ({
            addTo: vi.fn()
        })),
        marker: vi.fn(() => ({
            bindPopup: vi.fn().mockReturnThis(),
            on: vi.fn().mockReturnThis(),
            addTo: vi.fn(),
            setIcon: vi.fn(),
            fire: vi.fn()
        })),
        icon: vi.fn(),
        layerGroup: vi.fn(() => ({
            clearLayers: vi.fn(),
            addLayer: vi.fn(),
            addTo: vi.fn()
        }))
    },
    map: vi.fn(() => ({
        setView: vi.fn().mockReturnThis(),
        remove: vi.fn(),
        addTo: vi.fn().mockReturnThis(),
        panTo: vi.fn(),
        on: vi.fn(),
        fire: vi.fn()
    })),
    tileLayer: vi.fn(() => ({
        addTo: vi.fn()
    })),
    marker: vi.fn(() => ({
        bindPopup: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
        addTo: vi.fn(),
        setIcon: vi.fn(),
        fire: vi.fn()
    })),
    icon: vi.fn(),
    layerGroup: vi.fn(() => ({
        clearLayers: vi.fn(),
        addLayer: vi.fn(),
        addTo: vi.fn()
    }))
}));
