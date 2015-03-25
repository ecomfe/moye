/**
 * @file 必填项校验规则
 * @author leon<lupengyu@baidu.com>
 * @authro wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var lib = require('../../lib');
    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    ValidateRule.register('required', {

        check: function (value, control) {
            if (lib.isNumber(value)) {
                value = '' + value;
            }

            var result = !!value;
            return new ValidityState(
                result,
                this.getMessage(control, result)
            );
        },

        message: {
            invalid: '请填写!{title}'
        }

    });

});
