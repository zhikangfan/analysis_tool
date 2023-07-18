import React, {useEffect, useState} from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {message, Upload} from "antd";
const { Dragger } = Upload;
export default function UploadPage() {
  const key = 'loadingKey'
  const props: UploadProps = {
    name: 'xlsx',
    multiple: true,
    maxCount: 10,
    showUploadList: false,
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    action: 'http://127.0.0.1:3001/upload',
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
  return <div style={{width: '100%', height: '100vh', boxSizing: 'border-box', padding: '20px'}}>
    <Dragger {...props}>
      <p className="ant-upload-text">点击或者将文件拖拽到此区域</p>
      <p className="ant-upload-hint">
        仅支持.xlsx文件
      </p>
    </Dragger>
  </div>
}