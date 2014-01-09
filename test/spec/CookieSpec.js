define(function (require) {

    var Cookie = require('ui/Cookie');
    
    describe('cookie instance', function () {
        var cookie;

        beforeEach(function () {
            cookie = new Cookie('foo'); 
        });

        afterEach(function () {
            cookie.remove();
        });

        it('set & get', function () {
            cookie.set('bar');

            expect(cookie.get()).toBe('bar');

            cookie.set('fooo', 'baz');
            expect(cookie.get('fooo')).toBe('baz');
            cookie.remove('fooo');
        });

        it('remove', function () {
            cookie.set('bar');
            cookie.remove();

            expect(cookie.get()).toBe('');
        });

        it('options.duration', function () {
            cookie.remove();
            cookie = new Cookie('foo', {
                duration: -1
            });
            cookie.set('bar');

            expect(cookie.get()).toBe('');
        });

        it('options.path', function () {
            cookie.remove();
            cookie = new Cookie('foo', {
                path: '/path/to/unreachable'
            });
            cookie.set('bar');

            expect(cookie.get()).toBe('');
        });

        it('options.secure', function () {
            cookie.remove();
            cookie = new Cookie('foo', {
                secure: true
            });
            cookie.set('bar');

            expect(cookie.get()).toBe('');
        });
    });

    describe('Cookie static', function () {
        
        it('set & get', function () {
            Cookie.set('foo', 'bar');
            expect(Cookie.get('foo')).toBe('bar');

            var cookie = Cookie.set('foo', 'baz');
            expect(cookie.get()).toBe('baz');
            expect(Cookie.get('foo')).toBe('baz');
        });

        it('remove', function () {
            Cookie.set('foo', 'bar');
            expect(Cookie.get('foo')).toBe('bar');

            Cookie.remove('foo');
            expect(Cookie.get('foo')).toBe('');
        });
    });

});
