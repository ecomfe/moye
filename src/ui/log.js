/**
 * Moye (Zhixin UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @file  知心中间页日志统计模块
 * @author  chris(wfsr@foxmail.com)
 */

define(function (require) {

    var lib = require('./lib');
    
    /**
     * 将字符串解析成 JSON 对象
     * 
     * @memberof module:log
     * @param {string} data 需要解析的字符串
     * @return {Object} 解析结果 JSON 对象
     * @inner
     */
    var parseJSON = function (data) {
        try {
            return (new Function('return (' + data + ')'))();
        }
        catch (e) {
            return {};
        }
    };

    /**
     * 发送日志请求
     * 
     * @memberof module:log
     * @method module:log~send
     * @param {string} url 日志完整地址
     * @fires module:log#send
     * @inner
     */
    var send = (function () {
        var list = [];

        return function (data) {

            // 某些浏览器在 Image 对象引用计数为 0 时，可能会 cancel 请求
            // 所以通过闭包 list 持有引用
            // 使用 document.createElement 比 new Image 更佳
            var index = list.push(document.createElement('img')) - 1;

            list[index].onload = list[index].onerror = function () {
                list[index] = list[index].onload = list[index].onerror = null;
                delete list[index];
            };

            var url = options.action + lib.toQueryString(data);

            // 新规范无时间戳字段上报，自动加上以防止缓存
            list[index].src = url + '&' + (+new Date()).toString(36);

            /**
             * @event module:log#send
             * @type {Object}
             * @property {string} url 当前统计请求的完整地址
             */
            exports.fire('send', {url: url});
        };
    })();

    /**
     * 填充数据
     * 根据当前点击对象，解释对象所处 XPath 及 url
     * 
     * @memberof module:log
     * @param {Object} data 待发送的数据对象
     * @param {HTMLElement} from 当前点击对象
     * @param {HTMLElement} to 统计日志最上层容器
     * @return {Object} 合并所有HTML自定义属性和相关配置项后的数据对象
     * @inner
     */
    var fill = function (data, from, to) {
        var type;
        var url;
        var nolog = 0;
        var el = from;
        var path = [];

        var rsvData = el.getAttribute('data-rsv');
        if (rsvData) {
            data.rsv = lib.extend(data, {rsv: parseJSON(rsvData)});
        }

        var i = 0;
        var clickData;
        var typeReg = /\bOP_LOG_(TITLE|LINK|IMG|BTN|INPUT|OTHERS)\b/i;
        while (el !== to) {
            if (el.getAttribute('data-nolog') === '1') {
                nolog = 1;
                break;
            }

            clickData = el.getAttribute('data-click');
            if (clickData) {
                data = lib.extend(parseJSON(clickData), data);
            }

            rsvData = el.getAttribute('data-rsv');
            if (rsvData) {
                data.rsv = lib.extend(parseJSON(rsvData), data.rsv);
            }

            if (el.href) {
                url = el.href;
                type = 'link';
            }

            if (type === 'link' && el.tagName === 'H3') {
                type = 'title';
            }

            if (typeReg.test(el.className)) {
                type = RegExp.$1.toLowerCase();
            }

            var count = 1;
            if (el.previousSibling) {
                var sibling = el.previousSibling;

                do {
                    if (sibling.nodeType === 1
                        && sibling.tagName === el.tagName
                    ) {
                        count++;
                    }
                    sibling = sibling.previousSibling;
                } while (sibling);
            }

            path[i++] = el.tagName + (count > 1 ? count : '');

            el = el.parentNode;

        }

        if (from !== to) {
            clickData = to.getAttribute('data-click');
            if (clickData) {
                data = lib.extend(parseJSON(clickData), data);
            }            
        }

        if (nolog) {
            return !nolog;
        }

        // 反转 XPath 顺序
        path.reverse();
        var tag = from.tagName.toLowerCase();

        if (!type
                && /^(a|img|input|button|select|datalist|textarea)$/.test(tag)
            ) {
            type = {a: 'link'}[tag] || 'input';

            url = from.href || from.src || url;
        }

        // 自定义属性指定的 type 优化级最高
        type = from.getAttribute('data-type') || type;

        if (!type) {
            return false;
        }

        if (url) {
            data.url = url;
        }

        setField(data, from, 'p1');
        setField(data, from, 'act');
        setField(data, from, 'item');
        setField(data, from, 'mod', to.id);

        setTitle(data, from, type, tag, path, i);

        data.xpath = path.join('-').toLowerCase() + '(' + type + ')';

        return data;
    };

    /**
     * 设置点击标题文字
     * 
     * @memberof module:log
     * @param {Object} data 已收集的数据对象
     * @param {HTMLElement} from 当前点击的节点
     * @param {string} type 点击的节点类型
     * @param {string} tag 点击的节点标签名
     * @param {Array} path xpath 从上到下的标签数组
     * @param {number} level 点击的节点到模块间的深度
     * @inner
     */
    var setTitle = function (data, from, type, tag, path, level) {
        var title = '';
        var get = function (el) {
            return (
                el.getAttribute('data-title')
                || el.title
                || el.textContent
                || el.innerText
                || ''
            );
        };

        // 如果是表单元素
        if (type === 'input') {
            if (/input|textarea/.test(tag)) {
                title = from.value;
                if (from.type && from.type.toLowerCase() === 'password') {
                    title = '';
                }
            }
            else if (/select|datalist/.test(tag)) {
                if (from.children.length > 0) {
                    var index = from.selectedIndex || 0;
                    title = from.children[index > -1 ? index : 0].innerHTML;
                }
            }
            else {
                title = get(from) || from.value || '';
            }
        }
        else {

            title = get(from);

            // title为空，遍历父节点
            if (!title) {
                var el = from;

                var i = level;
                while (i > 0) {
                    i--;
                    if (/^a\d*\b/i.test(path[i])) {
                        data.url = el.href;
                        title = get(el);
                        break;
                    }
                    else {
                        if (el.className
                            && (/\bOP_LOG_[A-Z]+\b/.test(el.className))
                        ) {
                            title = get(el);   
                            break;
                        }
                        el = el.parentNode;
                    }
                }
            }
        }
        
        data.txt = lib.trim(title).replace(/<[^>]+?>/g, '');
    };

    /**
     * 从多方获取数据值给指定字段
     * 
     * @memberof module:log
     * @param {Object} data 已收集的数据对象
     * @param {HTMLElement} from 当前点击的节点
     * @param {string} key 要获取的数据字段名
     * @param {(string | number)} defaults 默认填充的值，假值时置为 '-'。
     * @inner
     */
    var setField = function (data, from, key, defaults) {

        // 具体指定的自定义属性优化级最高，data-click 值次之
        data[key] = from.getAttribute('data-' + key)
            || data[key]
            || defaults
            || '-';
    };

    /**
     * 配置项
     * 
     * @memberof module:log
     * @type {Object}
     * @property {string} action 日志统计服务接口地址
     * @property {string} main 日志统计顶层容器 className
     * @property {string} title xpath 中 title 类型的 className
     * @property {string} link xpath 中 link 类型的 className
     * @property {string} img xpath 中 img 类型的 className
     * @property {string} btn xpath 中 btn 类型的 className
     * @property {string} input xpath 中 input 类型的 className
     * @property {string} others xpath 中 others 类型的 className
     * 
     * @property {Object} data 统计公共部分数据
     * @property {string} data.url 访问的 url, 页面加载或者点击的 url。不允许为默认值 -。
     * @property {(number | string)} data.pid 产品线 id。
     * 对应 nsclick 的 pid 概念。Nsclick 用 pid 将不同产品线的日志进行分割。
     * 不允许为默认值 -。
     * 
     * @property {string} data.cat 对全站不同类型的页面的划分。
     * 比如 cat=home 表示人工编辑的首 页,cat=product 表示商品陈列页。
     * 类比知 道 type 字段,type=2030 为检索页,2014 为问题页。
     * 
     * @property {string} data.page 某一类具体页面。
     * 在粒度上, cat > page > 具体 url。比如 cat=home&page= baby 表示 首页下的
     * 母婴产品目录页。如果 cat 字段 符合层级结构,可以不使用此字段: cat=home-baby。
     * 
     * @property {string} data.fr 对 pv 的来源进行分类。
     * 或者在某次实验中 记录特定的导流来源。粒度大于 refer。
     * 
     * @property {string} data.pvid 记录一次 pv 的唯一 id。
     * 类似于大搜 索的 qid (query id)。应当由由后台生成, 保证前端日志和后端日志可以 merge。 
     * 如果系统不能生成,最简单的方法是用进入页 面的时间戳。从页面发起的所有点击 pvid 一致,
     * 用于串联一次页面上的点击。
     * 
     * @property {string} data.rqid 页面可能使用异步刷新。
     * 一次 pv 下发出多个 request。每一个 request 用 rqid 唯一标识。
     * 
     * @property {string} data.qid 大搜索一次检索唯一标识
     * 用来 merge 大搜 索和中间页的点击日志。不允许为默认值 -
     * 
     * @property {(string | number)} data.psid 大搜索的抽样 id，传导进入中间页
     * @property {(string | number)} data.sid 中间页的抽样 id。
     * 如果由抽样平台统一接管, 则 psid = sid。
     * 
     * @property {(string | number)} data.pn 搜索结果页、商品列表页翻页的次数
     * @property {string} data.act 用户动作类型。
     * act=pv 表示页面加载, act=a[\w+]表示点击一个链接(离开本页)。
     * act=b[\w+]表示在页面内的一个操作(筛选, 下拉菜单等,操作完毕后仍然停留在本页)。
     * 一些重要的 b[\w+]操作可以单独列出。比如下单操作重要性高于筛选操作。
     * 
     * @property {string} data.mod 对页面进行分块统计。
     * 标识一些常用组件,在不同页面中保持稳定。通常可以 为页面 dom 元素的 id。
     * 比如首页和商品页 都有 mod=recommend-left 的“热门商品推荐”。
     * 
     * @property {string} data.item 点击或者操作对象。
     * 在微购中 item 对应商 品 id。在游戏中间页汇总,item 对应游戏 id。
     * 
     * @property {(string | number)} data.p1 点击 item 对象在页面中的顺序号。
     * 类似于大搜索结果的 1~10 位。
     * 
     * @property {string} data.xpath 点击元素的 xpath。
     * 如果记录绝对 path 或者相对 path。
     * 比如热门商品推荐在不同的不稳定,可以记录相对于 mod 的 xpath。不允许为默认值 -。
     * 
     * @property {number} data.f 表示搜索页面的加载来源。
     * 参照大搜索的 f 字段, 1(主动改写)、2(下侧推荐)、3(sug)。
     * 
     * @property {string} data.txt 点击元素的文本(锚文字)
     * @property {string} data.q 用户的检索 query
     * @property {?Object=} data.rsv Reserve 字段。
     * 其他不在通用字段中的结果 都可以用 dict 表示。比如微购产品页的地域 信息。
     * 如果一个字段足够常用, 再将它从 rsv 提升到固定字段中。
     * @inner
     */
    var options = {

        // 日志统计服务接口地址
        action: 'http://nsclick.baidu.com/v.gif?',

        // 日志统计顶层容器 className
        main: 'result-op',

        // xpath 中 title 类型的 className
        title: 'OP_LOG_TITLE',

        // xpath 中 link 类型的 className
        link: 'OP_LOG_LINK',

        // xpath 中 img 类型的 className
        img: 'OP_LOG_IMG',

        // xpath 中 btn 类型的 className
        btn: 'OP_LOG_BTN',

        // xpath 中 input  类型的 className
        input: 'OP_LOG_INPUT',

        // xpath 中 others 类型的 className
        others: 'OP_LOG_OTHERS',

        // 统计公共数据部分
        data: {

            // 不允许为默认值 -
            url: (window.location || document.location || {href: '-'}).href,

            // 对应 nsclick 的 pid 概念。Nsclick 用 pid 将不同产品线的日志进行分割。
            // 不允许为默认值 -
            pid: '-',

            // 比如 cat=home 表示人工编辑的首 页,cat=product 表示商品陈列页。
            // 类比知 道 type 字段,type=2030 为检索页,2014 为问题页。
            cat: '-',

            // 在粒度上, cat > page > 具体 url。比如 cat=home&page= baby 表示 首页下的
            // 母婴产品目录页。如果 cat 字段 符合层级结构,可以不使用此字段: cat=home-baby。
            page: '-',

            // 或者在某次实验中 记录特定的导流来源。粒度大于 refer。
            fr: '-',

            // 类似于大搜 索的 qid (query id)。应当由由后台生成, 保证前端日志和后端日志可以
            // merge。 如 果系统不能生成,最简单的方法是用进入页 面的时间戳。
            // 从页面发起的所有点击 pvid 一致,用于串联一次页面上的点击。
            pvid: '-',

            // 一次 pv 下发出多个 request。每一个 request 用 rqid 唯一标识。
            rqid: '-',

            // 用来 merge 大搜 索和中间页的点击日志。
            // 不允许为默认值 -
            qid: '-',

            // 大搜索的抽样 id,传导进入中间页
            psid: '-',

            // 如果由抽样平台统一接管, 则 psid = sid。
            sid: '-',

            // 搜索结果页、商品列表页翻页的次数
            pn: '-',

            // act=pv 表示页面加载, act=a[\w+]表示点击一个链接(离开本页)。 
            // act=b[\w+]表示在页面内的一个操作(筛选, 下拉菜单等,操作完毕后仍然停留在本页)。
            // 一些重要的 b[\w+]操作可以单独列出。比如下单操作重要性高于筛选操作。
            act: '-',

            // 标识一些常用组件,在不同页面中保持稳定。通常可以 为页面 dom 元素的 id。
            // 比如首页和商品页 都有 mod=recommend-left 的“热门商品推荐”。
            mod: '-',

            // 在微购中 item 对应商 品 id。在游戏中间页汇总,item 对应游戏 id。
            item: '-',

            // 类似于大搜索结果的 1~10 位。
            p1: '-',

            // 如果记录绝对 path 或者相对 path。
            // 比如热门商品推荐在不同的不稳定,可以记录相对于 mod 的 xpath。
            // 不允许为默认值 -
            xpath: '-',

            // 参照大搜索的 f 字段, 如一次新的搜索来源是 sug, 主动改写,rs,ec
            f: '-',

            // 点击元素的文本(锚文字)
            txt: '-',

            // 用户的检索 query
            q: '-',

            // 其他不在通用字段中的结果 都可以用 dict 表示。比如微购产品页的地域 信息。
            // 如果一个字段足够常用,再将它从 rsv 提升到固定字段中。
            rsv: null
        }
    };

    /**
     * 暴露一个全局变量
     * 目的是： 使用商业知心中间页展现点击查看工具（浏览器插件）
     * 工具详情的具体链接 http://wiki.baidu.com/pages/viewpage.action?pageId=40195676
     * 根据工具要求，需要暴露一个和options一样的全局变量__logInfo__
     * 方便使用浏览器插件工具查看点击日志统计
     * 
     * @type {Object}
     */
    window.__logInfo__ = options;

    /**
     * 绑定 P1 参数索引值
     * 
     * @memberof module:log
     * @param {HTMLElement } el 点击统计的容器
     * @param {number} index 点击统计容器的序号
     * @inner
     */
    var bindP1 = function (el, index) {
        var data = parseJSON(el.getAttribute('data-click'));

        data.p1 = index;

        el.setAttribute('data-click', lib.stringify(data));
    };

    /**
     * 页面点击监听
     * @see http://fe.baidu.com/doc/aladdin/#standard/aladdin_click.text
     * 
     * @memberof module:log
     * @param {?Event} e DOM 事件对象
     * @param {HTMLElement=} el 指定触发统计的 HTMLElement
     * @fires module:log#click
     * @inner
     */
    var onClick = function (e, el) {
        var target = el || lib.getTarget(e);
        var klass = options.main;
        var main = lib.hasClass(target, klass)
            ? target
            : lib.getAncestorByClass(target, klass);

        if (!main || main.getAttribute('data-nolog') === '1') {
            return;
        }

        var data = target.getAttribute('data-click');

        if (data) {
            data = parseJSON(data);
        }

        data = fill(data || {}, target, main);

        // 某个上级节点配置了 data-nolog 之后
        if (!data) {
            return;
        }

        // 合并公共数据，最低优先级
        if (options.data) {
            data = lib.extend(lib.extend({}, options.data), data);
        }

        // 仅当首次点击或有新加入节点时计算 p1 序号值
        if (!('p1' in data)) {
            lib.each(
                lib.q(options.main),
                function (el, i) {
                    if (el === main) {
                        data.p1 = i + 1;
                    }
                    bindP1(el, i + 1);
                }
            );
        }

        /**
         * @event module:log#click
         * @type {Object}
         * @property {Object} data 上报的公共数据
         * @see module:log~options
         * @property {string} target 点击事件源对象
         * @property {string} main 当前统计区域（卡片）主容器
         */
        exports.fire('click', {data: data, target: target, main: main});

        send(data);
    };

    /**
     * 中间页日志统计模块
     * 
     * @requires lib
     * @module log
     * @example
     * log.config({
     *  data: {
     *      pid: 201,
     *      cat: 'home',
     *      page: 'baby',
     *      fr: 'ps-zhixin',
     *      pvid: '123ef33257',
     *      rqid: '233f93323',
     *      qid: 'dd322f65003ee7a7',
     *      psid: 2401,
     *      sid: 3557,
     *      f: 1,
     *      q: 'Glaxay Note'
     *  }
     * });
     * log.live({
     *  'mod1': function (json) {
     *      // console.log(json.data);
     *      // console.log(json.target);
     *      // console.log(json.main);
     *  },
     *  'mod2': function (json) {
     *      if (json.target.tagName === 'a') {
     *          data.act = 'remove';
     *      }
     *  }
     * });
     * log.start();
     */
    var exports = {

        /**
         * 配置项
         * 
         * @see module:log~options
         * @param {Object} ops 可配置项
         * @return {module:log} log
         */
        config: function (ops) {
            lib.extend(options, ops);

            return this;
        },

        /**
         * 开始监听页面点击日志
         * 
         * @return {module:log} log
         * @fires module:log#start
         */
        start: function () {
            lib.on(document, 'mousedown', onClick);

            /**
             * @event module:log#start
             * @type {Object}
             * @property {Object} type 事件类型
             */
            this.fire('start');

            return this;
        },

        /**
         * 停止监听页面点击日志
         * 
         * @return {module:log} log
         */
        stop: function () {
            lib.un(document, 'mousedown', onClick);

            return this;
        },

        /**
         * 模拟点击指定的 HTMLElement 以发送统计
         * 
         * @param {HTMLElement} el 需要模拟点击触发统计的 HTMLElement
         * @return {module:log} log
         */
        click: function (el) {
            onClick(null, el);

            return this;
        },

        /**
         * 为指定节点集统一填充数据
         * 
         * @param {(Array.<HTMLElement> | HTMLCollection)} elements 节点集
         * @param {Object} data 待填充的数据
         * @return {module:log} log
         */
        fill: function (elements, data) {
            for (var i = 0, element, clickData; (element = elements[i++]);) {
                clickData = element.getAttribute('data-click');
                if (clickData) {

                    // 就近原则，自定义属性比通用配置具有更高优先级
                    data = lib.extend(parseJSON(clickData), data);
                }
                element.setAttribute('data-click', lib.stringify(data));
            }

            return this;
        },

        /**
         * 动态捕获点击节点处理上报数据
         * 
         * @param {Object.<string, Function>} obj 对于 mod 级别的动态处理绑定
         * @return {module:log} log
         */
        live: function (obj) {
            var map = this.map;

            if (!map) {
                map = this.map = {};
                this.on('click', function (json) {
                    var mod = json.data.mod;
                    if (mod && mod in map) {
                        map[mod](json);
                    }
                });
            }

            lib.extend(map, obj);

            return this;
        },

        /**
         * 手动发送统计请求
         * 
         * @method module:log.send
         * @param {Object} data 要发送的数据
         * @return {module:log} log
         * @fires module:log#send
         * @see module:log~send
         */
        send: function (data) {

            send(lib.extend(lib.clone(options.data), data));

            return this;
        }
    };

    /**
     * 添加事件绑定
     * 
     * @method module:log.on
     * @param {?string} type 事件类型
     * @param {Function} listner 要添加绑定的监听器
     */

    /**
     * 解除事件绑定
     * 
     * @method module:log.un
     * @param {string=} type 事件类型
     * @param {Function=} listner 要解除绑定的监听器
     */

    /**
     * 触发指定事件
     * 
     * @method module:log.fire
     * @param {string} type 事件类型
     * @param {Object} args 透传的事件数据对象
     */
    lib.extend(exports, lib.clone(lib.observable));

    return exports;
});
