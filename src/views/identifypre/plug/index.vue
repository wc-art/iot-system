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
        <!-- 操作部分 -->
        <div v-if="imageSrcList.length === 0">无图片</div>
        <el-row v-else v-loading="imageLoading" justify="flex-start">
          <el-col :span="2" class="info_btn">
            <el-button plain @click.passive="prevPage" circle icon="ArrowLeftBold"></el-button>
          </el-col>
          <el-col v-for="(src, index) in imageSrcList" :key="src.pictureId" :span="4">
            <el-image :src="src.pictureUrl" fit="contain" @click.passive="clickImage(index)" class="check_btn">
              <template #error>
                <div>
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-col>
          <el-col :span="2" class="info_btn">
            <el-button plain @click.passive="nextPage" circle icon="ArrowRightBold"></el-button>
          </el-col>
        </el-row>

        <el-row v-if="imageSrcList.length !== 0" style="margin-top:10px">
          <el-col :span="12">
            <el-button disabled>
              待检图片
            </el-button>
            <el-image :src="curImageSrc" class="check_btn">
              <template #error>
                <div>
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-col>
          <el-col :span="12" v-loading="growLoading">
            <el-button @click="checkGrow">
              苗盘生长点检测
            </el-button>
            <el-image class="check_btn">
              <template #error>
                <div>
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-col>
        </el-row>
        <el-row v-if="imageSrcList.length !== 0">
          <el-col :span="12" v-loading="holeLoading">
            <el-button @click="checkHoles">
              苗盘穴孔检测
            </el-button>
            <el-image :src="curImageSrc" class="check_btn">
              <template #error>
                <div>
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-col>
          <el-col :span="12" v-loading="greenLoding">
            <el-button @click="checkGreen">
              苗盘超绿检测
            </el-button>
            <el-image class="check_btn">
              <template #error>
                <div>
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup name="plugCheck">
import { ref, getCurrentInstance } from 'vue';
import { getTree } from '@/api/tree';
import { getImagesBynodeId, getCheckedGreenImgByImg, getCheckedHoleImgByImg } from '@/api/identifypre/plug';

// vue实例
const { proxy: { $modal } } = getCurrentInstance();

// 加载
const loading = ref(false);
const imageLoading = ref(false);
const loadingText = ref('加载中...');

// 图片列表
const currentPage = ref(1);
const imageSrcList = ref(['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',]); // 图片列表
const imageList = ['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',];

const curImageSrc = ref(imageSrcList.value[0].pictureUrl); // 正在看的图片连接
const curGrowthDetected = ref('');  // 生长点检测图片
const curPlugDetected = ref('');  //苗盘穴孔检测图片
const curGreenDetected = ref(''); // 苗盘超绿检测图片

// 请求图片列表
// function getImageList(nodeId) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(imageList);
//     }, 1000);
//   });
// }

function clickImage(index) {
  curImageSrc.value = imageSrcList.value[index].pictureUrl;
}

// 上一页图片
async function prevPage() {
  if (currentPage.value === 1) {
    return;
  }
  currentPage.value--;
  imageLoading.value = true;
  imageSrcList.value = await getImageList(tree.value?.getCurrentNode()?.treeId);
  imageLoading.value = false;
}

// 下一页图片
async function nextPage() {
  currentPage.value++;
  imageLoading.value = true;
  imageSrcList.value = await getImageList(tree.value.getCurrentNode()?.treeId);
  imageLoading.value = false;
}

const growLoading = ref(false);
const greenLoding = ref(false);
const holeLoading = ref(false);

// 检测方法
function checkGrow() {
  $modal.confirm({
    title: '提示',
    content: '检测中...',
    onOk: () => {
      console.log('检测中...');
    },
    onCancel: () => {
      console.log('取消');
    },
  });
}

function checkHoles() {
  holeLoading.value = true;
  getCheckedHoleImgByImg("D:\\ruoyi\\uploadPath\\image\\13_20220815_Wjw0xDGsk4.png").then(res => {
    // curGreenDetected.value = res.message
    holeLoading.value = false;
    console.log(res);
  });
}

function checkGreen() {
  greenLoding.value = true;
  getCheckedGreenImgByImg("D:\\ruoyi\\uploadPath\\image\\13_20220815_Wjw0xDGsk4.png").then(res => {
    // curGreenDetected.value = res.message
    greenLoding.value = false;
    console.log(res);
  });
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

const treeType = 2;  // 树的种类
const tree = ref(null); // 树的dom实例


const getTreeList = () => {
  getTree(treeType, 0, 1).then(res => {
    routesData.value = res.data.children;
  });
};

getTreeList();

async function rowClick(nodeObj) {
  loading.value = true;
  imageSrcList.value = await getImagesBynodeId(nodeObj.treeId);
  curImageSrc.value = imageSrcList.value[0].pictureUrl;
  loading.value = false;
}

</script>
<style lang="scss" scoped>
.right-box {
  // background-color: #fff;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
  margin-left: 20px;
}

.el-col {
  border-radius: 4px;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
}

.check_btn {
  display: block;
  min-height: 200px;
  text-align: center;
  line-height: 200px;
  font-size: 40px;
}


.mokuai {
  margin-bottom: 0;
  background-color: #fff;
  // box-shadow:2px 2px 5px #000;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
}

.right-box {
  // background-color: #fff;
  // border:1px solid #ccc;
  // margin-bottom: 50px;
  margin-left: 20px;
}

.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
<style  scoped>
.info_btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.shadow {
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
  /* 0 3px 3px -2px rgba(0, 0, 0, 0.12),
         0 1px 8px 0 rgba(0, 0, 0, 0.2); */
}
</style>
