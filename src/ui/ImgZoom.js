/**
 * Moye (PS UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * @author wuyou,guoyong03
 * @date 2014-08-19
 
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
     * 预览图放大组件
     * 
     * @constructor
     * @extends module:Control
     * @requires Control
     * @exports ImgZoom
     */
    var ImgZoom = Control.extend(/** @lends module:Tabs.prototype */{

        /**
         * 控件类型标识
         * 
         * @type {string}
         * @private
         */
        type: 'ImgZoom',

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
            prefix: config.prefix + '-imgZoom',

            // 放大图片的最小宽度
            MinWidth:121,

            // 放大图片的最小高度
            MinHeight:90,

            // 放大图片的最大宽度
            MaxWidth:538,

            // 放大图片的最大高度
            MaxHeight:404,
        },

        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:ImgZoom#options
         * @private
         */
        init: function (options){
            this.options.MinWidth = options.MinWidth;
            this.options.MinHeight = options.MinHeight;
            this.options.MaxWidth = options.MaxWidth;
            this.options.MaxHeight = options.MaxHeight;
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

                // rsv_imgZoom：0，点小图放大，fm:beha
                $(this).parent().attr("data-click","{'fm':'beha','rsv_imgZoom':'0'}")

                $(this).bind({
                    click: function (event) {
                        var $img = $(this),
                        $a = $img.parent(),
                        $container = $img.parents(".result,.result-op"),
                        imgClass = [options.prefix,'img',i].join('-'),
                        imgPosition = $img.offset();

                        if (!$container.length) {return};
                        
                        var data = {
                            src: $img.attr('data-zoomImg'),
                            href: $a.attr('href'),
                            top: lib.browser.ie && lib.browser.ie <=6 
                                ? imgPosition.top + document.body.scrollTop -2 
                                : imgPosition.top,
                            left: lib.browser.ie && lib.browser.ie <=6 
                                ? imgPosition.left -3 
                                : imgPosition.left,
                            width: $img.width(),
                            height: $img.height(),
                            imgClass: imgClass,

                            // 点击参数,仅大搜索环境有效
                            click: "'mu':'" + ($container.attr("mu") || $a.attr('href')) + "','p1':'" + $container.attr("id") + "','rsv_srcid':'" + $container.attr("srcid") + "'",

                            // rsv_imgZoom：0，点小图放大，fm:beha
                            // rsv_imgZoom：1，大图点击跳转，fm:as/alop
                            // rsv_imgZoom：2，close点击关闭，fm:beha
                            // rsv_imgZoom：3，点击其他部位关闭，fm:beha
                            click_fm: ($container.hasClass("result-op")?"alop":"as"),
                            click_rsv_imgZoom: '1'
                        };

                        //修正放大图最小高宽
                        options.MinWidth = $img.width();
                        options.MinHeight = $img.height();

                        // 修改原图鼠标样式为默认
                        $img.css({cursor:'pointer'}).addClass(imgClass);

                        CurrentImgClass = imgClass;

                        _this.createMask(data);
                        _this.createImgZoomContainer(data);

                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }

                // 恢复原图鼠标样式为放大镜
                }).css({cursor:'url(http://www.baidu.com/aladdin/img/ImgZoom/big.cur),auto'});
            });
        },

        /**
         * 创建遮罩层
         * 
         * @param {object} data 原图属性参数
         * @private
         */
        createMask: function (data) {
            var _this = this;
            var options = this.options;
            var $body = $(document.body);
            var $mask = $(''
                + '<div class="' + options.prefix + '-mask xpath-log" '
                + 'style="width: ' 
                + (lib.browser.ie && lib.browser.ie <=6 
                    ? $body.width() - 22 
                    : $body.width()) 
                + 'px; height: ' + $(document).height()+ 'px;" '
                + 'data-click="{' 
                + data.click + ',\'fm\':\'beha\',\'rsv_imgZoom\':\'3\'}">'
                + '<iframe frameborder="0" src="about:blank"></iframe>'
                + '<div class="OP_LOG_OTHERS">&nbsp;</div></div>'
                ).bind({click: function () {_this.closeImgZoom();}});
            $body.append($mask);
        },

        /**
         * 删除遮罩层
         * 
         * @private
         */
        removeMask: function () {
            var options = this.options;
            $('.' + options.prefix + '-mask').remove();
        },

        /**
         * 关闭放大效果
         * 
         * @param {string} img 原图class属性
         * @private
         */
        closeImgZoom: function (img) {
            img = img || CurrentImgClass;
            $('.' + img).css({cursor:'url(http://www.baidu.com/aladdin/img/ImgZoom/big.cur),auto'});
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
            var $container = $('<div class="'+options.prefix+'-container xpath-log" data-click="{'+data.click+',\'fm\':\''+ data.click_fm +'\',\'rsv_imgZoom\':\''+data.click_rsv_imgZoom+'\'}" style="left:'+data.left+'px;top:'+data.top+'px;"></div>'); 

            // 关闭按钮
            var $close = $('<a class="'+options.prefix+'-close" href="###" data-click="{'+data.click+',\'fm\':\'beha\',\'rsv_imgZoom\':\'2\'}" onclick="return false;"><span></span></a>').bind({click: function () {_this.closeImgZoom(imgClass);}});
            
            // loading
            var $loading = $('<i class="c-loading" style="top:'+(data.height-50)/2+'px;left:'+(data.width-50)/2+'px;"></i>');
            
            $(document.body).append($container.append($close).append($loading));

            // 放大图片本身
            var $imgZoom=$('<img class="'+options.prefix+'" src="'+data.src+'">').bind({
                load:function () {
                    $loading.hide();
                    _this.rePositionImgZoom(data);
                    $imgZoom.show();
                    $close.css({display:'block'});
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
            var MiddleSreen = (lib.browser.ie && lib.browser.ie <= 6 
                ? document.body.offsetHeight/2
                : $(window).height()/2);            

            // 放大的图片
            var $imgZoom = $('.' + options.prefix);
            var imgZoomHeight = $imgZoom.height();
            var imgZoomWidth = $imgZoom.width();

            // 放大图片容器
            var $imgZoomContainer = $('.' + options.prefix + '-container');

            // 原图距屏幕上边距
            var imgTop = data.top - (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);

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

            // 当原图在屏幕中线以下
            if(imgTop >= MiddleSreen) {
                $imgZoomContainer.css("top",data.top + data.height - $imgZoom.height());
            }

            // 当原图在屏幕中线范围
            else if(imgTop < MiddleSreen && imgTop+data.height > MiddleSreen) {
                $imgZoomContainer.css("top",data.top - ($imgZoom.height() - data.height)/2);
            }
        },

        /**
         * 关闭放大整体效果
         * 
         * @private
         */
        close: function () {
            this.removeImgZoomContainer();
            this.removeMask();
        },

        /**
         * 销毁
         * 
         * @private
         */
        dispose:function () {
            this.close();
            CurrentImgClass=null;
        }
    });

    module.exports = ImgZoom;

});
