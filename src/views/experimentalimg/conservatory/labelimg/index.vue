<template>
  <div>
    <el-container class="container">
      <el-header>
        <el-button @click="uploadZip" size="large" class="upload-zip" v-hasPermi="['experimental:upload']">上传</el-button>
        <el-date-picker v-model="searchDate" type="date" placeholder="按日期检索" size="large" class="search" />
        <el-button @click="search" size="large">搜索</el-button>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="20">
            <el-tag size="large" style="width:100%;text-align: left;">{{ dateName }}</el-tag>
          </el-col>
          <el-col :span="4">
            <el-button @click="downloadZip">下载</el-button>
            <el-button @click="removeZip" v-hasPermi="['experimental:remove']">删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-tag size="large" style="width:100%;text-align: left;">img</el-tag>
          </el-col>
          <el-col :span="4">
            <el-button @click="downloadImg">下载</el-button>
            <el-button @click="removeImg" v-hasPermi="['experimental:remove']">删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <div class="img_box">
              <el-image v-for="(src, index) in imgList" key="index" :previewSrcList="imgList" :initial-index="index"
                :src="src" class="img"></el-image>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button @click="uploadImg" style="width:65%;height: 100%;" v-hasPermi="['experimental:upload']">上传</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-tag size="large" style="width:100%;text-align: left;">dep</el-tag>
          </el-col>
          <el-col :span="4">
            <el-button @click="downloadDep">下载</el-button>
            <el-button @click="removeDep" v-hasPermi="['experimental:remove']">删除</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <div class="img_box">
              <el-image v-for="(src, index) in depList" key="index" :previewSrcList="depList" :initial-index="index"
                :src="src" class="img"></el-image>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button @click="uploadDep" style="width:65%;height: 100%;" v-hasPermi="['experimental:upload']">上传</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-dialog :title="`上传${dialogTitle}`" v-model="dialogVisible" width="70%">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="文件" prop="file">
          <el-upload class="upload-demo" drag action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :auto-upload="false" v-model:file-list="form.file" :accept="acceptFile">
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
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期" class="search" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup name="LabelImg">
import { UploadFilled, } from '@element-plus/icons-vue';
import { ref, reactive, getCurrentInstance, onMounted } from 'vue';

// 获取默认当日图片
onMounted(() => {

});
// 获取vue实例上的方法
const { proxy: { $modal } } = getCurrentInstance();

const searchDate = ref('');// 检索日期
const dateName = computed(() => {
  const date = new Date(searchDate.value);
  return `${date.getFullYear()}年${date.getMonth() - 1}月${date.getDate()}日温室标签图像`;
});// 检索日期
function search() {
  if (searchDate.value === '') {
    $modal.msgError('请选择日期');
    return;
  }
  console.log('日期', searchDate.value);
}
const dialogTitle = ref('');// 弹窗标题
const dialogVisible = ref(false);// 弹窗是否可见

// 上传文件夹弹窗打开
function uploadZip() {
  dialogTitle.value = '文件夹图片';
  acceptFile.value = '.jpg,.jpeg,.png';
  dialogVisible.value = true;
}
function uploadImg() {
  dialogTitle.value = '图片';
  acceptFile.value = '.jpg,.png,.jpeg';
  form.date = searchDate.value;
  dialogVisible.value = true;
}
function uploadDep() {
  dialogTitle.value = 'dep';
  acceptFile.value = '.jpg,.png,.jpeg';
  form.date = searchDate.value;
  dialogVisible.value = true;
}

const form = reactive({
  file: [],
  date: '',
}); // 表单数据

const rules = reactive({
  file: [
    { required: true, message: '请上传文件', trigger: 'blur' },
  ],
  date: [
    { type: "date", required: true, message: '请选择日期', trigger: 'change' },
  ],
});

const acceptFile = ref('');  // 上传接收的文件类型

// 提交表单
function submitForm() {
  console.log(form);
  dialogVisible.value = false;
}

const imgList = ref(['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',]); // 图片列表
const depList = ref(['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',]); // dep列表
const imgLoading = ref(false); // 图片是否加载中
const depLoading = ref(false); // dep是否加载中

// 请求图片列表
function getImageList() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(imageList);
    }, 1000);
  });
}
// 请求dep列表
function getDepList() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(depList);
    }, 1000);
  });
}

function downloadZip() {
  console.log('下载压缩包');
}
function removeZip() {
  console.log('删除压缩包');
}
function downloadImg() {
  console.log('下载图片');
}
function removeImg() {
  console.log('删除图片');
}
function downloadDep() {
  console.log('下载dep');
}
function removeDep() {
  console.log('删除dep');
}
</script>

<style scoped>
.container {
  margin: 40px 0 0 30px;
}


.upload-zip {
  width: 20%;
  margin-right: 20vh;
}

.img_box {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  margin-top: 20px;
  margin-bottom: 20px;
}

.img {
  height: 100px;
  padding: 0 5px;
}
</style>
