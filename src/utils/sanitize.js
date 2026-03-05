export function sanitizeText(input, maxLength = 2000) {
    if (typeof input !== 'string') return ''
    return input
        .replace(/<[^>]*>/g, '')
        .replace(/[<>&"'`]/g, (c) => ({
            '<': '&lt;', '>': '&gt;',
            '&': '&amp;', '"': '&quot;',
            "'": '&#x27;', '`': '&#x60;'
        }[c]))
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .trim()
        .slice(0, maxLength)
}

export function validateEmail(email) {
    const trimmed = (email || '').trim()
    if (!trimmed) return { valid: false, message: 'Email address is required.' }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(trimmed)) return { valid: false, message: 'Please enter a valid email address.' }
    if (trimmed.length > 254) return { valid: false, message: 'Email address is too long.' }
    return { valid: true, message: '' }
}

export function validatePassword(password) {
    if (!password) return { valid: false, message: 'Password is required.' }
    if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters.' }
    if (!/\d/.test(password)) return { valid: false, message: 'Password must contain at least one number.' }
    if (password.length > 128) return { valid: false, message: 'Password is too long (max 128 characters).' }
    return { valid: true, message: '' }
}

export function createRateLimiter(maxAttempts = 5, windowMs = 10 * 60 * 1000) {
    let attempts = 0
    let lockedUntil = 0

    return {
        allow() {
            const now = Date.now()
            if (now < lockedUntil) return false
            if (now >= lockedUntil && lockedUntil !== 0) {
                attempts = 0
                lockedUntil = 0
            }
            attempts++
            if (attempts >= maxAttempts) {
                lockedUntil = now + windowMs
            }
            return true
        },

        reset() {
            attempts = 0
            lockedUntil = 0
        },

        secondsRemaining() {
            const remaining = lockedUntil - Date.now()
            return remaining > 0 ? Math.ceil(remaining / 1000) : 0
        },

        isLocked() {
            return Date.now() < lockedUntil
        }
    }
}
