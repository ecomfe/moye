define('ui/Control', [
    'require',
    'jquery',
    './lib'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = lib.newClass({
            type: 'Control',
            _disabled: false,
            bindEvents: function (provider) {
                var me = this;
                var bound = this._bound || {};
                $.each(provider, function (name, fn) {
                    if (/^on[A-Z]/.test(name)) {
                        bound[name] = $.proxy(fn, me);
                    }
                });
                this._bound = bound;
            },
            initialize: function (options) {
                options = this.setOptions(options);
                if (this.binds) {
                    lib.binds(this, this.binds);
                }
                if (this.init) {
                    this.init(options);
                    this.init = null;
                }
                this.children = [];
            },
            render: function () {
                throw new Error('not implement render');
            },
            appendTo: function (wrap) {
                this.main = wrap || this.main;
                this.render();
            },
            query: function (className) {
                return $('.' + className, this.main).toArray();
            },
            createElement: function (tagName, properties) {
                var element = document.createElement(tagName || 'div');
                for (var prop in properties) {
                    element[prop] = properties[prop];
                }
                return element;
            },
            disable: function () {
                this._disabled = true;
                this.fire('disable');
            },
            enable: function () {
                this._disabled = false;
                this.fire('enable');
            },
            isDisabled: function () {
                return this._disabled;
            },
            addChild: function (control, name) {
                var children = this.children;
                name = name || control.childName;
                if (name) {
                    children[name] = control;
                }
                children.push(control);
            },
            removeChild: function (control) {
                var children = this.children;
                for (var name in children) {
                    if (children.hasOwnProperty(name)) {
                        if (children[name] === control) {
                            delete this[name];
                        }
                    }
                }
            },
            getChild: function (name) {
                return this.children[name];
            },
            initChildren: function (wrap) {
                throw new Error('not implement initChildren');
            },
            dispose: function () {
                var child;
                while (child = this.children.pop()) {
                    child.dispose();
                }
                for (var type in this._listners) {
                    this.un(type);
                }
                var main = this.main;
                if (main && main.parentNode) {
                    main.parentNode.removeChild(main);
                    delete this.main;
                }
                this.fire('dispose');
            }
        }).implement(lib.observable).implement(lib.configurable);
    return Control;
});