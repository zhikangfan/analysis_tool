import React, {useEffect, useState} from 'react';
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import type { UploadProps } from 'antd';

import {message, Table, Upload, Image, Form, Select, Button} from 'antd';
const { Dragger } = Upload;
import axios from 'axios'

export interface TableData {
  distinct_id: string, // 神策id
  uid: string, // 用户id
  user_status : string, // 用户状态
  record_process: string, // 录制进程
  record_mode: "区域模式" | "游戏模式" | "全屏录制" | "应用窗口录制" | "摄像头录制" | "跟随鼠标录制" | " 声音录制",
  record_duration : number, // 录制时长
  file_size : number, // 文件大小
  resolution: string, // 分辨率
  frame_rate : number, // 帧率
  frame_sample_url : string, // 截帧采样图片链接
  files?: Array<string> // 截帧采样图片
}


export default function HomePage() {

  const key = 'loadingKey'
  const isLoadZipSwitch = true; // 是否开启懒加载zip，若服务端开启则开启，关闭则关闭
  let defaultPageSize = 1;

  const props: UploadProps = {
    name: 'xlsx',
    multiple: true,
    maxCount: 10,
    showUploadList: false,
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    action: '/upload',
    onChange(info) {
      const { status } = info.file;
      if (status === 'uploading') {
        message.loading({
          content: "正在上传...",
          duration: 0,
          key: key
        })
      }
      if (status === 'done') {
       let successUpload = info.fileList.filter(item => item.response.status === 'success');
       message.success({
         content: "上传成功 " + successUpload.length + " 个，失败 " + (info.fileList.length - successUpload.length) + " 个",
         duration: 1.5,
         key: key
       } )
      } else if (status === 'error') {
        message.error({
          content: "上传失败",
          duration: 1.5,
          key: key
        });
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [tableLoading, setTableLoading] = useState<boolean>(false)

  const columns = [
    {
      title: "神策ID",
      key: "distinct_id",
      dataIndex: "distinct_id"
    },
    {
      title: "用户ID",
      key: "uid",
      dataIndex: "uid"
    },
    {
      title: "帧率",
      key: "frame_rate",
      dataIndex: "frame_rate"
    },
    {
      title: "用户状态",
      key: "user_status",
      dataIndex: "user_status"
    },{
      title: "录制进程",
      key: "record_process",
      dataIndex: "record_process"
    },
    {
      title: "录制模式",
      key: "record_mode",
      dataIndex: "record_mode"
    },
    {
      title: "录制时长（秒）",
      key: "record_duration",
      dataIndex: "record_duration"
    },
    {
      title: "文件大小（Mb）",
      key: "file_size",
      dataIndex: "file_size",
      render(text: number, record: TableData, index: number) {
        return (text / 1024 / 1024)
      }
    },
    {
      title: "分辨率",
      key: "resolution",
      dataIndex: "resolution"
    },

    {
      title: "视频采样帧",
      key: "files",
      dataIndex: "files",
      render(text: Array<string>, record: TableData, index: number) {
        return <>
          <Image.PreviewGroup>
            {
              record?.files?.map((item,idx) => <Image width={150} key={item+"_"+idx} src={"http://10.10.40.24:3001" + item} />)
            }

          </Image.PreviewGroup>
        </>
      }
    }
  ]
  const [data, setData] = useState<Array<TableData>>([])
  const [files, setFiles] = useState([])


  useEffect(() => {
    axios.get('/files').then(res => {
      if (res.data.status === 'success'){
          let filesOptions = res.data.data.map((item: Array<string>) => {
            return {
              value: item,
              label: item
            }
          })
        setFiles(filesOptions)
      }
    }).catch(e => {
      console.log(e)
    })
  },[])
  async function handleSearch(filename: string) {
    setTableLoading(true)
    try {
      let res = await axios.get('/data?name=' + filename)
      let d = await addPictures(1, defaultPageSize, res.data.data)
      setData(d)
      setTotal(d.length)
      setTableLoading(false)
    } catch (e) {
      message.error('加载数据错误!')
      setTableLoading(false)
    }
  }

  /**
   * @description 请求图片
   * @param {string} url
   */
  async function getPictures(url: string) {
    return axios.get('/unzip?url=' + url)
  }

  async function addPictures(page: number, pageSize: number, data: Array<TableData>) {

    // 没有开启懒加载，直接返回
    if (!isLoadZipSwitch) {
      return data;
    }

    let results = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    for (let i = 0; i < results.length; i++) {
      let picturesResults = await getPictures(window.btoa(results[i]['frame_sample_url']))
      if (picturesResults.data.status === 'success') {
        results[i]['files'] = picturesResults.data.data
      } else {
        results[i]['files'] = []
      }

    }
    data.splice((page - 1) * pageSize, pageSize, ...results)
    return data;
  }
  /**
   * @description 页码改变
   * @param {number} page
   * @param {number} pageSize
   */
  async function onPageChange(page: number, pageSize: number) {
    await addPictures(page, pageSize, data)
    await setCurrentPage(page)
  }

  return (
    <div style={{padding: '20px'}}>

      <div style={{display: 'flex'}}>
        <Form>
          <Form.Item
            label={"选择文件"}
            name={"filename"}
          >
            <Select
              style={{ width: 180 }}
              onChange={ async (filename) => {
                await handleSearch(filename.split('.xlsx')[0])
                await setCurrentPage(1)
              }}
              options={files}
            />

          </Form.Item>
        </Form>
        {/*<div style={{marginLeft: '30px'}}>*/}
        {/*  <Upload {...props}>*/}
        {/*    <Button icon={<UploadOutlined />}>选择文件（.xlsx）</Button>*/}
        {/*  </Upload>*/}
        {/*</div>*/}
      </div>
      <Table
        columns={columns}
        dataSource={data}
        loading={
          {
            spinning: tableLoading,
            tip: '数据获取中...'
          }
        }
        bordered
        pagination={{
          total: total,
          defaultPageSize: defaultPageSize,
          current: currentPage,
          pageSizeOptions: [50, 100, 200, 500],
          showSizeChanger: true,
          showTotal: (total) => {
            return `共 ${total} 条数据`
          },
          onChange: onPageChange
        }}
      />
    </div>

  );
}
