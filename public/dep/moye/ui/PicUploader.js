/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 图片上传预览组件
 * @author mengke(mengke01@baidu.com)
 */


define(function (require) {

    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');

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
        reader.onload = function (e) {
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

    function createFileNode(options) {
        var node = document.createElement('input');
        node.type = 'file';
        for (var i in options) {
            node[i] = options[i];
        }
        return node;
    }

    /**
     * 私有函数或方法
     *
     * @type {Object}
     * @namespace
     * @name module:PicUploader~privates
     */
    var privates = /** @lends module:PicUploader~privates */ {


        /**
         * 根据名字构建的css class名称
         *
         * @param {string} name 模块名字
         * @return {string} 构建的class名称
         * @private
         */
        getClass: function (name) {
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
        getDom: function (name, scope) {
            return $('.' + privates.getClass.call(this, name), lib.g(scope))[0];
        },

        /**
         * 当点击关闭的时候
         *
         * @private
         * @param {HTMLEvent} e dom事件对象
         */
        onCloseClick: function (e) {
            var target = $(e.target);
            var clazz = '.' + privates.getClass.call(this, 'picker');
            var picker = target.closest(clazz)[0];
            privates.removePicker.call(this, picker);
        },

        /**
         * 当文件选择改变的时候处理函数
         *
         * @private
         * @param {HTMLEvent} e dom事件对象
         * @fires module:PicUploader#pickerror
         * @fires module:PicUploader#pick
         */
        onFileChange: function (e) {

            var target = $(e.target);
            var filePath = target.val();

            if (!filePath) {
                return;
            }

            var pos      = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
            var fileName = filePath.slice(pos + 1);
            fileName = fileName.slice(0, fileName.lastIndexOf('.'));
            var clazz    = '.' + privates.getClass.call(this, 'picker');
            var picker   = target.closest(clazz);
            var bound    = this._bound;

            if (!filePath.match(this.options.fileType)) {

                // IE浏览器不允许设置file.value这里移除之后再创建一个
                if (lib.browser.ie) {

                    // 这里用cloneNode会出现一堆诡异的问题
                    // 只能创建新的节点来替换，会损失一部分原始的信息
                    var newTarget = createFileNode({
                        className: target.attr('class')
                    });

                    // 销毁旧的input
                    target
                        .after(newTarget)
                        .off('change', bound.onFileChange)
                        .remove();

                    // 重新绑定事件
                    $(newTarget).on('change', bound.onFileChange);

                }
                else {
                    target.val('');
                }

                picker.addClass(privates.getClass.call(this, 'error'));

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

                var pic = privates.getDom.call(this, 'pic', picker.get(0));

                // 支持fileReader则可以提供预览
                if (supportFileReader) {
                    getLocalImageData(target.get(0).files[0], function (data) {
                        var img = document.createElement('IMG');
                        img.src = data;
                        pic.appendChild(img);
                        pic = null;
                    });
                }

                // 否则只显示文件名字
                else {
                    pic.innerHTML = '<em>' + fileName + '</em>';
                }

                privates.getDom.call(this, 'title', picker.get(0)).innerHTML = fileName;

                // 修改class
                picker
                    .attr('title', fileName)
                    .removeClass(privates.getClass.call(this, 'cur'))
                    .removeClass(privates.getClass.call(this, 'error'))
                    .addClass(privates.getClass.call(this, 'picked'));

                // 解绑事件
                target.off('change', bound.onFileChange);

                this.count++;

                // 如果没有超过限制，则继续生成一个上传框
                if (this.count < this.options.maxCount) {
                    privates.create.call(this);
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
         * @param {HTMLElement} picker 选择框元素
         * @fires module:PicUploader#remove
         */
        removePicker: function (picker) {

            var fileName = privates.getDom.call(this, 'file', picker).value;
            var bound = this._bound;

            // 解绑事件
            $(privates.getDom.call(this, 'file', picker)).off('change', bound.onFileChange);
            $(privates.getDom.call(this, 'close', picker)).off('click', bound.onCloseClick);

            picker.parentNode.removeChild(picker);

            this.count--;

            // 如果当前个数小于最大个数减1，则生成一个选择框
            if (this.count === this.options.maxCount - 1) {
                privates.create.call(this);
            }

            /**
             * @event module:PicUploader#remove
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
        bindPicker: function (id) {
            var bound = this._bound;

            // 绑定文件选择
            $(privates.getDom.call(this, 'file', id)).on('change', bound.onFileChange);

            // 绑定关闭
            $(privates.getDom.call(this, 'close', id)).on('click', bound.onCloseClick);
        },

        /**
         * 创建一个上传框
         * @private
         */
        create: function () {
            var cls = {
                closeClass: privates.getClass.call(this, 'close'),
                picClass: privates.getClass.call(this, 'pic'),
                titleClass: privates.getClass.call(this, 'title'),
                fileClass: privates.getClass.call(this, 'file'),
                wrapperClass: privates.getClass.call(this, 'wrapper')
            };

            // 渲染主框架内容
            var picker = this.createElement('div', {
                'className': privates.getClass.call(this, 'picker')
                        + ' '
                        + privates.getClass.call(this, 'cur')
            });

            picker.innerHTML = this.options.tpl.replace(
                /#\{([\w-.]+)\}/g,
                function ($0, $1) {
                    return cls[$1] || '';
                }
            );

            this.options.main.appendChild(picker);
            privates.bindPicker.call(this, this.curPicker = picker);
        }

    };

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

            // 最多选择图片的个数
            maxCount: 3,

            // 支持上传的文件类型
            fileType: /\.(jpg|png|gif|jpeg)$/,

            // 模板框架
            tpl: ''
                +   '<div class="#{closeClass}" title="关闭">×</div>'
                +   '<div class="#{picClass}"></div>'
                +   '<div class="#{titleClass}">点击上传</div>'
                +   '<a href="javascript:;" class="#{wrapperClass}">'
                +       '<input type="file" class="#{fileClass}">'
                +   '</a>'
        },


        /**
         * 当前已经选择的图片框个数
         *
         * @type {number}
         * @private
         */
        count: 0,

        /**
         * 控件初始化
         *
         * @param {Object} options 控件配置项
         * @see module:Control#options
         * @private
         */
        init: function (options) {
            if (!options.main && 1 !== options.main.nodeType) {
                throw new Error('invalid main');
            }

            this.bindEvents(privates);

            this._disabled = options.disabled;

            if (this._disabled) {
                this.disable();
            }
        },


        /**
         * 绘制控件
         *
         * @override
         * @public
         */
        render: function () {
            if (!this.rendered) {
                privates.create.call(this);
                this.rendered = true;
            }

            return this;
        },

        /**
         * 根据文件路径移除图片框
         *
         * @param {string} filePath 文件路径
         * @return {module:PicUploader} 本对象
         * @publick
         */
        remove: function (filePath, checker) {
            var me = this;
            checker = checker ||
            function (removePath, filePath, index) {
                index;
                return removePath === filePath;
            };

            $('.' + privates.getClass.call(this, 'file'), this.main).each(function (index, item) {
                if (item.value === filePath && checker(item.value, filePath, index)) {
                    privates.removePicker.call(
                        me,
                        $(item).closest('.' + privates.getClass.call(me, 'picker')).get(0)
                    );
                }
            });

            return this;
        },


        /**
         * 根据索引移除图片框
         *
         * @param {number} index 索引
         * @return {module:PicUploader} 本对象
         * @public
         */
        removeAt: function (index) {
            var list = $('.' + privates.getClass.call(this, 'picker'), this.options.main);
            if (list[index] !== this.curPicker) {
                privates.removePicker.call(this, list[index]);
            }
            return this;
        },

        /**
         * 获得已经选择的文件列表
         *
         * @return {Array.<string>} 文件名字列表
         * @public
         */
        getFileList: function () {
            var me = this;
            return $('.' + privates.getClass.call(this, 'file'), this.options.main)
                .map(function (i, item) {
                    return item.value.match(me.options.fileType) ? item.value : null;
                })
                .get();
        },

        /**
         * 启用组件
         *
         * @return {module:PicUploader} 本对象
         * @override
         */
        enable: function () {

            if (this.curPicker) {
                $(this.options.main).removeClass(privates.getClass.call(this, 'disabled'));
            }

            this._disabled = 0;

            return this;
        },

        /**
         * 禁用组件
         *
         * @return {module:PicUploader} 本对象
         * @override
         */
        disable: function () {

            if (this.curPicker) {
                $(this.options.main).addClass(privates.getClass.call(this, 'disabled'));
            }

            this._disabled = 1;

            return this;
        },

        /**
         * 销毁，注销事件，解除引用
         *
         * @public
         * @fires module:PicUploader#dispose
         * @override
         */
        dispose: function () {

            if (this.curPicker) {
                var bound = this._bound;

                $(privates.getDom.call(this, 'file', this.curPicker))
                    .off('change', bound.onFileChange);

                $(privates.getDom.call(this, 'close', this.curPicker))
                    .off('click', bound.onCloseClick);

                this.curPicker = 0;
            }

            this.options.main.innerHTML = '';

            this.parent('dispose');
        }
    });

    return PicUploader;
});

