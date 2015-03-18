/**
 * @file 各种接口小工具
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var $ = require('jquery');
    var object = require('./object');
    var TYPE = require('./type');

    return {

        /**
         * 参数配置
         *
         * @interface
         */
        configurable: {

            /**
             * 设定参数
             *
             * 会自动将原型链上的options作为默认参数给合并到this上
             *
             * 直接合并到Control对象上去, 不再搞srcOptions
             *
             * @param {Object} options 参数
             */
            setOptions: function (options) {
                object.extend(this, this.options, options);
            },

            /**
             * 处理参数设置中以onXxxx的属性, 将它们直接绑定到控件实例上
             *
             * 同时, 我们会把这些参数从option清除掉, 还你一片晴朗的天空~!
             *
             * @param {Object} options 参数
             */
            bindEvents: function (options) {
                options = options || {};
                // 处理配置项中的事件
                // 把参数中以on开始的属性做为待绑定事件处理
                for (var name in options) {
                    var value = options[name];
                    if (
                        // 自有
                        Object.prototype.hasOwnProperty.call(options, name)
                        // 属性名以on开头
                        && name.indexOf('on') === 0
                        // 属性值为函数
                        && TYPE.isFunction(value)
                    ) {
                        this.on(
                            // 移除on前缀，并转换第3个字符为小写，得到事件类型
                            name.charAt(2).toLowerCase() + name.slice(3),
                            // 回调函数
                            value
                        );
                        delete options[name];
                    }
                }
            }

        },

        /**
         * 事件功能
         */
        observable: {
            /**
             * 添加事件绑定
             *
             * @public
             * @param {string} type 事件类型
             * @param {Function} listener 要添加绑定的监听器
             * @return {Observable}
             */
            on: function (type, listener) {
                if (TYPE.isFunction(type)) {
                    listener = type;
                    type = '*';
                }
                this._listeners = this._listeners || {};
                var listeners = this._listeners[type] || [];
                if ($.inArray(listener, listeners) < 0) {
                    listener.$type = type;
                    listeners.push(listener);
                }
                this._listeners[type] = listeners;
                return this;
            },

            /**
             * 解除事件绑定
             *
             * @public
             * @param {string=} type 事件类型
             * @param {Function=} listener 要解除绑定的监听器
             * @return {Observable}
             */
            un: function (type, listener) {
                if (TYPE.isFunction(type)) {
                    listener = type;
                    type = '*';
                }
                this._listeners = this._listeners || {};
                var listeners = this._listeners[type];
                if (listeners) {
                    if (listener) {
                        var index = $.inArray(listener, listeners);
                        if (~index) {
                            listeners.splice(index, 1);
                        }
                    }
                    else {
                        listeners.length = 0;
                        delete this._listeners[type];
                    }
                }
                return this;
            },

            /**
             * 添加单次事件绑定
             *
             * @public
             * @param {string=} type 事件类型
             * @param {Function} listener 要添加绑定的监听器
             * @return {Observable}
             */
            once: function (type, listener) {
                if (TYPE.isFunction(type)) {
                    listener = type;
                    type = '*';
                }
                var me = this;
                var realListener = function () {
                    listener.apply(me, arguments);
                    me.un(type, realListener);
                };
                this.on.call(me, type, realListener);
                return this;
            },

            /**
             * 触发指定事件
             *
             * @public
             * @param {string} type 事件类型
             * @param {Object} args 透传的事件数据对象
             * @return {Event}
             */
            fire: function (type, args) {
                var event;

                // 重载: fire(Event)
                if (type instanceof $.Event) {
                    event = type;
                    type = event.type;
                }
                // 重载: fire(eventType, eventArgs)
                else {
                    event = new $.Event(type, args);
                }

                // 如果没指定target, 那么谁fire, 谁是target~
                if (!event.target) {
                    event.target = this;
                }

                this._listeners = this._listeners || {};

                var listeners = this._listeners[type] || [];
                var globalListeners = this._listeners['*'] || [];
                var allListeners = [].concat(listeners, globalListeners);
                var count = allListeners.length;

                for (var i = 0; i < count; i++) {
                    allListeners[i].call(this, event);
                }
                
                return event;
            },

            /**
             * 销毁事件侦听池
             */
            destroyEvents: function () {
                delete this._listeners;
            }

        }

    };


});
