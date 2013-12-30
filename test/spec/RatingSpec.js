define(
    function(require) {
        var lib = require('ui/lib');

        var Rating = require('ui/Rating');

        var rating;

        lib;

        beforeEach(function() {
            document.body.insertAdjacentHTML(
                'beforeEnd',
                '<div class="ecl-ui-rating" id="rating"></div>'
            );
            rating = new Rating({
                main: 'rating',
                value: 1,
                max: 3
            }).render();
        });

        afterEach(function() {
            rating.dispose();
            rating = null;
        });

        describe('评分组件', function() {
            // 点亮第一颗星，其他都不亮
            it('init rating with a value', function() {
                var result = lib.q('ecl-ui-rating-star-on', rating.main);

                expect(result.length).toBe(1);
                
                expect(
                    rating.stars[0].className
                ).toContain('ecl-ui-rating-star-on');

                expect(
                    rating.stars[1].className
                ).not.toContain('ecl-ui-rating-star-on');

                expect(
                    rating.stars[2].className
                ).not.toContain('ecl-ui-rating-star-on');
            });

            // 鼠标移进星星，预览星级
            it('preview rating when mouseover', function() {
                var rndIndex = 1;

                lib.fire(rating.stars[rndIndex], 'mouseover');

                setTimeout(
                    function() {
                        var result = lib.q(
                            'ecl-ui-rating-star-on',
                            rating.main
                        );

                        expect(result.length).toBe(rndIndex + 1);
                    },
                    0
                );
            });

            // // 鼠标移出星星，重置星级为value所指定的星级
            it('reset rating when mouseout', function() {
                var rndIndex = 1;

                lib.fire(rating.stars[rndIndex], 'mouseout');

                setTimeout(
                    function() {
                        var result = lib.q(
                            'ecl-ui-rating-star-on',
                            rating.main
                        );

                        expect(result.length).toBe(rating.options.value);
                    },
                    0
                );
            });

            // 单击星星
            it('event:onRated', function() {
                var rndIndex = 1;

                var onRated = function(e) {
                    expect(e.value).toBe(rndIndex + 1);
                };

                rating.on('rated', onRated);
                lib.fire(rating.stars[rndIndex], 'click');
                rating.un('rated');
            });
        });
    }
);
