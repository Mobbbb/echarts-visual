function getRequestDate() {
    return new Date(+ new Date() + 8 * 60 * 60 * 1000).toISOString().split('T')[0].split('-').join('')
}