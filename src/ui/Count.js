/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file  倒计时控件
 * @author  liuxiaqi(liuxiaqi@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * 倒计时控件
     *
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports Count
     */
    var Count = Control.extend(/** @lends module:Count.prototype */{

        /**
         * 控件类型标识
         *
         * @type {string}
         * @private
         */
        type: 'Count',

        /**
         * 控件配置项
         *
         * @name module:Count#options
         * @type {Object}
         * @property
         * @private
         */

        options: {

            /**
             * 倒计时控件所属的父元素
             *
             * 如果不指定, 那么会使用body作为父元素
             *
             * @type {(string | HTMLElement)}
             */
            target: '',
            

            /**
             * 倒计时开始时间
             *
             * 格式：'YY-MM-DD-HH-MM-SS'
             *
             * 如果不指定, 那么会以当前时间作为开始计算时间
             *
             * @type {string}
             */
        	start: '',

            /**
             * 倒计时结束时间
             *
             * 格式：'YY-MM-DD-HH-MM-SS'
             *
             * 必填，如果不指定将会报错
             *
             * @type {string}
             */
        	end: '',

            /**
             * 是否计算天
             *
             * 可选值: true | false
             *
             * true: 计算天
             * false: 不计算天
             *
             * 如果不指定，默认值为true，即默认计算天
             *
             * @type {bollen}
             */
        	isDay: true,

            /**
             * 是否计算小时
             *
             * 为true, 不可修改，否则会报错。即一定计算小时
             *
             * @type {bollen}
             */
        	isHour: true,

            /**
             * 是否计算分钟
             *
             * 为true, 不可修改，否则会报错。即一定计算小时
             *
             * @type {bollen}
             */
        	isminute: true,

            /**
             * 是否计算秒
             *
             * 可选值: true | false
             *
             * true: 计算秒
             * false: 不计算秒
             *
             * 如果不指定，默认值为true，即默认计算秒
             *
             * @type {bollen}
             */
        	isSecond: true
        },

        /**
         * 控件初始化
         *
         * @param {Object} options 配置项
         * @see module:Count#options
         * @protected
         */
        init: function (options) {
        	this.$parent(options);

        	var main = this.main;
            this.main = $('<div class="ui-count-container"></div>');

        	if (options.target) {
                this.main.appendTo($(options.target));
        	}
        	else {
        		this.main.appendTo($('body'));
        	}

        	if (options.start && typeof options.start === 'string') {
        	    var startArr = options.start.split('-');
                var startTime = new Date(startArr[0], startArr[1] - 1, startArr[2], startArr[3], startArr[4], startArr[5]);
                this.start = startTime.getTime();
        	}
        	else {
        		this.start = new Date();
        	}

        	if (options.end && typeof options.end === 'string') {
        	    var endArr = options.end.split('-');
                var endTime = new Date(endArr[0], endArr[1] - 1, endArr[2], endArr[3], endArr[4], endArr[5]);
                this.end = endTime.getTime();
        	}
        	else {
        		throw '"end" is required';
        	}

        },

        initStructure: function () {

        	if (this.isDay) {
        		this.dayElem = $('<div class="ui-count-days"></div>');
        		this.dayElem.appendTo(this.main);
        	}
            else {
                this.main.addClass('ui-count-nodays');
            }

        	if (this.isHour) {
        	    this.hourElem = $('<div class="ui-count-hours"></div>');
        	    this.hourElem.appendTo(this.main);
        	}

        	if (this.isminute) {
        	    this.minuteElem = $('<div class="ui-count-minutes"></div>');
        	    this.minuteElem.appendTo(this.main);
        	}
            
        	if (this.isSecond) {
        	    this.secondElem = $('<div class="ui-count-seconds"></div>');
        	    this.secondElem.appendTo(this.main);
        	}
            else {
                this.main.addClass('ui-count-noseconds');               
            }

        },

        /**
         * 初始化事件绑定
         *
         * @protected
         */
        initEvents: function () {

            var that = this;

            that.getDif();
            that.calculate();
            that.showCount();               

            setInterval (function () {
        	    that.getDif();
                that.calculate();
                that.showCount();              
            }, 1000);

        },


        /**
         * 获取时间差
         *
         * @protected
         */
        getDif: function () {
            
        	if (!this.difTime) {
        	    this.difTime = this.end - this.start;	
        	}
        	else {
                // 每隔1s自减
                this.difTime -= 1000;        		
        	}

        	if (this.difTime <= 0) {

        		this.difTime = 0;
        	}
        },

        /**
         * 计算倒计时的天、时、分、秒
         *
         * @protected
         */
        calculate: function () {

            // 天
            this.days = Math.floor(this.difTime / (24 * 3600 * 1000));
            
            // 小时
            var leave1 = this.difTime % (24 * 3600 * 1000);

            if (this.dayElem) {
                this.hours = Math.floor(leave1 / (3600 * 1000));  
            }
            else {
                this.hours = Math.floor(this.difTime / (3600 * 1000)); 
            }

            // 分钟
            var leave2 = leave1 % (3600 * 1000);
            if (this.hourElem) {
                this.minutes = Math.floor(leave2 / (60 * 1000)); 
            }
            else {
                throw '"isHour" and "isSecond" are forced to be true';
            }

            // 秒
            var leave3 = leave2 % (60 * 1000);
            this.seconds = Math.floor(leave3 / 1000);
        },

        /**
         * 显示倒计时
         *
         * @protected
         */
        showCount: function () {
            if (this.dayElem) {
                $(this.dayElem).html('<span class="ui-count-number">' + this.days + '</span> 天'); 
            }
            if (this.hourElem) {
                $(this.hourElem).html('<span class="ui-count-number">' + this.hours + '</span> 时'); 
            }
            if (this.minuteElem) {
                $(this.minuteElem).html('<span class="ui-count-number">' + this.minutes + '</span> 分'); 
            }
            if (this.secondElem) {
                $(this.secondElem).html('<span class="ui-count-number">' + this.seconds + '</span> 秒'); 
            }        	
        },

        dispose: function () {
            this.dayElem = this.hourElem = this.minuteElem = this.secondElem = null;
            this.clear();
            this.$parent();
        }

    });

    return Count;
});

