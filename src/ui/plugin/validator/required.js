/**
 * @file RequiredValidator
 * @author leon<lupengyu@baidu.com>
 */

define(function (require) {

    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    ValidateRule.register('required', {

        check: function (value, control) {
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
