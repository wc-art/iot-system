<template>
  <div style="width:100%;min-height: calc(100vh - 84px);background-color:#EEEEEE">
    <el-container style="padding:20px;border: 1px solid #eee" v-loading="loading" :element-loading-text="loadingText"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-aside width="20%" class="mokuai card shadow" style="min-height: calc(100vh - 180px)">
        <el-tree ref="tree" :data="routesData" :props="defaultProps" node-key="treeId" default-expand-all
          highlight-current :current-node-key="1" @node-click="rowClick" class="permission-tree" />
      </el-aside>
      <!-- //右边的盒子 -->
      <el-main width="78%" style="padding:0" class="right-box">
        <el-table :data="tableData" stripe style="width: 100%" align="center">
          <el-table-column fixed type="index" width="40" align="center" />
          <el-table-column v-for="item in dates" :prop="item" :label="item" min-width="100" align="center" />
        </el-table>

        <div>
          <el-button class="btn tag_btn">时间选择</el-button>
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">Check all
          </el-checkbox>
          <el-checkbox-group v-model="checkedDates" @change="handleCheckedDatesChange">
            <el-checkbox v-for="date in dates" :key="date" :label="date">{{
                date
            }}</el-checkbox>
          </el-checkbox-group>
        </div>

        <!-- <el-button class="btn" @click.passive="startPre">开始预测</el-button>
        <Histogram3D v-if="!histogramLoading" :xData="xData" :yData="yData" :tableData="tableData" class="histogram" />
        <div v-else class="histogram" v-loading="histogramLoading"></div>
        <el-button class="btn tag_btn" @click.passive="downloadPreResult">下载预测结果</el-button> -->

        <div style="margin-top: 20px;">
          <el-button @click.passive="startPre" round class="start_pre">
            <Opportunity style="width: 1em; height: 1em; color: orange; margin: auto;"></Opportunity>
            开始预测
          </el-button>
          <el-button @click.passive="downloadPreResult" circle class="download_result">
            <Download style="width: 1.5em; height: 1.5em; margin: auto;" />
          </el-button>
        </div>
        <Histogram3D v-if="!histogramLoading" :xData="xData" :yData="yData" :tableData="tableData" class="histogram" />
        <div v-else class="histogram" v-loading="histogramLoading"></div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup name="growthPre">
import { ref, getCurrentInstance, nextTick } from 'vue';
import Histogram3D from './histogram3D.vue';
import { getTree } from '@/api/tree';

// vue实例
const { proxy: { $modal } } = getCurrentInstance();

// 加载
const loading = ref(false);
const histogramLoading = ref(false);
const loadingText = ref('加载中...');

// 表格数据
const tableData = ref([
  {
    '2020-01-01': 11,
    '2020-01-02': 22,
    '2020-01-03': 33,
    '2020-01-04': 44,
  },
  {
    '2020-01-01': 11,
    '2020-01-02': 22,
    '2020-01-03': 33,
    '2020-01-04': 44,
  },
  {
    '2020-01-01': 11,
    '2020-01-02': 22,
    '2020-01-03': 33,
    '2020-01-04': 44,
  },
  {
    '2020-01-01': 11,
    '2020-01-02': 22,
    '2020-01-03': 33,
    '2020-01-04': 44,
  }
]);
const dates = ref(Object.keys(tableData.value[0]));

// 获取表格数据
function getTableData(treeId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(tableData.value);
    }, 2000);
  });
}
// 全选框
const checkAll = ref(false);
const isIndeterminate = ref(true);
// 全选函数
function handleCheckAllChange(val) {
  checkAll.value = val;
  isIndeterminate.value = false;
  checkedDates.value = val ? dates.value : [];
}

// 多选框
const checkedDates = ref(dates.value);
function handleCheckedDatesChange(val) {
  checkAll.value = val.length === dates.value.length;
  isIndeterminate.value = val.length > 0 && val.length < dates.value.length;
}

// 预测图数据
const xData = ref(new Array(tableData.value.length).fill(0).map((item, index) => `第${index + 1}株`));
const yData = ref(tableData.value.length ? Object.keys(tableData.value[0]) : []);

// 开始预测
function startPre() {
  histogramLoading.value = true;
  setTimeout(() => {
    nextTick(() => {
      histogramLoading.value = false;
    });
  }, 2000);
}

// 下载预测结果
function downloadPreResult() {
  setTimeout(() => {
    $modal.msgSuccess({
      message: '下载成功',
      showClose: true
    });
  }, 2000);
}
// 树控件
const routesData = ref([{
  treeName: 'Level one 1',
  treeId: '1',
  children: [
    {
      treeName: 'Level two 1-1',
      treeId: '11',
      children: [
        {
          treeName: 'Level three 1-1-1',
          treeId: '111',
        },
      ],
    },
  ],
},
{
  treeName: 'Level one 2',
  treeId: '2',
  children: [
    {
      treeName: 'Level two 2-1',
      treeId: '21',
      children: [
        {
          treeName: 'Level three 2-1-1',
          treeId: '211',
        },
      ],
    },
    {
      treeName: 'Level two 2-2',
      treeId: '21',
      children: [
        {
          treeName: 'Level three 2-2-1',
          treeId: '221`',
        },
      ],
    },
  ],
},
{
  treeName: 'Level one 3',
  treeId: '3',
  children: [
    {
      treeName: 'Level two 3-1',
      treeId: '31',
      children: [
        {
          treeName: 'Level three 3-1-1',
          treeId: '311',
        },
      ],
    },
    {
      treeName: 'Level two 3-2',
      treeId: '32',
      children: [
        {
          treeName: 'Level three 3-2-1',
          treeId: '321',
        },
      ],
    },
  ],
}]);
const defaultProps = ref({
  children: 'children',
  label: 'treeName'
});

const treeType = 3;
const tree = ref(null);

const getTreeList = () => {
  getTree(treeType, 0, 1).then(res => {
    routesData.value = res.data.children;
    nextTick(() => {
      console.log('tree.value', tree.value);
    });
  });
};

getTreeList();

async function rowClick(nodeObj) {
  console.log('nodeObj', nodeObj);
  loading.value = true;
  await getTableData(nodeObj.treeId);
  loading.value = false;
}

</script>
<style lang="scss" scoped>
.right-box {
  margin-left: 20px;
}

.mokuai {
  margin-bottom: 0;
  background-color: #fff;
}

.right-box {
  margin-left: 20px;
}

.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
<style  scoped>
.btn {
  margin: auto;
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

.tag_btn {
  background-color: aqua;
}

.histogram {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  height: 500px;
}

.start_pre {
  text-align: center;
  width: 120px;
  height: 50px;
  font-size: large;
  margin-left: 400px;
}

.download_result {
  width: 50px;
  height: 50px;
  float: right;
}

.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
  /* 0 3px 3px -2px rgba(0, 0, 0, 0.12),
         0 1px 8px 0 rgba(0, 0, 0, 0.2); */
}
</style>
