/**
 * @file 最小长度
 * @author leon<lupengyu@baidu.com>
 */

define(function (require) {

    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    ValidateRule.register('minlength', {

        check: function (value, control) {
            var minLength = control.minLength;
            var result = (value + '').length >= minLength;
            return new ValidityState(
                result,
                this.getMessage(control, result)
            );
        },

        message: {
            invalid: '!{title}不能超过!{minLength}'
        }

    });

});
