<template>
    <el-container class="w main-bg" :style="{ height: mainheight + 'px' }">
        <el-header :height="headerHeight">
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
                        <el-input style="height:50px;margin-top:1px;" :placeholder="placeholder[i]" v-model="input"
                            prefix-icon="Search">
                        </el-input>
                    </div>
                    <div id="right">
                        <el-button icon="Search" style="height:50px;margin-left:10px" @click="go">搜索</el-button>
                        <el-button type="primary" style="height:50px;" @click="highSearch">高级搜索</el-button>
                    </div>
                </div>
            </div>
        </el-header>
        <el-container class="border" style="padding:0 50px">
            <div style="width:50%">
                <div style="margin-top:100px;padding:20px 50px;width:100%;height:60px;font-size:30px;text-align:left">
                    {{ arr[0].title }}</div>
                <div style="padding:20px 50px;width:100%;height:200px;line-height:50px; font-size:20px;text-align:left">
                    {{ arr[0].detail }}</div>
            </div>
            <el-container style="overflow:hidden">
                <div class="head_img"></div>
            </el-container>
        </el-container>
    </el-container>
</template>

<!-- <script>
import { simpleFind, advancedFind } from "@/api/search";
import { ElMessage } from 'element-plus';
export default {
    name: "search",
    components: {},
    data() {
        return {
            type: "data",
            i: 1,
            placeholder: [
                "海量资源，等你发现",
                "海量数据，等你发现",
                "海量图片，等你发现",
            ],
            input: "",
            headerHeight: "60",
            mainheight: window.innerHeight - 60,
            arr: [
                {
                    title: "",
                    detail:
                        "根据输入的查询条件，获取水稻、玉米、油菜和棉花等作物性状的表型图片和实验数据，进行可视化展示，包括普通搜索和高级搜索两种。",
                },
            ],
        };
    },
    methods: {
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

                this.$router.push(
                    `/searching/result/${this.type}/${this.input}`
                );
            }
        },
        handleAll() {
            this.i = 0;
            this.type = "";
        },
        handleData() {
            this.type = "data";
            this.i = 1;

        },
        handleImg() {
            this.type = "image";
            this.i = 2;

        },
    },
};
</script> -->

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const type = ref('data');
const i = ref(1);
const placeholder = [
    "海量资源，等你发现",
    "海量数据，等你发现",
    "海量图片，等你发现",
];
const input = ref('');
const headerHeight = ref('60');
const mainheight = ref(window.innerHeight - 60);
const router = useRouter();
const arr = ref([
    {
        title: "",
        detail:
            "根据输入的查询条件，获取水稻、玉米、油菜和棉花等作物性状的表型图片和实验数据，进行可视化展示，包括普通搜索和高级搜索两种。",
    },
]);

function highSearch() {
    router.push('/user/searching/highSearch');
}

function go() {
    if(input.value === '') {
        ElMessage.error('输入不能为空！');
    } else {
        router.push(`/searching/result/${type.value}/${input.value}`);
    }
}

function handleAll() {
    i.value = 0;
    type.value = '';
}

function handleData() {
    type.value = 'data';
    i.value = 1;
}

function handleImg() {
    type.value = 'image';
    i.value = 2;
}
</script>
<style >
#center .el-input__inner {
    height: 50px;
}
</style>
<style scoped>
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
    width: 400px;
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

.main-bg {
    width: 100%;
    height: 100%;
    background: url("../../assets/images/search/index_bg1.jpg");
    background-color: #29b7cb;
    color: white;
}

.w {
    padding: 0 50px;
}
</style>