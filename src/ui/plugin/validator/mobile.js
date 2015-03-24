/**
 * @file 手机号码校验规则
 * @author leon<lupengyu@baidu.com>
 */

define(function (require) {

    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    var regex = /^1\d{10}$/;

    ValidateRule.register('mobile', {

        message: {
            invalid: '!{title}不符合手机号码格式'
        },

        check: function (value, control) {
            var state = !value || regex.test(value);
            return new ValidityState(state, this.getMessage(control, state));
        }

    });

});
