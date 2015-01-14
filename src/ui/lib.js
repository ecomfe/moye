/**
 * Moye (Zhixin UI)
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file  UI基础库
 * @author chris(wfsr@foxmail.com)
 * @author leon(leonlu@outlook.com)
 */
/* jshint boss: true, unused: false */
define(function (require) {

    var $ = require('jquery');

    /**
     * 基类库
     *
     * 提供常用工具函数的封装
     * @exports lib
     */
    var lib = {};

    $.extend(
        lib,
        require('./lib/array'),
        require('./lib/browser'),
        require('./lib/class'),
        require('./lib/dom'),
        require('./lib/function'),
        require('./lib/interface'),
        require('./lib/object'),
        require('./lib/page'),
        require('./lib/string'),
        require('./lib/type')
    );

    return lib;
});
