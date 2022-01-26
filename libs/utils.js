const genVH = (length) => {
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    if (!clientHeight) return length
    return length * clientHeight / CONFIG.BASE_HEIGHT
}

const genVW = (length) => {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (!clientWidth) return length
    return length * clientWidth / CONFIG.BASE_WIDTH
}

const getRequestDate = () => {
    return new Date(+ new Date() + 8 * 60 * 60 * 1000).toISOString().split('T')[0].split('-').join('')
}
