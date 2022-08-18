<template>
    <el-container style="width:100%">
        <el-header class="main-bg w" height="160px">
            <el-row class="head" style="margin-left:250px">
                <el-col :span="20">
                    <div class="grid-content" style="padding:25px;">
                        <el-row class="nav">
                            <el-col :span="3">
                                <a @click="handleData" :class="i == 1 ? 'bold' : ''">数据</a>
                            </el-col>
                            <el-col :span="3">
                                <a @click="handleImg" :class="i == 2 ? 'bold' : ''">图片</a>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
            <div style="width:100%;height:50px">
                <div id="box">
                    <div id="left">
                        <div style="font-size:30px;text-align:right;line-height:50px;padding:0 20px">大数据搜索</div>
                    </div>
                    <div id="center">
                        <el-input style="height:50px;margin-top:1px;" :placeholder="placeholder[i]" v-model="input">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                    <div id="right">
                        <el-button icon="el-icon-search" style="height:50px;margin-left:10px;" @click="go">搜索
                        </el-button>
                        <el-button type="primary" style="height:50px;margin-left:10px" @click="highSearch">高级搜索
                        </el-button>
                    </div>
                </div>
            </div>
        </el-header>
        <!-- <el-container class="border" style="padding:0 50px;background-color:#D0D0D0"> -->
        <el-container class="border" :style="'padding:0;min-height:' + mainheight">
            <el-aside>
                <!-- style="background-color:#fff" -->
                <el-menu default-active="2" :default-openeds="['1', '2']" class="el-menu-vertical-demo"
                    @open="handleOpen" @close="handleClose">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>标签</span>
                        </template>
                        <el-menu-item-group>
                            <!-- <template slot="title">分组一</template> -->
                            <el-menu-item @click="resetTag">全部</el-menu-item>
                            <el-menu-item index="1-1" :key="o" v-for="(item, o) in type == 'data' ? dtags : itags"
                                @click="filterTag(item)">{{ item }}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
                <div v-if="type == 'data' && (datas[0] === '未找到数据' || datas.length == 0) || type == 'image' && (imgs[0] === '未找到数据' || imgs.length == 0)"
                    style="font-size:30px;">
                    <div class="tishi" style="font-size:20px; margin-top:100px">
                        <span>
                            <i class="el-icon-search">...</i>
                        </span>
                        温馨提示：
                        <br />没有检索到数据或图片，请检查您输入的内容是否正确。
                    </div>
                </div>
                <div v-if="type == 'data' && (datas[0] !== '未找到数据' && datas.length > 0)" v-loading="loading"
                    element-loading-text="拼命下载中" element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)">
                    <div class="data_box"
                        v-for="(item, o) in datas.filter(data => !searchD || data.label.some(label => { return label.toLowerCase() == searchD.toLowerCase(); }))"
                        :key="o">
                        <div style="padding:0 10px;border-bottom:0.2px solid #ccc">
                            <h3 style="font-weight: 600;color: #1f2f3d;">
                                {{ item.fileName }}
                                <el-tag :key="o" v-for="(tag, o) in item.label" :disable-transitions="false"
                                    style="float:right;margin-left:10px">{{ tag }}</el-tag>
                            </h3>
                            <p style="font-size: 14px;margin:0;padding:14px 0;color: #5e6d82;line-height: 1.5em;overflow:hidden;">
                                {{ item.setDescription }}
                                <el-button type="primary" style="float:right;margin-left:10px;margin-top:-10px"
                                    @click="download(item)">下载</el-button>
                            </p>
                        </div>
                        <!-- <ux-grid
                            :data="Object.values(item.contents[0])"
                            ref="plxTable"
                            height="550"
                            :checkboxConfig="{checkMethod: selectable, highlight: true}"
                            @selection-change="selectionChange"
                            @table-body-scroll="scroll"
                            show-header-overflow="ellipsis"
                        >
                            <ux-table-column type="index" width="100" />
                            <ux-table-column
                                v-for="(item,o) in item.contents?Object.values(item.contents[0]):''"
                                :key="o"
                                resizable="true"
                                :field="item"
                                sortable="true"
                                fixed="left"
                                min-width="180"
                            />
                        </ux-grid>-->
                        <u-table style="overflow:hidden;" ref="plxTable"
                            :data="item.contents ? item.contents.slice(1) : []" :border="false" max-height="500px"
                            use-virtual width="100%">
                            <el-table-column type="index" align="center" width="100"></el-table-column>
                            <el-table-column align="center" :key="o"
                                v-for="(col, o) in item.contents ? Object.values(item.contents[0]) : ''" :prop="col"
                                :label="col" width="180"></el-table-column>
                        </u-table>
                        <!-- <el-table
                            ref="table"
                            :header-cell-style="{background:'#F1F1F1',color:'#606266'}"
                            v-loading="listLoading"
                            stripe
                            :data="item.contents"
                            style="width: 100%"
                            max-height="550"
                            highlight-current-row
                        >
                            <el-table-column
                                align="center"
                                :key="o"
                                v-for="(col,o) in item.contents?Object.values(item.contents[0]):''"
                                :prop="col"
                                :label="parsefloat(o)"
                                width="180"
                            ></el-table-column>
                        </el-table>-->
                    </div>
                </div>
                <div v-if="type == 'image'">
                    <!-- <el-row>
                        <el-col
                            :span="7"
                            v-for="(o, index) in imgs"
                            :key="index"
                            :offset="index%3 > 0 ? 1 : 0"
                        >
                           
                        </el-col>
                    </el-row>-->
                    <ul style="padding:0">
                        <li v-for="(o, index) in imgs.filter(data => !searchI || data.label.some(label => { return label.toLowerCase() == searchI.toLowerCase(); }))"
                            :key="index" style="float:left;list-style:none;width:20%">
                            <el-card :body-style="{ padding: '0', width: '100%' }" style="margin: 0 0px 40px 15px;">
                                <!-- <img :src="o.url" class="image" style="width:300px;height:300px" /> -->

                                <el-image @click.self="showBigImage(o.url)" :src="o.url" class="image"
                                    style="width:200px;height:200px">
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                                <ShowPhoto :visible="photoVisible" :url="bigImgUrl"
                                    @closeClick="() => { photoVisible = false; }"></ShowPhoto>
                                <div style="padding: 5px;height:80px;overflow-y:auto">
                                    <span style="font-size:15px;font-weight:700">{{ o.fileName }}</span>
                                    <div style="font-size: 12px;color: #999;margin:5px 0" clearfix>
                                        <span class="time" style="line-height:12px">{{ o.setDescription }}</span>
                                        <!-- <time class="time">{{ currentDate }}</time> -->
                                    </div>
                                    <div style>
                                        <el-tag :key="index" v-for="(tag, index) in o.label"
                                            :disable-transitions="false" style="margin-right:5px;font-size:12px">{{ tag
                                            }}</el-tag>
                                    </div>
                                </div>
                            </el-card>
                        </li>
                    </ul>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<!-- <script>
