<template>
    <div style="width:100%;min-height: calc(100vh - 84px);background-color:#EEEEEE">
        <el-container style="padding:20px;border: 1px solid #eee" v-loading="loading"
            :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-aside width="20%" class="mokuai card shadow" style="min-height: calc(100vh - 180px)">
                <div>选择节点</div>
                <el-tree ref="tree" :data="routesData" :props="defaultProps" node-key="treeId" default-expand-all
                    highlight-current :current-node-key="1" @node-click="rowClick" class="permission-tree" />
            </el-aside>
            <!-- //右边的盒子 -->
            <el-main width="78%" style="padding:0" class="right-box">
                <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                    label-width="68px">
                    <el-form-item label="文件ID" prop="fileId">
                        <el-input v-model="queryParams.fileId" placeholder="请输入文件ID" clearable
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="文件名称" prop="fileName">
                        <el-input v-model="queryParams.fileName" placeholder="请输入文件名称" clearable
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="文件描述" prop="description">
                        <el-input v-model="queryParams.description" placeholder="请输入文件描述" clearable
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="日期" prop="datetime">
                        <el-date-picker v-model="queryParams.datetime" type="date" placeholder="选择一个日期" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="Search" size="small" @click="handleQuery">搜索</el-button>
                        <el-button icon="Refresh" size="small" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
                <!-- 操作部分 -->
                <el-row class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="Plus" size="small" @click="handleAdd"
                            v-hasPermi="['system:logininfor:add']">新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="danger" plain icon="Delete" size="small" :disabled="multiple"
                            @click="handleDelete" v-hasPermi="['system:logininfor:remove']">删除</el-button>
                    </el-col>
                    <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
                </el-row>
                <!-- 表格部分 -->
                <el-table v-loading="tableLoading" :data="fileList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="文件ID" align="center" prop="fileId" />
                    <el-table-column label="文件名" align="center" prop="fileName" />
                    <el-table-column label="描述" align="center" prop="description" />
                    <el-table-column label="是否公开" align="center" prop="fileStatus">
                        <template #default="scope">
                            <el-switch v-model="fileList[scope.$index].fileStatus"
                                @change="updateFileStatus(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="文件时间" align="center" prop="datetime" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <el-button size="small" type="text" icon="Download" @click="handleDownload(scope.row)"
                                v-hasPermi="['system:logininfor:download']">下载</el-button>
                            <el-button size="small" type="text" icon="Document" @click="openDrawer(scope.row)">详情
                            </el-button>
                            <el-button size="small" type="text" icon="Edit" @click="handleUpdate(scope.row)"
                                v-hasPermi="['system:logininfor:edit']">修改</el-button>
                            <el-button size="small" type="text" icon="Delete" @click="deleteFile(scope.row)"
                                v-hasPermi="['system:logininfor:remove']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination v-show="total > 0" :total="total" v-model:currentPage="queryParams.pageNum"
                    v-model:page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="getList" @current-change="getList" :background="false" />
            </el-main>
        </el-container>
        <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" center draggable width="50%">
            <el-form ref="form" :rules="rules" :model="dataForm" label-position="left" label-width="100px">
                <el-form-item label="文件名称：" prop="fileName">
                    <el-input v-model="dataForm.fileName" placeholder="输入文件名称" />
                </el-form-item>
                <el-form-item label="文件描述" prop="description">
                    <el-input v-model="dataForm.description" placeholder="输入文件描述" />
                </el-form-item>
                <el-form-item label="日期" prop="datetime">
                    <el-date-picker v-model="dataForm.datetime" type="date" placeholder="选择一个日期"/>
                </el-form-item>
                <el-form-item label="是否公开" prop="fileStatus">
                    <el-switch v-model="dataForm.fileStatus" />
                </el-form-item>
                <el-form-item label="上传文件" prop="file" v-show="dialogStatus === 'create'">
                    <el-upload v-model:file-list="fileList" class="upload-demo" ref="upload" :limit="1"
                        accept=".csv,.doc,.docx" :action="uploadUrl" :auto-upload="false"
                        :headers="{ 'Authorization': 'Bearer ' + getToken() }" :on-error="uploadFileError"
                        :on-success="uploadFileSuccess" :on-exceed="handleExceed">
                        <el-button type="primary">Click to upload</el-button>
                        <template #tip>
                            <div class="el-upload__tip">
                                select a file to upload
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
                        保存
                    </el-button>
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-drawer v-model="drawer" :title="fileName">
            <div>{{ fileContent }}</div>
        </el-drawer>
    </div>
</template>

<script setup name="phenoType">
import { ref, getCurrentInstance, nextTick, onMounted } from 'vue';
import { getTree } from '@/api/tree.js';
import { listFile, updateFile, delFile, getFileContent } from '@/api/infomanage/phenoType';
import useUserStore from '@/store/modules/user';
import { getToken } from '@/utils/auth';
import { genFileId } from 'element-plus';

// vue实例
const { proxy: { $modal, $download } } = getCurrentInstance();
// 登录用户权限
const { roles } = useUserStore();

// 加载
const loading = ref(false);
const loadingText = ref('加载中...');
const tableLoading = ref(false);

// 对话框
const dialogFormVisible = ref(false);
const dialogStatus = ref('create');
const textMap = {
    create: '添加文件',
    update: '修改文件',
};

// 表单实例
const form = ref(null);

// 表单参数
const dataForm = reactive({
    fileId: null,
    fileName: '',
    description: '',
    fileStatus: true,
    datetime: null
});

