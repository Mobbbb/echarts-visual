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

const genVMin = (length) => {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

    if (!clientWidth || !clientHeight) return length
    if (clientHeight > clientWidth) {
        return length * clientWidth / CONFIG.BASE_WIDTH
    } else {
        return length * clientHeight / CONFIG.BASE_HEIGHT
    }
}

const getRequestDate = () => {
    return new Date(+ new Date() + 8 * 60 * 60 * 1000).toISOString().split('T')[0].split('-').join('')
}

const createHiDPICanvas = (w, h, ratio) => {
    let PIXEL_RATIO = (() => {
        let c = document.createElement('canvas')
        let ctx = c.getContext('2d')
        let dpr = window.devicePixelRatio || 1
        let bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1

        return dpr / bsr
    })()

    if (!ratio) ratio = PIXEL_RATIO
    
    let canvas = document.createElement('canvas')
    canvas.width = w * ratio
    canvas.height = h * ratio
    canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0)
    return canvas
}

const getTextSize = (text, fontSize) => {
    let textDom = document.createElement('span'), width, height
    textDom.innerHTML = text
    textDom.style.position = 'absolute'
    textDom.style.color = 'transparent'
    textDom.style.lineHeight = 'normal'
    textDom.style.fontSize = fontSize
    
    document.body.appendChild(textDom)
    width = textDom.clientWidth
    height = textDom.clientHeight

    return {
        height,
        width,
    }
}
