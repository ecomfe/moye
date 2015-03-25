/**
 * @file 自然数校验器
 * @author leon<lupengyu@baidu.com>
 */

define(function (require) {

    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    var regex = /^[\d]+$/;

    ValidateRule.register('natural', {

        message: {
            invalid: '请输入整数'
        },

        check: function (value, control) {
            var state = !value || regex.test(value);
            return new ValidityState(state, this.getMessage(control, state));
        }

    });


});
