"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[866],{27113:function(he,O,l){l.r(O),l.d(O,{default:function(){return Q}});var U=l(93525),Z=l.n(U),k=l(25359),u=l.n(k),$=l(49811),c=l.n($),F=l(54306),p=l.n(F),o=l(93236),z=l(70003),G=l(45406),h=l(35026),C=l(49802),H=l(52294),J=l(55310),I=l(74567),m=l(73669),i=l(62086),fe=z.Z.Dragger,N=G.Z.Search;function Q(){var E="loadingKey",V=!0,v=100,me={name:"xlsx",multiple:!0,maxCount:10,showUploadList:!1,accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",action:"/upload",onChange:function(e){var t=e.file.status;if(t==="uploading"&&h.ZP.loading({content:"\u6B63\u5728\u4E0A\u4F20...",duration:0,key:E}),t==="done"){var n=e.fileList.filter(function(r){return r.response.status==="success"});h.ZP.success({content:"\u4E0A\u4F20\u6210\u529F "+n.length+" \u4E2A\uFF0C\u5931\u8D25 "+(e.fileList.length-n.length)+" \u4E2A",duration:1.5,key:E})}else t==="error"&&h.ZP.error({content:"\u4E0A\u4F20\u5931\u8D25",duration:1.5,key:E})},onDrop:function(e){console.log("Dropped files",e.dataTransfer.files)}},X=(0,o.useState)(1),S=p()(X,2),Y=S[0],T=S[1],q=(0,o.useState)(0),R=p()(q,2),ee=R[0],L=R[1],ae=(0,o.useState)(!1),W=p()(ae,2),te=W[0],d=W[1],re=(0,o.useState)(""),x=p()(re,2),ne=x[0],se=x[1],le=[{title:"\u795E\u7B56ID",key:"distinct_id",width:100,dataIndex:"distinct_id"},{title:"\u7528\u6237ID",key:"uid",width:100,dataIndex:"uid"},{title:"\u5E27\u7387",key:"frame_rate",width:50,ellipsis:!0,textWrap:"word-break",dataIndex:"frame_rate"},{title:"\u7528\u6237\u72B6\u6001",key:"user_status",width:80,ellipsis:!0,textWrap:"word-break",dataIndex:"user_status"},{title:"\u5F55\u5236\u8FDB\u7A0B",key:"record_process",width:100,ellipsis:!0,textWrap:"word-break",dataIndex:"record_process"},{title:"\u5F55\u5236\u6A21\u5F0F",key:"record_mode",width:100,ellipsis:!0,textWrap:"word-break",dataIndex:"record_mode"},{title:"\u65F6\u957F",key:"record_duration",width:80,dataIndex:"record_duration"},{title:"\u6587\u4EF6\u5927\u5C0F",key:"file_size",dataIndex:"file_size",width:100},{title:"\u5206\u8FA8\u7387",key:"resolution",width:100,ellipsis:!0,textWrap:"word-break",dataIndex:"resolution"}],ue=(0,o.useState)([]),A=p()(ue,2),P=A[0],j=A[1],ie=(0,o.useState)([]),B=p()(ie,2),_e=B[0],de=B[1];(0,o.useEffect)(function(){m.Z.get("/files").then(function(s){if(s.data.status==="success"){var e=s.data.data.map(function(t){return{value:t,label:t}});de(e)}}).catch(function(s){console.log(s)})},[]);function K(s){return g.apply(this,arguments)}function g(){return g=c()(u()().mark(function s(e){var t,n;return u()().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return d(!0),a.prev=1,a.next=4,m.Z.get("/data?name="+e);case 4:return t=a.sent,a.next=7,y(1,v,t.data.data);case 7:n=a.sent,j(n),L(n.length),d(!1),a.next=17;break;case 13:a.prev=13,a.t0=a.catch(1),h.ZP.error("\u52A0\u8F7D\u6570\u636E\u9519\u8BEF!"),d(!1);case 17:case"end":return a.stop()}},s,null,[[1,13]])})),g.apply(this,arguments)}function oe(s){return b.apply(this,arguments)}function b(){return b=c()(u()().mark(function s(e){var t,n;return u()().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:if((e==null?void 0:e.trim().length)!==0){a.next=4;break}return a.next=3,K(ne.split(".xlsx")[0]);case 3:return a.abrupt("return");case 4:return a.prev=4,d(!0),t=P.filter(function(f){return f.distinct_id===e}),a.next=9,y(1,v,t);case 9:n=a.sent,j(n),L(n.length),d(!1),a.next=19;break;case 15:a.prev=15,a.t0=a.catch(4),h.ZP.error("\u67E5\u627E\u5931\u8D25!"),d(!1);case 19:case"end":return a.stop()}},s,null,[[4,15]])})),b.apply(this,arguments)}function ce(s){return D.apply(this,arguments)}function D(){return D=c()(u()().mark(function s(e){return u()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",m.Z.get("/unzip?url="+e));case 1:case"end":return n.stop()}},s)})),D.apply(this,arguments)}function y(s,e,t){return M.apply(this,arguments)}function M(){return M=c()(u()().mark(function s(e,t,n){var r,a,f;return u()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:if(V){_.next=2;break}return _.abrupt("return",n);case 2:r=n.slice((e-1)*t,(e-1)*t+t),a=0;case 4:if(!(a<r.length)){_.next=12;break}return _.next=7,ce(window.btoa(r[a].frame_sample_url));case 7:f=_.sent,f.data.status==="success"?r[a].files=f.data.data:r[a].files=[];case 9:a++,_.next=4;break;case 12:return n.splice.apply(n,[(e-1)*t,t].concat(Z()(r))),_.abrupt("return",n);case 14:case"end":return _.stop()}},s)})),M.apply(this,arguments)}function pe(s,e){return w.apply(this,arguments)}function w(){return w=c()(u()().mark(function s(e,t){return u()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return d(!0),r.prev=1,r.next=4,y(e,t,P);case 4:return r.next=6,T(e);case 6:d(!1),r.next=12;break;case 9:r.prev=9,r.t0=r.catch(1),d(!1);case 12:case"end":return r.stop()}},s,null,[[1,9]])})),w.apply(this,arguments)}return(0,i.jsxs)("div",{style:{padding:"20px"},children:[(0,i.jsxs)("div",{style:{display:"flex"},children:[(0,i.jsx)(C.Z,{children:(0,i.jsx)(C.Z.Item,{label:"\u9009\u62E9\u6587\u4EF6",name:"filename",children:(0,i.jsx)(H.Z,{style:{width:180},onChange:function(){var s=c()(u()().mark(function e(t){return u()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return se(t),r.next=3,K(t.split(".xlsx")[0]);case 3:return r.next=5,T(1);case 5:case"end":return r.stop()}},e)}));return function(e){return s.apply(this,arguments)}}(),options:_e})})}),(0,i.jsx)("div",{style:{width:350,marginLeft:10},children:(0,i.jsx)(N,{placeholder:"\u795E\u7B56ID",onSearch:oe,enterButton:!0})})]}),(0,i.jsx)(J.Z,{columns:le,dataSource:P,loading:{spinning:te,tip:"\u6570\u636E\u83B7\u53D6\u4E2D..."},bordered:!0,expandable:{defaultExpandAllRows:!0,columnTitle:"\u89C6\u9891\u91C7\u6837\u5E27",columnWidth:50,expandedRowRender:function(e){var t;return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(I.Z.PreviewGroup,{children:e==null||(t=e.files)===null||t===void 0?void 0:t.map(function(n,r){return(0,i.jsx)(I.Z,{width:300,src:"http://10.10.40.24:3001"+n},n+"_"+r)})})})}},pagination:{total:ee,defaultPageSize:v,current:Y,pageSizeOptions:[50,100,200,500],showSizeChanger:!0,showTotal:function(e){return"\u5171 ".concat(e," \u6761\u6570\u636E")},onChange:pe}})]})}}}]);
