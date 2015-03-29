/**
 * @file 身份证号校验规则
 * @author leon<lupengyu@baidu.com>
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var powers = [
        '7', '9', '10', '5', '8',
        '4', '2', '1', '6', '3',
        '7', '9', '10', '5', '8',
        '4', '2'
    ];

    var parityBits = [
        '1', '0', 'X', '9', '8', '7',
        '6', '5', '4', '3', '2'
    ];

    // 校验身份证号码的主调用
    function validate(idNo) {
        var valid = false;
        if (idNo === '') {
            return;
        }

        if (idNo.length === 15) {
            valid = validId15(idNo);
        }
        else if (idNo.length === 18) {
            valid = validId18(idNo);
        }

        return valid;
    }

    // 校验18位的身份证号码
    function validId18(idNo) {
        idNo = idNo + '';

        var num = idNo.substr(0, 17);
        var parityBit = idNo.substr(17);
        var power = 0;

        for (var i = 0; i < 17; i++) {

            // 校验每一位的合法性
            if (num.charAt(i) < '0' || num.charAt(i) > '9') {
                return false;
            }

            // 加权
            power += parseInt(num.charAt(i), 10) * parseInt(powers[i], 10);
        }

        // 取模
        var mod = parseInt(power, 10) % 11;
        if (parityBits[mod] === parityBit) {
            return true;
        }

        return false;
    }

    // 校验15位的身份证号码
    function validId15(idNo) {
        idNo = idNo + '';

        for (var i = 0; i < idNo.length; i++) {

            // 校验每一位的合法性
            if (idNo.charAt(i) < '0' || idNo.charAt(i) > '9') {
                return false;
            }
        }
        var year = idNo.substr(6, 2);
        var month = idNo.substr(8, 2);
        var day = idNo.substr(10, 2);

        // 校验年份位
        if (year < '01' || year > '90') {
            return false;
        }

        // 校验月份
        if (month < '01' || month > '12') {
            return false;
        }

        // 校验日
        if (day < '01' || day > '31') {
            return false;
        }
        return true;
    }


    var ValidityState = require('../ValidityState');
    var ValidateRule = require('../ValidateRule');

    ValidateRule.register('identity', {
        check: function (value, control) {
            var state = !value || validate(value);
            return new ValidityState(state, this.getMessage(control, state));
        },
        message: {
            invalid: '请填写正确的身份证号'
        }
    });

});
