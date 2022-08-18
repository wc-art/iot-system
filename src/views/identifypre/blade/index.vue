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
          <el-col v-for="(src, index) in imageSrcList" :key="index" :span="4">
            <el-image :src="src" fit="contain" @click.passive="clickImage(index)" class="check_btn">
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

        <el-row v-if="imageSrcList.length !== 0">
          <el-col :span="12">
            <el-button disabled>
              待检图片
            </el-button>
            <el-image :src="curImageSrc" style="min-height:200px;display: block;" />
            <div v-loading="bladeLoading">
              <el-button @click="checkBlade" v-hasPermi="['system:blade:check']">
                叶片检测
              </el-button>
              <el-image class="check_btn" :src="bladeSrc">
                <template #error>
                  <div>
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </el-col>
          <el-col :span="12" style="padding-left:10px">
            <el-button :disabled="false">叶片检测结果</el-button>
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="variety" label="类别" />
              <el-table-column prop="data" label="值" />
            </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup name="bladeCheck">
import { ref, getCurrentInstance } from 'vue';
import { getTree } from '@/api/tree';
import { getImagesBynodeId,getCheckedLeafImgByImg } from '@/api/identifypre/blade';


// vue实例
const { proxy: { $modal } } = getCurrentInstance();

// 加载
const loading = ref(false);
const imageLoading = ref(false);
const loadingText = ref('加载中...');

// 表格数据
const tableData = ref([
  {
    variety: '检测日期',
    data: '2020-01-01'
  },
  {
    variety: '出苗率',
    data: '100%'
  },
  {
    variety: '弱苗位置',
    data: '左上'
  },
  {
    variety: '无苗位置',
    data: '左上'
  },
  {
    variety: '补苗量',
    data: '3株'
  }
]);

// 图片列表
const currentPage = ref(1);
const imageSrcList = ref(['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',]); // 图片列表
const imageList = ['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://scpic.chinaz.net/files/pic/pic6/pic1874.jpg',
];
const curImageSrc = ref(imageSrcList.value[0]); // 正在看的图片连接

function clickImage(index) {
  curImageSrc.value = imageSrcList.value[index];
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

const bladeLoading = ref(false);
const bladeSrc = ref('') // 叶片检测后图片链接
// 检测方法
function checkBlade() {
  bladeLoading.value = true
  getCheckedLeafImgByImg("D:\\ruoyi\\uploadPath\\image\\13_20220815_Wjw0xDGsk4.png").then(res => {
    bladeSrc.value = res.Picture
    delete res.picture
    tableData.value.map(item => {
      item.data = res[item.variety]
      return item
    })
    bladeLoading.value = false
  })
}

// 树控件
const routesData = ref([]);
const defaultProps = ref({
  children: 'children',
  label: 'treeName'
});

const treeType = 2;
const tree = ref(null);

const getTreeList = () => {
  getTree(treeType, 0, 1).then(res => {
    routesData.value = res.data.children;
  });
};

getTreeList();

async function rowClick(nodeObj) {
  console.log('nodeObj', nodeObj);
  loading.value = true;
  imageSrcList.value = await getImagesBynodeId(nodeObj.treeId);
  curImageSrc.value = imageSrcList.value[0];
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
.check_btn {
  display: block;
  min-height: 200px;
  text-align: center;
  line-height: 200px;
  font-size: 40px;
}

.image_item {
  height: 200px;
}

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
