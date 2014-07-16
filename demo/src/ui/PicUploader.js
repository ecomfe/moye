define('ui/PicUploader', [
    'require',
    './lib',
    './Control'
], function (require) {
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
                return lib.q(privates.getClass.call(this, name), lib.g(scope))[0];
            },
            onCloseClick: function (e) {
                var target = lib.getTarget(e);
                var picker = lib.getAncestorByClass(target, privates.getClass.call(this, 'picker'));
                privates.removePicker.call(this, picker);
            },
            onFileChange: function (e) {
                var target = lib.getTarget(e);
                var filePath = target.value;
                if (!filePath) {
                    return;
                }
                var fileName = filePath.slice(Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\')) + 1);
                fileName = fileName.slice(0, fileName.lastIndexOf('.'));
                var picker = lib.getAncestorByClass(target, privates.getClass.call(this, 'picker'));
                var bound = this._bound;
                if (!filePath.match(this.options.fileType)) {
                    if (lib.browser.ie) {
                        var newTarget = createFileNode({ className: target.className });
                        target.parentNode.insertBefore(newTarget, target);
                        lib.un(target, 'change', bound.onFileChange);
                        target.parentNode.removeChild(target);
                        lib.on(newTarget, 'change', bound.onFileChange);
                    } else {
                        target.value = '';
                    }
                    lib.addClass(picker, privates.getClass.call(this, 'error'));
                    this.fire('pickerror', { fileName: filePath });
                } else {
                    var pic = privates.getDom.call(this, 'pic', picker);
                    if (supportFileReader) {
                        getLocalImageData(target.files[0], function (data) {
                            var img = document.createElement('IMG');
                            img.src = data;
                            pic.appendChild(img);
                            pic = null;
                        });
                    } else {
                        pic.innerHTML = '<em>' + fileName + '</em>';
                    }
                    picker.title = fileName;
                    privates.getDom.call(this, 'title', picker).innerHTML = fileName;
                    lib.removeClass(picker, privates.getClass.call(this, 'cur'));
                    lib.removeClass(picker, privates.getClass.call(this, 'error'));
                    lib.addClass(picker, privates.getClass.call(this, 'picked'));
                    lib.un(target, 'change', bound.onFileChange);
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
                lib.un(privates.getDom.call(this, 'file', picker), 'change', bound.onFileChange);
                lib.un(privates.getDom.call(this, 'close', picker), 'click', bound.onCloseClick);
                picker.parentNode.removeChild(picker);
                this.count--;
                if (this.count === this.options.maxCount - 1) {
                    privates.create.call(this);
                }
                this.fire('remove', { fileName: fileName });
            },
            bindPicker: function (id) {
                var bound = this._bound;
                lib.on(privates.getDom.call(this, 'file', id), 'change', bound.onFileChange);
                lib.on(privates.getDom.call(this, 'close', id), 'click', bound.onCloseClick);
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
                lib.each(lib.q(privates.getClass.call(this, 'file'), this.options.main), function (item, index) {
                    if (item.value === filePath) {
                        if (checker(item.value, filePath, index)) {
                            privates.removePicker.call(me, lib.getAncestorByClass(item, privates.getClass.call(me, 'picker')));
                        }
                    }
                });
                return this;
            },
            removeAt: function (index) {
                var list = lib.q(privates.getClass.call(this, 'picker'), this.options.main);
                if (list[index] !== this.curPicker) {
                    privates.removePicker.call(this, list[index]);
                }
                return this;
            },
            getFileList: function () {
                var me = this;
                var files = [];
                lib.each(lib.q(privates.getClass.call(this, 'file'), this.options.main), function (item) {
                    if (item.value.match(me.options.fileType)) {
                        files.push(item.value);
                    }
                });
                return files;
            },
            enable: function () {
                if (this.curPicker) {
                    lib.removeClass(this.options.main, privates.getClass.call(this, 'disabled'));
                }
                this._disabled = 0;
                return this;
            },
            disable: function () {
                if (this.curPicker) {
                    lib.addClass(this.options.main, privates.getClass.call(this, 'disabled'));
                }
                this._disabled = 1;
                return this;
            },
            dispose: function () {
                if (this.curPicker) {
                    var bound = this._bound;
                    lib.un(privates.getDom.call(this, 'file', this.curPicker), 'change', bound.onFileChange);
                    lib.un(privates.getDom.call(this, 'close', this.curPicker), 'click', bound.onCloseClick);
                    this.curPicker = 0;
                }
                this.options.main.innerHTML = '';
                this.parent('dispose');
            }
        });
    return PicUploader;
});