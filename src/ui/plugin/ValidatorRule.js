/**
 * @file 一大堆校验规则
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var ValidityState = require('./ValidityState');
    var lib = require('../lib');

    function format(template, obj) {
        obj = obj || {};
        return template.replace(/\$\{([^}]+)\}/g, function (match, name) {
            return obj[name] || '';
        });
    }

    var ValidityRule = lib.newClass({

        options: {},

        $class: 'ValidityRule',

        initialize: function (options) {
            lib.extend(this, this.options, options);
        },

        getErrorMessage: function (control) {
            var errorMessage = control[this.type + 'ErrorMessage'] || this.errorMessage;
            return format(errorMessage, control);
        },

        getLimitCondition: function (control) {
            return control[this.type];
        }

    });

    var rules = [
        {
            type: 'maxByteLength',
            errorMessage: '${title}长度不能超过${maxByteLength}，中文占两字符',
            check: function (value, control) {
                var len = value.replace(/[^\x00-\xff]/g, 'xx').length;
                return new ValidityState(
                    len <= this.getLimitCondition(control),
                    this.getErrorMessage(control)
                );
            }
        },
        {
            type: 'mobile',
            errorMessage: '${title}不符合手机号码格式',
            check: function (value, control) {
                return new ValidityState(
                    /^1\d{10}$/.test(value),
                    this.getErrorMessage(control)
                );
            }
        },
        {
            type: 'pattern',
            errorMessage: '${title}不符合格式要求',
            check: function (value, control) {
                var pattern = this.getLimitCondition(control);
                return new ValidityState(
                    value === '' || pattern.test(value),
                    this.getErrorMessage(control)
                );
            }
        },
        {
            type: 'required',
            errorMessage: '请填写${title}',
            check: function (value, control) {
                return new ValidityState(
                    !!value,
                    this.getErrorMessage(control)
                );
            }
        }
    ];


    lib.each(rules, ValidityRule.extend);

    /**
     * 从组件属性上查找已注册了的校验器
     * @param  {Control} control 组件
     * @return {Array.ValiditorRule}
     */
    ValidityRule.getRules = function (control) {
        return lib.reduce(
            this.getAllClasses(),
            function (result, Rule, type) {
                if (control.hasOwnProperty(type)) {
                    result.push(new Rule());
                }
                return result;
            },
            []
        );
    };

    return ValidityRule;
});
