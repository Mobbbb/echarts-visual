$(function() {
    App = new VisualViewport(CONSTANT)
})

function Visual(data) {
    if (location.protocol.indexOf('file' > -1)) {
        this.baseUrl = FETCH_API.DEV
    } else if (this.getBaseUrl()) {
        this.baseUrl = this.getBaseUrl()
    } else {
        this.baseUrl = ''
    }

    this.channel = ENV // 唯一标识符
    this.constantConfig = data

    this.timer = null // 轮询定时器
    this.updateTime = 1 // 更新数据的时间，01:00 - 01:59
    this.timerInterval = 1 * 60 * 60 * 1000 // 更新数据的轮询周期，1h
    this.queue = [] // 请求队列
    this.cacheDateList = [] // 数据缓存日期
    this.requestDate = getRequestDate() // 请求数据的日期

    // render title
    renderTitle()
    // render box wrapper
    renderContentBox()
    // render dom
    this.renderCardDom()
    // request data and re-render
    this.updateAllCardDom()
    // polling api once an hour
    this.pollingApiByTiming()
}

Visual.prototype.renderCardDom = function() {
    // card module render start
    Object.keys(this.constantConfig).forEach((key) => {
        if (this.constantConfig[key].type === RENDER_TYPE.CHART_RENDER) {
            renderChartModule(this.constantConfig[key])
        } else {
            renderOtherModule(this.constantConfig[key])
        }
    })
}

Visual.prototype.updateAllCardDom = async function() {
    this.queue = []
    Object.keys(this.constantConfig).forEach((key) => {
        this.queue.push(this.updateConfigByKey(key))
    })
    await Promise.all(this.queue)
}

/**
 * @description 根据key请求对应接口，更新渲染数据，并渲染对应模块
 * @param {String} key 
 * @returns 
 */
Visual.prototype.updateCardDomByKey = async function(key) {
    // request
    await this.updateConfigByKey(key)
    // render card item
    if (this.constantConfig[key].type === RENDER_TYPE.CHART_RENDER) {
        renderChartModule(this.constantConfig[key])
    } else {
        renderOtherModule(this.constantConfig[key])
    }
}

/**
 * @description 根据key更新<constantConfig>.key.data
 * @param {String} key 
 * @returns {*}
 */
Visual.prototype.updateConfigByKey = async function(key) {
    let { fetchConfig = {}, data } = this.constantConfig[key] || {}
    let { url, params = {}, dataProcessHandle } = fetchConfig
    let result = null

    if (url) {
        result = await httpRequest(this.baseUrl + url, params)
        result = this.cacheResultByKey(key, result)
        if (dataProcessHandle) {
            this.constantConfig[key].data = dataProcessHandle(data, result)
        } else {
            this.constantConfig[key].data = result
        }
    }

    return result
}

Visual.prototype.cacheResultByKey = function(key, data) {
    let result = data
    let dataList = result.data || []
    let dateOfLocalData = localStorage.getItem(`${key}-${this.channel}-date`)
    if (!dataList.length && dateOfLocalData) { // 若接口未返回数据，本地有缓存
        if (localStorage.getItem('cacheStatus') !== 'false') {
            // 读取本地缓存
            result = JSON.parse(localStorage.getItem(`${key}-${this.channel}`))
        }
    } else if (dataList.length && !dateOfLocalData) { // 若接口返回数据，本地无缓存
        // 设置缓存，并记录缓存日期
        dateOfLocalData = this.setStorageByKey(result, key)
    } else if (dataList.length && dateOfLocalData) { // 若接口返回数据，本地有缓存
        if (dateOfLocalData !== this.requestDate) { // 缓存日期为两天前
            // 更新缓存，并更新缓存日期
            dateOfLocalData = this.setStorageByKey(result, key)
        }
    }

    this.cacheDateList.push(dateOfLocalData)

    return result
}

Visual.prototype.pollingApiByTiming = function() {
    this.timer = setInterval(async () => {
        let currentHours = new Date().getHours()
        if (currentHours >= this.updateTime) { // 到达更新时间
            // 请求前先获取当前页面数据的缓存日期，并过滤出过期的缓存数据
            this.requestDate = window.testTime || getRequestDate()
            let oldDataList = this.cacheDateList.filter((item) => item !== this.requestDate)
            if (oldDataList.length) { // 页面存在过期的缓存数据
                // 重新请求数据，重新设置缓存
                this.cacheDateList = []
                await this.updateCacheCard()
            }
        }
    }, this.timerInterval)
}

Visual.prototype.updateCacheCard = function() {
    Object.keys(this.constantConfig).forEach(async (key) => {
        let dateOfLocalData = localStorage.getItem(`${key}-${this.channel}-date`)
        if (this.requestDate !== dateOfLocalData) { // 过期数据项
            await this.updateCardDomByKey(key)
            console.log(`[${key} Update] ${new Date()}`)
        }
    })
}

Visual.prototype.setStorageByKey = function(result, key) {
    localStorage.setItem(`${key}-${this.channel}-date`, this.requestDate)
    localStorage.setItem(`${key}-${this.channel}`, JSON.stringify(result))

    return this.requestDate
}

Visual.prototype.disabledCache = function() {
    localStorage.setItem('cacheStatus', false)
}

Visual.prototype.openCache = function() {
    localStorage.removeItem('cacheStatus')
}

Visual.prototype.setBaseUrl = function(url) {
    localStorage.setItem('baseUrl', url)
}

Visual.prototype.removeBaseUrl = function() {
    localStorage.removeItem('baseUrl')
}

Visual.prototype.getBaseUrl = function() {
    return localStorage.getItem('baseUrl')
}
