define('ui/DialogFactory', [
    'require',
    'jquery',
    './lib',
    './Dialog'
], function (require) {
    var $ = require('jquery');
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
            var id = 'btn-' + lib.guid();
            var cls = getClass(opts, 'cancel-btn');
            footer += '<a id="' + id + '" href="javascript:;"' + ' class="' + cls + '">' + (opts.cancelTitle || '\u53D6\u6D88') + '</a>';
            opts.title = opts.title || '\u786E\u8BA4';
            opts.cancelId = id;
        }
        if (opts.confirm) {
            var id = 'btn-' + lib.guid();
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
            opts.confirmHandler = function () {
                dlg.fire('confirm');
            };
            $('#' + opts.confirmId).on('click', opts.confirmHandler);
        }
        if (opts.cancelId) {
            dlg.onCancel && dlg.on('cancel', dlg.onCancel);
            opts.cancelHandler = function () {
                dlg.fire('cancel');
            };
            $('#' + opts.cancelId).on('click', opts.cancelHandler);
        }
        dlg.on('beforedispose', function () {
            dlg.un('confirm');
            dlg.un('cancel');
            if (opts.confirmId) {
                $('#' + opts.confirmId).off('click', opts.confirmHandler);
            }
            if (opts.cancelId) {
                $('#' + opts.cancelId).off('click', opts.cancelHandler);
            }
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