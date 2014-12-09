/**
 * @file 浏览器相关小工具
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    /* jshint -W101 */
    var reg = /(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/;
    var UA = navigator.userAgent.toLowerCase().match(reg)
        || [null, 'unknown', 0];
    var mode = UA[1] === 'ie' && document.documentMode;

    /**
     * 浏览器信息
     *
     * @namespace module:lib.browser
     * @property {string} name 浏览器名称，
     * 如 ( opera | ie | firefox | chrome | safari )
     * @property {number} version 浏览器版本
     * @property {number} (browser.name) 是否指定浏览器，
     * 如 ie 6 时为 lib.browser.ie = 6
     * @property {boolean} (browser.name+browser.version) 是否指定浏览器及版本，
     * 如 ie 6 时为 lib.browser.ie6 = true
     */
    var browser = {
        name: (UA[1] === 'version') ? UA[3] : UA[1],
        version: mode
            || parseFloat((UA[1] === 'opera' && UA[4]) ? UA[4] : UA[2])
    };

    browser[browser.name] = browser.version | 0;
    browser[browser.name + (browser.version | 0)] = true;

    return {
        browser: browser
    };

});
