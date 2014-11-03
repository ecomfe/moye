/**
 * @file MOYE主模块
 * @author Leon(leon@outlook.com)
 */
define(function (require) {

    /**
     * 控件库配置数据
     *
     * @type {Object}
     * @ignore
     */
    var config = {
        uiPrefix: 'data-ui',
        instanceAttr: 'data-ctrl-id',
        uiClassPrefix: 'ui',
        skinClassPrefix: 'skin',
        stateClassPrefix: 'state',
        domIDPrefix: ''
    };

    var exports = {};

    exports.config = function (options) {
        config = $.extend(configs, options);
    };

    exports.getConfig = function (name) {
        return config[name];
    };

    return exports;
});
