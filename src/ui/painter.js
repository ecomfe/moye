/**
 * @file 重绘工具
 * @author leon <leonlu@outlook.com>
 */

define(function (require) {

    return {
        /**
         * 创建一组可以监听属性变化渲染器
         *
         * 本方法接受以下2类作为“渲染器”：
         *
         * - 直接的函数对象
         * - 一个`painter`对象
         *
         * 当一个直接的函数对象作为“渲染器”时，会将`changes`和`changesIndex`两个参数
         * 传递给该函数，函数具有最大的灵活度来自由操作控件
         *
         * 一个`painter`对象必须包含以下属性：
         *
         * - `{string | string[]} name`：指定这个`painter`对应的属性或属性集合
         * - `{Function} paint`：指定渲染的函数
         *
         * 一个`painter`在执行时，执行上下文是Control，其`paint`函数将接受以下参数：
         *
         * - `{Object} painter`：当前的`渲染器`
         * - `{Mixed} args...`：根据`name`配置指定的属性，依次将属性的最新值作为参数
         *
         * @param {Object|Function} args `painter`对象
         * @return {Function} `repaint`方法的实现
         */
        createRepaint: function () {
            var painters = [].concat.apply([], [].slice.call(arguments));

            return function (changes, changesIndex) {
                // 临时索引，不能直接修改`changesIndex`，会导致子类的逻辑错误
                var index = $.extend({}, changesIndex);

                // 按顺序执行repianter
                for (var i = 0; i < painters.length; i++) {
                    var painter = painters[i];

                    // 如果是一个函数，就认为这个函数处理所有的变化，直接调用一下
                    if (typeof painter === 'function') {
                        painter.apply(this, arguments);
                        continue;
                    }

                    // 其它情况下，走的是`painter`的自动化属性->函数映射机制
                    var propertyNames = [].concat(painter.name);

                    // 以下2种情况下要调用：
                    //
                    // - 第一次重绘（没有`changes`）
                    // - `name`所指定的一个或多个属性发生了变化
                    var shouldPaint = !changes;
                    if (!shouldPaint) {
                        for (var j = 0; j < propertyNames.length; j++) {
                            var name = propertyNames[j];
                            if (changesIndex.hasOwnProperty(name)) {
                                shouldPaint = true;
                                break;
                            }
                        }
                    }

                    if (!shouldPaint) {
                        continue;
                    }

                    // 收集所有属性`name`指定属性值
                    var properties = [painter];
                    for (j = 0; j < propertyNames.length; j++) {
                        name = propertyNames[j];
                        properties.push(this[name]);
                        // 从索引中删除，为了后续构建`unpainted`数组
                        delete index[name];
                    }
                    // 绘制
                    painter.paint.apply(this, properties);
                }

                return this;
            };
        }
    };

});

