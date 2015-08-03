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
            main: '',
            

            /**
             * 倒计时开始时间
             *
             * 格式：'new Date([arguments list])'
             *
             * 如果不指定或格式不正确, 那么会以当前时间作为开始计算时间
             *
             * @type {string}
             */
        	start: '',

            /**
             * 倒计时结束时间
             *
             * 格式：'new Date([arguments list])'
             *
             * 必填，如果不指定或格式不正确将会报错
             *
             * @type {string}
             */
        	end: '',

            /**
             * 是否计算星期
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
            isWeek: true,
            
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

        	if (options.main) {
                this.main.appendTo($(options.main));
        	}
        	else {
        		this.main.appendTo($('body'));
        	}

        	if (options.start && (options.start instanceof Date)) {
                this.start = options.start.getTime();
        	}
        	else {
        		this.start = new Date();
        	}

        	if (options.end && (options.end instanceof Date)) {
                this.end = options.end.getTime();
        	}
        	else {
        		throw 'Date "end" is required';
        	}

        },

        initStructure: function () {
            if (this.isWeek) {
                this.weekElem = $('<div class="ui-count-weeks"></div>');
                this.weekElem.appendTo(this.main);
            }
            else {
                this.main.addClass('ui-count-nodays');
            }

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
            that.format();
            // that.sliderAnimate();
            that.showCount();               

/*            setInterval (function () {
        	    that.getDif();
                that.calculate();
                that.format();
                that.sliderAnimate();
                that.showCount();              
            }, 1000);*/

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
            // 星期
            this.weeks = Math.floor(this.difTime / (7 *24 * 3600 * 1000));

            // 天
            var leave0 = this.difTime % (7 * 24 * 3600 * 1000);
            if (this.weekElem) {
                this.days = Math.floor(leave0 / (24 * 3600 * 1000));  
            }
            else {
                this.days = Math.floor(this.difTime / (24 * 3600 * 1000)); 
            }
            
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
         * 格式化倒计时数据
         *
         * @protected
         */
        format: function () {
            if (this.weeks < 10)
            {
                this.weeks = parseInt('0' + this.weeks);
            }

            if (this.days < 10)
            {
                this.days = parseInt('0' + this.days);
            }

            if (this.hours < 10)
            {
                this.hours = parseInt('0' + this.hours);
            }

            if (this.minutes < 10)
            {
                this.minutes = parseInt('0' + this.minutes);
            }

            this.secbit = this.seconds % 10;
            this.secten = parseInt(this.seconds / 10);

            console.log(this.secbit);
            console.log(this.secten);
            if (this.seconds.ten === 0)
            {
                this.seconds = parseInt('0' + this.seconds);
            }

        },

        /**
         * 倒计时动画
         *
         * @protected
         */
        sliderAnimate: function () {

            var lastdigital = $('.ui-count-seconds .ui-count-digital-top').html();

            if (this.seconds !== lastdigital) {
                $('.ui-count-seconds .ui-count-digital-top').animate({top: "-94px"}, 1500);
                $('.ui-count-seconds .ui-count-digital-bottom').animate({top: "0"}, 1500);
            }
         
        },


        /**
         * 显示倒计时
         *
         * @protected
         */
        showCount: function () {
            if (this.weekElem) {
                $(this.weekElem).html('<div class="ui-count-digital"><span class="ui-count-digital-top">' + this.days + '</span><span class="ui-count-digital-bottom"></span></div><lable class="ui-count-unit"> WEEKS</lable>'); 
            }
            if (this.dayElem) {
                $(this.dayElem).html('<div class="ui-count-digital"><span class="ui-count-digital-top">' + this.days + '</span><span class="ui-count-digital-bottom"></span></div><lable class="ui-count-unit"> DAYS</lable>'); 
            }
            if (this.hourElem) {
                $(this.hourElem).html('<div class="ui-count-digital"><span class="ui-count-digital-top">' + this.hours + '</span><span class="ui-count-digital-bottom"></span></div><lable class="ui-count-unit"> HOURS</lable>'); 
            }
            if (this.minuteElem) {
                $(this.minuteElem).html('<div class="ui-count-digital"><span class="ui-count-digital-top">' + this.minutes + '</span><span class="ui-count-digital-bottom"></span></div><lable class="ui-count-unit"> MINUTES</lable>'); 
            }
            if (this.secondElem) {
                $(this.secondElem).html('<div class="ui-count-digital"><span class="ui-count-digital-top"><span class="ui-count-digital-top-ten">' + this.secten + '</span><span class="ui-count-digital-top-bit">' + this.secbit + '</span></span><span class="ui-count-digital-bottom">' + (this.seconds - 1) + '</span></div><lable class="ui-count-unit"> SECONDS</lable>'); 
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

