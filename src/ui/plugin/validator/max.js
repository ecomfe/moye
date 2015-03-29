/**
 * @file 最大值校验规则
 * @author leon<lupengyu@baidu.com>
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    ValidateRule.register('max', {

        check: function (value, control) {
            var result = !value || (!isNaN(value) && value <= this.value);
            return new ValidityState(
                result,
                this.getMessage(control, result)
            );
        },

        message: {
            invalid: '!{title}不能超过!{value}'
        }

    });

});
