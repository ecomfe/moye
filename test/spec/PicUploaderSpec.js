define(function (require) {
    var PicUploader = require('ui/PicUploader');
    var lib = require('ui/lib');
    var picUploader;

    beforeEach(function () {

        document.body.insertAdjacentHTML(
            'beforeEnd',
            '<div id="picUploaderContainer"></div><div id="picUploaderContainer1"></div>'
        );

        picUploader = new PicUploader({
            main: lib.g('picUploaderContainer')
        });
        picUploader.render();

    });


    afterEach(function () {
        picUploader.dispose();
        document.body.removeChild(lib.g('picUploaderContainer'));
        document.body.removeChild(lib.g('picUploaderContainer1'));
    });
  
    describe('基本接口', function () {


        it('event:pickerror', function () {
            //这里想直接塞入文件不太容易，使用fake的元素来模拟
            
            var uploader = new PicUploader({
                main: lib.g('picUploaderContainer1'),
                tpl: ''
                    +   '<div class="#{closeClass}" title="关闭">×</div>'
                    +   '<div class="#{picClass}"></div>'
                    +   '<div class="#{titleClass}">点击上传</div>'
                    +   '<a href="javascript:;" class="#{wrapperClass}">'
                    +       '<div class="#{fileClass}"></div>'
                    +   '</a>'
            });
            uploader.render();

            var curPan = lib.q('ecl-ui-picuploader-cur', uploader.options.main)[0];
            var fileBtn = lib.q('ecl-ui-picuploader-file', curPan)[0];
            fileBtn.value = '';
            lib.fire(fileBtn, 'change');


            fileBtn.value = 'fakeimg.fake';
            uploader.on('pickerror', function (e) {
                expect('pickerror').toBe('pickerror');
            });

            lib.fire(fileBtn, 'change');

            var ieVer = lib.browser.ie;
            lib.browser.ie = 8;

            //测试IE8
            fileBtn.value = 'fakeimg.fake';

            uploader.on('pick', function (e) {
                expect('iepick').toBe('iepick');
            });

            lib.fire(fileBtn, 'change');

            lib.browser.ie = ieVer;

            uploader.dispose();

        });

        //如果支持Blob对象
        if (typeof window.Blob === 'function') {
            it('event:pick', function () {
                var uploader = new PicUploader({
                    main: lib.g('picUploaderContainer1'),
                    tpl: ''
                        +   '<div class="#{closeClass}" title="关闭">×</div>'
                        +   '<div class="#{picClass}"></div>'
                        +   '<div class="#{titleClass}">点击上传</div>'
                        +   '<a href="javascript:;" class="#{wrapperClass}">'
                        +       '<div class="#{fileClass}"></div>'
                        +   '</a>'
                });
                uploader.render();

                var curPan = lib.q('ecl-ui-picuploader-cur', uploader.options.main)[0];
                var fileBtn = lib.q('ecl-ui-picuploader-file', curPan)[0];

                fileBtn.files = [new Blob(['fakeimg'])];
                fileBtn.value = 'fakeimg.jpg';

                uploader.on('pick', function (e) {
                    expect('pick').toBe('pick');
                });

                lib.fire(fileBtn, 'change');
                uploader.dispose();
            });
        }


        it('getfilelist', function () {
            var files = picUploader.getFileList();

            expect(files.length).toBe(0);
        });

        it('remove', function () {

            picUploader.remove('xxxxxx', 
                function (removePath, filePath,  index) {
                    index;
                    expect(removePath).toBeTruthy();
                }
            );

        });

        it('disable,enable', function () {

            picUploader.disable();

            expect(picUploader.options.main.className).toBe('ecl-ui-picuploader-disabled');

            picUploader.enable();

            expect(picUploader.options.main.className).toBe('');
        });

        it('event:remove', function () {

            var removeEventCount = 0;

            picUploader.on('remove', function () {
                removeEventCount++;
            });

            picUploader.on('dispose', function () {
                expect(removeEventCount).toBe(1);
            });

            var closeBtn = lib.q(
                'ecl-ui-picuploader-close', 
                picUploader.options.main
            )[0];

            expect(closeBtn).toBeTruthy();

            lib.fire(
                closeBtn, 
                'click'
            );

        });

        it('event:removeAt', function () {
            var removeEventCount = 0;
            picUploader.on('remove', function () {
                removeEventCount++;
            });

            picUploader.on('dispose', function () {
                expect(removeEventCount).toBe(1);
            });
            picUploader.removeAt(0);
            
        });
    });





});