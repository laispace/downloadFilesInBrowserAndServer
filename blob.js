// # 构造函数：
// 创建一个 Blob 对象
// var myBlob = new Blob(array, options);
// 参数 array 是 ArrayBuffer、ArrayBufferView、Blob、DOMString 对象的一种，或这些对象的混合。
// 参数 options 含两个属性：
var options = {
  type: '',                 // 默认为空，指定 array 内容的 MIME 类型
    endings: 'transparent' // 默认为 'transparent', 指定遇到包含结束符 '/n' 的字符串如何写入
                            // 'native' 表示结束符转化为与当前用户的系统相关的字符表示，
                            // 'transparent' 表示结束符直接存储到 Blob 中，不做转换。
};

// # 举例1 - 创建一个简单的 Blob 对象

// DOMString 类型数据
var array = ['<div id="myId"><a href="http://alloyteam.com">Alloyteam</a></div>']
// 生成 Blob 对象并指定 MIME 类型
var myBlob = new Blob(array, {type: 'text/html'});

// 输出看看有啥
console.log(myBlob); // => Blob {type: "text/html", size: 65, slice: function}

// 大小，单位为字节
var size = myBlob.size;
// MIME 类型，创建时不设置则为空
var type = myBlob.type;

console.log('size: ', size);
console.log('type: ', type);

// 切割, slice 后返回一个新的 blob 对象
// 第一个参数指定切割开始的位置
var myBlob2 = myBlob.slice(10);
console.log(myBlob2); // => Blob {type: "", size: 55, slice: function}

// 第二个参数指定切割结束的位置
var myBlob3 = myBlob.slice(10, 30);
console.log(myBlob3); // => Blob {type: "", size: 20, slice: function}

// # 举例2 - 将 Blob 对象转化为 URL 形式

var array = ['<div id="myId"><a href="http://alloyteam.com">Alloyteam</a></div>']
var myBlob = new Blob(array, {type: 'text/html'});
var url = URL.createObjectURL(myBlob);
console.log(url); // => blob:http%3A//www.alloyteam.com/ba206814-56f7-4277-93b1-50f2fff124bd

// # 举例3 - 将 Blob 对象的数据导出

var array = ['<div id="myId"><a href="http://alloyteam.com">Alloyteam</a></div>']
var myBlob = new Blob(array, {type: 'text/html'});

// 使用 FileReader 对象对 Blob 对象的数据进行读取
// #3-1导出为 ArrayBuffer
var myReader1 = new FileReader();
myReader1.onload = function () {
    console.log('readAsArrayBuffer: ', myReader1.result);
};
myReader1.readAsArrayBuffer(myBlob);

// #3-2导出为 Text
var myReader2 = new FileReader();
myReader2.onload = function () {
    console.log('readAsText: ', myReader2.result);
};
myReader2.readAsText(myBlob);

// #3-3导出为 BinaryString
var myReader3 = new FileReader();
myReader3.onload = function () {
    console.log('readAsBinaryString: ', myReader3.result);
};
myReader3.readAsBinaryString(myBlob);

// #3-4导出为 DataURL
var myReader4 = new FileReader();
myReader4.onload = function () {
    console.log('readAsDataURL: ', myReader4.result);
};
myReader4.readAsDataURL(myBlob);
