window.onload = function() {
    // render box wrapper
    renderContentBox({
        className: CARD_WRAP_NAME,
    })
    App = new Visual(RENDER_CONFIG, {
        baseUrl: FETCH_API.DEV, // 接口请求host
        channel: ENV, // 唯一标识符，任意字符串
    })
    // polling api once an hour
    App.pollingApiByTiming()
}

function Visual(data, opt = {}) {
    const {
        baseUrl = '//localhost:8080',
        channel = 'arbitrary-unique-key',
    } = opt
 
    this.renderConfig = data // 渲染的配置
    this.channel = channel // 唯一标识符

    this.queue = [] // 请求队列
    this.cacheDateList = [] // 数据缓存日期
    this.requestDate = this.getRequestDate() // 请求数据的日期
    this.setBaseUrl(baseUrl)

    // render dom
    this.renderCardDom()
    // request data and re-render
    this.updateAllCardDom()
}

Visual.prototype.renderCardDom = function() {
    // card module render start
    Object.keys(this.renderConfig).forEach((key) => {
        if (this.renderConfig[key].type === RENDER_TYPE.CHART_RENDER) {
            renderChartModule(this.renderConfig[key])
        } else {
            renderOtherModule(this.renderConfig[key])
        }
    })
}

Visual.prototype.updateAllCardDom = async function() {
    this.queue = []
    Object.keys(this.renderConfig).forEach((key) => {
        this.queue.push(this.updateCardDomByKey(key))
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
    let result = await this.updateConfigByKey(key)
    if (!result) return
    
    // render card item
    if (this.renderConfig[key].type === RENDER_TYPE.CHART_RENDER) {
        renderChartModule(this.renderConfig[key])
    } else {
        renderOtherModule(this.renderConfig[key])
    }
}

/**
 * @description 根据key更新<renderConfig>.key.data
 * @param {String} key 
 * @returns {*}
 */
Visual.prototype.updateConfigByKey = async function(key) {
    let { fetchConfig = {}, data } = this.renderConfig[key] || {}
    let { url, params = {}, dataHandling } = fetchConfig
    let result = null

    if (url) {
        if (Array.isArray(url)) {
            const resultItem = []
            url.forEach((item, index) => {
                resultItem.push(httpRequest(this.baseUrl + item, params[index] || {}))
            })
            result = await Promise.all(resultItem)
        } else {
            result = await httpRequest(this.baseUrl + url, params)
        }
        
        result = this.cacheResultByKey(key, result)
        if (dataHandling) {
            this.renderConfig[key].data = dataHandling(data, result)
        } else {
            this.renderConfig[key].data = result
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

Visual.prototype.pollingApiByTiming = function(opt = {}) {
    const {
        updateTime = 1, // 开始更新数据的时刻，01:00 - 01:59
        timerInterval = 1 * 60 * 60 * 1000, // 更新数据的轮询周期，1h
    } = opt
    
    this.updateTime = updateTime
    this.timerInterval = timerInterval

    this.timer = setInterval(async () => {
        let currentHours = new Date().getHours()
        if (currentHours >= this.updateTime) { // 到达更新时间
            // 请求前先获取当前页面数据的缓存日期，并过滤出过期的缓存数据
            this.requestDate = window.testTime || this.getRequestDate()
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
    Object.keys(this.renderConfig).forEach(async (key) => {
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

Visual.prototype.setLocalStorageBaseUrl = function(url) {
    localStorage.setItem('baseUrl', url)
}

Visual.prototype.removeLocalStorageBaseUrl = function() {
    localStorage.removeItem('baseUrl')
}

Visual.prototype.setBaseUrl = function(baseUrl) {
    if (location.protocol.indexOf('file' > -1)) {
        this.baseUrl = baseUrl
    } else if (localStorage.getItem('baseUrl')) {
        this.baseUrl = localStorage.getItem('baseUrl')
    } else {
        this.baseUrl = ''
    }
}

Visual.prototype.getRequestDate = function() {
    return new Date(+ new Date() + 8 * 60 * 60 * 1000).toISOString().split('T')[0].split('-').join('')
}
