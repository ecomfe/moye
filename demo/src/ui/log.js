define('ui/log', [
    'require',
    'jquery',
    './lib'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var parseJSON = function (data) {
        try {
            return new Function('return (' + data + ')')();
        } catch (e) {
            return {};
        }
    };
    var send = function () {
            var list = [];
            return function (data) {
                var index = list.push(document.createElement('img')) - 1;
                list[index].onload = list[index].onerror = function () {
                    list[index] = list[index].onload = list[index].onerror = null;
                    delete list[index];
                };
                var url = options.action + $.param(data);
                list[index].src = url + '&' + (+new Date()).toString(36);
                exports.fire('send', { url: url });
            };
        }();
    var fill = function (data, from, to) {
        var type;
        var url;
        var nolog = 0;
        var el = from;
        var path = [];
        var rsvData = el.getAttribute('data-rsv');
        if (rsvData) {
            data.rsv = $.extend(data, { rsv: parseJSON(rsvData) });
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
                data = $.extend(parseJSON(clickData), data);
            }
            rsvData = el.getAttribute('data-rsv');
            if (rsvData) {
                data.rsv = $.extend(parseJSON(rsvData), data.rsv);
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
                    if (sibling.nodeType === 1 && sibling.tagName === el.tagName) {
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
                data = $.extend(parseJSON(clickData), data);
            }
        }
        if (nolog) {
            return !nolog;
        }
        path.reverse();
        var tag = from.tagName.toLowerCase();
        if (!type && /^(a|img|input|button|select|datalist|textarea)$/.test(tag)) {
            type = { a: 'link' }[tag] || 'input';
            url = from.href || from.src || url;
        }
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
    var setTitle = function (data, from, type, tag, path, level) {
        var title = '';
        var get = function (el) {
            return el.getAttribute('data-title') || el.title || el.textContent || el.innerText || '';
        };
        if (type === 'input') {
            if (/input|textarea/.test(tag)) {
                title = from.value;
                if (from.type && from.type.toLowerCase() === 'password') {
                    title = '';
                }
            } else if (/select|datalist/.test(tag)) {
                if (from.children.length > 0) {
                    var index = from.selectedIndex || 0;
                    title = from.children[index > -1 ? index : 0].innerHTML;
                }
            } else {
                title = get(from) || from.value || '';
            }
        } else {
            title = get(from);
            if (!title) {
                var el = from;
                var i = level;
                while (i > 0) {
                    i--;
                    if (/^a\d*\b/i.test(path[i])) {
                        data.url = el.href;
                        title = get(el);
                        break;
                    } else {
                        if (el.className && /\bOP_LOG_[A-Z]+\b/.test(el.className)) {
                            title = get(el);
                            break;
                        }
                        el = el.parentNode;
                    }
                }
            }
        }
        data.txt = $.trim(title).replace(/<[^>]+?>/g, '');
    };
    var setField = function (data, from, key, defaults) {
        data[key] = from.getAttribute('data-' + key) || data[key] || defaults || '-';
    };
    var options = {
            action: 'http://nsclick.baidu.com/v.gif?',
            main: 'result-op',
            title: 'OP_LOG_TITLE',
            link: 'OP_LOG_LINK',
            img: 'OP_LOG_IMG',
            btn: 'OP_LOG_BTN',
            input: 'OP_LOG_INPUT',
            others: 'OP_LOG_OTHERS',
            data: {
                url: (window.location || document.location || { href: '-' }).href,
                pid: '-',
                cat: '-',
                page: '-',
                fr: '-',
                pvid: '-',
                rqid: '-',
                qid: '-',
                psid: '-',
                sid: '-',
                pn: '-',
                act: '-',
                mod: '-',
                item: '-',
                p1: '-',
                xpath: '-',
                f: '-',
                txt: '-',
                q: '-',
                rsv: null
            }
        };
    var bindP1 = function (el, index) {
        var data = parseJSON(el.getAttribute('data-click'));
        data.p1 = index;
        el.setAttribute('data-click', lib.stringify(data));
    };
    var onClick = function (e, el) {
        var target = $(el || e.target);
        var klass = options.main;
        var main = $(target).closest('.' + klass);
        if (!main.length || main.attr('data-nolog') === '1') {
            return;
        }
        var data = target.attr('data-click');
        if (data) {
            data = parseJSON(data);
        }
        data = fill(data || {}, target[0], main[0]);
        if (!data) {
            return;
        }
        if (options.data) {
            data = $.extend({}, options.data, data);
        }
        if (!('p1' in data)) {
            $('.' + options.main).each(function (i, el) {
                if (el === main) {
                    data.p1 = i + 1;
                }
                bindP1(el, i + 1);
            });
        }
        exports.fire('click', {
            data: data,
            target: target[0],
            main: main[0]
        });
        send(data);
    };
    var exports = {
            config: function (ops) {
                $.extend(options, ops);
                return this;
            },
            start: function () {
                $(document).on('mousedown', onClick);
                this.fire('start');
                return this;
            },
            stop: function () {
                $(document).on('mousedown', onClick);
                return this;
            },
            click: function (el) {
                onClick(null, el);
                return this;
            },
            fill: function (elements, data) {
                for (var i = 0, element, clickData; element = elements[i++];) {
                    clickData = element.getAttribute('data-click');
                    if (clickData) {
                        data = $.extend(parseJSON(clickData), data);
                    }
                    element.setAttribute('data-click', lib.stringify(data));
                }
                return this;
            },
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
                $.extend(map, obj);
                return this;
            },
            send: function (data) {
                send($.extend(lib.clone(options.data), data));
                return this;
            }
        };
    $.extend(exports, lib.observable);
    return exports;
});