/**
 * @file 邮箱校验规则
 * @author leon<lupengyu@baidu.com>
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    var reg = /^[\w\u4e00-\u9fa5._-]+@[\w\u4e00-\u9fa5]+\.[\w\u4e00-\u9fa5]+$/;

    ValidateRule.register('email', {
        check: function (value, control) {
            var state = !value || reg.test(value);
            return new ValidityState(state, this.getMessage(control, state));
        },
        message: {
            invalid: '请填写正确的电子邮箱'
        }
    });

});
