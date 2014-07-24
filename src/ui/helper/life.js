define(function (require) {


    var LIFE_CYCLE = {
        NEW: 0,
        INITED: 1,
        RENDERED: 2,
        DISPOSED: 4
    };

    return {
        
        /**
         * 判断控件是否处于相应的生命周期阶段
         * 
         * @param {string} stage 生命周期阶段
         * @private
         * @return {boolean}
         */
        isInStage: function (stage) {
            if (LIFE_CYCLE[stage] == null) {
                throw new Error('Invalid life cycle stage: ' + stage);
            }
            return this.stage === LIFE_CYCLE[stage];
        },

        /**
         * 改变控件的生命周期阶段
         * 
         * @param {string} stage 生命周期阶段
         * @private
         * @return {SELF}
         */
        changeStage: function (stage) {
            if (LIFE_CYCLE[stage] === null) {
                throw new Error('Invalid life cycle stage: ' + stage);
            }
            this.stage = LIFE_CYCLE[stage];
            return this;
        }

    };

});