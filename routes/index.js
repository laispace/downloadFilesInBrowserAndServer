var express = require('express');
var router = express.Router();
var Promise = require("bluebird");
var uuid = require('node-uuid');
var path = require('path');
var zip = require('zipfolder');
var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

// 去死吧 回调地狱
Promise.promisifyAll(fs);

var downloadSrcDir = path.resolve('./public/');
var downloadDstDir = path.resolve('./public/download/');


router.get('/download', function(req, res) {
  var files = req.query.files;
  if (typeof files === 'string') {files = [files];}

  // 创建唯一 id
  var id = uuid.v4();
  var downloadDstTmpDir = path.join(downloadDstDir, id);

  // 创建目录
  fs.mkdirSync(downloadDstTmpDir);

  // 使用 promise 来判断全部文件复制完成
  var promises = [];
  files.forEach(function (file) {
    var pathArray = file.split('/');
    pathArray.pop();

    var pathString = pathArray.reduce(function (prev, curr) {
      return prev + '/' + curr;
    });

    mkdirp.sync(path.join(downloadDstTmpDir, pathString));
    var src  = path.join(downloadSrcDir, file);
    var dest = path.join(downloadDstTmpDir, file);
    // linkAsync 返回一个 promise
    // 注意是 linkAsync 不是 linkSync
    var promise = fs.linkAsync(src, dest);
    promises.push(promise);
  });

  Promise.all(promises).then(function () {
    // 打包
    // 因为 zipFolder 模块的 promise 使用了 Q 模块封装的，并不是 Bluebird，所以这里还是用回调的方式
    zip.zipFolder({folderPath: downloadDstTmpDir}, function (error, zipPath) {
      if (error) { /* ignore error */ }
      // 设置正确的 MIME 类型，提示浏览器
      res.setHeader('Content-type', 'application/x-zip-compressed');
      res.setHeader('Content-disposition', 'attachment; filename=downloadFromServer.zip');
      res.sendFile(zipPath);

      // 清理临时文件
      // 立即删除文件夹
      rimraf(downloadDstTmpDir, function (error) {
        if (error) { /* ignore error */ }
        console.log('removed: ', downloadDstTmpDir);
      });
      // 5秒删除临时压缩包文件
      setTimeout(function () {
        fs.unlink(zipPath, function (error) {
          if (error) { /* ignore error */ }
          console.log('removed: ', zipPath);
        });
        // 5s 简单粗暴
      }, 5000);
    })
  });
});

module.exports = router;
