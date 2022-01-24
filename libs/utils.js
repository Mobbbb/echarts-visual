function getVH(length) {
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    if (clientHeight) return length
    return length * clientHeight / RENDER_CONFIG.BASE_HEIGHT
}

function getVW(length) {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (clientWidth) return length
    return length * clientWidth / RENDER_CONFIG.BASE_WIDTH
}

function getRequestDate() {
    return new Date(+ new Date() + 8 * 60 * 60 * 1000).toISOString().split('T')[0].split('-').join('')
}
