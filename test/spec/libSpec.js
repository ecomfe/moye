define(function (require) {
    var lib = require('ui/lib');
    

    beforeEach(function () {

        
    });


    afterEach(function () {
    });
  
    describe('类型判断', function () {

        /* jshint -W053 */
        it('字符串判断', function () {

            expect(lib.isString).not.toBeUndefined();

            expect(lib.isString('just a pure string')).toBeTruthy();

            expect(lib.isString(new String('string create from new')))
                .toBeTruthy();

            expect(lib.typeOf(new String('box string'))).toBe('string');

        });

        it('数组判断及转换', function () {

            expect(lib.isArray).not.toBeUndefined();

            expect(lib.isArray(['simply array'])).toBeTruthy();

            expect(lib.isArray(new Array(5))).toBeTruthy();

            expect(lib.typeOf([])).toBe('array');

            var array = lib.toArray(arguments);
            expect(lib.isArray(array)).toBe(true);

            array = lib.toArray(null);
            expect(lib.isArray(array)).toBe(true);

            array = lib.toArray([1, 2, 3]);
            expect(lib.isArray(array)).toBe(true);

            array = lib.toArray({length: 3, 0: 1, 1: 2, 2: 3});
            expect(lib.isArray(array)).toBe(true);

            array = lib.toArray(document.getElementsByTagName('*'));
            expect(lib.isArray(array)).toBe(true);

            array = lib.toArray(1);
            expect(lib.isArray(array)).toBe(true);

            array = [1, 2];
            expect(lib.clone(array) === array).toBeFalsy();

        });

        it('函数判断', function () {

            expect(lib.isFunction).not.toBeUndefined();

            expect(lib.isFunction(lib.isFunction)).toBeTruthy();

            expect(lib.typeOf(lib.isFunction)).toBe('function');

        });

        it('日期判断', function () {

            expect(lib.isDate).not.toBeUndefined();

            expect(lib.isDate(new Date())).toBeTruthy();

            expect(lib.typeOf(new Date())).toBe('date');

        });

        it('DOM判断', function () {
            expect(lib.typeOf(document.createElement('div'))).toBe('dom');

        });

        it('对象判断', function () {

            expect(lib.isObject).not.toBeUndefined();

            expect(lib.isObject(lib)).toBeTruthy();

            /* jshint -W010 */
            expect(lib.isObject({})).toBeTruthy();

            expect(lib.isObject(new Object())).toBeTruthy();

            expect(lib.typeOf({})).toBe('object');

        });

    });

    describe('JSON处理', function () {
        it('toQueryString', function () {
            var input = {a: [1, 2], b: 1, c: 'c', d: {e: 1}};

            // 'a[1]=2&a[0]=1&b=1&c=c&d[e]=1';
            var output = lib.toQueryString(input);
            expect(lib.contains(output, 'a[0]=1', '&')).toBe(true);
            expect(lib.contains(output, 'a[1]=2', '&')).toBe(true);
            expect(lib.contains(output, 'b=1', '&')).toBe(true);
            expect(lib.contains(output, 'c=c', '&')).toBe(true);
            expect(lib.contains(output, 'd[e]=1', '&')).toBe(true);
        });
    });

    describe('string处理', function () {
        it('camelCase', function () {
            var input = 'position-x';
            var output = 'positionX';
            expect(lib.camelCase(input)).toBe(output);

            input = 'border-left-width';
            output = 'borderLeftWidth';
            expect(lib.camelCase(input)).toBe(output);

            input = 'border-Left-width';
            output = 'borderLeftWidth';
            expect(lib.camelCase(input)).toBe(output);
        });

        it('capitalize', function () {
            var input = 'position';
            var output = 'Position';
            expect(lib.capitalize(input)).toBe(output);

            input = 'border-left-width';
            output = 'Border-Left-Width';
            expect(lib.capitalize(input)).toBe(output);

            input = 'border-Left-width';
            output = 'Border-Left-Width';
            expect(lib.capitalize(input)).toBe(output);
        });

        it('contains', function () {
            var input = 'position x ';
            expect(lib.contains(input)).toBe(true);

            input = 'border  left   width ';
            expect(lib.contains(input)).toBe(true);
        });

        it('pad', function () {
            var width = 5;
            var input = '5';
            var output = '00005';
            expect(lib.pad(input, width)).toBe(output);

            input = 10;
            output = '00010';
            expect(lib.pad(input, width)).toBe(output);

            input = 10000;
            output = '10000';
            expect(lib.pad(input, width)).toBe(output);

            input = 100000;
            output = '100000';
            expect(lib.pad(input, width)).toBe(output);

            input = -1000;
            output = '-01000';
            expect(lib.pad(input, width)).toBe(output);
        });
    });

    describe('function处理', function () {
        it('bind', function () {
            var a = {
                name: 'a'
            };
            var b = {
                name: 'b'
            };

            var fn = function () {
                return this.name;
            };

            expect(lib.bind(fn, a)()).toBe(a.name);
            expect(lib.bind(fn, b)()).toBe(b.name);

            a.fn = fn;
            expect(a.fn()).toBe(a.name);

            expect(lib.bind(a.fn, b)()).toBe(b.name);
            
        });

        it('curry', function () {
            var fn = function (first, last) {
                return first + last;
            };

            var curried = lib.curry(fn, 'chris');

            expect(curried('wong')).toBe(fn('chris', 'wong'));
        });
    });

    describe('类模拟', function () {
        var Cat;

        beforeEach(function () {
            Cat = lib.newClass({
                initialize: function (name) {
                    this.name = name;
                },

                say: function () {
                    return 'Miao~';
                }
            });                
        });

        afterEach(function () {
            Cat = null;
        });

        it('类创建', function () {

            var Rat = lib.newClass(function () {
                this.name = 'Jerry';
            });

            var tom = new Cat('Tom');
            var jerry = new Rat();

            expect(tom instanceof Cat).toBeTruthy();
            expect(tom.name).toBe('Tom');
            expect(tom.say()).toBe('Miao~');

            expect(jerry.name).toBe('Jerry');
            expect(jerry instanceof Rat).toBeTruthy();
        });

        it('类扩展', function () {
            var tom = new Cat('Tom');

            expect(tom.name).toBe('Tom');
            expect(tom.say()).toBe('Miao~');
            expect(tom.eat).toBeUndefined();

            Cat.implement({
                say: function () {
                    return 'Mao';
                },

                eat: function () {
                    return 'Fish';
                }
            });

            expect(tom.say()).toBe('Mao');
            expect(tom.eat()).toBe('Fish');
        });

        it('类继承', function () {
            Cat.implement({
                eat: function () {
                    return 'Fish';
                }
            });
            
            var Lion = Cat.extend({
                initialize: function () {
                    this.name = 'Sinbad';
                },

                eat: function () {
                    return 'Meat' + this.parent('eat');
                },

                big: function () {
                    return true;
                },

                unkown: function () {
                    return this.parent('unkown');
                }
            });

            var sinbad = new Lion();

            expect(sinbad.name).toBe('Sinbad');
            expect(sinbad.eat()).toBe('MeatFish');
            expect(sinbad.big()).toBeTruthy();
            expect(sinbad.unkown).toThrow();

            expect(sinbad instanceof Lion).toBe(true);
            expect(sinbad instanceof Cat).toBe(true);
        });

        it('类继承1', function () {
            Cat.implement({
                eat: function () {
                    return 'Fish';
                }
            });
            
            var Lion = Cat.extend({
                initialize: function () {
                    this.name = 'Sinbad';
                },

                eat: function () {
                    return 'Meat' + this.parent('eat');
                },

                big: function () {
                    return true;
                }
            });

            var Lion1 = lib.newClass();
            Lion1.implement(Lion);

            var sinbad = new Lion1();

            expect(sinbad.name).toBe('Sinbad');
            expect(sinbad.eat()).toBe('MeatFish');
            expect(sinbad.big()).toBeTruthy();

            expect(sinbad instanceof Lion1).toBe(true);
            expect(sinbad instanceof Lion).toBe(false);
            expect(sinbad instanceof Cat).toBe(false);
        });

        it('事件实现', function () {
            Cat.implement(lib.observable);
            var tom = new Cat();

            var firedCatched = false;
            var global = false;

            tom.on('catchRat', function () {
                firedCatched = true;
            });
            tom.on(function () {
                global = true;
            });
            tom.fire('catchRat');

            expect(firedCatched).toBe(true);
            expect(global).toBe(true);

            tom.un('catchRat');
            firedCatched = false;
            tom.fire('catchRat');
            expect(firedCatched).toBe(false);

        });

        it('参数可配实现', function () {
            var Lion = Cat.extend({
                options: {
                    name: 'Sinbad',
                    age: 3
                },
                initialize: function (options) {
                    options = this.setOptions(options);
                    this.name = options.name;
                    this.age = options.age;
                }
            }).implement(lib.configurable);
            

            var lion = new Lion({
                name: 'Sid',
                age: 1
            });

            expect(lion.name).toBe('Sid');
            expect(lion.age).toBe(1);

        });
    });

    describe('Event', function () {
        it('normal-event', function () {
            var clicked = false;
            var onClick = function (e) {
                expect(e.type).toBe('click');
                clicked = true;
            };
            lib.on(document, 'click', onClick);

            lib.fire(document, 'click');
            expect(clicked).toBe(true);

            clicked = false;
            lib.un(document, 'click', onClick);
            expect(clicked).toBe(false);
        });

        it('custom-event', function () {
            var entered = false;
            var onEnter = function (e) {
                if (e._type) {
                    expect(e.type).toBe('mouseover');
                    expect(e._type).toBe('mouseenter');  
                }
                entered = true;
            };
            lib.on(document, 'mouseenter', onEnter);

            lib.fire(document, 'mouseenter');
            expect(entered).toBe(true);

            entered = false;
            lib.un(document, 'mouseenter', onEnter);
            expect(entered).toBe(false);
        });

        it('preventDefault & stopPropagation', function () {
            var counter = 0;
            var stopPropagation = false;
            var preventDefault = false;
            var link = document.createElement('a');
            link.href = '#baidu';
            link.innerHTML = 'baidu';
            document.body.appendChild(link);

            var onClick = function (e) {
                counter++;

                var target = lib.getTarget(e);
                expect(
                    target === document.body
                        || target === link
                ).toBe(true);

                if (stopPropagation) {
                    lib.stopPropagation(e);
                }

                if (preventDefault) {
                    lib.preventDefault(e);
                }
            };

            lib.on(link, 'click', onClick);
            lib.on(document.body, 'click', onClick);

            lib.fire(link, 'click');
            expect(counter).toBe(2);

            stopPropagation = true;
            lib.fire(link, 'click');
            expect(counter).toBe(3);

            location.hash = 'changed';
            preventDefault = true;
            lib.fire(link, 'click');
            expect(location.hash).toBe('#changed');
            location.hash = '';

            lib.un(link, 'click', onClick);
            lib.un(document.body, 'click', onClick);
            document.body.removeChild(link);
            link = null;
        });
    });

    describe('Page', function () {
        
        it('scroll', function () {
            var left = 50;
            var top = 50;
            var div = document.createElement('div');
            div.style.cssText = ''
                + 'position: absolute;'
                + 'width: 100%;'
                + 'height: 100%;'
                + 'left: 100px;'
                + 'top: 100px;';
            document.body.appendChild(div);
            window.scrollTo(left, top);

            expect(lib.getScrollLeft()).toBe(left);
            expect(lib.getScrollTop()).toBe(top);

            document.body.removeChild(div);
            div = null;
        });

        it('viewSize', function () {

            var root = document.documentElement;
            expect(lib.getViewWidth()).toBe(
                root.clientWidth
            );
            expect(lib.getViewHeight()).toBe(
                root.clientHeight
            );

        });
    });

    describe('DOM', function () {
        it('lib.g', function () {
            var id = 'ui_' + (+new Date()).toString(36);
            var el = document.createElement('div');
            el.id = id;
            document.body.appendChild(el);

            var found = lib.g(id);
            expect(found).toBe(el);
            expect(found).toBe(lib.g(found));
            expect(found).toBe(lib.g(el));

            document.body.removeChild(el);
            el = null;
            found = null;
        });

        it('lib.q', function () {
            var className = 'ui_' + (+new Date()).toString(36);
            var el = document.createElement('div');
            el.className = className;
            document.body.appendChild(el);

            var found = lib.q(className);
            expect(found.length).toBe(1);
            expect(found[0]).toBe(el);

            document.body.removeChild(el);
            el = null;
            found = null;
        });

        it('getAncestorBy & getAncestorByClass', function () {
            var el = document.createElement('div');
            el.innerHTML = ''
                + '<p class="art"><a href="#" name="top">top</a></p>'
                + '<ul class="list">'
                +   '<li>'
                +       '<a href="#" target="_self">'
                +           '<img src="404.gif">'
                +       '<\/a>'
                +   '<\/li>'
                + '</ul>';

            document.body.appendChild(el);

            var links = el.getElementsByTagName('a');
            expect(links.length).toBe(2);

            var found;
            found = lib.getAncestorBy(
                links[0],
                function (el) {
                    return el.tagName === 'P';
                }
            );
            expect(found).toBe(el.getElementsByTagName('p')[0]);

            found = lib.getAncestorBy(
                lib.dom.first(links[1]),
                function (el) {
                    return el.className === 'list';
                }
            );
            expect(found).toBe(lib.dom.last(el));
            expect(found.tagName).toBe('UL');

            var list = lib.getAncestorByClass(
                lib.dom.first(links[1]),
                'list'
            );
            expect(list).toBe(found);

            document.body.removeChild(el);
            el = null;
            found = null;
            list = null;
        });

        it('className', function () {
            var dom = document.body;
            var originClass = dom.className;

            dom.className = 'body doc test';

            expect(lib.hasClass(dom, 'body')).toBe(true);
            expect(lib.hasClass(dom, 'doc')).toBe(true);
            expect(lib.hasClass(dom, 'test')).toBe(true);

            expect(lib.hasClass(dom, 'newClass')).toBe(false);
            lib.addClass(dom, 'newClass');
            expect(lib.hasClass(dom, 'newClass')).toBe(true);
            lib.removeClass(dom, 'newClass');
            expect(lib.hasClass(dom, 'newClass')).toBe(false);

            lib.addClass(dom, 'doc');
            expect(dom.className).toBe('body doc test');

            var has = lib.hasClass(dom, 'test');
            lib.toggleClass(dom, 'test');
            expect(lib.hasClass(dom, 'test')).toBe(!has);
            lib.toggleClass(dom, 'test');
            expect(lib.hasClass(dom, 'test')).toBe(has);

            dom.className = originClass;
        });

        it('show & hide', function () {
            var width = 100;
            var height = 100;
            var el = document.createElement('div');
            el.style.cssText = ''
                + 'position: absolute;'
                + 'border: none;'
                + 'padding: 0;'
                + 'margin: 0;'
                + 'width: ' + width + 'px;'
                + 'height: ' + height + 'px';

            document.body.appendChild(el);

            expect(el.offsetWidth).toBe(width);
            expect(el.offsetHeight).toBe(height);

            lib.hide(el);
            expect(el.offsetWidth).toBe(0);
            expect(el.offsetHeight).toBe(0);

            lib.show(el);
            expect(el.offsetWidth).toBe(width);
            expect(el.offsetHeight).toBe(height);


            document.body.removeChild(el);
            el = null;

        });

        it('getStyle', function () {
            var className = 'zxui-test-getStyle';
            var selector = '.' + className;
            var rules = 'left: 10px; top: 2px; height: 100px;';
            var styleEl = document.createElement('style');
            document.getElementsByTagName('head')[0].appendChild(styleEl);
            var sheet = styleEl.sheet || styleEl.styleSheet;
            if (sheet) {
                if (sheet.addRule) {
                    sheet.addRule(selector, rules);
                }
                else {
                    sheet.insertRule(selector + '{' + rules + '}', 0);
                }
            }

            var el = document.createElement('div');
            el.className = className;
            el.style.cssText = ''
                + 'position: absolute;'
                + 'border: none;'
                + 'padding: 0;'
                + 'margin: 0;'
                + 'left: 20px;'
                + 'height: 200px';

            document.body.appendChild(el);

            expect(lib.getStyle(el, 'left')).toBe('20px');
            expect(lib.getStyle(el, 'top')).toBe('2px');
            expect(lib.getStyle(el, 'height')).toBe('200px');

            document.body.removeChild(el);
            styleEl.parentNode.removeChild(styleEl);
            el = null;
            styleEl = null;
        });

        it('getPosition', function () {
            var className = 'zxui-test-getStyle';
            var selector = '.' + className;
            var rules = 'left: 10px; top: 2px; height: 100px;';
            var styleEl = document.createElement('style');
            document.getElementsByTagName('head')[0].appendChild(styleEl);
            var sheet = styleEl.sheet || styleEl.styleSheet;
            if (sheet) {
                if (sheet.addRule) {
                    sheet.addRule(selector, rules);
                }
                else {
                    sheet.insertRule(selector + '{' + rules + '}', 0);
                }
            }

            var el = document.createElement('div');
            el.className = className;
            el.style.cssText = ''
                + 'position: absolute;'
                + 'margin: 5px;'
                + 'left: 20px;';

            document.body.appendChild(el);

            var position = lib.getPosition(el);
            var marginNleft = parseInt(lib.getStyle(el, 'left'), 10)
                + parseInt(lib.getStyle(el, 'margin-left'), 10);
            var marginNtop = parseInt(lib.getStyle(el, 'top'), 10)
                + parseInt(lib.getStyle(el, 'margin-top'), 10);

            expect(position.left).toBe(marginNleft);
            expect(position.top).toBe(marginNtop);

            document.body.removeChild(el);
            styleEl.parentNode.removeChild(styleEl);
            el = null;
            styleEl = null;
        });

        it('setStyles', function () {
            var el = document.createElement('div');
            document.body.appendChild(el);

            lib.setStyles(el, {
                position: 'absolute',
                left: '50px',
                top: '100px'
            });

            expect(el.style.left).toBe('50px');
            expect(el.style.top).toBe('100px');

            document.body.removeChild(el);
            el = null;
        });


        it('guid', function () {
            var bodyId = lib.guid(document.body);
            var anotherBodyId = lib.guid(document.body);

            var headId = lib.guid(document.getElementsByTagName('head')[0]);

            expect(bodyId).toBe(anotherBodyId);
            expect(bodyId).toBeLessThan(headId);
        });

        it('walk', function () {
            var body = document.body;
            var head = document.getElementsByTagName('head')[0];
            var title = document.getElementsByTagName('title')[0];

            var dom = lib.dom;
            expect(dom.previous(body)).toBe(head);
            expect(dom.next(head)).toBe(body);
            expect(dom.contains(head, title)).toBe(true);

            var el = document.createElement('div');
            el.innerHTML = '<p>hello</p><div>world</div>';
            body.appendChild(el);

            expect(dom.first(el).tagName).toBe('P');
            expect(dom.last(el).tagName).toBe('DIV');

            var children = dom.children(el);
            expect(children.length).toBe(2);
            expect(children[0].tagName).toBe('P');
            expect(children[1].tagName).toBe('DIV');
            expect(dom.contains(el, children[0])).toBe(true);
            expect(dom.contains(el, children[1])).toBe(true);

            body.removeChild(el);
            el = null;
            body = null;
            head = null;
            title = null;
        });
    });

// describe('Asynchronous specs', function() {

//   var value, flag;

//   it('should support async execution of test preparation and expectations', 
//     function(done) {

//     runs(function() {
//       flag = false;
//       value = 0;

//       setTimeout(function() {console.log('set');
//         flag = true;
//       }, 500);
//     });

//     waitsFor(function() {console.log('pool');
//       value++;
//       return flag;
//     }, 'The Value should be incremented', 750);
    
//     runs(function() {console.log('runs:%s', value);
//       expect(value).toBeGreaterThan(0);done();
//     });
//   });
// });

});