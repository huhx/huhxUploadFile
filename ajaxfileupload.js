(function(define) {
    define(['jquery', 'toastr'], function($, toastr) {
        return (function() {
            var fileupload = {
                upload
            }
            return fileupload;

            // 文件上传的方法
            function upload(options) {
                options = $.extend({}, getDefaults(), options);
                var files = document.getElementById(options.fileId).files;
                if (files == null || files.length < 1) {
                    toastr.info("没有选择文件！");
                    return;
                }
                // 检查类型
                var typepattern = options.typepattern;
                if (checkIsNotNull(typepattern)) {
                    var isType = checkFileType(files, typepattern);
                    if (!isType) {
                        toastr.info("文件类型不符合！");
                        return;
                    }
                }
                // 检查大小
                var maxsize = options.maxsize;
                if (checkIsNotNull(maxsize)) {
                    var isSize = checkFileSize(files, maxsize);
                    if (!isSize) {
                        toastr.info("文件的大小过大！");
                        return;
                    }
                }

                // 定义事件
                var xhr = new XMLHttpRequest();

                // 判断form是否非空 
                var formData;
                if (checkIsNotNull(options.formId)) {
                    var form = document.getElementById(options.formId);
                    formData = new FormData(form);
                } else {
                    formData = new FormData();
                }

                // 拓展用户传送数据
                var userInput = options.data;
                if (checkIsNotNull(userInput)) {
                    putInputFormData(formData, userInput);
                }

                // 将文件放进表单
                for (var i = 0; i < files.length; i++) {　　　
                    formData.append('files', files[i]);　　
                }
                xhr.upload.onprogress = options.change;
                xhr.timeout = options.timeout;
                xhr.onload = options.load;
                xhr.onloadstart = options.loadstart;
                xhr.onabort = options.cancel;
                xhr.onloadend = options.complete;
                xhr.open('POST', options.action);　
                xhr.send(formData);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        options.done(xhr.responseText);
                    }
                }
            };
            // 配置默认的属性
            function getDefaults() {
                return {
                    fileId: 'myfile',
                    formId: 'myform',
                    timeout: 3000,
                    maxsize: 12000
                }
            };

            // 检查文件的类型
            function checkFileType(files, pattern) {
                for (let i = 0; i < files.length; i++) {
                    if (!pattern.test(files[i])) {
                        return false;
                    }
                }
                return true;
            };

            // 检查文件的大小
            function checkFileSize(files, maxsize) {
                for (let i = 0; i < files.length; i++) {
                    if (files[i].size > maxsize) {
                        return false;
                    }
                }
                return true;
            }

            // 检查非空  不为空为true
            function checkIsNotNull(str) {
                if (str == null || str == "") {
                    return false;
                }
                return true;
            };

            // 将用户的数据封装到formdata中
            function putInputFormData(formData, input) {
                for (let param in input) {
                    formData.append(param, input[param]);
                }
            }

            // 检查为空  为空为true
            function checkNotNull(str) {
                return !checkIsNotNull(str);
            };
        })();
    });
}(typeof define === 'function' && define.amd ? define : function(deps, factory) {
    if (typeof module !== 'undefined' && module.exports) { //Node
        module.exports = factory(require('jquery'), require('toastr'));
    } else {
        window.fileupload = factory(window.jQuery, window.toastr);
    }
}));