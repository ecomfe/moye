/**
 * @file 最小值校验规则
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var lib = require('../../lib');
    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    ValidateRule.register('min', {

        check: function (value, control) {
            if (lib.isNumber(value)) {
                value = '' + value;
            }

            var result = !value || (!isNaN(value) && value >= this.value);
            return new ValidityState(
                result,
                this.getMessage(control, result)
            );
        },

        message: {
            invalid: '!{title}不能小于!{value}'
        }

    });

});
