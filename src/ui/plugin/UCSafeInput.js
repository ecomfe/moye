/**
 * @file UC安全控件插件
 * @author leon <lupengyu@bfaidu.com>
 */
define(function (require) {

    var $ = require('jquery');
    var lib = require('../lib');
    var host = 'http://cas.baidu.com';
    var url = host + '/ucsl/ucsl.js?appid=228&d=' + Math.floor((+new Date)/(864e5));

    function SafeInput(options) {
        $.extend(this, options);
    }

    SafeInput.prototype.execute = function (input) {
        var me = this;

        var target = me.target = input;
        var parent = $(target.input).parent()[0];

        target.safer = me;

        $.getScript(url).then(function () {

            me.__support = ucsl.support();

            if (!me.__support) {
                return;
            }

            var fid = me.fid = lib.getId(target, 'wrapper');
            var wrapper = me.wrapper = $('<div id="' + fid + '">');

            $(target.input).replaceWith(wrapper);

            $(target.main).addClass('uc-safe-input');

            target.fire('beforesaferinit', {
                type: 'beforesaferinit',
                target: me
            });

            me.renderUCInput();

        });

    };

    /**
     * 渲染UC安全控件
     * 
     * @return {moye/plugin/UCSafeInput} self
     */
    SafeInput.prototype.renderUCInput = function () {

        // 先把wrapper里边的内容都清空
        $(this.wrapper).html('');

        // 把安全控件的内容放进去
        ucsl.init({
            fid: this.fid,
            ready: $.proxy(this.__ready, this),
            style: {
                width: this.width,
                height: this.height
            }
        });

        return this;
    }

    /**
     * 安全控件库加载完成回调处理
     * 
     * @private
     */
    SafeInput.prototype.__ready = function () {

        var me = this;
        var target = me.target;

        me.__isReady = true;

        target.fire('saferready', {
            type: 'saferready',
            target: me
        });

    };

    /**
     * 获取值
     * 
     * @return {object}
     */
    SafeInput.prototype.getValue = function () {
        var me = this;
        var inputs = $('input', me.wrapper);

        return {
            sid: inputs[0].value,
            pwd: inputs[1].value
        }

    };

    /**
     * 是否支持当前的浏览器/系统环境
     * 
     * @return {boolean}
     */
    SafeInput.prototype.isSupport = function () {
        return this.__support;
    };

    /**
     * 安全控件当前是否可用
     * 
     * @return {boolean}
     */
    SafeInput.prototype.isReady = function () {
        return !!this.__isReady;
    };

    /**
     * 把安全控件隐藏起来
     * 
     * @return {moye/plugin/UCSafeInput} self
     */
    SafeInput.prototype.flyaway = function () {
        var main = $(this.target.main);

        if (!this.__flyStyleCache) {
            this.__flyStyleCache = {
                position: main.css('position'),
                left: main.css('left')
            };
        }

        main.css({
            position: 'absolute',
            left: '-9999px'
        });

        return this;
    };

    /**
     * 把安全控件放回去
     * 
     * @return {moye/plugin/UCSafeInput} self
     */
    SafeInput.prototype.flyback = function () {
        var cache = this.__flyStyleCache;

        if (!cache) {
            return;
        }

        $(this.target.main).css(this.__flyStyleCache);
        this.__flyStyleCache = null;

        this.reset();
        return this;
    };

    /**
     * 校验输入值
     * 
     * @return {boolean}
     */
    SafeInput.prototype.validate = function () {
        return ucsl.verify();
    };

    /**
     * 重置安全控件
     * 
     * @return {UCSafeInput} self
     */
    SafeInput.prototype.reset = function () {
        this.__isReady = false;
        return this.renderUCInput();
    };
    
    /**
     * 析构函数
     */
    SafeInput.prototype.dispose = function () {
        this.wrapper = null;
        this.target.safer = null;
        this.target = null;
    };

    return function (options) {
        return new SafeInput(options);
    };

});