<template>
    <div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在。</p>
    </div>
  </template>
  
  <script>
  import { message } from 'ant-design-vue'
  
  export default {
    name: 'NotFoundPage',
    mounted() {
      message.warning('路由不存在，请检查您的 URL')
    }
  }
  </script>