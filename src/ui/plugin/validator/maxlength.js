/**
 * @file 最大长度校验规则
 * @author leon<ludafa@outlook.com>
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    ValidateRule.register('maxlength', {

        check: function (value, control) {
            var maxLength = this.maxLength;
            var result = (value + '').length <= maxLength;
            return new ValidityState(
                result,
                this.getMessage(control, result)
            );
        },

        message: {
            invalid: '!{title}长度不能超过!{maxLength}'
        }

    });

});
