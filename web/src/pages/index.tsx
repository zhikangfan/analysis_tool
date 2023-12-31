import React, {useEffect, useState} from 'react';
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import type { UploadProps } from 'antd';

import {message, Table, Upload, Image, Form, Select, Button, Input} from 'antd';
const { Dragger } = Upload;
const { Search } = Input;
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
  let defaultPageSize = 100;

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
  const [searchFilename, setSearchFilename] = useState<string>('')

  const columns = [
    {
      title: "神策ID",
      key: "distinct_id",
      width: 100,
      dataIndex: "distinct_id"
    },
    {
      title: "用户ID",
      key: "uid",
      width: 100,
      dataIndex: "uid"
    },
    {
      title: "帧率",
      key: "frame_rate",
      width: 50,
      ellipsis: true,
      textWrap: 'word-break',
      dataIndex: "frame_rate"
    },
    {
      title: "用户状态",
      key: "user_status",
      width: 80,
      ellipsis: true,
      textWrap: 'word-break',
      dataIndex: "user_status"
    },{
      title: "录制进程",
      key: "record_process",
      width: 100,
      ellipsis: true,
      textWrap: 'word-break',
      dataIndex: "record_process"
    },
    {
      title: "录制模式",
      key: "record_mode",
      width: 100,
      ellipsis: true,
      textWrap: 'word-break',
      dataIndex: "record_mode"
    },
    {
      title: "时长",
      key: "record_duration",
      width: 80,
      dataIndex: "record_duration"
    },
    {
      title: "文件大小",
      key: "file_size",
      dataIndex: "file_size",
      width: 100
      // render(text: number, record: TableData, index: number) {
      //   return (text / 1024 / 1024)
      // }
    },
    {
      title: "分辨率",
      key: "resolution",
      width: 100,
      ellipsis: true,
      textWrap: 'word-break',
      dataIndex: "resolution"
    },

    // {
    //   title: "视频采样帧",
    //   key: "files",
    //   dataIndex: "files",
    //   render(text: Array<string>, record: TableData, index: number) {
    //     return <>
    //       <Image.PreviewGroup>
    //         {
    //           record?.files?.map((item,idx) => <Image width={300} key={item+"_"+idx} src={"http://10.10.40.24:3001" + item} />)
    //         }
    //
    //       </Image.PreviewGroup>
    //     </>
    //   }
    // }
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

  async function onSearch(value: string) {
    if (value?.trim().length === 0) {
      await handleSearch(searchFilename.split('.xlsx')[0])
      return
    }
    try {
      setTableLoading(true)
      let filterData = data.filter(item => item.distinct_id === value);
      let d = await addPictures(1, defaultPageSize, filterData)
      setData(d)
      setTotal(d.length)
      setTableLoading(false)
    } catch (e) {
      message.error('查找失败!')
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
    setTableLoading(true)
    try {
      await addPictures(page, pageSize, data)
      await setCurrentPage(page)
      setTableLoading(false)
    } catch (e) {
      setTableLoading(false)
    }
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
                setSearchFilename(filename)
                await handleSearch(filename.split('.xlsx')[0])
                await setCurrentPage(1)
              }}
              options={files}
            />

          </Form.Item>
        </Form>
        <div style={{width: 350, marginLeft: 10}}>
          <Search placeholder="神策ID" onSearch={onSearch} enterButton />
        </div>
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
        expandable={{
          defaultExpandAllRows: true,
          columnTitle: '视频采样帧',
          columnWidth: 50,
          expandedRowRender: (record) => {
            return <>
              {/*<div style={{*/}
              {/*  color: 'rgba(0,0,0,.88)',*/}
              {/*  fontWeight: 600,*/}
              {/*  paddingBottom: 15,*/}
              {/*  marginBottom: 15,*/}
              {/*  background: '#fafafa',*/}
              {/*  borderBottom: '1px solid #f0f0f0'*/}
              {/*}}>*/}
              {/*  视频采样帧:*/}
              {/*</div>*/}
              <Image.PreviewGroup>
                {
                  record?.files?.map((item,idx) => <Image width={300} key={item+"_"+idx} src={"http://10.10.40.24:3001" + item}/>)
                }

              </Image.PreviewGroup>
            </>
          },
        }}
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
