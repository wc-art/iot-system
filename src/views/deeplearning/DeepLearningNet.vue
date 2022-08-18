<template>
  <div class="container">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="20">
            <span>预测图像：</span>
            <span v-for="(img, index) in imgList" :key="index">{{ img.name }},</span>
          </el-col>
          <el-col :span="2">
            <el-button @click="predictAllImg">一键预测</el-button>
          </el-col>
          <el-col :span="2">
            <el-button @click="uploadImg">上传(多张)</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <span>预测结果：</span>
            <span v-for="(file, index) in predictImgList">{{ file.name }},</span>
          </el-col>
          <el-col :span="4">
            <el-button @click="saveAllImg">结果保存</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row :gutter="30">
          <el-col :span="12" class="img_box">
            <el-image :src="currentImg.value.src" class="img">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <icon-picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-col>
          <el-col :span="12" class="img_box">
            <el-image :src="curPredictImg.src" class="img">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <icon-picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <el-row>
          <el-col :span="12" style="display:inline-flex;justify-content: space-around;">
            <el-button @click="prevImg">上一张</el-button>
            <el-button @click="predictImg">预测</el-button>
            <el-button @click="nextImg">下一张</el-button>
          </el-col>
          <el-col :span="12" style="display:inline-flex;justify-content: space-around;">
            <el-button @click="saveImg">结果保存</el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
    <el-dialog title="上传图片" v-model="dialogVisible" width="70%">
      <el-upload ref="uploadRef" drag action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        v-model:file-list="uploadImgList" accept=".jpeg,.jpg,.png" :auto-upload="false">
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            {{ dialogTitle }} files
          </div>
        </template>
      </el-upload>
      <el-button type="primary" @click="submitForm">上传</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Picture as IconPicture } from '@element-plus/icons-vue'

const imgList = ref([
  {
    src: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    name: '1.jpeg'
  }, {
    src: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    name: '2.jpeg'
  }
]); // 图片列表
const uploadImgList = ref([]); // 上传中的图片列表
const predictImgList = ref([]); // 预测图片列表
const uploadRef = ref(null); // 上传组件实例

const currentImg = reactive({
  value: imgList.value[0],
  idx: 0
}); // 当前图片
const curPredictImg = ref(imgList.value[0]); // 当前预测图片

const dialogVisible = ref(false); // 弹框加载状态

// 预测所有图片
function predictAllImg() {
  for (let i = 0; i < imgList.value.length; i++) {
    predictImg(imgList.value[i]);
  }
}

// 上一张
function prevImg() {
  if (currentImg.idx > 0) {
    currentImg.idx--;
    currentImg.value = imgList.value[currentImg.idx];
  }
}

// 下一张
function nextImg() {
  if (currentImg.idx < imgList.value.length - 1) {
    currentImg.idx++;
    currentImg.value = imgList.value[currentImg.idx];
  }
}
// 预测图片
function predictImg(img = currentImg.value) {
  console.log('predict', img);
}
// 保存所有图片
function saveAllImg() {
  console.log('save all', predictImgList.value);
}
// 保存图片
function saveImg() {
  console.log('save', curPredictImg.value);
}

// 打开上传图片弹窗
function uploadImg() {
  uploadImgList.value = [];
  dialogVisible.value = true;
}

// 上传图片
function submitForm() {
  uploadRef.value.submit();
}
</script>

<style scoped>
.container {
  margin: 40px 0 0 30px
}

.img{
  height: 400px;
  width: 300px;
}

.img_box{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
