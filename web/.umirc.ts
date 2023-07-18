import { defineConfig } from "umi";

export default defineConfig({
  title: '视频截帧采样',
  routes: [
    { path: '/upload', component: "upload"},
    { path: "/", component: "index" },
    { path: '/*', component: "error"},
  ],
  npmClient: 'pnpm',
  outputPath: "../public/dist",
  publicPath: "/dist/",
  proxy: {
    '/data': {
      'target': 'http://10.10.40.24:3001',
      'changeOrigin': true
    },
    '/upload': {
      'target': 'http://10.10.40.24:3001',
      'changeOrigin': true
    },
    '/files': {
      'target': 'http://10.10.40.24:3001',
      'changeOrigin': true
    },
  }
});