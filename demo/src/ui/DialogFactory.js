define('ui/DialogFactory', [
    'require',
    './lib',
    './Dialog'
], function (require) {
    var lib = require('./lib');
    var Dialog = require('./Dialog');
    function getClass(opts, name) {
        name = name ? '-' + name : '';
        var skin = opts.skin;
        return (opts.prefix || 'ecl-ui-dialog') + name + (skin ? ' ' + skin + name : '');
    }
    function genDialog(opts) {
        var footer = opts.footer || '';
        if (opts.cancel) {
            var id = 'btn-' + Math.random();
            var cls = getClass(opts, 'cancel-btn');
            footer += '<a id="' + id + '" href="javascript:;"' + ' class="' + cls + '">' + (opts.cancelTitle || '\u53D6\u6D88') + '</a>';
            opts.title = opts.title || '\u786E\u8BA4';
            opts.cancelId = id;
        }
        if (opts.confirm) {
            var id = 'btn-' + Math.random();
            var cls = getClass(opts, 'confirm-btn');
            footer = '<button id="' + id + '"' + ' class="' + cls + '">' + (opts.confirmTitle || '\u786E\u5B9A') + '</button>' + footer;
            opts.title = opts.title || '\u63D0\u793A';
            opts.confirmId = id;
        }
        opts.footer = footer;
        var dlg = new Dialog(opts);
        dlg.render();
        if (opts.confirmId) {
            dlg.onConfirm && dlg.on('confirm', dlg.onConfirm);
            lib.on(lib.g(opts.confirmId), 'click', opts.confirmHandler = function () {
                dlg.fire('confirm');
            });
        }
        if (opts.cancelId) {
            dlg.onCancel && dlg.on('cancel', dlg.onCancel);
            lib.on(lib.g(opts.cancelId), 'click', opts.cancelHandler = function () {
                dlg.fire('cancel');
                dlg.hide();
            });
        }
        dlg.on('beforedispose', function () {
            dlg.un('confirm');
            dlg.un('cancel');
            opts.confirmId && lib.un(lib.g(opts.confirmId), 'click', opts.confirmHandler);
            opts.cancelId && lib.un(lib.g(opts.cancelId), 'click', opts.cancelHandler);
            opts = null;
        });
        return dlg;
    }
    var DialogFactory = {
            create: function (opts) {
                return genDialog(opts);
            },
            alert: function (opts) {
                opts.confirm = 1;
                return genDialog(opts);
            },
            confirm: function (opts) {
                opts.confirm = 1;
                opts.cancel = 1;
                return genDialog(opts);
            }
        };
    return DialogFactory;
});