// 校验规则
const rules = reactive({
    fileName: [
        { required: true, message: '请输入文件名', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入文件描述', trigger: 'blur' }
    ],
    datetime: [
        {required: true,message: '请选择一个日期', trigger: 'blur'}
    ]
});

const drawer = ref(false); // 文件详情窗口开启状态
const fileName = ref(''); // 选中文件名
const fileContent = ref('');

// 开启文件详情窗口
async function openDrawer(row) {
    fileName.value = row.fileName;
    fileContent.value = await getFileContent(row.fileId);
    drawer.value = true;
}
// 上传实例
const upload = ref(null);
// 文件上传
const uploadUrl = ref('11');

// 文件创建
function createData() {
    form.value.validate(valid => {
        if (valid) {
            uploadUrl.value =
                `${import.meta.env.VITE_APP_UPLOAD_URL}/system/file/upload?fileName=${dataForm.fileName}&description=${dataForm.description}&fileStatus=${dataForm.fileStatus ? 1 : 0}&treeId=${tree.value.getCurrentNode().treeId}`;
            nextTick(async () => {
                tableLoading.value = false;
                await upload.value.submit();
            });
        }
    });
}
// 文件上传成功回调
function uploadFileSuccess() {
    $modal.msgSuccess('上传成功');
    dialogFormVisible.value = false;
    upload.value.clearFiles();
    getList();
}

// 文件上传失败回调
function uploadFileError() {
    $modal.msgError('上传失败');
}
// 文件替换
function handleExceed(files) {
    upload.value?.clearFiles();
    const file = files[0];
    file.uid = genFileId();
    upload.value?.handleStart(file);
}

// 文件修改
async function updateData() {
    form.value.validate(valid => {
        if (valid) {
            tableLoading.value = true;
            updateFile(dataForm).then(res => {
                tableLoading.value = false;
                dialogFormVisible.value = false;
                getList();
            }).catch(err => {
                loading.value = false;
                $modal.msgError('添加失败');
            });
        }
    });
}

// 文件表格
const fileList = ref([
    {
        fileId: '111',
        fileName: 'clx',
        datetime: new Date(),
        description: '2232',
        fileStatus: true
    }, {
        fileId: '222',
        fileName: 'aa.txt',
        datetime: new Date(),
        description: 'rwer',
        fileStatus: false
    }
]);  // 文件列表
const ids = ref([]); // 选中数组
const multiple = ref(false); // 是否多选

// 打开添加文件对话框
function handleAdd() {
    dialogStatus.value = 'create';
    dialogFormVisible.value = true;
}
// 删除文件
function handleDelete() {
    delFile(ids.value).then(res => {
        getList();
    }).catch(err => {
        $modal.msgError('删除失败');
    });
}
// 请求文件列表
function getList() {
    tableLoading.value = true;
    listFile({
        ...queryParams,
        treeId: tree.value.getCurrentNode().treeId,
        fileStatus: roles[0] === 'admin' ? 1 : 0
    }).then(res => {
        tableLoading.value = false;
        // if (roles[0] === 'admin') {
        fileList.value = res.rows.map(item => ({
            ...item,
            fileStatus: item.fileStatus === 1
        }));
        // } else {
        //     fileList.value = res.rows.filter(item => {
        //         if(item.fileStatus) {
        //             return true
        //         } else {
        //             return false
        //         }
        //     })
        // }
        // total.value = fileList.value.length;
        total.value = res.total;
    }).catch(err => {
        tableLoading.value = false;
        $modal.msgError('获取列表失败');
    });
}

// 选择文件项
function handleSelectionChange(selection) {
    if (selection.length !== 1) {
        multiple.value = true;
    } else {
        multiple.value = false;
    }
    selection.forEach(item => {
        ids.value.push(item.treeId);
    });
}

// 更新是否公开选项
async function updateFileStatus(row) {
    console.log('row', row);
    updateFile({
        fileId: row.fileId,
        fileStatus: row.fileStatus,
        fileName: row.fileName,
        description: row.description
    }).then(res => {
        $modal.msgSuccess('更新成功');
    }).catch(err => {
        $modal.msgError('更新失败');
    });
}

// 下载文件
function handleDownload(row) {
    $download.name(row.name);
}

// 修改文件
function handleUpdate(row) {
    dataForm.fileId = row.fileId;
    dataForm.fileName = row.fileName;
    dataForm.description = row.description;
    dataForm.fileStatus = row.fileStatus;
    dialogFormVisible.value = true;
    dialogStatus.value = 'update';
}

// 删除文件
function deleteFile(row) {
    delFile([row.fileId]).then(res => {
        getList();
    }, err => {
        $modal.msgError('删除失败');
    });
}

// 表单提交
const total = ref(2);
const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    treeId: '',
    fileId: '',
    fileName: '',
    description: '',
    fileStatus: '',
    datetime: ''
});
const showSearch = ref(true);
const queryForm = ref(null); // 查询表单dom元素
const handleQuery = async () => {  // 查询回调
    queryParams.treeId = tree.value.getCurrentNode().treeId;
    getList();
};

const resetQuery = () => {
    queryParams.pageNum = 1;
    queryParams.pageSize = 10;
    queryParams.treeId = 0;
    queryParams.fileId = '';
    queryParams.fileName = '';
    queryParams.description = '';
    queryParams.fileStatus = true;
};

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

const treeType = ref(2);  // 树的种类
const tree = ref(null);  // 数的dom实例


const getTreeList = () => {
    getTree(treeType.value, 0, 1).then(res => {
        routesData.value = res.data.children;
        nextTick(() => {
            tree.value.setCurrentNode(routesData.value[0]);
            queryParams.treeId = (tree.value.getCurrentNode())?.treeId;
            getList();
        });
    });
};

onMounted(() => {
    getTreeList();
});

function rowClick(nodeObj) {
    queryParams.treeId = nodeObj.treeId;
    getList();
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
