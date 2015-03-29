/**
 * @file 表单 - 字段关联插件
 *       FIXME: 该插件不能使用 `use` 方式加载，其初始化依赖组件的`afterrender`事件
 *       如果该组件已经渲染过了，再 `use` 将不会奏效
 * @author Leon(lupengyu@baidu)
 * @author wuhuiyao(wuhuiyao@baidu.com)
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

    /**
     * 表单字段关联插件
     *
     * @extends module:Plugin
     * @module FormRelation
     */
    var FormRelation = Plugin.extend(/** @lends module:FormRelation.prototype */{

        $class: 'FormRelation',

        /**
         * @typedef {Object} DependenceInfo
         * @property {string} id 依赖的控件 id
         * @property {string=} value 依赖控件使用内置的 `equal logic` 指定的要满足的值，可选
         * @property {string|function(Dependence):boolean} 依赖组件要满足的逻辑规则定义，
         *           可以使用内置的{@link module:FormRelation#logics}名称，或者自定义的
         *           规则逻辑，执行上下文为该依赖的控件
         */
        /**
         * @typedef {Object} Relation
         * @property {Array.<DependenceInfo>} dependences 该关联组件的所有依赖信息
         * @property {string|function(boolean):boolean} pattern 依赖关系要满足的规则定义
         *           可以使用内置的{@link module:FormRelation#patterns}名称，或者自定义的
         *           规则定义
         * @property {Array.<string>} targets 依赖关系要触发执行的 `actions` 的目标控件 id
         * @property {Array.<string|function(boolean)>} actions 要执行的 `action`,
         *           可以使用内置的{@link module:FormRelation#actions}名称，或者自定义的
         *           动作，注意该动作函数传入参数为 `patterns` 执行结果，执行上下文为 `targets`
         *           指定的控件实例
         */
        /**
         * 表单字段关联插件选项
         *
         * @property {Object} options 选项配置
         * @property {Array.<Relation>} options.relations 表单字段关联信息定义
         */
        options: {
            relations: []
        },

        /**
         * @override
         */
        initialize: function (options) {
            this.$parent(options);
            this.onFieldChange = $.proxy(this.onFieldChange, this);
        },

        /**
         * @override
         */
        activate: function (control) {
            var me = this;
            if (me.isActivated()) {
                return;
            }

            me.control = control;
            control.once('afterrender', $.proxy(me.bindEvents, me));
            me.$parent();
        },

        /**
         * @override
         */
        inactivate: function () {
            if (!this.isActivated()) {
                return;
            }

            this.control.un('fieldchange', this.onFieldChange);
            this.$parent();
        },

        /**
         * 初始化事件绑定
         *
         * @private
         */
        bindEvents: function () {
            var me = this;
            var control = me.control;

            // 上来就把所有的字段都给检查一遍~
            lib.each(control.getInputControls(), function (field) {
                me.check(field);
            });

            // 监听字段变化
            control.on('fieldchange', me.onFieldChange);
        },

        /**
         * 字段变化处理函数
         *
         * @private
         * @param {Event} e 字段变化事件对象
         */
        onFieldChange: function (e) {
            this.check(e.target);
        },

        /**
         * 检查依赖关系
         *
         * @private
         * @param {Control} source 发生变化的字段控件
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
                        this.execute(targets, actions, state);
                    }

                },
                this
            );

        },

        /**
         * 寻找依赖于指定字段source的字段
         *
         * @private
         * @param {Control} source 发生变化的控件
         * @return {Array.<Control>} 依赖于此控件的控件们
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
         *
         * @private
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
                if (!defer && lib.isPromise(state)) {
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
         * 计算给定的依赖是否满足依赖关系逻辑
         *
         * @private
         * @param  {Object} dependence 依赖关系配置
         * @return {boolean}
         */
        getLogicState: function (dependence) {
            var id  = dependence.id;
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
         *
         * @private
         * @param  {string} controlId 子控件id
         * @return {?Control}
         */
        getField: function (controlId) {
            var fields = this.control.getInputControls();
            for (var i = fields.length - 1; i >= 0; i--) {
                var field = fields[i];
                var id = field.id;
                if (id === controlId) {
                    return field;
                }
            }
            return null;
        },

        /**
         * 合并单项依赖状态, 给出依赖状态结果
         *
         * @private
         * @param {Object} relation 关系
         * @param  {Array.<boolean>} states 状态
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
         *
         * @private
         * @param  {Array.<string>}          targets 一组控件的id
         * @param  {Array.<function|string>} actions 一组动作
         * @param  {boolean|Promise}         state   关系状态
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

        /**
         * @override
         */
        dispose: function () {
            this.control = null;
            this.$parent();
        }

    });

    /**
     * 所有依赖组件 `dependences` 所决定的其关联组件的状态的内置规则定义
     *
     * @static
     * @type {{all: Function, any: Function}}
     */
    FormRelation.patterns = DEFAULT_PATTERNS;

    /**
     * 确定依赖组件状态的内置逻辑规则定义
     *
     * @static
     * @type {{equal: Function, valid: Function}}
     */
    FormRelation.logics = DEFAULT_LOGICS;

    /**
     * 一些内置的用于关联组件联动结束后要执行的 `action` 定义
     *
     * @static
     * @type {{show: Function, hide: Function, disable: Function, enable: Function}}
     */
    FormRelation.actions = DEFAULT_ACTIONS;

    return FormRelation;

});
