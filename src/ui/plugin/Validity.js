/**
 * @file 验证合法性
 *       来自esui/Validity
 *       Validity.addState方法直接可以添加state和message。
 *       自动转化为ValidityState实例。
 * @author leon <lupengyu@baidu.com>
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    /**
     * 验证结果类
     *
     * 一个`Validity`是对一个控件的验证结果的表达，
     * 是一系列{@link module:ValidityState}的组合
     *
     * 当有至少一个{@link module:ValidityState}处于错误状态时，
     * 该`Validity`对象将处于错误状态
     *
     * @module Validity
     * @class Validity
     * @constructor
     */
    function Validity() {
        this.states = [];
        this.stateIndex = {};
        this.customMessage = '';
        this.customValidState = null;
    }

    /**
     * 添加验证状态
     *
     * @param {string} name 状态名
     * @param {ValidityState} state 验证状态
     */
    Validity.prototype.addState = function (name, state) {
        var stateList = this.states;
        var existedState = this.stateIndex[name];

        // 如果状态名已存在
        if (existedState) {

            // 同样的状态对象，不处理
            if (existedState === state) {
                return;
            }

            // 不一样，删除原list中元素
            for (var i = 0, len = stateList.length; i < len; i++) {
                if (stateList[i] === existedState) {
                    stateList.splice(i, 1);
                    break;
                }
            }
        }

        // 更新数据
        stateList.push(state);
        this.stateIndex[name] = state;
    };

    /**
     * 获取验证状态
     *
     * @param {string} name 状态名
     * @return {?ValidityState} 规则验证状态对象
     */
    Validity.prototype.getState = function (name) {
        return this.stateIndex[name] || null;
    };

    /**
     * 获取验证状态集合
     *
     * @return {Array.<ValidityState>}
     */
    Validity.prototype.getStates = function () {
        return this.states.slice();
    };

    /**
     * 获取自定义验证信息
     *
     * @return {string}
     */
    Validity.prototype.getCustomMessage = function () {
        return this.customMessage;
    };

    /**
     * 设置自定义验证信息
     *
     * @param {string} message 自定义验证信息
     */
    Validity.prototype.setCustomMessage = function (message) {
        this.customMessage = message;
    };

    /**
     * 设置自定义验证结果
     *
     * @param {string} validState 验证结果字符串
     */
    Validity.prototype.setCustomValidState = function (validState) {
        this.customValidState = validState;
    };


    /**
     * 获取整体是否验证通过
     *
     * @return {boolean}
     */
    Validity.prototype.isValid = function () {

        var states = this.getStates();

        for (var i = states.length - 1; i >= 0; i--) {
            if (!states[i].getState()) {
                return false;
            }
        }

        return true;
    };

    /**
     * 获取验证状态的字符串
     *
     * @return {string}
     */
    Validity.prototype.getValidState = function () {
        return this.customValidState
            || (this.isValid() ? 'valid' : 'invalid');
    };

    return Validity;
});
