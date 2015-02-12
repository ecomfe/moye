/**
 * @file 最大长度
 * @author leon<lupengyu@baidu.com>
 */

define(function (require) {

    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    ValidateRule.register('maxlength', {

        check: function (value, control) {
            var maxLength = control.maxLength;
            var result = (value + '').length <= maxLength;
            return new ValidityState(
                result,
                this.getMessage(control, result)
            );
        },

        message: {
            invalid: '!{title}不能超过!{maxLength}'
        }

    });

});
