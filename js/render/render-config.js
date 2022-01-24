/**
 * @property {String} <Object>.type 渲染类型，取值为 chartRender 时，将自动渲染echarts图表，渲染的option配置为optDispatch方法的返回值。若为空，将直接调用render方法
 * @property {String} <Object>.domId 绑定节点的Id
 * @property {Number} <Object>.domHeight Card's height，单位: px
 * @property {String} <Object>.name 渲染标题的内容，若 renderTitle 为false，将不会渲染
 * @property {Boolean} <Object>.renderTitle 是否渲染标题
 * @property {Boolean} <Object>.renderBasic 是否渲染Card高度、标题、内容节点
 * @property {Array | Object} <Object>.data 渲染的数据
 * @property {Function} <Object>.optDispatch type取值为 chartRender 时，该方法需返回echarts所需的option配置
 * @property {Function} <Object>.render 在echarts图表渲染后执行，回调参数为domMap：节点列表，config：当前的配置信息
 * @property {Function} <Object>.onResize window.resize的回调，回调参数为domMap：节点列表，config：当前的配置信息
 * @property {Function} <Object>.onMouseover echarts图表mouseover的回调
 * @property {Function} <Object>.onMouseout echarts图表mouseout的回调
 * @property {Object} <Object>.fetchConfig 接口请求的相关配置
 * @property {String} <Object>.fetchConfig.url 接口请求的路径
 * @property {Object} <Object>.fetchConfig.params 接口请求的参数
 * @property {Function} <Object>.fetchConfig.dataHandling 接口请求后的回调方法，用于处理接口返回的数据，返回结果将会赋予<Object>.data
 */
const RENDER_CONFIG = {
    title: {
        domId: 'headerWrap',
        name: 'Visual',
        renderBasic: false,
        render: renderTitle,
    },
    banner: {
        domId: 'bannerWrap',
        renderBasic: false,
        render: () => {},
    },
    card1: {
        domId: 'card-1',
        name: 'Card1',
        domHeight: 250,
    },
    card2: {
        domId: 'card-2',
        name: 'Card2',
    },
    card3: {
        domId: 'card-3',
        name: 'Card3',
    },
    card4: {
        type: RENDER_TYPE.CHART_RENDER,
        domId: 'card-4',
        name: 'Card4',
        domHeight: 353,
        data: [500, 300],
        optDispatch: getCardOpt1,
    },
    card5: {
        domId: 'card-5',
        name: 'Card5',
        domHeight: 353,
    },
    card6: {
        domId: 'card-6',
        name: 'Card6',
    },
    card7: {
        domId: 'card-7',
        name: 'Card7',
    },
    card8: {
        domId: 'card-8',
        name: 'Card8',
    },
}