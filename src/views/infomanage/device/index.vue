<template>
    <div style="width:100%;min-height: calc(100vh - 84px);background-color:#EEEEEE">
        <el-container
            style="padding:20px;border: 1px solid #eee"
            v-loading="loading"
            :element-loading-text="loadingText"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <el-aside width="20%" class="mokuai card shadow">
                <el-tree
                    ref="tree"
                    :data="routesData"
                    :props="defaultProps"
                    node-key="treeId"
                    default-expand-all
                    highlight-current
                    :current-node-key="1"
                    @node-click="rowClick"
                    class="permission-tree"
                />
            </el-aside>
            <!-- //右边的盒子 -->
            <el-main width="78%" style="padding:0" class="right-box">
                <!-- 操作部分 -->
                <div style="width:100%;">
                    <el-button
                        type="primary"
                        class="filter-item"
                        style="margin: 10px;"
                        @click.prevent="addChildNode"
                    >添加子节点</el-button>
                    <el-button
                        :disabled="this.current.nodeName==='大数据中心'"
                        type="primary"
                        class="filter-item"
                         
                        style="margin: 10px;"
                        @click.prevent="deleteNode"
                    >删除节点</el-button>
                </div>
                <!-- 上传部分 -->
                <div v-if="current.treeId==1" style="height:500px;">此节点下不能添加相关文件</div>
                <div class="shadow" v-else>
                    <el-tabs type="border-card" class="shadow">
                        <!-- 数据 -->
                        <el-tab-pane label="数据">
                            <!-- 主体 -->
                            <span slot="label">
                                <i class="el-icon-tickets"></i> 数据
                            </span>
                            <div class="u-main">
                                <el-form
                                    ref="dataForm"
                                    :model="temp1"
                                    label-width="150px"
                                    label-position="left"
                                    style="width:90%;margin:30px auto"
                                >
                                    <el-form-item label="数据说明：" style="width:600px">
                                        <el-input
                                            v-model="temp1.setDescription"
                                            type="textarea"
                                            :rows="6"
                                            placeholder="请输入数据说明"
                                        />
                                    </el-form-item>
                                    <el-form-item label="数据导入：">
                                        <el-upload
                                            ref="upload"
                                            class="upload-demo"
                                            action
                                            :before-upload="beforeUpload1"
                                            accept=".csv, .xlsx, .xls, .zip"
                                            :auto-upload="false"
                                            :on-preview="handlePreview"
                                            :on-remove="handleRemove1"
                                            :on-change="handleAvatarChange1"
                                            :file-list="temp1.fileUrls"
                                            list-type="picture"
                                        >
                                            <el-button size="small" type="primary">点击上传</el-button>
                                            <!-- <img
                                                v-if="this.imageUrl"
                                                :src="this.imageUrl"
                                                class="avatar"
                                            />-->
                                            <div
                                                slot="tip"
                                                class="el-upload__tip"
                                            >上传文件只能是 csv、xls、xlsx格式或者是这三个格式的.zip压缩包 !</div>
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item label="数据标签：">
                                        <el-tag
                                            :key="o"
                                            v-for="(tag,o) in temp1.tags"
                                            closable
                                            :disable-transitions="false"
                                            @close="handleClose1(tag)"
                                        >{{tag}}</el-tag>
                                        <el-input
                                            class="input-new-tag"
                                            v-if="inputVisible1"
                                            v-model="inputValue1"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="handleInputConfirm1"
                                            @blur="handleInputConfirm1"
                                        ></el-input>
                                        <el-button
                                            v-else
                                            class="button-new-tag"
                                            size="small"
                                            @click="showInput1"
                                        >+ 新标签</el-button>
                                    </el-form-item>
                                    <el-button
                                        :disabled="btn1"
                                        type="primary"
                                        class="filter-item"
                                         
                                        style
                                        @click="update1"
                                    >{{databtn}}</el-button>
                                </el-form>
                            </div>
                        </el-tab-pane>
                        <!-- 图片 -->
                        <el-tab-pane label="图片" class="el-tab-pane-img">
                            <!-- 主体 -->
                            <span slot="label">
                                <i class="el-icon-picture-outline"></i> 图片
                            </span>

                            <div class="u-main">
                                <el-form
                                    ref="dataForm"
                                    :model="temp2"
                                    label-width="150px"
                                    label-position="left"
                                    style="width:90%;margin:30px auto"
                                >
                                    <el-form-item label="图片说明：" style="width:600px">
                                        <el-input
                                            v-model="temp2.setDescription"
                                            type="textarea"
                                            :rows="6"
                                            placeholder="请输入图片说明"
                                        />
                                    </el-form-item>
                                    <el-form-item label="图片导入：">
                                        <el-upload
                                            ref="upload"
                                            class="upload-demo"
                                            action="1"
                                            accept=".jpeg, .jpg, .png, .bmp, .gif, .zip"
                                            :auto-upload="false"
                                            :on-preview="handlePreview"
                                            :on-remove="handleRemove2"
                                            :on-change="handleAvatarChange2"
                                            :file-list="temp2.fileUrls"
                                            list-type="picture"
                                        >
                                            <el-button size="small" type="primary">点击上传</el-button>
                                            <!-- <img
                                                v-if="this.imageUrl"
                                                :src="this.imageUrl"
                                                class="avatar"
                                            />-->
                                            <div
                                                slot="tip"
                                                class="el-upload__tip"
                                            >只能上传以.jpg、.png、.jpeg、.bmp、.gif为后缀的图片, 或者是.zip后缀的图片压缩包</div>
                                        </el-upload>
                                        <!-- <el-upload
                                            ref="upload"
                                            class="upload-demo"
                                            :auto-upload="false"
                                            action="1"
                                            :limit="3"
                                            :file-list="temp.fileUrls"
                                            style
                                            :on-change="handleAvatarChange"
                                        >
                                            <el-popover
                                                placement="top-start"
                                                title="提示"
                                                width="360"
                                                trigger="hover"
                                            >
                                                <el-button
                                                    slot="reference"
                                                    type="primary"
                                                    size="small"
                                                    style
                                                >导入</el-button>
                                            </el-popover>
                                        </el-upload>-->
                                    </el-form-item>
                                    <el-form-item label="图片标签：">
                                        <el-tag
                                            :key="o"
                                            v-for="(tag,o) in temp2.tags"
                                            closable
                                            :disable-transitions="false"
                                            @close="handleClose2(tag)"
                                        >{{tag}}</el-tag>
                                        <el-input
                                            class="input-new-tag"
                                            v-if="inputVisible2"
                                            v-model="inputValue2"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="handleInputConfirm2"
                                            @blur="handleInputConfirm2"
                                        ></el-input>
                                        <el-button
                                            v-else
                                            class="button-new-tag"
                                            size="small"
                                            @click="showInput2"
                                        >+ 新标签</el-button>
                                    </el-form-item>
                                    <el-button
                                        :disabled="btn2"
                                        type="primary"
                                        class="filter-item"
                                         
                                        style
                                        @click="update2"
                                    >{{imgbtn}}</el-button>
                                </el-form>
                            </div>
                        </el-tab-pane>
                        <!-- //文档管理 -->
                        <el-tab-pane label="文档管理" class="el-tab-pane-doc">
                            <!-- 主体 -->
                            <span slot="label">
                                <i class="el-icon-folder"></i> 文档管理
                            </span>
                            <div class="u-main" ref="doc">
                                <el-form
                                    ref="dataForm"
                                    :model="temp3"
                                    label-width="150px"
                                    label-position="left"
                                    style="width:90%;margin:30px auto"
                                >
                                    <el-form-item label="文档说明：" style="width:600px">
                                        <el-input
                                            v-model="temp3.setDescription"
                                            type="textarea"
                                            :rows="6"
                                            placeholder="请输入文档说明"
                                        />
                                    </el-form-item>
                                    <el-form-item label="文档导入：">
                                        <el-upload
                                            ref="upload"
                                            class="upload-demo"
                                            action
                                            accept
                                            :auto-upload="false"
                                            :multiple="true"
                                            :on-preview="handlePreview"
                                            :on-remove="handleRemove3"
                                            :on-change="handleAvatarChange3"
                                            :file-list="temp3.fileUrls"
                                            list-type="picture"
                                        >
                                            <el-button size="small" type="primary">点击上传</el-button>
                                            <!-- <img
                                                v-if="this.imageUrl"
                                                :src="this.imageUrl"
                                                class="avatar"
                                            />-->
                                            <div slot="tip" class="el-upload__tip">请选择要上传的文件</div>
                                        </el-upload>
                                        <!-- <el-upload
                                            ref="upload"
                                            class="upload-demo"
                                            :auto-upload="false"
                                            action="1"
                                            :limit="3"
                                            :file-list="temp.fileUrls"
                                            style
                                            :on-change="handleAvatarChange"
                                        >
                                            <el-popover
                                                placement="top-start"
                                                title="提示"
                                                width="360"
                                                trigger="hover"
                                            >
                                                <p>* 上传模板只能是 xls、xlsx格式 !</p>
                    <p>* 上传模板大小不能超过 5MB !</p>
                    <p>* 导入文件的文档格式为: </p>
                                                <p style="padding-left:20px"> 学校名称 | 学校地址 | 法人代表 | 联系人 | 联系电话</p>
                                                <el-button
                                                    slot="reference"
                                                    type="primary"
                                                    size="small"
                                                    style
                                                >导入</el-button>
                                            </el-popover>
                                        </el-upload>-->
                                    </el-form-item>
                                    <el-form-item label="文档标签：">
                                        <el-tag
                                            :key="o"
                                            v-for="(tag,o) in temp3.tags"
                                            closable
                                            :disable-transitions="false"
                                            @close="handleClose3(tag)"
                                        >{{tag}}</el-tag>
                                        <el-input
                                            class="input-new-tag"
                                            v-if="inputVisible3"
                                            v-model="inputValue3"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="handleInputConfirm3"
                                            @blur="handleInputConfirm3"
                                        ></el-input>
                                        <el-button
                                            v-else
                                            class="button-new-tag"
                                            size="small"
                                            @click="showInput3"
                                        >+ 新标签</el-button>
                                    </el-form-item>
                                    <el-button
                                        :disabled="btn3"
                                        type="primary"
                                        class="filter-item"
                                         
                                        style
                                        @click="update3"
                                    >{{docbtn}}</el-button>
                                </el-form>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-main>
        </el-container>
        <el-dialog
            :title="textMap[dialogStatus]"
            v-model="dialogFormVisible"
            center
            draggable
            width="400px"
        >
            <el-form
                ref="dataForm"
                :rules="rules"
                label-position="left"
                label-width="100px"
                style="width:300px;"
                size="small"
            >
                <el-form-item label="节点名称：" prop="name">
                    <el-input v-model="nodeTitle" placeholder="输入节点名称" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="dialogStatus==='create'?createData():updateData()"
                >保存</el-button>
                <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { deepClone } from "@/utils/index";
