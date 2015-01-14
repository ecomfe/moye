/**
 * @file 一大堆校验规则
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {

    var ValidityState = require('./ValidityState');

    function format(template, obj) {
        obj = obj || {};
        return template.replace(/\$\{([^}]+)\}/g, function (match, name) {
            return obj[name] || '';
        });
    }

    function ValidityRule(options) {
        $.extend(this, options);
    }

    ValidityRule.prototype.getErrorMessage = function (control) {
        var errorMessage = control[this.type + 'ErrorMessage'] || this.errorMessage;
        return format(errorMessage, control);
    };

    ValidityRule.prototype.getLimitCondition = function(control) {
        return control[this.type];
    };

    var rules = {
        maxByteLength: {
            errorMessage: '${title}长度不能超过${maxByteLength}，中文占两字符',
            check: function (value, control) {
                var len = value.replace(/[^\x00-\xff]/g, 'xx').length;
                return new ValidityState(
                    len <= this.getLimitCondition(control),
                    this.getErrorMessage(control)
                );
            }
        },
        mobile: {
            errorMessage: '${title}不符合手机号码格式',
            check: function (value, control) {
                return new ValidityState(
                    /^1\d{10}$/.test(value),
                    this.getErrorMessage(control)
                );
            }
        },
        pattern: {
            errorMessage: '${title}不符合格式',
            check: function (value, control) {
                var pattern = this.getLimitCondition(control);
                return new ValidityState(
                    value === '' || pattern.test(value),
                    this.getErrorMessage(control)
                );
            }
        },
        required: {
            errorMessage: '请填写${title}',
            check: function (value, control) {
                return new ValidityState(
                    !!value,
                    this.getErrorMessage(control)
                );
            }
        }
    };

    for (var type in rules) {
        var Rule = new Function();
        Rule.prototype = $.extend(
            new ValidityRule(),
            rules[type],
            {
                constructor: Rule,
                type: type
            }
        );
        rules[type] = Rule;
    }

    /**
     * 从组件属性上查找已注册了的校验器
     * @param  {Control} control 组件
     * @return {Array.ValiditorRule}
     */
    ValidityRule.getRules = function (control) {
        var result = [];
        for (var prop in control) {
            if (control.hasOwnProperty(prop)) {
                var Rule = rules[prop];
                if (Rule) {
                    result.push(new Rule());
                }
            }
        }
        return result;
    };

    return ValidityRule;
});
