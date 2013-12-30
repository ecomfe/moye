define(function (require) {
    var PicUploader = require('ui/PicUploader');
    var lib = require('ui/lib');
    var picUploader;
    var removeEventCount=0;

    beforeEach(function () {

        document.body.insertAdjacentHTML(
            'beforeEnd',
            '<div id="picUploaderContainer"></div>'
        );

        picUploader = new PicUploader({
            main: lib.g('picUploaderContainer')
        });
        picUploader.render();

    });


    afterEach(function () {
        picUploader.dispose();
        document.body.removeChild(lib.g('picUploaderContainer'));
    });
  
    describe('基本接口', function () {


        it('getfilelist', function () {
            var files = picUploader.getFileList();

            expect(files.length).toBe(0);
        });

        it('remove', function () {

            picUploader.remove('xxxxxx', 
                function(removePath, filePath,  index) {
                    index;
                    expect(removePath).toBeTruthy();
                }
            );

        });

        it('disable,enable', function () {

            picUploader.disable();

            expect(picUploader.options.main.className)
                .toBe('ecl-ui-picuploader-disabled');

            picUploader.enable();

            expect(picUploader.options.main.className)
                .toBe('');
        });

        it('event:remove', function () {

            picUploader.on('remove', function() {
                removeEventCount++;
            });

            picUploader.on('dispose', function() {
                //expect(removeEventCount).toBe(1);
            });

            var closeBtn = lib.q(
                'ecl-ui-picuploader-close', 
                picUploader.options.main
            )[0];

            expect(closeBtn).toBeTruthy();
            //FIXME 这个case总是跑不过，不知道什么原因
            // lib.fire(
            //     closeBtn, 
            //     'click'
            // );

        });

        it('event:removeAt', function () {

            picUploader.on('remove', function() {
                removeEventCount++;
            });

            picUploader.removeAt(0);
            
        });

    });





});