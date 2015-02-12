/**
 * @file 表单 - 字段关联插件
 * @author Leon(lupengyu@baidu)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('../lib');
    var Plugin = require('./Plugin');

    var DEFAULT_ACTIONS = {
        show: function (state) {
            state ? this.show() : this.hide();
        },
        hide: function (state) {
            state ? this.hide() : this.show();
        },
        disable: function (state) {
            state ? this.disable() : this.enable();
        },
        enable: function (state) {
            state ? this.enable() : this.disable();
        }
    };

    var DEFAULT_LOGICS = {
        equal: function (conf) {
            return this.getValue() === conf.value;
        },
        valid: function (conf) {
            return this.checkValidity();
        }
    };

    var DEFAULT_PATTERNS = {
        all: function (states) {
            for (var i = states.length - 1; i >= 0; i--) {
                if (!states[i]) {
                    return false;
                }
            }
            return true;
        },
        any: function (states) {
            for (var i = states.length - 1; i >= 0; i--) {
                if (states[i]) {
                    return true;
                }
            }
            return false;
        }
    };

    var FormRelation = Plugin.extend({

        $class: 'FormRelation',

        options: {
            relations: []
        },

        initialize: function (options) {
            this.$parent(options);
            this.onFieldChange = $.proxy(this.onFieldChange, this);
        },

        activate: function (control) {
            this.control = control;
            control.once('afterrender', $.proxy(this.bind, this));
        },

        inactivate: function () {
            this.control.off('fieldchange', this.onFieldChange);
        },

        bind: function () {
            var me = this;
            var control = me.control;
            // 上来就把所有的字段都给检查一遍~
            lib.each(control.getInputControls(), function (field) {
                me.check(field);
            });
            // 兰后, 监听字段变化
            control.on('fieldchange', me.onFieldChange);
        },

        /**
         * 字段变化处理函数
         * @param  {Event} e  字段变化事件
         */
        onFieldChange: function (e) {
            this.check(e.target);
        },

        /**
         * 检查依赖关系
         * @param  {Control} source 发生变化的字段控件
         */
        check: function (source) {

            var relations = this.relations;

            if (!relations || !relations.length) {
                return;
            }

            // 首先，找出所在依赖于source的控件们
            var reliers = this.findRelies(source);

            if (!reliers.length) {
                return;
            }

            // 每个依赖于source的relation都计算一下关系状态
            // 如果结果是true, 执行action, 否则，执行action-inverse
            lib.each(
                reliers,
                function (rely) {
                    var state    = this.getRelationState(rely);
                    var targets  = [].concat(rely.targets);
                    var actions  = [].concat(rely.actions);

                    if (lib.isPromise(state)) {
                        state.then($.proxy(this.execute, this, targets, actions));
                    }
                    else {
                        this.execute(targets, actions, state)
                    }

                },
                this
            );

        },

        /**
         * 寻找依赖于指定字段source的字段
         * @param  {Control} source 发生变化的控件
         * @return {Array.Control}  依赖于此控件的控件们
         */
        findRelies: function (source) {
            var relations = this.relations;
            var dependences = [];
            for (var i = relations.length - 1; i >= 0; i--) {
                var relation = relations[i];
                for (var j = 0, len = relation.dependences.length; j < len; j++) {
                    var dependence = relation.dependences[j];
                    if (dependence.id === source.id) {
                        dependences.push(relation);
                        break;
                    }
                }
            }
            return dependences;
        },

        /**
         * 计算执行条件是否成立
         * @param {Object} relation 关系
         * @return {boolean}
         */
        getRelationState: function (relation) {

            var me = this;
            var states = [];
            var defer = false;

            for (var i = 0, dependences = relation.dependences, len = dependences.length; i < len; i++) {
                var dependence = dependences[i];
                var state = states[i] = me.getLogicState(dependence);
                if (lib.isPromise(state)) {
                    defer = true;
                }
            }

            return defer
                ? $.when.apply(null, states).then(function () {
                    return me.getPatternState(relation, [].slice.call(arguments));
                })
                : me.getPatternState(relation, states);
        },

        /**
         * 计算某字段是否满足依赖关系设定
         * @param  {Object} relation 依赖关系配置
         * @return {boolean}
         */
        getLogicState: function (dependence) {
            var id  = dependence.childName || dependence.id;
            var field = this.getField(id);

            // 如果字段丢了, 那可是大事啊...后边的操作也没办法做了啊...
            // 直接丢一个error吧
            if (!field) {
                throw new Error('lost field control[' + id + ']');
            }

            var logic = dependence.logic;

            // 如果logic本身就是函数, 那么就直接执行它
            // 否则解析一下它
            logic = lib.isFunction(logic)
                ? logic
                : DEFAULT_LOGICS[logic];

            // 找到了就执行, 找不到直接给false
            return logic ? logic.call(field, dependence) : false;
        },

        /**
         * 在表单中找一个字段
         * @param  {string} childName 子控件名称
         * @return {Control}
         */
        getField: function (childName) {
            var fields = this.control.getInputControls();
            for (var i = fields.length - 1; i >= 0; i--) {
                var field = fields[i];
                var id = field.childName || field.id;
                if (id === childName) {
                    return field;
                }
            }
            return null;
        },

        /**
         * 合并单项依赖状态, 给出依赖状态结果
         * @param {Object} relation 关系
         * @param  {Array.bool} states 状态
         * @return {boolean}
         */
        getPatternState: function (relation, states) {
            var pattern = relation.pattern || DEFAULT_PATTERNS.all;

            pattern = lib.isFunction(pattern)
                ? pattern
                : DEFAULT_PATTERNS[pattern];

            return pattern ? pattern(states) : false;
        },

        /**
         * 执行动作
         * @param  {Array.string}          targets 一组控件的id
         * @param  {Array.Function|string} actions 一组动作
         * @param  {bool|Promise}          state   关系状态
         */
        execute: function (targets, actions, state) {

            var form = this.control;

            lib.each(targets, function (target) {

                // 在form的上下文中查找控件
                target = form.context.get(target);

                // 没有找到控件那就算鸟
                if (!target) {
                    return;
                }

                // 如果找到了控件就对它做一些羞羞羞的事情啦
                lib.each(actions, function (action) {

                    // 解析一下动作啦
                    // 如果action是一个函数, 直接用
                    // 否则在默认的动作库里找一找
                    action = lib.isFunction(action)
                        ? action
                        : DEFAULT_ACTIONS[action];

                    // 找到了就用一下啦, 找不到就算了.
                    action && action.call(target, state);

                });


            });

        },

        dispose: function () {
            this.control = null;
            this.$parent();
        }

    });

    FormRelation.patterns = DEFAULT_PATTERNS;
    FormRelation.logics = DEFAULT_LOGICS;
    FormRelation.actions = DEFAULT_ACTIONS;

    return FormRelation;

});
