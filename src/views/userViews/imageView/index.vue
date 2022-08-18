<template>
  <div style="width:100%;min-height: calc(100vh - 84px);background-color:#EEEEEE;height: 100%;">
    <el-container style="padding:20px;border: 1px solid #eee;height:100%;" v-loading="loading"
      element-loading-text="loading..." element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-aside width="20%" class="mokuai card shadow">
        <el-tree ref="tree" :data="routesData" :props="defaultProps" node-key="treeId" default-expand-all
          highlight-current :current-node-key="1" @node-click="rowClick" class="permission-tree" />
      </el-aside>
      <!-- //右边的盒子 -->
      <el-main class="right-box">
        <!-- 操作部分 -->
        <div style="width:100%;">
          <el-button type="primary" class="filter-item" style="margin: 10px;" @click.prevent="addNode">新建</el-button>
        </div>
        <!-- 图片展示部分 -->
        <div v-if="imageSrcList.length === 0" style="height:500px;">无图片</div>
        <div class="image_box" v-else>
          <el-card class="image_item" v-for="(item, index) in imageSrcList" :key="index">
            <el-image :src="item" :preview-src-list="imageSrcList" :initial-index="index">
              <template #placeholder>
                <div class="image-slot">Loading<span class="dot">...</span></div>
              </template>
            </el-image>
            <el-button icon="Delete" size="large" circle type="danger" @click="deleteImage(index)"></el-button>
          </el-card>
        </div>
      </el-main>
    </el-container>
    <!-- <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" center draggable width="400px">
      <el-form ref="dataForm" :rules="rules" label-position="left" label-width="100px" style="width:300px;"
        size="small">
        <el-form-item label="节点名称：" prop="name">
          <el-input v-model="nodeTitle" placeholder="输入节点名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogStatus === 'create' ? createData() : updateData()">保存</el-button>
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';

const routesData = ref([]);
const defaultProps = ref({
  children: 'children',
  label: 'name'
});
const loading = ref(false);
const imageSrcList = ref(['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg']);

function deleteImage(index) {
  imageSrcList.value.splice(index, 1);
}

function addNode() {

}

function rowClick(row) {

}
</script>

<style scoped>
:deep(.el-tree-node__label) {
  font-size: 18px;
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #79b5f1 !important;
}

/* /deep/ .el-upload-list--picture .el-upload-list__item {
    overflow: hidden;
    z-index: 0;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 10px;
    margin-right: 20px;
    padding: 10px 10px 10px 90px;
    height: 92px;
    width: 60%;
} */
/* .el-tab-pane-img */
:deep(.el-upload-list--picture .el-upload-list__item) {
  overflow: hidden;
  z-index: 0;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 10px;
  margin-right: 20px;
  padding: 10px 10px 10px 90px;
  height: 92px;
  width: 300px;
  float: left;
}

.card {
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}
</style>
<style lang="scss" scoped>
.image_box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.image_item {
  box-sizing: border-box;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  width: 25%;
}

.right-box {
  // background-color: #fff;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
  margin-left: 20px;
}

.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
  /* 0 3px 3px -2px rgba(0, 0, 0, 0.12),
         0 1px 8px 0 rgba(0, 0, 0, 0.2); */
}
</style>