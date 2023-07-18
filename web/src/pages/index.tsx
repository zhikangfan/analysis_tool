import React, {useEffect, useState} from 'react';
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import type { UploadProps } from 'antd';

import {message, Table, Upload, Image, Form, Select, Button} from 'antd';
const { Dragger } = Upload;
import axios from 'axios'

export interface TableData {
  "神策id": string,
  "会员状态": string,
  "录制模式": "区域模式" | "游戏模式" | "全屏录制" | "应用窗口录制" | "摄像头录制" | "跟随鼠标录制" | " 声音录制",
  "录制时长(秒）": number,
  "文件大小（Byte字节）": number,
  "分辨率": string,
  "帧率": number,
  "截帧url": string,
  files: Array<string>
}


export default function HomePage() {

  const key = 'loadingKey'
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

  const columns = [{
    title: "神策ID",
    key: "神策id",
    dataIndex: "神策id"
  },
    {
      title: "用户ID",
      key: "用户id",
      dataIndex: "用户id"
    },
    {
      title: "帧率",
      // key: "帧率",
      dataIndex: "帧率"
    },
    {
      title: "会员状态",
      // key: "会员状态",
      dataIndex: "会员状态"
    },{
      title: "会员级别",
      // key: "会员级别",
      dataIndex: "会员级别"
    },
    {
      title: "录制模式",
      // key: "录制模式111",
      dataIndex: "录制模式"
    },
    {
      title: "录制时长（秒）",
      // key: "录制时长(秒）",
      dataIndex: "录制时长(秒）"
    },
    {
      title: "文件大小（Byte字节）",
      // key: "文件大小（Byte字节）",
      dataIndex: "文件大小（Byte字节）"
    },
    {
      title: "分辨率",
      // key: "分辨率",
      dataIndex: "分辨率"
    },
    {
      title: "视频采样帧",
      // key: "files",
      dataIndex: "files",
      render(text: Array<string>, record: TableData, index: number) {
        return <>
          <Image.PreviewGroup>
            {
              record?.files?.map((item,idx) => <Image width={50} key={item+"_"+idx} src={"http://10.10.40.24:3001/public/" + item} />)
            }

          </Image.PreviewGroup>
        </>
      }
    }
  ]
  const [data, setData] = useState([])
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

      setData(res.data.data)
      setTotal(res.data.data.length)
      setTableLoading(false)
    } catch (e) {
      message.error('加载数据错误!')
      setTableLoading(false)
    }
  }

  return (
    <div style={{padding: '20px'}}>

      <div style={{display: 'flex',}}>
        <Form>
          <Form.Item
            label={"选择文件"}
            name={"filename"}
          >
            <Select
              style={{ width: 180 }}
              onChange={ (filename) => {
                handleSearch(filename.split('.xlsx')[0])
                setCurrentPage(1)
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
        pagination={{
          pageSize: 10,
          total: total,
          current: currentPage,
          showTotal: (total) => {
            return `共 ${total} 条数据`
          },
          onChange:(page)=> {
            setCurrentPage(page)
          }
        }}
      />
    </div>

  );
}