import { documentDownload } from "@/api/bigData";
import LargeImg from "@/components/LargeImg";
import { simpleFind } from "@/api/search";
export default {
    name: "result",
    components: {
        ShowPhoto: LargeImg,
    },
    data() {
        return {
            loading: false,
            loadingText: "拼命下载中···",
            isGo: false,
            bigImgUrl: "",
            photoVisible: false,
            searchD: "", //标签查询
            searchI: "", //标签查询
            listLoading: true,
            imgs: [],
            currentDate: new Date(),
            year: ["2017", "2018", "2019", "2020"],
            author: ["a", "b", "c"],
            tags: [],
            dags: [],
            itags: [],
            i: 1,
            placeholder: [
                "海量资源，等你发现",
                "海量数据，等你发现",
                "海量图片，等你发现"
            ],
            //query
            input: "",
            type: "",
            tableKey: "",
            headerHeight: 60,
            mainheight: window.innerHeight - 220 + "px",
            datas: [""],
        };
    },
    created() {
        console.log("this.$route", this.$route);
        this.input = this.$route.params.input;
        this.type = this.$route.params.type;
        if (this.type == "data") {
            this.i = 1;
        } else if (this.type == "image") {
            this.i = 2;
        }
        this.go();
    },
    methods: {
        download(item) {
            // console.log('this.temp3.fileUrls',this.temp3.fileUrls);
            let url = item.url;
            if (url) {
                this.loading = true;
                this.loadingText = "正在请求下载中，请耐心等候···";
                // let type = url.substring(url.lastIndexOf(".") + 1);
                // let urlp = url.replace(/\\/g, "/");
                // // console.log('url',url);
                // let url1 = decodeURI(urlB); //el-upload会将url中的中文编码
                // url1 = url1.replace(/\\/g, "/");

                // var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                // url = decodeURI(url.replace(/\\/g, "//"));

                // if (userAgent.indexOf("Trident") > -1) {
                //     url = url.replace(/\\/g, "\\");
                //     url=encodeURI(url)
                // }
                documentDownload(url)
                    .then((res) => {
                        let name = item.fileName; //文件名字
                        let type = url.substring(url.lastIndexOf(".") + 1); //文件后缀名
                        const blob = new Blob([res], {
                            type: "application/octet-stream",
                        });
                        if (
                            window.navigator.userAgent.indexOf("Trident") >
                            -1 &&
                            window.navigator.msSaveBlob
                        ) {
                            console.log("IE download");
                            window.navigator.msSaveBlob(
                                blob,
                                name + "." + type
                            );
                            this.loading = false;
                        } else {
                            console.log(res);
                            this.loading = false;
                            this.loadingText = "拼命加载中···";

                            const a = document.createElement("a");
                            const href = window.URL.createObjectURL(blob);
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
                        this.loadingText = "拼命加载中···";
                        console.log("err", err);
                        this.$message({
                            message: "下载失败",
                            type: "warning",
                        });
                    });
            } else {
                this.$message({
                    message: "未找到文件",
                    type: "warning",
                });
            }

            // let a=document.createElement('a');
            // a.download="a.jpg"
            // a.href='http://81.71.138.29:8080/file/DATACENTER/DataCenter/002D1_0-20210226183753825.jpg'
            // a.click()
            // window.location.href='http://81.71.138.29:8080/file/DATACENTER/DataCenter/table-list (23)-20210220204543354.xlsx'
        },
        showBigImage(imgUrl) {
            const a = document.createElement("a");
            a.href = imgUrl;
            a.target = "_blank";
            a.click();
            //点击图片函数，点击后，把photoVisible设置成true
            // if (imgUrl != "") {
            //     this.bigImgUrl = imgUrl;
            //     this.photoVisible = true;
            // }
        },

        resetTag() {
            if (this.type == "data") {
                this.searchD = "";
            } else if (this.type == "image") {
                this.searchI = "";
            }
        },
        //筛选标签
        filterTag(item) {
            if (this.type == "data") {
                this.searchD = item;
                console.log(item);
            } else if (this.type == "image") {
                this.searchI = item;
                console.log(item);
            }
        },
        //高级搜索
        highSearch() {
            this.$router.push("/searching/highSearch");
        },
        go() {
            if (this.input == "") {
                this.$message({
                    title: "",
                    message: "输入不能为空！",
                    type: "error",
                    duration: 2000,
                });
            } else {
                this.data = [""];
                this.img = "";
                this.isGo = true;
                this.listLoading = true;
                simpleFind({ type: this.type, keyword: this.input }).then(
                    (res) => {
                        console.log(res);
                        console.log("Object.values", Object.values(res.data));

                        if (this.type == "data") {
                            this.dtags = []; //清空标签数组
                            console.log(Object.values(res.data));
                            if (Object.values(res.data)[0] == "未找到数据") {
                                this.datas = [];
                            } else {
                                this.datas = Object.values(res.data);
                            }
                            console.log("datas", this.datas);
                            if (this.datas[0]) {
                                console.log("数组", this.datas[0].contents);
                                console.log(
                                    "文件行数",
                                    this.datas[0].contents.length
                                );
                                console.log(
                                    "文件列数",
                                    Object.values(this.datas[0].contents[0])
                                        .length
                                );
                                //行
                                if (this.datas[0].contents.length == 31) {
                                    //文件行数>30行（排除第一行列名）
                                    // this.datas[0].contents[31]=this.datas[0].contents[30]会同时变化
                                    this.datas[0].contents[31] = JSON.parse(
                                        JSON.stringify(
                                            this.datas[0].contents[30]
                                        )
                                    );
                                    for (var index in this.datas[0]
                                        .contents[31]) {
                                        console.log(index);
                                        this.datas[0].contents[31][index] =
                                            "......";
                                        console.log(
                                            this.datas[0].contents[31][index]
                                        );
                                    }
                                }

                                //列
                                if (
                                    Object.values(this.datas[0].contents[0])
                                        .length == 20
                                ) {
                                    console.log("列");
                                    for (
                                        var j = 0;
                                        j < this.datas[0].contents.length;
                                        j++
                                    ) {
                                        console.log(this.datas[0].contents[j]);
                                        this.datas[0].contents[j].more =
                                            "......";
                                        console.log(this.datas[0].contents[j]);
                                    }
                                }
                                console.log(
                                    "-------------------------------------"
                                );
                            }

                            //标签处理
                            this.datas.forEach((data) => {
                                console.log(data);
                                if (data.label) {
                                    data.label.forEach((label) => {
                                        // if(label in this.dtags){label是索引
                                        if (this.dtags.includes(label)) {
                                        } else {
                                            this.dtags.push(label);
                                        }
                                    });
                                }
                            });
                            console.log("dtags", this.dtags);
                            this.listLoading = false;
                            this.isGo = false;
                        }
                        if (this.type == "image") {
                            this.itags = []; //清空标签数组
                            if (Object.values(res.data)[0] == "未找到数据") {
                                this.imgs = [];
                            } else {
                                this.imgs = Object.values(res.data);
                            }
                            console.log("datas", this.imgs);
                            this.imgs.forEach((data) => {
                                console.log(data);
                                data.label.forEach((label) => {
                                    console.log("label", label);
                                    // if(label in this.tags){label是索引
                                    if (this.itags.includes(label)) {
                                        console.log(label);
                                    } else {
                                        this.itags.push(label);
                                    }
                                });
                            });
                            this.listLoading = false;
                            this.isGo = false;
                        }
                    }
                );
            }
        },
        handleAll() {
            this.i = 0;
            this.type == "";
        },
        handleData() {
            this.i = 1;
            this.type = "data";
        },
        handleImg() {
            this.i = 2;
            this.type = "image";
        },
    },
};
</script> -->

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { documentDownload } from "@/api/bigData";
import { simpleFind } from "@/api/search";
import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const isGo = ref(false);
const bigImgUrl = ref("");
const loadingText = ref("拼命下载中...");
const photoVisible = ref(false);
const listLoading = ref(false);
const imgs = ref([]);
const searchD = ref(""); // 标签查询
const searchI = ref(""); // 标签查询\
const dtags = ref([]);
const itags = ref([]);
const i = ref(1);
const placeholder = ref([
    "海量资源，等你发现",
    "海量数据，等你发现",
    "海量图片，等你发现",
]);
const input = ref("");
const type = ref("data");
const mainheight = ref(window.innerHeight - 60 + 'px');
const datas = ref([]);


console.log("route", route);
input.value = route.params.input;
type.value = route.params.type;
if (type.value == "data") {
    i.value = 1;
} else if (type.value == "image") {
    i.value = 2;
}
go();
function download(item) {
    let url = item.url;
    if (url) {
        loading.value = true;
        loadingText.value = "正在请求下载中，请耐心等候···";
        documentDownload(url)
            .then((res) => {
                let name = item.fileName; //文件名字
                let type = url.substring(url.lastIndexOf(".") + 1); //文件后缀名
                const blob = new Blob([res], {
                    type: "application/octet-stream",
                });
                if (
                    window.navigator.userAgent.indexOf("Trident") >
                    -1 &&
                    window.navigator.msSaveBlob
                ) {
                    console.log("IE download");
                    window.navigator.msSaveBlob(
                        blob,
                        name + "." + type
                    );
                    loading.value = false;
                } else {
                    console.log(res);
                    loading.value = false;
                    loadingText.value = "拼命加载中···";

                    const a = document.createElement("a");
                    const href = window.URL.createObjectURL(blob);
                    a.href = href;
                    a.download = name + "." + type;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(href);
                }
            })
            .catch((err) => {
                loading.value = false;
                loadingText.value = "拼命加载中···";
                console.log("err", err);
                ElMessage({
                    showClose: true,
                    message: "下载失败",
                    type: "warning",
                });
            });
    } else {
        ElMessage({
            showClose: true,
            message: "未找到文件",
            type: "warning",
        });
    }
}

function showBigImage(imgUrl) {
    const a = document.createElement("a");
    a.href = imgUrl;
    a.target = "_blank";
    a.click();
}
//重置标签
function resetTag() {
    if (type.value == "data") {
        searchD.value = "";
    } else if (type.value == "image") {
        searchI.value = "";
    }
}
//筛选标签
function filterTag(item) {
    if (type.value == "data") {
        searchD.value = item;
        console.log(item);
    } else if (type.value == "image") {
        searchI.value = item;
        console.log(item);
    }
}
//高级搜索
function highSearch() {
    router.push("/searching/highSearch");
}

function go() {
    if (input.value == "") {
        ElMessage.error("请输入搜索内容");
    } else {
        listLoading.value = true;
        isGo.value = true;
        simpleFind({ type: type.value, keyword: input.value }).then(
            (res) => {
                console.log(res);
                console.log("Object.values", Object.values(res.data));

                if (type.value == "data") {
                    dtags.value = []; //清空标签数组
                    console.log(Object.values(res.data));
                    if (Object.values(res.data)[0] == "未找到数据") {
                        datas.value = [];
                    } else {
                        datas.value = Object.values(res.data);
                    }
                    console.log("datas", datas.value);
                    console.log("数组", datas.value[0].contents);
                    console.log(
                        "文件行数",
                        datas.value[0].contents.length
                    );
                    console.log(
                        "文件列数",
                        Object.values(datas.value[0].contents[0]).length
                    );

                    //行
                    if (datas.value[0].contents.length == 31) {
                        datas.value[0].contents[31] = JSON.parse(
                            JSON.stringify(datas.value[0].contents[30])
                        );
                        for (var index in datas.value[0].contents[31]) {
                            console.log(index);
                            datas.value[0].contents[31][index] =
                                "......";
                            console.log(
                                datas.value[0].contents[31][index]
                            );
                        }
                    }

                    //列
                    if (
                        Object.values(this.datas[0].contents[0])
                            .length == 20
                    ) {
                        console.log("列");
                        for (
                            var j = 0;
                            j < datas.value[0].contents.length;
                            j++
                        ) {
                            console.log(datas.value[0].contents[j]);
                            datas.value[0].contents[j].more = "......";
                            console.log(datas.value[0].contents[j]);
                        }
                    }
                    console.log(
                        "-------------------------------------"
                    );

                    datas.value.forEach((data) => {
                        console.log(data);
                        if (data.label) {
                            data.label.forEach((label) => {
                                if (dtags.value.includes(label)) {
                                } else {
                                    dtags.value.push(label);
                                }
                            });
                        }
                    });
                    console.log("dtags", dtags.value);
                    listLoading.value = false;
                    isGo.value = false;
                }
                if (type.value == "image") {
                    itags.value = []; //清空标签数组
                    if (Object.values(res.data)[0] == "未找到数据") {
                        imgs.value = [];
                    } else {
                        imgs.value = Object.values(res.data);
                    }
                    console.log("datas", imgs.value);
                    imgs.value.forEach((data) => {
                        console.log(data);
                        data.label.forEach((label) => {
                            console.log("label", label);
                            if (itags.value.includes(label)) {
                                console.log(label);
                            } else {
                                itags.value.push(label);
                            }
                        });
                    });
                    listLoading.value = false;
                    isGo.value = false;
                }
            }
        );
    }
}
function handleData() {
    i.value = 1;
    type.value = "value";
}
function handleImg() {
    i.value = 2;
    type.value = "image";
}
</script>
<style >
#center .el-input__inner {
    height: 50px;
}
</style>
<style scoped>
:deep(.border aside) {
    background: #dfe6f1;
}

