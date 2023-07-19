const express = require('express');
const router = express.Router();
const fs = require('fs');
const xlsx = require('node-xlsx').default;

const path = require('path');
const AdmZip = require('adm-zip');
const request = require('request');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const md5 = require('md5');

const linkField = 'frame_sample_url';


function parseUrl(filename) {
  return {
    ...path.parse(filename),
    ext: '.' + filename.split('.').pop()
  }
}
/**
 * @description 将两个数组转换成对象
 * @param keys
 * @param values
 * @returns {{}}
 */
function arrayToObject(keys,values) {
  let obj = {}
  keys.forEach((key,idx) => {
    obj[key] = values[idx]
  })
  return obj;
}

/**
 * @description 判断是不是图片类型
 * @param filename
 * @returns {boolean}
 */
function isPhoto(filename) {
  const suffix = ['png', 'svg', 'webp', 'jpg', 'jpeg'];
  let result = filename.split('.');
  return suffix.includes(result[result.length - 1])
}

async function isExists(path) {
  return new Promise((resolve, reject) => {
    fs.access(path,fs.constants.F_OK, err => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * 读取zip文件内容
 * @param file
 * @returns {Promise<string>}
 */
async function unzip(file) {
  let unzipPath = path.resolve(__dirname, '../public/unzip/' + parseUrl(file).name)
  let downloadPath = path.resolve(__dirname, `../public/download/${file}`)
  let flag = await isExists(unzipPath)
  if (!flag) {
    let zip = new AdmZip(downloadPath);
    zip.extractAllTo(unzipPath, true);
  }
  return unzipPath;
}

function downloadZip(url) {
  let filename = md5(parseUrl(url).name)
  let ext = parseUrl(url).ext
  let downPath = path.resolve(__dirname, `../public/download/${filename}${ext}`);
  return new Promise((resolve, reject) => {
    if (ext === '.zip') {

      isExists(downPath).then(flag => {
        if (flag) {
          resolve(`${filename}${ext}`)
        } else {
          const stream = fs.createWriteStream(downPath);
          request(url).pipe(stream).on("close", err => {
            if (err) {
              reject(err);
            } else {
              resolve(`${filename}${ext}`)
            }
          })
        }
      })

    } else {
      reject('文件非zip文件')
    }
  })

}

// 上传
router.post('/upload', uploadMiddleware, async (req, res) => {
  let filesArray = req.files;
  res.send(JSON.stringify({
    status: 'success',
    msg: '上传成功',
    data: filesArray
  }));
})

// 获取上传过的文件

router.get('/files', async (req, res) => {
  let xlsxFiles = []
  fs.readdir(path.resolve(__dirname, '../public/data/'), (err, files) => {
    if (err) {
      res.send(JSON.stringify({
        status: 'fail',
        msg: "读取失败",
        info: err,
        data: []
      }))
    } else {
      xlsxFiles = files.filter(item => path.extname(item) === '.xlsx')
      res.send(JSON.stringify({
        status: 'success',
        msg: "读取成功",
        data: xlsxFiles
      }))
    }

  })
})

let catchData = new Map();


// 读取数据
router.get('/data', async (req,res) => {
  let {name: queryFilename} = req.query;
  try{
    // 读取数据缓存
    if (!catchData.has(queryFilename)) {
      let xlsxData =  xlsx.parse(path.resolve(__dirname, `../public/data/${queryFilename}.xlsx`))
      let {name: filename, data} = xlsxData[0];
      let finalData = {
        filename: filename,
        data: data
      };
      if (data.length > 0) {
        let keys = data[0];
        let filterData = data.filter(item => item.length > 0)
        filterData.shift();
        finalData = filterData.map(values => arrayToObject(keys, values))
        // 将zip下载到本地并解压
        // for (let i = 0; i < finalData.length; i++) {
        //   let item = finalData[i];
        //   if (item[linkField]) {
        //     item['files'] = await getPicturesByRemoteZip(item[linkField])
        //   }
        // }
      }
      catchData.set(queryFilename, finalData)
    }
    await res.send(JSON.stringify({
      status: 'success',
      msg: 'success',
      data: catchData.get(queryFilename)
    }))
  } catch (e) {
    res.send(JSON.stringify({
      status: 'fail',
      data: {},
      msg: '读取文件失败',
      info: e
    }))
  }

})

/**
 * @description 根据远程zip url获取zip并解压提取图片
 * @param remoteZipUrl
 * @returns {Promise<Array<string>>>}
 */
async function getPicturesByRemoteZip(remoteZipUrl) {
  let dirname = md5(parseUrl(remoteZipUrl).name);
  let unzipPath = path.resolve(__dirname, '../public/unzip/' + dirname);
  let flag = await isExists(unzipPath)
  let unzipFilePath = unzipPath
  if (!flag) {
    let resultsFile = await downloadZip(remoteZipUrl)
    // 解压文件
    unzipFilePath = await unzip(resultsFile);
  }

  return new Promise((resolve, reject) => {
    // 读取文件目录
    fs.readdir(unzipFilePath, (err, files) => {
      if (err) {
        reject(err)
      } else {
        // 将图片内容过滤出来
        let photos = files.filter(f => ['.png','.jpeg','.jpg', '.webp', '.svg', '.gif'].includes(path.extname(f)));
        let photoSrcArray  = photos.map(item => {
          return `/unzip/${dirname}/${item}`
        })
        resolve(photoSrcArray)

      }
    })
  })
}

// 根据url获取zip包并解压将图片提取返回图片路径
router.get('/unzip', async (req, res) => {
  let {url: remoteZipUrl} = req.query;
  try {

    let pictures = await getPicturesByRemoteZip(new Buffer(remoteZipUrl, 'base64').toString());
    res.send(JSON.stringify({
      status: 'success',
      msg: '获取成功',
      data: pictures
    }))


  } catch (e) {
    res.send(JSON.stringify({
      status: 'fail',
      msg: '获取失败',
      data: [],
      info: e
    }))
  }
})

// 清除缓存
router.get('/clear', async (req,res) => {
  let {key} = req.query;
  catchData.delete(key);
  res.send({
    status: 'success',
    msg: '清除缓存成功',
    data: []
  })
})

/* GET home page. */
router.get('*', async (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../public/dist/index.html'))
});

module.exports = router;
