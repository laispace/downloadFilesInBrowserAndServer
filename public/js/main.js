(function ($) {
    var Config = {
        downloadDir: '/', // where to find files
        downloadZipName: 'downloadFromClient.zip',
    };

    function getFile (url) {
        return new Promise(function (resolve, reject) {
            var request = $.ajax({
                url: url,
                method: "GET",
                dataType: 'text'
            });
            request.done(function (data) {
                console.log('downloaded: ', url, data.length);
                resolve(data);
            });
            request.fail(function (xhr, statusText) {
                reject(xhr, statusText);
            });
        });
    }

    function getFiles(urls) {
        return new Promise(function (resolve, reject) {
            var content = '';
            var promises = [];
            var errors = [];

            urls.forEach(function (url) {
                promises.push(getFile(url)
                    .then(function (data) {
                        content += data;
                    }, function (xhr, statusText) {
                        errors.push(xhr);
                    }));
            });

            Promise.all(promises)
                .then(function () {
                    console.log('downloaded all files: ', content.length);
                    resolve(content);
                }, function () {
                    reject(errors);
                })

        });
    }

    $('#client-download-btn').on('click', function () {
        try {
            var isFileSaverSupported = !!new Blob;
        } catch (e) {
            alert('- -！你当前的浏览器暂不支持下载，换个最新的 Chrome 试试呗~ ');
        }

        var data = $('#download-form').serializeArray();
        var zip = new JSZip();
        var cache = {};
        var promises = [];
        data.forEach(function (item) {
            var name = item.value;
            var promise = getFile(name).then(function (data) {
                zip.file(name, data);
                cache[name] = data;
            });
           promises.push(promise);
        });

        Promise.all(promises).then(function () {
            console.log('all files downloaded: ', Object.keys(cache));
            var content = zip.generate({type:"blob"});
            // content 将为一个 blob 对象 => Blob {type: "application/zip", size: 349808, slice: function}
            saveAs(content, Config.downloadZipName);
        });
    });
})(jQuery);