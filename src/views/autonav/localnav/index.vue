<template>
  <div class="container">
    <el-container>
      <el-header>
        <el-button @click="detect('Hough检测')">Hough检测</el-button>
        <el-button @click="detect('最小二乘检测')">最小二乘检测</el-button>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6" class="video_item">
            <video width="200" height="300" style="border: 2px solid black;" controls="controls">
              <source :src="roadVideo" type="video/mp4">
              <!-- <source :src="roadVideo" type="video/ogg">
              您的浏览器不支持Video标签。 -->
            </video>
          </el-col>
          <el-col :span="12" class="video_item">
            <video width="300" height="400" style="border: 2px solid black;" controls="controls">
              <source :src="predictedVideo" type="video/mp4">
              <!-- <source :src="predictedVideo" type="video/ogg">
              您的浏览器不支持Video标签。 -->
            </video>
          </el-col>
          <el-col :span="6" class="video_item">
            <el-button @click="downloadData">
              下载数据
            </el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-dialog :title="`上传视频(${dialogTitle})`" v-model="dialogVisible" width="70%">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="文件" prop="localNavVideo">
          <el-upload ref="localVideoRef" drag action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :limit="1" :auto-upload="false" v-model:file-list="form.localNavVideo"
            accept=".avi,.wmv,.mpeg,.mp4,.m4v,.mov,.asf,.flv,.f4v,.rmvb,.rm,.3gp,.vob">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                files
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="文件" prop="depVideo">
          <el-upload ref="depVideoRef" drag action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :limit="1" :auto-upload="false" v-model:file-list="form.depVideo"
            accept=".avi,.wmv,.mpeg,.mp4,.m4v,.mov,.asf,.flv,.f4v,.rmvb,.rm,.3gp,.vob">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                files
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const roadVideo = ref('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'); // 路面视频
const predictedVideo = ref('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'); // 预测后的路面视频

const dialogVisible = ref(false); // 对话框是否可见
const dialogTitle = ref(''); // 对话框狂标题

// 打开对话框
function detect(type) {
  dialogTitle.value = type;
  dialogVisible.value = true;
}

// 上传视频表单
const form = reactive({
  localNavVideo: [],
  depVideo: []
});

const validateLocalNavVideo = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error('请上传路面视频'));
  } else {
    callback();
  }
};

const validateDepVideo = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error('请上传深度视频'));
  } else {
    callback();
  }
};

const rules = reactive({
  localNavVideo: [
    { validator: validateLocalNavVideo, trigger: 'change', required: true }
  ],
  depVideo: [
    { validator: validateDepVideo, trigger: 'change', required: true }
  ]
});

// 视频提交预测
async function submitForm() {
  console.log(form);

  predictedVideo.value = await getFileUrl(form.depVideo[0].raw);

  const url = await getFileUrl(form.localNavVideo[0].raw);
  roadVideo.value = url;
  nextTick(() => {
    dialogVisible.value = false;
  });
}

// 数据下载
function downloadData() {
  dialogVisible.value = false;
  console.log('downloadData');
}

// 获取文件url
async function getFileUrl(file) {
  const reader = new FileReader();
  return new Promise(resolve => {
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      // 文件里的文本会在这里被打印出来
      resolve(event.target.result);
    };
  });
}

function dataURLtoFile(dataurl) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  console.log(bstr);
  return bstr;
}
</script>

<style scoped>
.video_item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  margin: 40px 0 0 30px;
}
</style>
