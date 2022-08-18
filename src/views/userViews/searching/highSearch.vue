<template>
    <el-header :height="mainheight" class="w main-bg">
        <el-card class="box-card">
            <template #header>
                <div class="clearfix">
                    <span style="font-size:20px;color:#417dc9;font-weight:700">高级搜索</span>
                    <el-button style="float:right;" @click="back">返回</el-button>
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </div>
            </template>
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="data">
                    <template #label>
                        <span>
                            <el-icon>
                                <ZoomIn />
                            </el-icon>
                            <span>数据</span>
                        </span>
                    </template>
                    <div>
                        <span>检索信息：</span>
                        <el-form ref="form" :model="form" label-width="0px">
                            <el-row v-for="(item, index) in propTotal" :key="index">
                                <el-col :span="3">
                                    <el-form-item label align="right">
                                        <el-button icon="Plus" circle size="mini" @click="addProp" />
                                        <el-button icon="Minus" circle size="mini" @click="deleteProp(index)" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label>
                                        <el-select clearable v-model="item.prop" placeholder="请选择"
                                            style="margin-left:10px">
                                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                                :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label>
                                        <el-input style="display:inline" v-model="item.input" placeholder="请输入内容">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5"></el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div>
                        <div style="margin-top:20px">
                            <el-button type="primary" @click="go">检索</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="image">
                    <template #label>
                        <span>
                            <el-icon>
                                <ZoomIn />
                            </el-icon>
                            <span>图片</span>
                        </span>
                    </template>
                    <div>
                        <span style="color:#417dc9;font-size:16px;">注意：列名只对数据有效</span>
                        <br />
                        <span>检索信息：</span>
                        <el-form ref="form" :model="form" label-width="0px">
                            <el-row v-for="(item, index) in propTotal" :key="index">
                                <el-col :span="3">
                                    <el-form-item label align="right">
                                        <el-button icon="Plus" circle size="mini" @click="addProp" />
                                        <el-button icon="Minus" circle size="mini" @click="deleteProp(index)" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item label>
                                        <el-select clearable v-model="item.prop" placeholder="请选择"
                                            style="margin-left:10px">
                                            <el-option v-for="op in options" :key="op.value" :label="op.label"
                                                :value="op.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label>
                                        <el-input style="display:inline" v-model="item.input" placeholder="请输入内容">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5"></el-col>
                            </el-row>
                        </el-form>
                    </div>
                    <div>
                        <div style="margin-top:20px">
                            <el-button type="primary" @click="go">检索</el-button>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </el-header>
    <el-container class="border" style="padding:0;" v-if="disFlag">
        <el-aside style>
            <!-- style="background-color:#fff" -->
            <el-menu default-active="2" :default-openeds="['1', '2']" class="el-menu-vertical-demo" @open="handleOpen"
                @close="handleClose">
                <el-submenu index="1">
                    <template #title>
                        <el-icon>
                            <Location />
                        </el-icon>
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
        <el-main style="padding-right:50px" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <div v-if="type == 'data' && (datas[0] === '未找到数据' || datas.length == 0) || type == 'image' && (imgs[0] === '未找到数据' || imgs.length == 0)"
                style="font-size:30px;">
                <div class="tishi" style="font-size:20px; margin-top:100px">
                    <span>
                        <el-icon>
                            <Search></Search>
                        </el-icon>
                        <span>...</span>
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
                        <h3 style="font-weight: 600;
    color: #1f2f3d;">
                            {{ item.fileName }}
                            <el-tag :key="o" v-for="(tag, o) in item.label" :disable-transitions="false"
                                style="float:right;margin-left:10px">{{ tag }}</el-tag>
                        </h3>
                        <p style="    font-size: 14px;
                                margin:0;
                                padding:14px 0;
    color: #5e6d82;
    line-height: 1.5em;
    overflow:hidden;">
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
                    <u-table style="overflow:hidden;" ref="plxTable" :data="item.contents ? item.contents.slice(1) : []"
                        :border="false" max-height="500px" use-virtual width="100%">
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
            <div v-if="query.fileType == 'image'">
                <ul style="padding:0">
                    <li v-for="(o, index) in imgs.filter(data => !searchI || data.label.some(label => { return label.toLowerCase() == searchI.toLowerCase(); }))"
                        :key="index" style="float:left;list-style:none;width:20%">
                        <el-card :body-style="{ padding: '0' }" style="margin: 0 0px 40px 15px;">
                            <!-- <img :src="o.url" class="image" style="width:300px;height:300px" /> -->

                            <el-image @click.self="showBigImage(o.url)" :src="o.url" class="image"
                                style="width:200px;height:200px">
                                <template #error>
                                    <div class="image-slot">
                                        <el-icon>
                                            <Picture></Picture>
                                        </el-icon>
                                    </div>
                                </template>
                            </el-image>
                            <ShowPhoto :visible="photoVisible" :url="o.url"
                                @closeClick="() => { photoVisible = false; }">
                            </ShowPhoto>
                            <div style="padding: 5px;height:80px;overflow-y:auto">
                                <span style="font-size:15px;font-weight:700">{{ o.fileName }}</span>
                                <div style="font-size: 12px;color: #999;margin:5px 0" clearfix>
                                    <span class="time" style="line-height:12px">{{ o.setDescription }}</span>
                                    <!-- <time class="time">{{ currentDate }}</time> -->
                                </div>
                                <div style>
                                    <el-tag :key="index" v-for="(tag, index) in o.label" :disable-transitions="false"
                                        style="margin-right:5px;font-size:12px">{{ tag
                                        }}</el-tag>
                                </div>
                            </div>
                        </el-card>
                    </li>
                </ul>
            </div>
        </el-main>
    </el-container>
