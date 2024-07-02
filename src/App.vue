<template>
  <div id="app">
    <router-view /> <!-- 当你的路由path 与访问的地址相符时，会将指定的组件替换该 router-view -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
