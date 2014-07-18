define('ui/PicUploader', [
    'require',
    'jquery',
    './lib',
    './Control'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var supportFileReader = 'FileReader' in window;
    function getLocalImageData(filePath, callBack) {
        var reader = new FileReader(filePath);
        reader.onload = function (e) {
            callBack && callBack(e.target.result);
            reader = null;
        };
        reader.readAsDataURL(filePath);
    }
    function createFileNode(options) {
        var node = document.createElement('input');
        node.type = 'file';
        for (var i in options) {
            node[i] = options[i];
        }
        return node;
    }
    var privates = {
            getClass: function (name) {
                name = name ? '-' + name : '';
                return this.options.prefix + name;
            },
            getDom: function (name, scope) {
                return $('.' + privates.getClass.call(this, name), lib.g(scope))[0];
            },
            onCloseClick: function (e) {
                var target = $(e.target);
                var clazz = '.' + privates.getClass.call(this, 'picker');
                var picker = target.closest(clazz)[0];
                privates.removePicker.call(this, picker);
            },
            onFileChange: function (e) {
                var target = $(e.target);
                var filePath = target.val();
                if (!filePath) {
                    return;
                }
                var pos = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
                var fileName = filePath.slice(pos + 1);
                fileName = fileName.slice(0, fileName.lastIndexOf('.'));
                var clazz = '.' + privates.getClass.call(this, 'picker');
                var picker = target.closest(clazz);
                var bound = this._bound;
                if (!filePath.match(this.options.fileType)) {
                    if (lib.browser.ie) {
                        var newTarget = createFileNode({ className: target.attr('class') });
                        target.after(newTarget).off('change', bound.onFileChange).remove();
                        $(newTarget).on('change', bound.onFileChange);
                    } else {
                        target.val('');
                    }
                    picker.addClass(privates.getClass.call(this, 'error'));
                    this.fire('pickerror', { fileName: filePath });
                } else {
                    var pic = privates.getDom.call(this, 'pic', picker.get(0));
                    if (supportFileReader) {
                        getLocalImageData(target.get(0).files[0], function (data) {
                            var img = document.createElement('IMG');
                            img.src = data;
                            pic.appendChild(img);
                            pic = null;
                        });
                    } else {
                        pic.innerHTML = '<em>' + fileName + '</em>';
                    }
                    privates.getDom.call(this, 'title', picker.get(0)).innerHTML = fileName;
                    picker.attr('title', fileName).removeClass(privates.getClass.call(this, 'cur')).removeClass(privates.getClass.call(this, 'error')).addClass(privates.getClass.call(this, 'picked'));
                    target.off('change', bound.onFileChange);
                    this.count++;
                    if (this.count < this.options.maxCount) {
                        privates.create.call(this);
                    }
                    this.fire('pick', { fileName: filePath });
                }
            },
            removePicker: function (picker) {
                var fileName = privates.getDom.call(this, 'file', picker).value;
                var bound = this._bound;
                $(privates.getDom.call(this, 'file', picker)).off('change', bound.onFileChange);
                $(privates.getDom.call(this, 'close', picker)).off('click', bound.onCloseClick);
                picker.parentNode.removeChild(picker);
                this.count--;
                if (this.count === this.options.maxCount - 1) {
                    privates.create.call(this);
                }
                this.fire('remove', { fileName: fileName });
            },
            bindPicker: function (id) {
                var bound = this._bound;
                $(privates.getDom.call(this, 'file', id)).on('change', bound.onFileChange);
                $(privates.getDom.call(this, 'close', id)).on('click', bound.onCloseClick);
            },
            create: function () {
                var cls = {
                        closeClass: privates.getClass.call(this, 'close'),
                        picClass: privates.getClass.call(this, 'pic'),
                        titleClass: privates.getClass.call(this, 'title'),
                        fileClass: privates.getClass.call(this, 'file'),
                        wrapperClass: privates.getClass.call(this, 'wrapper')
                    };
                var picker = this.createElement('div', { 'className': privates.getClass.call(this, 'picker') + ' ' + privates.getClass.call(this, 'cur') });
                picker.innerHTML = this.options.tpl.replace(/#\{([\w-.]+)\}/g, function ($0, $1) {
                    return cls[$1] || '';
                });
                this.options.main.appendChild(picker);
                privates.bindPicker.call(this, this.curPicker = picker);
            }
        };
    var PicUploader = Control.extend({
            type: 'PicUploader',
            options: {
                main: '',
                prefix: 'ecl-ui-picuploader',
                maxCount: 3,
                fileType: /\.(jpg|png|gif|jpeg)$/,
                tpl: '' + '<div class="#{closeClass}" title="\u5173\u95ED">\xD7</div>' + '<div class="#{picClass}"></div>' + '<div class="#{titleClass}">\u70B9\u51FB\u4E0A\u4F20</div>' + '<a href="javascript:;" class="#{wrapperClass}">' + '<input type="file" class="#{fileClass}">' + '</a>'
            },
            count: 0,
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
            render: function () {
                if (!this.rendered) {
                    privates.create.call(this);
                    this.rendered = true;
                }
                return this;
            },
            remove: function (filePath, checker) {
                var me = this;
                checker = checker || function (removePath, filePath, index) {
                    index;
                    return removePath === filePath;
                };
                $('.' + privates.getClass.call(this, 'file'), this.main).each(function (index, item) {
                    if (item.value === filePath && checker(item.value, filePath, index)) {
                        privates.removePicker.call(me, $(item).closest('.' + privates.getClass.call(me, 'picker')).get(0));
                    }
                });
                return this;
            },
            removeAt: function (index) {
                var list = $('.' + privates.getClass.call(this, 'picker'), this.options.main);
                if (list[index] !== this.curPicker) {
                    privates.removePicker.call(this, list[index]);
                }
                return this;
            },
            getFileList: function () {
                var me = this;
                return $('.' + privates.getClass.call(this, 'file'), this.options.main).map(function (i, item) {
                    return item.value.match(me.options.fileType) ? item.value : null;
                }).get();
            },
            enable: function () {
                if (this.curPicker) {
                    $(this.options.main).removeClass(privates.getClass.call(this, 'disabled'));
                }
                this._disabled = 0;
                return this;
            },
            disable: function () {
                if (this.curPicker) {
                    $(this.options.main).addClass(privates.getClass.call(this, 'disabled'));
                }
                this._disabled = 1;
                return this;
            },
            dispose: function () {
                if (this.curPicker) {
                    var bound = this._bound;
                    $(privates.getDom.call(this, 'file', this.curPicker)).off('change', bound.onFileChange);
                    $(privates.getDom.call(this, 'close', this.curPicker)).off('click', bound.onCloseClick);
                    this.curPicker = 0;
                }
                this.options.main.innerHTML = '';
                this.parent('dispose');
            }
        });
    return PicUploader;
});