import {
    getPage,
    addNode,
    deleteNode,
    addFile,
    documentDownload,
    updateFile,
    getByTreeId,
} from "@/api/bigData";

export default {
    name: "bigDataCenter",
    data() {
        return {
            loadingText: "拼命上传中···",
            mainheight: window.innerHeight - 150,
            loading: false,
            //各标签、文件的id
            dataTagIds: [],
            imageTagIds: [],
            documentTagIds: [],
            dataFileIds: [],
            imageFileIds: [],
            documentFileIds: [],

            //点击节点请求的数据res.data
            resData: {},
            resImage: {},
            resDocument: {},
            //控制添加修改按钮，防止重复点击
            btn1: false,
            btn2: false,
            btn3: false,
            //button的名字
            databtn: "添加",
            imgbtn: "添加",
            docbtn: "添加",
            //
            query: {
                nodeName: "",
                parentId: "",
                // treeId: "",
            },
            //数据，图片，文档管理的数据
            data: {
                fileType: "data",
                setDescription: [],
                multipartFiles: [],
                tags: [],
                treeId: "",
            },
            temp: {
                name: "",
                setDescription: "",
                fileUrls: [],
                tags: [],
            },
            temp1: {
                name: "",
                setDescription: "",
                fileUrls: [],
                tags: [],
            },
            temp2: {
                name: "",
                setDescription: "这是一条图片说明@_@",
                fileUrls: [
                    // {
                    //     url:
                    //         "http://81.71.138.29:8080/file/KNOWLEDGE/knowledge/img-e7a007637ae8d860c80453f5dcb1ee62 (2) - 副本-20201201211244772.jpg",
                    // },
                    // {
                    //     url:
                    //         "http://81.71.138.29:8080/file/KNOWLEDGE/knowledge/QQ%E6%88%AA%E5%9B%BE20200425204650-20201207205957532.png",
                    // },
                    // {
                    //     url:
                    //         "http://81.71.138.29:8080/file/KNOWLEDGE/knowledge/QQ%E5%9B%BE%E7%89%8720200425121507-20201207210124554.jpg",
                    // },
                ],
                tags: [],
            },
            temp3: {
                name: "",
                setDescription: "这是一条文档说明@_@",
                fileUrls: [],
                tags: [],
            },

            //dialog
            rules: {
                nodeTitle: [
                    {
                        required: true,
                        message: "节点名称不能为空",
                        trigger: "blur",
                    },
                ],
            },
            dialogFormVisible: false,
            dialogStatus: "create",
            textMap: {
                update: "编辑节点",
                create: "新增子节点",
            },

            //
            menuVisible: true,
            tags: ["标签一", "标签二", "标签三"], //标签
            inputVisible1: false,
            inputVisible2: false,
            inputVisible3: false,
            inputValue1: "",
            inputValue2: "",
            inputValue3: "",

            propOptions: [],
            tableData: [
                {
                    cropProperty: "",
                    detectionTime: "",
                    growthPeriod: "",
                    process: "",
                    extraParam: {},
                    data: [],
                    average: "",
                },
            ],

            current: {
                nodeName: "",
                children: [],
            },
            currentNode: "",

            nodeTitle: "",

            sels: [],
            handleType: "",
            isHandle: {
                0: false,
                1: false,
                2: false,
            },
            inputShow: {
                0: false,
                1: false,
                2: false,
            },
            isEditShow: true,
            // role: Object.assign({}, defaultRole),
            routes: [],

            dialogType: "new",
            checkStrictly: false,
            defaultProps: {
                children: "nodes",
                label: "nodeName",
            },
        };
    },
    computed: {
        //下载文件按钮的显示
        downloadShow() {
            return (
                this.temp3.fileUrls.length > 0 &&
                this.temp3.fileUrls.some((item) => {
                    return !item.hasOwnProperty("raw");
                })
            );
        },
        currentName() {
            return this.current.nodeName == "";
        },
        routesData() {
            return this.routes;
        },
        isdisabled() {
            return this.sels.length == 0;
        },
    },
    created() {
        this.getList();
    },

        methods: {
        // 页面切换方法
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        //分页每页条数
        handleSizeChange(val) {
            this.pagesize = val;
        },
        //doc下每个文件生成下载按钮
        creatDowloadBtn() {
            let innerHTML = `<img src="" alt="" class="el-upload-list__item-thumbnail"><a class="el-upload-list__item-name"><i class="el-icon-document"></i>10-23_HN8-1956348563_01↵      </a><label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label><i class="el-icon-close"></i><i class="el-icon-close-tip">按 delete 键可删除</i><!----><!---->`;
            let doc = document.querySelector(".el-tab-pane-doc");
            let ul = doc.querySelector(".el-upload-list--picture");
            // console.log(ul);
            //添加文本内容
            let lis = ul.querySelectorAll("li");
            let img = ul.querySelectorAll("img");
            // console.log(img);
            lis.forEach((li) => {
                // console.log(li);
                let labelD = document.createElement("el-button");

                labelD.url = li.querySelector("img").src;
                // console.log("url", labelD.url);
                labelD.title = "下载";
                labelD.onmousemove = (event) => {
                    // console.log(event);
                    event.target.style.cursor = "pointer";
                };
                labelD.onclick = (event) => {
                    // console.log(event);
                    this.download(labelD.url);
                };
                //在IE中报错。strict模式下不允许分配只读属性。
                //             labelD.style=` position: absolute;
                //             color:#fff;
                //             border-radius:5px ;
                // right: -0px;
                // top: 65px;
                // width: 29px;
                // height: 26px;
                // background: rgb(19, 206, 102);
                // text-align: center;
                // transform: rotate(0deg);
                // box-shadow: rgb(204, 204, 204) 0px 1px 1px;`
                labelD.style.position = "absolute";
                labelD.style.color = "#fff";
                labelD.style.borderRadius = "5px";
                labelD.style.right = "-0px";
                labelD.style.top = "65px";
                labelD.style.height = "26px";
                labelD.style.width = "29px";
                labelD.style.background = "rgb(19, 206, 102)";
                labelD.style.textAlign = "center";
                labelD.style.transform = "rotate(0deg)";
                labelD.style.boxShadow = "rgb(204, 204, 204) 0px 1px 1px";
                labelD.innerHTML = `<i class="el-icon-download"></i>`;
                li.appendChild(labelD);
            });
        },

        //文档管理的下载文件
        download(urlB) {
            // console.log('this.temp3.fileUrls',this.temp3.fileUrls);
            let flag = this.temp3.fileUrls.some((item) => {
                if (item.hasOwnProperty("raw")) {
                    this.$message({
                        title: "",
                        message: "请先上传文件！",
                        type: "warning",
                        duration: 2000,
                    });
                    return false;
                } else {
                    return true;
                }
            });
            if (flag) {
                this.loading = true;
                this.loadingText = "正在请求下载中，请耐心等候···";
                // console.log('this.temp3.fileUrls',this.temp3.fileUrls);
                this.temp3.fileUrls.forEach((item) => {
                    let name = item.name;
                    let url = item.url;
                    let type = url.substring(url.lastIndexOf(".") + 1);
                    let urlp = url.replace(/\\/g, "/");
                    // console.log('url',url);
                    let url1 = decodeURI(urlB); //el-upload会将url中的中文编码
                    url1 = url1.replace(/\\/g, "/");

                    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                    url = decodeURI(url.replace(/\\/g, "//"));

                    if (userAgent.indexOf("Trident") > -1) {
                        url = url.replace(/\\/g, "\\");
                        url=encodeURI(url)
                    }
                    console.log("url", url);
                    // console.log('url1',url1);
                    if (urlp === url1) {
                        console.log("download···");
                        documentDownload(url)
                            .then((res) => {
                                const blob = new Blob([res], {
                                    type: "application/octet-stream",
                                });
                                if (
                                    window.navigator.userAgent.indexOf(
                                        "Trident"
                                    ) > -1 &&
                                    window.navigator.msSaveBlob
                                ) {
                                    console.log("IE download");
                                    window.navigator.msSaveBlob(blob, name+'.'+type);
                                    this.loading = false;
                                } else {
                                    console.log(res);
                                    this.loading = false;
                                    setTimeout(() => {
                                        this.loadingText = "拼命上传中···";
                                    }, 1000);

                                    const a = document.createElement("a");
                                    const href = window.URL.createObjectURL(
                                        blob
                                    );
                                    a.href = href;
                                    a.download = name + "." + type;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    window.URL.revokeObjectURL(href);
                                }
                            })
                            .catch((err) => {
                                this.loading = false;
                                console.log(err)
                            });
                    } else {
                        this.loadingText = "拼命上传中···";
                    }
                });
            } else {
                console.log("error");
            }

            // let a=document.createElement('a');
            // a.download="a.jpg"
            // a.href='http://81.71.138.29:8080/file/DATACENTER/DataCenter/002D1_0-20210226183753825.jpg'
            // a.click()
            // window.location.href='http://81.71.138.29:8080/file/DATACENTER/DataCenter/table-list (23)-20210220204543354.xlsx'
        },
        getList() {
            getPage().then((res) => {
                console.log(res);
                this.routes = [];
                this.routes.push(res.data);
                console.log(this.routes);
            });
        },
        resetTemp() {
            this.temp1 = {
                name: "",
                setDescription: "",
                fileUrls: [],
                tags: [],
            };
            this.temp2 = {
                name: "",
                setDescription: "",
                fileUrls: [],
                tags: [],
            };
            this.temp3 = {
                name: "",
                setDescription: "",
                fileUrls: [],
                tags: [],
            };
            // console.log(this.temp1);
            // console.log(this.temp2);
            // console.log(this.temp3);
        },
        //点击
        //根据当前节点查询data
        getDataById() {
            getByTreeId({ fileType: "data", treeId: this.data.treeId }).then(
                (res) => {
                    console.log("data", res.data);
                    // console.log(res);
                    if (res.data.dataModel == null) {
                        this.databtn = "添加";
                    } else {
                        this.databtn = "修改";
                        let temp = deepClone(res.data.dataModel);
                        this.resData = res.data.dataModel;
                        if (temp.tags) {
                            temp.tags = temp.tags.map((item) => {
                                return item.labelName;
                            });
                        }
                        if (temp.fileUrls) {
                            temp.fileUrls = temp.fileUrls.map((item) => {
                                return {
                                    name: item.fileName,
                                    url: item.url,
                                };
                            });
                        }
                        this.temp1 = temp;
                    }
                }
            );
        },
        //根据当前节点查询image
        getImageById() {
            getByTreeId({ fileType: "image", treeId: this.data.treeId }).then(
                (res) => {
                    console.log("image", res.data);
                    if (res.data.dataModel == null) {
                        this.imgbtn = "添加";
                        // this.temp2 = this.temp; //reset
                    } else {
                        this.imgbtn = "修改";
                        let temp = deepClone(res.data.dataModel);
                        this.resImage = res.data.dataModel;
                        if (temp.tags) {
                            temp.tags = temp.tags.map((item) => {
                                return item.labelName;
                            });
                        }
                        if (temp.fileUrls) {
                            temp.fileUrls = temp.fileUrls.map((item) => {
                                return {
                                    name: item.fileName,
                                    url: item.url.replace(/\\/g,'\\\\'),
                                };
                            });
                        }
                        this.temp2 = temp;
                    }
                }
            );
        },
        //根据当前节点查询document
        getDocumentById() {
            getByTreeId({
                fileType: "document",
                treeId: this.data.treeId,
            }).then((res) => {
                console.log("document", res.data);
                if (res.data.dataModel == null) {
                    this.docbtn = "添加";
                    // this.temp3 = this.temp;
                } else {
                    this.docbtn = "修改";
                    let temp = deepClone(res.data.dataModel);
                    this.resDocument = res.data.dataModel;
                    if (temp.tags) {
                        temp.tags = temp.tags.map((item) => {
                            return item.labelName;
                        });
                    }
                    if (temp.fileUrls) {
                        temp.fileUrls = temp.fileUrls.map((item) => {
                            return {
                                name: item.fileName,
                                url: item.url,
                            };
                        });
                    }
                    this.temp3 = temp;
                }
            });
        },

        rowClick(obj, node, el) {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            if (false) {
                //userAgent.indexOf("Trident") > -1//IE内核
                alert("请先将浏览器从兼容模式切换到极速模式再进行操作！");
            } else {
                this.resetTemp();
                // console.log(obj, node, el);
                this.data.treeId = obj.treeId;
                this.current = obj;
                this.currentNode = node;
                console.log("当前节点：", this.current);
                this.getDataById();
                this.getImageById();
                this.getDocumentById();
                setTimeout(() => {
                    this.creatDowloadBtn();
                }, 1000);
            }
        },
        //修改1
        update1() {
            if (this.current.nodeName == "") {
                this.$message({
                    message: "请先选择节点！",
                    type: "warning",
                });
            } else {
                //添加文件

                this.loading = true;
                if (this.databtn == "添加") {
                    let fd = new FormData();
                    fd.append("fileType", "data");
                    fd.append("treeId", this.current.treeId);
                    fd.append("setDescription", this.temp1.setDescription);
                    if (this.temp1.tags.length > 0) {
                        for (let i = 0; i < this.temp1.tags.length; i++) {
                            fd.append("tags[]", this.temp1.tags[i]);
                        }
                    } else {
                        fd.append("tags[]", "");
                    }
                    let haveFile = 0;
                    for (let i = 0; i < this.temp1.fileUrls.length; i++) {
                        if (this.temp1.fileUrls[i].raw) {
                            fd.append(
                                "multipartFiles[]",
                                this.temp1.fileUrls[i].raw
                            );
                            haveFile += 1;
                        } else {
                            fd.append(
                                "multipartFiles[]",
                                this.temp1.fileUrls[i]
                            );
                            haveFile += 1;
                        }
                    }
                    if (!haveFile) {
                        fd.append("multipartFiles[]", "");
                    }
                    addFile(fd)
                        .then((res) => {
                            this.loading = false;
                            this.btn1 = false;
                            this.databtn = "修改";
                            console.log(res);
                            this.$alert("", {
                                title: "",
                                message: "添加成功",
                                type: "success",
                                duration: 2000,
                            });

                            // this.getList()
                        })
                        .catch((err) => {
                            this.loading = false;
                            this.btn1 = false;
                            tthis.getDataById();
                            console.log(err);
                        });
                } else {
                    //修改文件
                    let fd = new FormData();
                    fd.append("setId", this.temp1.setId);
                    if (this.temp1.setDescription == null) {
                        this.temp1.setDescription = "";
                    }
                    fd.append("setDescription", this.temp1.setDescription);
                    //新增的file
                    console.log("this.temp1.fileUrls", this.temp1.fileUrls);

                    let haveFile = 0;
                    for (let i = 0; i < this.temp1.fileUrls.length; i++) {
                        if (this.temp1.fileUrls[i].raw) {
                            console.log(1);
                            fd.append("files[]", this.temp1.fileUrls[i].raw);
                            haveFile += 1;
                        } else {
                            // fd.append("files[]", this.temp1.fileUrls[i]);
                        }
                    }
                    if (!haveFile) {
                        fd.append("files[]", "");
                    }
                    //新增的tags
                    if (this.temp1.tags.length > 0) {
                        for (let i = 0; i < this.temp1.tags.length; i++) {
                            fd.append("tags[]", this.temp1.tags[i]);
                        }
                    } else {
                        fd.append("tags[]", "");
                    }

                    //要删除的tags的Id
                    this.resData.tags.forEach((item) => {
                        this.dataTagIds.push(item.labelId);
                    });
                    if (this.dataTagIds.length > 0) {
                        for (let i = 0; i < this.dataTagIds.length; i++) {
                            fd.append("tagIds[]", this.dataTagIds[i]);
                        }
                    } else {
                        fd.append("tagIds[]", "");
                    }

                    //要删除的文件
                    console.log("this.dataFileIds", this.dataFileIds);
                    if (this.dataFileIds.length > 0) {
                        for (let i = 0; i < this.dataFileIds.length; i++) {
                            fd.append("fileIds[]", this.dataFileIds[i]);
                        }
                    } else {
                        fd.append("fileIds[]", "");
                    }

                    updateFile(fd)
                        .then((res) => {
                            this.loading = false;
                            this.btn1 = false;
                            this.getDataById();
                            this.$alert("", {
                                title: "",
                                message: "修改成功",
                                type: "success",
                                duration: 2000,
                            });
                        })
                        .catch((err) => {
                            this.loading = false;
                            this.btn3 = false;
                            // this.getList();
                            console.log(err);
                        });
                }
            }
        },
        //修改2
        update2() {
            if (this.current.nodeName == "") {
                this.$message({
                    message: "请先选择节点！",
                    type: "warning",
                });
            } else {
                this.loading = true;
                if (this.imgbtn == "添加") {
                    let fd = new FormData();
                    console.log(this.temp2);
                    fd.append("fileType", "image");
                    fd.append("treeId", this.current.treeId);
                    fd.append("setDescription", this.temp2.setDescription);
                    if (this.temp2.tags.length > 0) {
                        for (let i = 0; i < this.temp2.tags.length; i++) {
                            fd.append("tags[]", this.temp2.tags[i]);
                        }
                    } else {
                        fd.append("tags[]", "");
                    }

                    let haveFile = 0;
                    for (let i = 0; i < this.temp2.fileUrls.length; i++) {
                        if (this.temp2.fileUrls[i].raw) {
                            fd.append(
                                "multipartFiles[]",
                                this.temp2.fileUrls[i].raw
                            );
                            haveFile += 1;
                        } else {
                            fd.append(
                                "multipartFiles[]",
                                this.temp2.fileUrls[i]
                            );
                            haveFile += 1;
                        }
                    }
                    if (!haveFile) {
                        fd.append("multipartFiles[]", "");
                    }
                    addFile(fd)
                        .then((res) => {
                            this.loading = false;
                            this.btn2 = false;
                            this.imgbtn = "修改";
                            console.log(res);
                            this.$alert("", {
                                title: "",
                                message: "添加成功",
                                type: "success",
                                duration: 2000,
                            });
                            this.getImageById();
                        })
                        .catch((err) => {
                            this.getImageById();
                            this.loading = false;
                            this.btn2 = false;
                            console.log(err);
                        });
                    //修改文件
                } else {
                    let fd = new FormData();
                    fd.append("setId", this.temp2.setId);
                    if (this.temp2.setDescription == null) {
                        this.temp2.setDescription = "";
                    }
                    fd.append("setDescription", this.temp2.setDescription);
                    //新增的file
                    console.log("this.temp2.fileUrls", this.temp2.fileUrls);

                    let haveFile = 0;
                    for (let i = 0; i < this.temp2.fileUrls.length; i++) {
                        if (this.temp2.fileUrls[i].raw) {
                            console.log(1);
                            fd.append("files[]", this.temp2.fileUrls[i].raw);
                            haveFile += 1;
                        } else {
                            // fd.append("files[]", this.temp2.fileUrls[i]);
                        }
                    }
                    if (!haveFile) {
                        fd.append("files[]", "");
                    }
                    //新增的tags
                    if (this.temp2.tags.length > 0) {
                        for (let i = 0; i < this.temp2.tags.length; i++) {
                            fd.append("tags[]", this.temp2.tags[i]);
                        }
                    } else {
                        fd.append("tags[]", "");
                    }

                    //要删除的tags的Id
                    console.log("this.resImage", this.resImage);
                    this.imageTagIds = [];
                    this.resImage.tags.forEach((item) => {
                        this.imageTagIds.push(item.labelId);
                    });
                    if (this.imageTagIds.length > 0) {
                        for (let i = 0; i < this.imageTagIds.length; i++) {
                            fd.append("tagIds[]", this.imageTagIds[i]);
                        }
                    } else {
                        fd.append("tagIds[]", "");
                    }

                    //要删除的文件
                    console.log("this.imageFileIds", this.imageFileIds);
                    if (this.imageFileIds.length > 0) {
                        for (let i = 0; i < this.imageFileIds.length; i++) {
                            fd.append("fileIds[]", this.imageFileIds[i]);
                        }
                    } else {
                        fd.append("fileIds[]", "");
                    }

                    updateFile(fd)
                        .then((res) => {
                            this.loading = false;
                            this.btn2 = false;
                            this.getImageById();
                            console.log(res);
                            this.$alert("", {
                                title: "",
                                message: "修改成功",
                                type: "success",
                                duration: 2000,
                            });
                        })
                        .catch((err) => {
                            this.loading = false;
                            this.btn2 = false;
                            this.getList();
                            this.getImageById();
                            console.log(err);
                        });
                }
            }
        },
        //修改3
        update3() {
            if (this.current.nodeName == "") {
                this.$message({
                    message: "请先选择节点！",
                    type: "warning",
                });
            } else {
                this.loading = true;
                if (this.docbtn == "添加") {
                    let fd = new FormData();
                    fd.append("fileType", "document");
                    fd.append("treeId", this.current.treeId);
                    fd.append("setDescription", this.temp3.setDescription);
                    if (this.temp3.tags.length > 0) {
                        for (let i = 0; i < this.temp3.tags.length; i++) {
                            fd.append("tags[]", this.temp3.tags[i]);
                        }
                    } else {
                        fd.append("tags[]", "");
                    }

                    let haveFile = 0;
                    console.log("this.temp3.fileUrls", this.temp3.fileUrls);
                    for (let i = 0; i < this.temp3.fileUrls.length; i++) {
                        if (this.temp3.fileUrls[i].raw) {
                            fd.append(
                                "multipartFiles[]",
                                this.temp3.fileUrls[i].raw
                            );
                            haveFile = 0;
                        } else {
                            fd.append(
                                "multipartFiles[]",
                                this.temp3.fileUrls[i]
                            );
                            haveFile = 0;
                        }
                    }
                    if (!haveFile) {
                        fd.append("multipartFiles[]", "");
                    }
                    addFile(fd)
                        .then((res) => {
                            this.loading = false;
                            this.btn3 = false;
                            this.docbtn = "修改";
                            // console.log(res);
                            this.$alert("", {
                                title: "",
                                message: "添加成功",
                                type: "success",
                                duration: 2000,
                            });
                            this.getDocumentById();
                            this.$nextTick(() => {
                                this.creatDowloadBtn();
                            });
                        })
                        .catch((err) => {
                            this.loading = false;
                            this.btn3 = false;
                            this.getDocumentById();
                            console.log(err);
                        });
                    //修改文件
                } else {
                    let fd = new FormData();
                    fd.append("setId", this.temp3.setId);
                    if (this.temp3.setDescription == null) {
                        this.temp3.setDescription = "";
                    }
                    fd.append("setDescription", this.temp3.setDescription);
                    //新增的file
                    console.log("this.temp3.fileUrls", this.temp3.fileUrls);

                    let haveFile = 0;
                    for (let i = 0; i < this.temp3.fileUrls.length; i++) {
                        if (this.temp3.fileUrls[i].raw) {
                            console.log(1);
                            fd.append("files[]", this.temp3.fileUrls[i].raw);
                            haveFile = 0;
                        } else {
                            // fd.append("files[]", this.temp3.fileUrls[i]);
                        }
                    }
                    if (!haveFile) {
                        fd.append("files[]", "");
                    }
                    //新增的tags
                    if (this.temp3.tags.length > 0) {
                        for (let i = 0; i < this.temp3.tags.length; i++) {
                            fd.append("tags[]", this.temp3.tags[i]);
                        }
                    } else {
                        fd.append("tags[]", "");
                    }

                    //要删除的tags的Id
                    console.log(this.resDocument);
                    this.resDocument.tags.forEach((item) => {
                        console.log("item", item);
                        this.documentTagIds.push(item.labelId);
                    });
                    // console.log("this.documentTagIds", this.documentTagIds);
                    if (this.documentTagIds.length > 0) {
                        for (let i = 0; i < this.documentTagIds.length; i++) {
                            fd.append("tagIds[]", this.documentTagIds[i]);
                        }
                    } else {
                        fd.append("tagIds[]", "");
                    }

                    //要删除的文件
                    // console.log("this.documentFileIds", this.documentFileIds);
                    if (this.documentFileIds.length > 0) {
                        for (let i = 0; i < this.documentFileIds.length; i++) {
                            fd.append("fileIds[]", this.documentFileIds[i]);
                        }
                    } else {
                        fd.append("fileIds[]", "");
                    }
                    updateFile(fd)
                        .then((res) => {
                            this.loading = false;
                            this.btn3 = false;

                            this.$alert("", {
                                title: "",
                                message: "修改成功",
                                type: "success",
                                duration: 2000,
                            });
                            this.getDocumentById();
                            setTimeout(() => {
                                this.creatDowloadBtn();
                            }, 1000);
                        })
                        .catch((err) => {
                            this.loading = false;
                            this.btn3 = false;
                            this.getDocumentById();
                            console.log(err);
                        });
                }
            }
        },

        //删除节点
        deleteNode() {
            console.log("current", this.current);
            if (this.current.treeId == "") {
                this.$message({
                    message: "请先选择节点！",
                    type: "warning",
                });
            } else {
                this.$confirm("确定要删除吗?删除后不能恢复", "系统提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    deleteNode(this.current.treeId).then((res) => {
                        console.log(res);
                        this.$alert("", {
                            title: "",
                            message: "删除成功",
                            type: "success",
                            duration: 2000,
                        });
                        this.getList();
                    });
                    this.current.nodeName = "";
                });
            }
        },
        //添加子节点
        addChildNode() {
            if (this.current.nodeName == "") {
                this.$message({
                    message: "请先选择节点！",
                    type: "warning",
                });
            } else {
                this.dialogFormVisible = true;
            }
        },
        //tree回调函数

        deleteName(id) {
            deleteNode(id).then((res) => {
                console.log(res);
            });
        },

        // deleteName(arr, parent) {
        //     arr.forEach((i, index) => {
        //         if (parent === i.nodeName) {
        //             console.log("index", index);
        //             arr.splice(index, 1);
        //         } else {
        //             if (i.children) {
        //                 console.log(i.children);
        //                 this.deleteName(i.children, parent);
        //             }
        //         }
        //     });
        // },
        addName() {
            if (this.nodeTitle == "") {
                this.$message({
                    title: "",
                    message: "请输入节点名",
                    type: "warning",
                    duration: 2000,
                });
            } else {
                this.query.nodeName = this.nodeTitle;
                this.query.parentId = this.current.treeId;
                // this.query.treeId = this.currentNode.id + 1;
                addNode(this.query).then((res) => {
                    console.log(res);
                    this.$alert("", {
                        title: "",
                        message: "添加成功",
                        type: "success",
                        duration: 2000,
                    });
                    this.getList();
                });
            }
        },
        createData() {
            // console.log("this.routes:", this.routes);
            // console.log("this.current", this.current);
            // console.log("this.nodeTitle", this.nodeTitle);
            this.addName(this.routes, this.current.nodeName, this.nodeTitle);
            console.log(this.routes);
            this.dialogFormVisible = !this.dialogFormVisible;
        },

        // 获取表格选中时的数据
        selectRow(sels) {
            this.sels = sels;
        },
        //批量删除数据
        delData() {
            this.$confirm("确定要删除吗?删除后不能恢复", "系统提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    for (let i = 0; i < this.sels.length; i++) {
                        this.item[i] = this.sels[i].cropId;
                    }
                    deleteRole(row.key).then(() => {
                        this.$alert("", {
                            title: "",
                            message: "删除成功",
                            type: "success",
                            duration: 2000,
                        });
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        // Reshape the routes structure so that it looks the same as the sidebar

        //文件改变时的钩子
        handleAvatarChange1(file, fileList) {
            console.log("handleAvatarChange1:");
            console.log(file);
            console.log(fileList);
            this.temp1.fileUrls = fileList;
        },
        handleAvatarChange2(file, fileList) {
            console.log("handleAvatarChange2:");
            console.log(file);
            console.log(fileList);
            this.temp2.fileUrls = fileList;
        },
        handleAvatarChange3(file, fileList) {
            console.log("handleAvatarChange3:");
            console.log(file);
            console.log(fileList);
            if (window.navigator.userAgent.indexOf("Trident") > -1) {
             console.log('ie');
            }

            this.temp3.fileUrls = fileList;
        },
        handleDelete({ $index, row }) {
            this.$confirm("Confirm to remove the role?", "Warning", {
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                type: "warning",
            })
                .then(async () => {
                    await deleteRole(row.key);
                    this.rolesList.splice($index, 1);
                    this.$message({
                        type: "success",
                        message: "Delete succed!",
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        beforeUpload1(file) {
            const extension = file.name.substring(
                file.name.lastIndexOf(".") + 1
            );
            const size = file.size / 1024 / 1024;
            console.log("exten", extension);
            if (
                extension !== "xls" ||
                extension !== "xlsx" ||
                extension !== "csv"
            ) {
                // 校验文件格式
                this.$message.warning(
                    "只支持上传后缀名为.xlsx,.xls,.csv的Excel文件"
                );
                return false;
            }
            // if (size > 10) { // 校验文件大小
            //   this.$message.warning('文件大小不能超过10MB')
            // }
        },

        //Tag 标签
        handleClose1(tag) {
            this.temp1.tags.splice(this.temp1.tags.indexOf(tag), 1);
        },
        handleClose2(tag) {
            this.temp2.tags.splice(this.temp2.tags.indexOf(tag), 1);
        },
        handleClose3(tag) {
            this.temp3.tags.splice(this.temp3.tags.indexOf(tag), 1);
        },

        showInput1() {
            this.inputVisible1 = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        showInput2() {
            this.inputVisible2 = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        showInput3() {
            this.inputVisible3 = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm1() {
            let inputValue1 = this.inputValue1;
            if (inputValue1) {
                this.temp1.tags.push(inputValue1);
            }
            this.inputVisible1 = false;
            this.inputValue1 = "";
        },
        handleInputConfirm2() {
            let inputValue2 = this.inputValue2;
            if (inputValue2) {
                this.temp2.tags.push(inputValue2);
            }
            this.inputVisible2 = false;
            this.inputValue2 = "";
        },
        handleInputConfirm3() {
            let inputValue3 = this.inputValue3;
            if (inputValue3) {
                this.temp3.tags.push(inputValue3);
            }
            this.inputVisible3 = false;
            this.inputValue3 = "";
        },

        //upload
        handleRemove1(file, fileList) {
            this.temp1.fileUrls = fileList;
            // console.log(file);
            if (this.databtn === "修改") {
                this.resData.fileUrls.forEach((item) => {
                    if (item.url === file.url) {
                        this.dataFileIds.push(item.fileId);
                    }
                });
            }
            console.log("filesId", this.dataFileIds);
        },
        handleRemove2(file, fileList) {
            this.temp2.fileUrls = fileList;
            console.log(file);
            if (this.imgbtn === "修改") {
                this.resImage.fileUrls.forEach((item) => {
                    if (item.url === file.url) {
                        this.imageFileIds.push(item.fileId);
                    }
                });
            }
        },
        handleRemove3(file, fileList) {
            console.log("file", file);
            this.temp3.fileUrls = fileList;
            if (this.docbtn === "修改") {
                this.resDocument.fileUrls.forEach((item) => {
                    if (item.url == file.url) {
                        this.documentFileIds.push(item.fileId);
                    }
                });
            }
        },
        handlePreview(file) {
            console.log("handlepreview:");
            console.log(file);
        },
        handleAvatarChange(file, fileList) {
            console.log("handleAvatarChange:");
            console.log(file);
            console.log(fileList);
            // this.temp.files = fileList;
        },
    },
};
</script>

<style scoped>
:deep(.el-tree-node__label) {
    font-size: 18px;
}
:deep(.el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content) {
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
.u-main .el-tag + .el-tag {
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
//el
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
