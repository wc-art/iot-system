<template>
  <div class="container">
    <h1>ROBOTLAB自动导航数据管理系统</h1>
    <div class="version">
      <h2>版本：{{ version }}</h2>
      <h3>技术人员：{{ people }}</h3>
    </div>
    <div class="footer">
      <div class="head-people">
        <h3>负责人：{{ headPeople }}</h3>
        <h3>邮箱：{{ email }}</h3>
      </div>
      <div class="log">
        <h3>更新日志：{{ log }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="NavigationHome">
import { ref } from "vue";

const version = ref("1.0.0");
const people = ref("程家伟");
const headPeople = ref('xxx')
const email = ref("xxxxxxxxxx@qq.com");
const log = ref("今日更新");

</script>

<style scoped>
.container {
  margin: 30px 0 0 20px;
}

.version {
  display: flex;
  width: 50%;
  justify-content: space-between;
}

.footer {
  margin-top: 100px;
  display: flex;
  justify-content: space-around;
}

.head-people {
  border: 2px solid black;
  text-align: center;
  border-radius: 10px;
  flex: 0.4;
  height: 200px;
}

.log {
  border: 2px solid black;
  text-align: center;
  border-radius: 10px;
  flex: 0.4;
}
</style>
