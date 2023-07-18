const multer = require('multer');
const uploadMimetypes = process.env.MIMETYPE_WHITELIST;
const maxCount = 10;
const fileSize = 10 * 1024;
const path = require('path');
// const { fail } = require('../router/response');
// 定制存储器
const storage = multer.diskStorage({
    // 定制存储位置，提前创建好对应文件目录
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../public/data/'))
    },
    // 定制存储文件名称
    filename: (req, file, cb) => {
        let suffixArray = file.originalname.split('.');
        let ext = suffixArray[suffixArray.length - 1];
        cb(null, `${path.parse(file.originalname).name}_${new Date().getFullYear()}${new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}.${ext}` );
    }

})

// 定制过滤器
const fileFilter = (req, file, cb) => {
    cb(null, true) //允许接收
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true) //允许接收
    } else {
        cb(null, false) //拒绝接收

        cb(new Error('仅支持xlsx文件')) //发送错误
    }

}


const upload = multer({
    storage: storage,
    limits: {
        fileSize: fileSize * 1024, //10Mb大小
        files: maxCount // 最多上传10个文件
    },
    fileFilter: fileFilter
})

const uploadArray = upload.array('xlsx', 10);

module.exports = (req, res, next) => {
    uploadArray(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            res.send(JSON.stringify({
                status: 'fail',
                data: {},
                msg: '上传文件失败',
                info: err
            }))
            // 发生错误
            // fail(res, 5000, 'Multer Error: ' + err, 500);
        } else if (err) {
            // 发生错误
            // fail(res, 5000, '' + err, 500);
            res.send(JSON.stringify({
                status: 'fail',
                data: {},
                msg: '上传文件失败',
                info: err
            }))
        } else {
            // 一切都好
            next();
        }

    })
}