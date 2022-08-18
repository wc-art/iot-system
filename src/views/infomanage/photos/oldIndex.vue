<template>
    <div style="width:100%;min-height: calc(100vh - 84px);background-color:#EEEEEE">
        <el-container style="padding:20px;border: 1px solid #eee" v-loading="loading"
            :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-aside width="20%" class="mokuai card shadow" style="min-height: calc(100vh - 180px)">
                <el-tree ref="tree" :data="routesData" :props="defaultProps" node-key="treeId" default-expand-all
                    highlight-current :current-node-key="1" @node-click="rowClick" class="permission-tree" />
            </el-aside>
            <!-- //右边的盒子 -->
            <el-main width="78%" style="padding:0" class="right-box">
                <!-- 操作部分 -->
                <div style="width:100%;">
                    <el-button :disabled="false" type="primary" class="filter-item" style="margin: 10px;"
                        @click.prevent="addChildNode" v-hasPermi="['system:node:add']">
                        添加子节点</el-button>
                    <el-button :disabled="false" type="primary" class="filter-item" style="margin: 10px;"
                        @click.prevent="deleteNode" v-hasPermi="['system:node:remove']">删除节点</el-button>
                    <el-button :disabled="false" type="primary" class="filter-item" style="margin: 10px;"
                        @click.prevent="addImage" v-hasPermi="['system:image:add']">添加图片</el-button>
                </div>
                <!-- 内容部分 -->
                <div v-if="imageSrcList.length === 0" style="height:500px;">无图片</div>
                <div class="image_box" v-else>
                    <el-card class="image_item" v-for="(item, index) in imageSrcList" :key="index">
                        <el-image :src="item" :preview-src-list="imageSrcList" :initial-index="index">
                            <template #placeholder>
                                <div class="image-slot">Loading<span class="dot">...</span></div>
                            </template>
                        </el-image>
                        <el-button icon="Delete" size="large" circle type="danger" @click="deleteImage(index)" v-hasPermi="['system:image:remove']" ></el-button>
                    </el-card>
                </div>
            </el-main>
        </el-container>
        <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" center draggable width="50%">
            <el-form ref="dataForm" :rules="rules" label-position="left" label-width="100px">
                <el-form-item label="节点名称：" prop="name">
                    <el-input v-model="nodeTitle" placeholder="输入节点名称" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
                    保存
                </el-button>
                <el-button @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- 添加图片对话框 -->
        <el-dialog title="添加图片" v-model="imageDialog" center draggable width="50%">
            <el-upload v-model:file-list="fileList" class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :on-preview="handlePreview"
                :on-remove="handleRemove" list-type="picture">
                <el-button type="primary">Click to upload</el-button>
                <template #tip>
                    <div class="el-upload__tip">
                        jpg/png files with a size less than 500kb
                    </div>
                </template>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitImage">
                    添加
                </el-button>
                <el-button @click="imageDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup name="phenoPhotos">
import { ref, getCurrentInstance } from 'vue';

// vue实例
const { proxy: { $modal } } = getCurrentInstance();

// 加载
const loading = ref(false);
const loadingText = ref('加载中...');



// 图片
const imageSrcList = ref([]);

const imageList = ['https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'];

function deleteImage(index) {
    imageSrcList.value.splice(index, 1);
}

function addImage(imageUrl) {
    imageDialog.value = true
    // imageSrcList.value.push(imageList[Math.floor(Math.random() * imageList.length)]);
}

// 添加图片对话框
const imageDialog = ref(false)

const fileList = ref([])

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

// 提交添加图片
const submitImage = () => {
    console.log('图片提交成功');
    imageDialog.value = false;
    $modal.close();
}

const handlePreview = (file) => {
  console.log(file)
}

// 对话框
const dialogFormVisible = ref(false);
const dialogStatus = ref('create');
const textMap = {
    create: '添加节点',
    update: '修改节点',
};
const rules = reactive({
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
});

const nodeTitle = ref('');

function createData() {
    console.log('create');
}

function updateData() {
    console.log('update');
}

// 树控件
const routesData = ref([{
    label: 'Level one 1',
    treeId: '1',
    children: [
        {
            label: 'Level two 1-1',
            treeId: '11',
            children: [
                {
                    label: 'Level three 1-1-1',
                    treeId: '111',
                },
            ],
        },
    ],
},
{
    label: 'Level one 2',
    treeId: '2',
    children: [
        {
            label: 'Level two 2-1',
            treeId: '21',
            children: [
                {
                    label: 'Level three 2-1-1',
                    treeId: '211',
                },
            ],
        },
        {
            label: 'Level two 2-2',
            treeId: '21',
            children: [
                {
                    label: 'Level three 2-2-1',
                    treeId: '221`',
                },
            ],
        },
    ],
},
{
    label: 'Level one 3',
    treeId: '3',
    children: [
        {
            label: 'Level two 3-1',
            treeId: '31',
            children: [
                {
                    label: 'Level three 3-1-1',
                    treeId: '311',
                },
            ],
        },
        {
            label: 'Level two 3-2',
            treeId: '32',
            children: [
                {
                    label: 'Level three 3-2-1',
                    treeId: '321',
                },
            ],
        },
    ],
}]);
const defaultProps = ref({
    children: 'children',
    label: 'label'
});
const tree = ref(null);
function addChildNode() {
    dialogFormVisible.value = true;
}

function deleteNode() {
    console.log('delete', tree.value.getCurrentNode());
}

function getImageList() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(imageList);
        }, 1000);
    });
}

async function rowClick(nodeObj, node, event) {
    console.log('nodeObj', nodeObj);
    console.log('node', node);
    console.log('event', event);
    loading.value = true;
    imageSrcList.value = await getImageList();
    loading.value = false;
}

</script>

<style scoped>
:deep(.el-tree-node__label) {
    font-size: 18px;
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
    background-color: #79b5f1 !important;
}

.card {
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
}

.u-main .el-tag+.el-tag {
    margin-left: 10px;
}

.u-main .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.u-main .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.u-main .el-form-item {
    margin: 60px 0;
}

.u-main .el-form-item__label {
    font-size: 20px;
}
</style>
<style lang="scss" scoped>
.image_box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    max-height: calc(100vh - 180px);
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

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #f5f5f5;
}

.bg-purple-light {
    background: rgb(32, 177, 159);
}

.grid-content {
    border-radius: 0px;
    height: 50px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}

.upload {
    width: 100%;
    // border:1px solid #ccc;
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

.u-title {
    width: 98%;
    margin: 0 auto;
    height: 50px;
}

.u-title ul {
    display: flex;
}

.u-title ul li {
    flex: 1;
    text-align: center;
}

.app-container {
    .roles-table {
        margin-top: 30px;
    }

    .permission-tree {
        margin-bottom: 30px;
    }
}
</style>
<style  scoped>
.shadow {
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14);
    /* 0 3px 3px -2px rgba(0, 0, 0, 0.12),
         0 1px 8px 0 rgba(0, 0, 0, 0.2); */
}
</style>