:deep(.el-tag) {
    padding: 0 5px;
}

:deep(.el-tag--medium) {
    height: 20px;
    line-height: 18px;
}

.data_box {
    margin-bottom: 50px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    background-color: #fff;
}

.border {
    /* background: linear-gradient(90deg,#eef1f6,#29b7cb); */
    background-color: #dfe6f1;
}

.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}

.nav a:hover {
    font-weight: 900;
}

.bold {
    font-weight: 900;
}

.nav {
    font-size: 18px;
    font-weight: 200;
}

.head_img {
    width: 100%;
    height: 370px;
    margin: 50px auto;
    background-image: url("../../assets/images/search/brain.png");
    background-repeat: no-repeat;
    background-size: 400 370;
}

#box {
    margin: 0 auto;
    width: 90%;
    height: 50px;
    display: flex;
}

#left,
#right {
    width: 220px;
    height: 50px;
    /* margin:10px; */
    /* background-color:#999; */
}

#center {
    flex: 1;
    height: 50px;
    /* margin:10px;左右margin不会叠加 */
    /* background-color:#f00; */
}

.tishi {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    text-align: center;
    color: #555;
    font-family: Avenir, Helvetica, Arial, sans-serif;
}

.main-bg {
    /* background: url("../../assets/images/index_bg.jpg"); */

    background-color: #29b7cb;
    color: white;
}

.w {
    padding: 0 50px;
}
</style>