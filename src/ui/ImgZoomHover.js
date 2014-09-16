/**
 * Moye (PS UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * @author guoyong03
 * @date 2014-09-12
 
 * @file 预览图放大组件
 */

define(function (require,exports,module) {
    
    var lib = require('./lib');
    var config = require('./config');
    var Control = require('./Control');
    
    /**
     * 被放大图片class
     * 
     * @type {string}
     */
    var CurrentImgClass;

    /**
     * 计时器
     * 
     * @type {string}
     */
    var Timer;
 
 
    /**
     * 预览图放大组件
     * 
     * @constructor
     * @extends module:Control
     * @requires Control
     * @exports ImgZoomHover
     */
    var ImgZoomHover = Control.extend(/** @lends module:Tabs.prototype */{

        /**
         * 控件类型标识
         * 
         * @type {string}
         * @private
         */
        type: 'ImgZoomHover',

        /**
         * 控件配置项
         * 
         * @name module:ImgZoom#options
         * @type {Object}
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @property {string} options.prefix 控件class前缀，同时将作为main的class之一
         * @private
         */
        options: {
            // 控件渲染主容器
            main: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: config.prefix + '-imgZoomHover',

            // 放大图片的最小宽度
            MinWidth:121,

            // 放大图片的最小高度
            MinHeight:90,

            // 放大图片的最大宽度
            MaxWidth:400,

            // 放大图片的最大高度
            MaxHeight:300

        },

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:ImgZoomHover#options
         * @private
         */
        init: function (options){
            this.options.MinWidth = options.MinWidth || this.options.MinWidth;
            this.options.MinHeight = options.MinHeight || this.options.MinHeight;
            this.options.MaxWidth = options.MaxWidth || this.options.MaxWidth;
            this.options.MaxHeight = options.MaxHeight || this.options.MaxHeight;
        },


        /**
         * 渲染控件，绑定事件
         * 
         * @param {Array} $img 图片对象数组
         * @private
         */
        render: function ($imgs) {
            var options = this.options;
            var _this = this;
            $imgs.each(function (i) {

                // 如果图片不可点，或图片没有data-zoomImg属性，return
                if(!$(this).attr("data-zoomImg") ||!$(this).parent().attr('href')){
                    return
                }

                // rsv_imgZoom：0，小图点击跳转，fm:as/alop
                // rsv_imgZoom：1，大图点击跳转，fm:as/alop
                // rsv_imgZoom：2，mousein显示大图，fm:beha
                // rsv_imgZoom：3，mouseout关闭大图，fm:beha
                $(this).parent().attr("data-click","{'rsv_imgZoom':'0'}");

                $(this).parent().css("display","block");

                var $img = $(this),
                $a = $img.parent(),
                $container = $img.parents(".result,.result-op"),
                imgClass = [options.prefix,'img',i].join('-');             

                if (!$container.length) {return};
                
                var data = {
                    src: $img.attr('data-zoomImg'),
                    href: $a.attr('href'),
                    imgClass: imgClass,

                    // 点击参数,仅大搜索环境有效
                    click: '"mu":"' + ($container.attr("mu") || $a.attr('href')) + '","p1":"' + $container.attr("id") + '","rsv_srcid":"' + $container.attr("srcid") + '"',

                    // rsv_imgZoom：1，大图点击跳转，fm:as/alop
                    click_fm: ($container.hasClass("result-op")?"alop":"as"),
                    click_rsv_imgZoom: '1'
                };

                $(this).bind({
                    mouseover: function (event) {
                        imgPosition = $img.offset();
                        data.top = lib.browser.ie && lib.browser.ie <=6 
                                    ? imgPosition.top + document.body.scrollTop -2 
                                    : imgPosition.top;
                        data.left = lib.browser.ie && lib.browser.ie <=6 
                                    ? imgPosition.left -3 
                                    : imgPosition.left;
                        data.width = $img.width();
                        data.height = $img.height();

                        //修正放大图最小高宽
                        options.MinWidth = $img.width();
                        options.MinHeight = $img.height();

                        clearTimeout(Timer);
                        $img.addClass(imgClass);

                        if(CurrentImgClass){
                            _this.closeImgZoom(CurrentImgClass);
                        }
                        CurrentImgClass = imgClass;

                        _this.createImgZoomContainer(data);

                    },
                    mouseout: function(event){
                        if(CurrentImgClass != null) {
                            Timer = setTimeout(function(){
                                _this.closeImgZoom(CurrentImgClass)},250);

                            //发统计 rsv_imgZoom：3，mouseout关闭大图，fm:beha
                            if(window.c){
                                window.c($.parseJSON('{'+data.click+',"fm":"beha","rsv_imgZoom":"3"}'));
                            }
                        }

                    }  


                });
            });
        },


        /**
         * 关闭放大效果
         * 
         * @param {string} img 原图class属性
         * @private
         */
        closeImgZoom: function (img) {
            img = img || CurrentImgClass;
            this.close();
            CurrentImgClass = null;
        },

        /**
         * 创建放大图片容器
         * 
         * @param {object} data 原图属性参数
         * @private
         */
        createImgZoomContainer: function (data) {
            var _this = this;
            var options = this.options
            var imgClass = data.imgClass || CurrentImgClass;

            // 放大图片容器
            var $container = $('<div class="'+options.prefix+'-container xpath-log" data-click=\'{'+data.click+',"fm":"'+ data.click_fm +'","rsv_imgZoom":"'+data.click_rsv_imgZoom+'"}\' style="left:' + (data.left + data.width +7) + 'px;"></div>'); 
            
            // loading
            var $loading = $('<i class="c-loading" style="top:'+(data.height-50)/2+'px;left:'+(data.width-50)/2+'px;"></i>');
            
            $(document.body).append($container.append($loading));

            // 放大图片本身
            var $imgZoom=$('<img class="'+options.prefix+'" src="'+data.src+'">').bind({
                load:function () {
                    $loading.hide();
                    _this.rePositionImgZoom(data);
                    $imgZoom.animate({opacity:'show'},500);

                    //发统计 rsv_imgZoom：2，mousein显示大图，fm:beha
                    if(window.c){
                        window.c($.parseJSON('{'+data.click+',"fm":"beha","rsv_imgZoom":"2"}'))
                    }
                },
                mouseover:function(){
                    clearTimeout(Timer);
                },
                mouseout:function(){
                    Timer = setTimeout(function(){
                        _this.closeImgZoom(CurrentImgClass)},250);
                },
                error:function () {
                    _this.closeImgZoom(data.imgClass);
                }
            });

            $container.append($('<a class="'+options.prefix+'-link" href="'+data.href+'" target="_blank"></a>').bind({click: function () {_this.closeImgZoom(data.imgClass);}}).append($imgZoom));


        },

        /**
         * 删除放大图片容器
         * 
         * @private
         */
        removeImgZoomContainer: function () {
            var options = this.options;
            $('.' + options.prefix + '-container').remove();
        },

        /**
         * 约束图片大小，重新定位图片
         * 
         * @param {object} data 原图属性参数
         * @private
         */
        rePositionImgZoom: function (data) {
            var options = this.options;
            var SreenHeight = (lib.browser.ie && lib.browser.ie <= 6 
                ? document.body.offsetHeight
                : $(window).height());

            //放大方式，1向下，2向上，3居中
            var zoomStyle = 3;

            // 放大的图片
            var $imgZoom = $('.' + options.prefix);
            var imgZoomHeight = $imgZoom.height();
            var imgZoomWidth = $imgZoom.width();

            // 放大图片容器
            var $imgZoomContainer = $('.' + options.prefix + '-container');

            // 原图距屏幕上边距
            var imgTop = data.top - (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);

            var topLeft = imgTop - 63;
            var bottomLeft = SreenHeight - imgTop - data.height;

            // 根据最大宽度和最大高度，约束图片放大效果，等比缩放
            if(imgZoomWidth/imgZoomHeight > options.MaxWidth/options.MaxHeight) {
                if($imgZoom.width() >= options.MaxWidth) {
                    $imgZoom.css("width",options.MaxWidth);
                }          
            }
            else{
                if($imgZoom.height() >= options.MaxHeight) {
                    $imgZoom.css("height",options.MaxHeight);
                }   
            }

            // 当原图小于展现大小，放大时按展现大小展现
            if($imgZoom.height() < options.MinHeight || $imgZoom.width() < options.MinWidth ) {
                $imgZoom.css("height",options.MinHeight);
                $imgZoom.css("width",options.MinWidth);
            } 

            var zoomImgHeight = $imgZoom.height() - data.height;



            if(topLeft < zoomImgHeight/2){
                zoomStyle = 1;
            }
            else if(bottomLeft < zoomImgHeight/2) {
                zoomStyle = 2;
            };


            switch(zoomStyle) {
                case 1:$imgZoomContainer.css("top",data.top -10);
                    break;
                
                case 2:$imgZoomContainer.css("top",data.top - zoomImgHeight + bottomLeft - 10);
                    break;
                
                case 3:$imgZoomContainer.css("top",data.top - zoomImgHeight/2 -10);
                    break;
            }

        },

        /**
         * 关闭放大整体效果
         * 
         * @private
         */
        close: function () {
            this.removeImgZoomContainer();
        },

        /**
         * 销毁
         * 
         * @private
         */
        dispose:function () {
            this.close();
            CurrentImgClass = null;
            clearTimeout(Timer);
            Timer = null;
        }
    });

    module.exports = ImgZoomHover;

});
