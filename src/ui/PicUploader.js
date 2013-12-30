/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @file 图片上传预览组件
 * @author mengke(mengke01@baidu.com)
 */


define(function (require) {

    var lib = require('./lib');
    var Control = require('./Control');

    /**
     * GUID计数
     * 
     * @type {number}
     */
    var counter = 0;
    
    /**
     * 获得GUID的函数
     * @param {string} tag GUID标签
     * @return {string} 一个不重复的guid字符串
     * 
     * @inner 
     */
    function guid(tag) {
        return 'ui-pic-uploader-' + (tag ? tag + '-' : '') + (counter++);
    }

    /**
     * 检查浏览器是否支持FileReader
     * 
     * @type {boolean}
     */
    var supportFileReader = 'FileReader' in window;


    /**
     * 获取本地图片数据
     * 
     * @param {string} filePath 文件名
     * @param {Function=} callBack 回调函数，返回图片的base64编码
     */
    function getLocalImageData(filePath, callBack) {
        var reader = new FileReader(filePath);
        reader.onload = function(e) {
            callBack && callBack(e.target.result);
            reader = null;
        };
        reader.readAsDataURL(filePath);
    }

    /**
     * 创建一个file节点
     * 
     * @param {Object} options 选项设置
     * @param {string} options.className 类名
     * 
     * @return {HTMLElement} dom节点
     * @inner
     */
    function createFileNode( options ) {
        var node = document.createElement('input');
        node.type = 'file';
        for(var i in options) {
            node[i] = options[i];
        }
        return node;
    }

    /**
     * 对话框
     * 
     * @extends module:Control
     * @requires lib
     * @requires Control
     * @exports PicUploader
     * @example
     *  
     * var uploader = new PicUploader({
     *    main: lib.g('uploader-container'),
     *    maxCount: 3,
     *    fileType: /\.(jpg|png|gif|jpeg)$/
     * });
     * 
     */
    var PicUploader = Control.extend(/** @lends module:PicUploader.prototype */{

        /**
         * 控件类型标识
         * 
         * @type {string}
         * @override
         * @private
         */
        type: 'PicUploader',

        /**
         * 控件配置项
         * 
         * @name module:Dialog#options
         * @type {Object}
         * @property {(string | HTMLElement)} options.main 控件渲染容器
         * @property {string} options.prefix class默认前缀
         * @property {int} options.maxCount 最多选择的图片个数
         * @property {Regexp} options.fileType 图片类型正则
         * @property {string} options.tpl 使用的模板
         * 
         * @private
         */
        options: {

            // 控件渲染主容器
            main: '',

            // 控件class前缀，同时将作为main的class之一
            prefix: 'ecl-ui-picuploader',

            //最多选择图片的个数
            maxCount: 3,

            //支持上传的文件类型
            fileType: /\.(jpg|png|gif|jpeg)$/,

            //模板框架
            tpl:  ''
                + '<div id="#{id}" class="#{pickerClass} #{curClass}">'
                +   '<div class="#{closeClass}" title="关闭">×</div>'
                +   '<div class="#{picClass}"></div>'
                +   '<div class="#{titleClass}">点击上传</div>'
                +   '<a href="javascript:;" class="#{wrapperClass}">'
                +       '<input type="file" class="#{fileClass}">'
                +   '</a>'
                + '</div>'
        },

        /**
         * 需要绑定 this 的方法名，多个方法以半角逗号分开
         * 
         * @type {string}
         * @private
         */
        binds: 'onDisable,onEnable,_closeClick,_fileChange',

        /**
         * 当前已经选择的图片框个数
         * 
         * @type {number}
         * @private
         */
        count: 0,

        /**
         * 当点击关闭的时候
         * 
         * @private
         * @param {HTMLEvent} e dom事件对象
         */
        _closeClick: function(e) {
            var target = lib.getTarget(e);
            var picker = lib.getAncestorByClass(
                target,
                this.getClass('picker')
            );
            this._removePicker(picker);
        },

        /**
         * 当文件选择改变的时候处理函数
         * 
         * @private
         * @param {HTMLEvent} e dom事件对象
         * @fires module:PicUploader#pickerror
         * @fires module:PicUploader#pick
         */
        _fileChange: function(e) {

            var target = lib.getTarget(e);
            var filePath = target.value;

            if(!filePath) {
                return;
            }

            var fileName = filePath.slice( 
                Math.max(
                    filePath.lastIndexOf('/'),
                    filePath.lastIndexOf('\\')
                ) + 1 
            );
            fileName = fileName.slice( 0, fileName.lastIndexOf('.'));

            var picker = lib.getAncestorByClass(
                target,
                this.getClass('picker')
            );

            if(! filePath.match(this.options.fileType) ) {

                //IE浏览器不允许设置file.value这里移除之后再创建一个
                if(lib.browser.ie) {
                    //这里用cloneNode会出现一堆诡异的问题
                    // 只能创建新的节点来替换，会损失一部分原始的信息
                    // 
                    var newTarget = createFileNode({
                        className: target.className
                    });

                    target.parentNode.insertBefore(newTarget, target);

                    //删除事件
                    lib.un(
                        target,
                        'change',
                        this._fileChange
                    );
                    target.parentNode.removeChild(target);

                    //重新绑定事件
                    lib.on(
                        newTarget,
                        'change',
                        this._fileChange
                    );

                }
                else {
                    target.value = '';
                }
                
                lib.addClass(picker, this.getClass('error'));

                /**
                 * @event module:PicUploader#error
                 * @property {Object} event 事件源对象
                 * event.fileName {string} 被移除的文件名
                 */
                this.fire('pickerror', {
                    fileName: filePath

                });
            }
            else {

                var pic = this.getDom('pic', picker);

                //支持fileReader则可以提供预览
                if(supportFileReader) {
                    getLocalImageData(target.files[0], function(data) {
                        var img = document.createElement('IMG');
                        img.src = data;
                        pic.appendChild(img);
                        pic = null;
                    });
                }
                //否则只显示文件名字
                else {
                    pic.innerHTML = '<em>' + fileName + '</em>';
                }

                picker.title = fileName;
                this.getDom('title', picker).innerHTML = fileName;

                //修改class
                lib.removeClass(picker, this.getClass('cur'));
                lib.removeClass(picker, this.getClass('error'));
                lib.addClass(picker, this.getClass('picked'));

                //解绑事件
                lib.un(
                    target,
                    'change',
                    this._fileChange
                );

                this.count++;
                //如果没有超过限制，则继续生成一个上传框
                if(this.count < this.options.maxCount) {
                    this.create();
                }
                
                /**
                 * @event module:PicUploader#error
                 * @param {Object} e 选择文件事件
                 * @param {string} e.fileName 被移除的文件名
                 */
                this.fire('pick', {
                    fileName: filePath
                });

            }
        },

        /**
         * 移出一个已选择的图片框
         * 
         * @private
         * @param {string|HTMLElement} id 选择框元素
         * @fires module:PicUploader#remove
         */
        _removePicker: function(id) {
            var picker = lib.g(id);
            var fileName = this.getDom('file', picker).value;

            //解绑事件
            lib.un( 
                this.getDom('file', picker),
                'change',
                this._fileChange
            );

            lib.un( 
                this.getDom('close', picker),
                'click',
                this._closeClick
            );

            picker.parentNode.removeChild(picker);

            this.count--;

            //如果当前个数小于最大个数减1，则生成一个选择框
            if( this.count === this.options.maxCount-1 ) {
                this.create();
            }

            /**
             * @event module:PicUploader:remove
             * @param {Object} e 事件源对象
             * @param {string} e.fileName 被移除的文件名
             */
            this.fire('remove', {
                fileName: fileName
            });
        },

        /**
         * 绑定图片选择
         * 
         * @private
         * @param {(string|HTMLElement)} id 当前的picker对象
         */
        _bindPicker: function(id) {
            //绑定文件选择
            lib.on(
                this.getDom('file', id), 
                'change',
                this._fileChange
            );

            //绑定关闭
            lib.on(
                this.getDom('close', id), 
                'click',
                this._closeClick
            );
        },

        /**
         * 创建一个上传框
         * @private
         */
        create: function() {
            var id = guid('picker');
            var cls = {
                id: id,
                pickerClass: this.getClass( 'picker' ),
                closeClass: this.getClass( 'close' ),
                picClass: this.getClass( 'pic' ),
                titleClass: this.getClass( 'title' ),
                fileClass: this.getClass( 'file' ),
                curClass: this.getClass( 'cur' ),
                wrapperClass: this.getClass( 'wrapper' )
            };

            //获取HTML
            var html = this.options.tpl.replace( 
                /#\{([\w-.]+)\}/g, 
                function($0, $1) {
                    return cls[$1] || '';
                }
            );

            //插入创建的元素，
            this.options.main.insertAdjacentHTML(
                'beforeend',
                html
            );

            this._bindPicker(this.curPicker = id);
        },


        /**
         * 控件初始化
         * 
         * @param {Object} options 控件配置项
         * @see module:Control#options
         * @private
         */
        init: function (options) {
            if(!options.main && 1 !== options.main.nodeType) {
                throw new Error('invalid main');
            }
            
            this.disabled  = options.disabled;

            if(this.disabled) {
                this.disable();
            }
        },


        /**
         * 根据名字构建的css class名称
         *  
         * @param {string} name 模块名字
         * @return {string} 构建的class名称
         * @private
         */
        getClass: function(name) {
            name = name ? '-' + name : '';
            return this.options.prefix + name;
        },

        /**
         * 获得指定dialog模块的dom元素
         *  
         * @param {string} name 模块名字
         * @param {string} scope 查找范围
         * @return {HTMLElement} 模块的DOM元素
         * @private
         */
        getDom: function(name, scope) {
            return lib.q( 
                this.getClass(name), 
                lib.g(scope)
            )[0];
        },

        /**
         * 绘制控件
         * 
         * @override
         * @public
         */
        render: function () {
            if (!this.rendered) {
                this.id = guid();
                this.create();
                this.rendered = true;
            }

            return this;
        },

        /**
         * 根据文件路径移除图片框
         * 
         * @param {string} filePath 文件路径
         * @return {module:PicUploader} 本对象
         * @private
         */
        remove: function(filePath, checker) {
            var me = this;
            checker = checker || function( removePath, filePath,  index ) {
                index;
                return removePath === filePath;
            };
            lib.each(
                lib.q( this.getClass('file'), this.options.main),
                function(item, index) {
                    if(item.value === filePath) {
                        if(checker(item.value, filePath, index)) {
                            me._removePicker(
                                lib.getAncestorByClass(
                                    item, me.getClass('picker') 
                                )
                            );
                        }
                    }
                } 
            );
            return this;
        },

        /**
         * 根据索引移除图片框
         * 
         * @param {number} index 索引
         * @return {module:PicUploader} 本对象
         * @private
         */
        removeAt: function(index) {
            var list = lib.q( this.getClass('picker'), this.options.main);
            if( list[index].id !== this.curPicker) {
                this._removePicker(list[index]);
            }
            return this;
        },

        /**
         * 获得已经选择的文件列表
         * 
         * @return {Array.<string>} 文件名字列表
         */
        getFileList: function() {
            var me = this;
            var files = [];
            lib.each(
                lib.q( this.getClass('file'), this.options.main),
                function(item) {
                    if( item.value.match(me.options.fileType) ) {
                        files.push(item.value);
                    }
                } 
            );
            return files;
        },

        /**
         * 启用组件
         * 
         * @return {module:PicUploader} 本对象
         */
        enable: function() {

            if(this.curPicker) {
                lib.removeClass(this.options.main, this.getClass('disabled') );
            }

            this.disabled = 0;

            return this;
        },

        /**
         * 禁用组件
         * 
         * @return {PicUploader} 本对象
         */
        disable: function() {

            if(this.curPicker) {
                lib.addClass(this.options.main, this.getClass('disabled') );
            }

            this.disabled = 1;

            return this;
        },

        /**
         * 销毁，注销事件，解除引用
         * 
         * @public
         * @fires module:PicUploader#dispose
         */
        dispose: function() {

            if(this.curPicker) {
                lib.un( 
                    this.getDom('file', this.curPicker),
                    'change',
                    this._fileChange
                );

                lib.un( 
                    this.getDom('close', this.curPicker),
                    'click',
                    this._closeClick
                );
                this.curPicker = 0;
            }

            this.options.main.innerHTML = '';

            this.parent('dispose');
        }
    });

    return PicUploader;
});