</template>

<!-- <script>
import { documentDownload } from "@/api/bigData";
import { advancedFind } from "@/api/search";
import { ElMessage } from "element-plus";
export default {
    name: "search",
    components: {},
    data() {
        return {
            searchD: "",
            searchI: "",
            disFlag: false,
            loading: false,
            listLoading: true,
            imgs: [],
            currentDate: new Date(),
            year: ["2017", "2018", "2019", "2020"],
            author: ["a", "b", "c"],
            tags: [],
            dtags: [],
            itags: [],
            //高级搜索请求query
            query: {
                fileType: "data",
                nodeNames: [],
                tags: [],
                years: [],
                columns: [],
            },
            input: "",
            type: "data",
            tableKey: "",
            headerHeight: 60,
            mainheight: window.innerHeight - 60 + "px",
            datas: [],
            editableTabsValue: 0,
            form: {},
            value1: "",
            tableData: [
                {
                    level: "",
                    input: "",
                    prop: "",
                    data: [],
                },
            ],
            propTotal: [
                {
                    input: "",
                    prop: "nodeNames",
                },
                {
                    input: "",
                    prop: "years",
                },
                {
                    input: "",
                    prop: "tags",
                },
            ],
            value: "",
            level: ["精确", "模糊"],
            options: [
                {
                    label: "作物",
                    value: "nodeNames",
                },
                {
                    label: "年份",
                    value: "years",
                },
                {
                    label: "标签",
                    value: "tags",
                },
                {
                    label: "列名",
                    value: "columns",
                },
            ],
            i: 0,
            arr: [
                {
                    title: "专利",
                    detail:
                        "专利资源来源于中外专利数据库，收录始于1985年，目前共收录中国专利2200余万条，国外专利8000余万条。收录范围涉及十一国两组织，最早可追溯到十八世纪八十年代。",
                },
            ],
        };
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
        },
        //重置标签
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
        resetQuery() {
            this.query.years = [];
            this.query.nodeNames = [];
            this.query.tags = [];
            this.query.columns = [];
        },

        handleOpen() { },
        handleClose() { },
        resetTag() {
            if (this.type == "data") {
                this.searchD = "";
            } else if (this.type == "image") {
                this.searchI = "";
            }
        },
        go() {
            if (this.input == "") {
                ElMessage.error("请输入搜索内容");
            } else {
                this.disFlag = true; //搜索结果显示
                this.mainheight = "";
                this.listLoading = true;
                console.log("propTotal", this.propTotal);
                this.resetQuery();
                this.propTotal.forEach((item) => {
                    if (item.input && item.prop == "nodeNames") {
                        this.query.nodeNames.push(item.input);
                    } else if (item.input && item.prop == "years") {
                        this.query.years.push(item.input);
                    } else if (item.input && item.prop == "tags") {
                        this.query.tags.push(item.input);
                    } else if (item.input && item.prop == "columns") {
                        this.query.columns.push(item.input);
                    }
                });
                console.log("query", this.query);
                if (
                    this.query.columns.length == 0 &&
                    this.query.nodeNames.length == 0 &&
                    this.query.tags.length == 0 &&
                    this.query.years.length == 0
                ) {
                    this.$message({
                        message: "输入不能为空！",
                        type: "error",
                        duration: 2000,
                    });
                } else {
                    advancedFind(this.query).then(
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
                                console.log("数组", this.datas[0].contents);
                                console.log(
                                    "文件行数",
                                    this.datas[0].contents.length
                                );
                                console.log(
                                    "文件列数",
                                    Object.values(this.datas[0].contents[0]).length
                                );

                                //行
                                if (this.datas[0].contents.length == 31) {
                                    //文件行数>30行（排除第一行列名）
                                    // this.datas[0].contents[31]=this.datas[0].contents[30]会同时变化
                                    this.datas[0].contents[31] = JSON.parse(
                                        JSON.stringify(this.datas[0].contents[30])
                                    );
                                    for (var index in this.datas[0].contents[31]) {
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
                                        this.datas[0].contents[j].more = "......";
                                        console.log(this.datas[0].contents[j]);
                                    }
                                }
                                console.log(
                                    "-------------------------------------"
                                );

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
                                        // if(label in this.itags){label是索引
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
            }
        },

        //标签页被点击时
        tabClick(tab) {
            console.log("tab", tab); //获取当前元素属性name
            this.query.fileType = tab.label;
            this.type = tab.label;
            this.resetTag();
            // this.go()
            // if (this.tabName == tabOne) {
            //     // 所需代码
            // } else if (this.tabName == tabTwo) {
            //     // 所需代码
            // }
        },
        //删除行
        deleteProp(index) {
            if (this.propTotal.length > 3) {
                console.log("index:", index);
                this.propTotal.splice(index, 1);
            }
        },
        //增加行
        addProp() {
            if (this.propTotal.length < 6) {
                this.propTotal.push({
                    input: "",
                    prop: "",
                });
            }
        },
        highSearch() {
            this.$router.push("/searching/highSearch");
        },
        back() {
            this.$router.go(-1);
        },
        handleData() {
            this.i = 1;
        },
        handleImg() {
            this.i = 2;
        },
    },
};
</script> -->

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { documentDownload } from "@/api/bigData";
import { advancedFind } from "@/api/search";
import { ElMessage } from "element-plus";

const router = useRouter();
const searchD = ref("");
const searchI = ref("");
const disFlag = ref(false);
const loading = ref(false);
const listLoading = ref(false);
const imgs = ref([]);
// const currentDate = ref(new Date());
// const year = ["2017", "2018", "2019", "2020"];
// const author = ref(["a", "b", "c"]);
// const tags = ref([]);
const dtags = ref([]);
const itags = ref([]);
const query = reactive({
    fileType: "data",
    nodeNames: [],
    tags: [],
    years: [],
    columns: []
});
const input = ref("");
const type = ref("data");
// const tableKey = ref("");
// const headerHeight = ref(60);
const mainheight = ref(window.innerHeight - 60 + 'px');
const datas = ref([]);
// const editableTabsValue = ref(0);
const form = ref({});
// const value1 = ref("");
// const tableData = ref([{
//     level: "",
//     input: "",
//     prop: "",
//     data: [],
// }]);
const propTotal = ref([
    {
        input: "",
        prop: "nodeNames",
    },
    {
        input: "",
        prop: "years",
    },
    {
        input: "",
        prop: "tags",
    },
]);
// const value = ref("");
// const level = ref(["精确", "模糊"]);
const options = ref([
    {
        label: "作物",
        value: "nodeNames",
    },
    {
        label: "年份",
        value: "years",
    },
    {
        label: "标签",
        value: "tags",
    },
    {
        label: "列名",
        value: "columns",
    },
]);
// const i = ref(0);
// const arr = ref([
//     {
//         title: "专利",
//         detail:
//             "专利资源来源于中外专利数据库，收录始于1985年，目前共收录中国专利2200余万条，国外专利8000余万条。收录范围涉及十一国两组织，最早可追溯到十八世纪八十年代。",
//     },
// ]);

function download(item) {
    // console.log('this.temp3.fileUrls',this.temp3.fileUrls);
    let url = item.url;
    if (url) {
        loading.value = true;
        // 不知这个loadingText是什么 后面都注释掉了
        // let loadingText = "正在请求下载中，请耐心等候···";
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
                    loading.value = false;
                } else {
                    console.log(res);
                    loading.value = false;
                    // loadingText = "拼命加载中···";

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
                // loadingText = "拼命加载中···";
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
function resetQuery() {
    query.years = [];
    query.nodeNames = [];
    query.tags = [];
    query.columns = [];
}

function go() {
    if (input.value == "") {
        ElMessage.error("请输入搜索内容");
    } else {
        disFlag.value = true; //搜索结果显示
        mainheight.value = "";
        listLoading.value = true;
        console.log("propTotal", this.propTotal);
        resetQuery();
        propTotal.value.forEach((item) => {
            if (item.input && item.prop == "nodeNames") {
                query.nodeNames.push(item.input);
            } else if (item.input && item.prop == "years") {
                query.years.push(item.input);
            } else if (item.input && item.prop == "tags") {
                query.tags.push(item.input);
            } else if (item.input && item.prop == "columns") {
                query.columns.push(item.input);
            }
        });
        console.log("query", query);
        if (
            query.columns.length == 0 &&
            query.nodeNames.length == 0 &&
            query.tags.length == 0 &&
            query.years.length == 0
        ) {
            ElMessage({
                message: "输入不能为空！",
                type: "error",
                duration: 2000,
            });
        } else {
            advancedFind(query).then(
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
                            //文件行数>30行（排除第一行列名）
                            // this.datas[0].contents[31]=this.datas[0].contents[30]会同时变化
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
                                    // if(label in this.dtags){label是索引
                                    if (dtags.value.includes(label)) {
                                    } else {
                                        dtags.value.push(label);
                                    }
                                });
                            }
                        });
                        console.log("dtags", dtags.value);
                        listLoading.value = false;
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
                                // if(label in this.itags){label是索引
                                if (itags.value.includes(label)) {
                                    console.log(label);
                                } else {
                                    itags.value.push(label);
                                }
                            });
                        });
                        listLoading.value = false;
                    }
                }
            );
        }
    }
}
//标签页被点击时
function tabClick(tab) {
    console.log("tab", tab); //获取当前元素属性name
    query.fileType = tab.label;
    type.value = tab.label;
    resetTag();
    // this.go()
    // if (this.tabName == tabOne) {
    //     // 所需代码
    // } else if (this.tabName == tabTwo) {
    //     // 所需代码
    // }
}
//删除行
function deleteProp(index) {
    if (propTotal.value.length > 3) {
        console.log("index:", index);
        propTotal.value.splice(index, 1);
    }
}
//增加行
function addProp() {
    if (propTotal.value.length < 6) {
        propTotal.value.push({
            input: "",
            prop: "",
        });
    }
}
function back() {
    router.go(-1);
}
        // function handleData() {
        //     i.value = 1;
        // }
        // function handleImg() {
        //     i.value = 2;
        // }
</script>
<style >
#center .el-input__inner {
    height: 50px;
}

.box-card .el-card__body {
    padding: 0;
    border: none;
}

.box-card .el-card__body .el-tabs--border-card {
    border: none;
}
</style>
<style scoped>
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

.data_box {
    margin-bottom: 50px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    background-color: #fff;
}

.border {
    background-color: #eef1f6;
}

.demonstration {
    padding-right: 10px;
}

.box-card {
    margin-top: 20px;
    font-size: 18px;
    font-weight: 500;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
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
    font-weight: bolder;
}

.bold {
    font-weight: bolder;
}

.nav {
    font-size: 18px;
}

.head_img {
    width: 400px;
    height: 370px;
    margin: 50px auto;
    background-image: url("../../assets/images/search/brain.png");
    background-repeat: no-repeat;
    background-size: 400 370;
}

#box {
    width: 100%;
    height: 50px;
    display: flex;
    margin: 10px;
}

#left,
#right {
    width: 200px;
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

.main-bg {
    width: 100%;
    background-color: #29b7cb;
    color: white;
}

.w {
    padding: 10px 50px 30px;
}
</style>