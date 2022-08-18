<template>
  <div class="screen-bg" :style="{ height: screenHeight, minWidth: '1200px' }">
    <!-- 智慧社区页面 -->
    <div class="container-flex" tabindex="0" hidefocus="true">
      <div class="box-left">
        <div class="left-top">
          <div class="current-num">
            <div>当前总数据</div>
            <p>{{ total }}</p>
          </div>
        </div>
        <div class="left-center">
          <div class="title-box">
            <h6>人员分析</h6>
          </div>
          <div class="chart-box pie-chart">
            <div id="pie_fanzui" ref="pie_fanzui" style="width: 100%"></div>
          </div>
        </div>
        <!-- 人员录入记录 -->
        <div class="left-bottom select">
          <div class="title-box">
            <h6>人员录入记录</h6>
          </div>
          <div class="chart-box">
            <table class="table3">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>年龄</th>
                  <th>与户主关系</th>
                  <th>录入时间</th>
                </tr>
              </thead>
              <tbody id="tList">
                <tr v-for="(item, index) in vaccineList" :key="index">
                  <td>{{ item.personName }}</td>
                  <td>{{ item.age }}</td>
                  <td>{{ item.relation }}</td>
                  <td>{{ item.createTime.split(" ")[0] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="box-center">
        <div class="center-top">
          <h1>智慧社区</h1>
        </div>
        <div class="center-center">
          <img :src="lineBg" />
          <div class="weather-box">
            <div class="data">
              <p class="time" id="time">{{ hours }}:{{ minute }}:{{ second }}</p>
              <p id="date">
                {{ year }}年{{ month }}月{{ data }}日 {{ ampm }} 周{{ day }}
              </p>
            </div>
            <div class="weather">
              <iframe allowtransparency="true" frameborder="0" width="195" height="96" scrolling="no"
                src="//tianqi.2345.com/plugin/widget/index.htm?s=2&z=1&t=0&v=0&d=1&bd=0&k=000000&f=ffffff&ltf=009944&htf=cc0000&q=1&e=0&a=1&c=71842&w=195&h=96&align=center"></iframe>
            </div>
          </div>
          <img :src="lineBg" />
        </div>
        <div class="center-bottom">
          <div class="chart-box">
            <div id="china_map" style="width: 100%; height: 95%">
              <el-row>
                <el-col>
                  <div style="position: relative; height: 450px">
                    <div id="container" style="height: 100%; position: absolute; width: 100%"></div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      <div class="box-right">
        <div class="right-top">
          <div class="title-box">
            <h6 id="barTitle">人员年龄分布</h6>
          </div>
          <p class="unit">单位：岁</p>
          <div class="chart-box">
            <div id="pie_age" ref="pie_age" style="width: 100%; height: 100%"></div>
          </div>
        </div>
        <div class="right-center" v-if="userUnit.unitType != 3">
          <div class="title-box">
            <h6>分区域人员分布</h6>
          </div>
          <div class="chart-box pie-chart">
            <div id="qufenbu_data" ref="qufenbu_data" style="width: 90%;"></div>
          </div>
        </div>

        <div class="right-bottom">
          <div class="title-box">
            <p id="switchBtn">
              <span class="active" data-dataType="income">人员录入情况统计</span>
            </p>
          </div>
          <div id="line_time" ref="line_time" style="width: 90%; height: 160px; margin-left: 10px"></div>
        </div>
      </div>
    </div>
    <el-row style="text-align:center;" class="indexRoute">
      <el-col :span="4" v-if="role == 'admin' || indexRoute.includes('表型图片')">
        <div class="img-small" @click="handleImage">
          <el-image :src="screen1Title" fit="fill" />
          <el-image :src="screen1" fit="fill" />
          <div class="screen-name">表型图片</div>
        </div>
      </el-col>
      <el-col :span="4" v-if="role == 'admin' || indexRoute.includes('表型数据')">
        <div class="img-small" @click="handleData">
          <el-image :src="screen2Title" fit="fill" />
          <el-image :src="screen2" fit="fill" />
          <div class="screen-name">表型数据</div>
        </div>
      </el-col>
      <el-col :span="4" v-if="role == 'admin' || indexRoute.includes('大数据中心')">
        <div class="img-small" @click="handleSearch">
          <el-image :src="screen3Title" fit="fill" />
          <el-image :src="screen3" fit="fill" />
          <div class="screen-name">大数据中心</div>
        </div>
      </el-col>
      <el-col :span="4" v-if="role == 'admin' || indexRoute.includes('田间作业')">
        <div class="img-small" @click="handleOperation">
          <el-image :src="screen4Title" fit="fill" />
          <el-image :src="screen4" fit="fill" />
          <div class="screen-name">田间作业</div>
        </div>
      </el-col>
      <el-col :span="4" v-if="role == 'admin' || indexRoute.includes('实时地图')">
        <div class="img-small" @click="handleSearch">
          <el-image :src="screen5Title" fit="fill" />
          <el-image :src="screen5" fit="fill" />
          <div class="screen-name">实时地图</div>
        </div>
      </el-col>
      <el-col :span="4" v-if="role == 'admin' || indexRoute.includes('数据下载')">
        <div class="img-small" @click="handleSearch">
          <el-image :src="screen5Title" fit="fill" />
          <el-image :src="screen5" fit="fill" />
          <div class="screen-name">数据下载</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="img-small" @click="handleAccount">
          <el-image :src="screen1Title" fit="fill" />
          <el-image style="width:84px;height:84px;" :src="screen8" fit="fill" />
          <div class="screen-name">账号</div>
        </div>
      </el-col>
      <el-col :span="4" v-if="role == 'admin' || indexRoute.includes('后台管理')">
        <div class="img-small" @click="handleBigData">
          <el-image :src="screen6Title" fit="fill" />
          <el-image :src="screen6" fit="fill" />
          <div class="screen-name">系统管理</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import screen1 from "@/assets/images/screen/1.png";
import screen2 from "@/assets/images/screen/2.png";
import screen3 from "@/assets/images/screen/3.png";
import screen4 from "@/assets/images/screen/4.png";
import screen5 from "@/assets/images/screen/5.png";
import screen6 from "@/assets/images/screen/6.png";
import screen8 from "@/assets/images/screen/8.1.png";
import lineBg from "@/assets/images/line_bg.png";

import screen1Title from "@/assets/images/screen/1-title.png";
import screen2Title from "@/assets/images/screen/2-title.png";
import screen3Title from "@/assets/images/screen/3-title.png";
import screen4Title from "@/assets/images/screen/4-title.png";
import screen5Title from "@/assets/images/screen/5-title.png";
import screen6Title from "@/assets/images/screen/6-title.png";
import { getCurrentInstance, ref, shallowRef, onUnmounted, onMounted, reactive } from 'vue';
import { useRouter } from "vue-router";

// 引入echarts
import * as echarts from "echarts";
// 引入高德地图
import AMapLoader from '@amap/amap-jsapi-loader';

console.log('line', lineBg);
console.log('screen1', screen1);
function fnW(str) {
  let num;
  str >= 10 ? (num = str) : (num = "0" + str);
  return num;
}

const { proxy: { $modal } } = getCurrentInstance();
const indexRoute = ref(['田间作业', '数据服务', '农业信息化获取', '教学实践', '后台管理', '大数据中心']);
const isaccount = ref(false);
const role = ref("admin");
const screenHeight = ref("1150px");
const router = useRouter();
const userUnit = reactive({
  unitType: 1
});
const map = shallowRef(null);
const curMark = ref(null);
const vaccineList = ref([
  {
    createBy: "admin",
    createTime: "2021-12-05 14:29:55",
    vaccineId: 124668,
    houseId: 3723,
    houseMasterName: "张三",
    relation: "本人",
    personName: "张三",
    sex: 1,
    age: 39,
  },
  {
    createBy: "admin",
    createTime: "2021-12-08 22:06:42",
    vaccineId: 244760,
    houseId: 3723,
    houseMasterName: "张三",
    relation: "女儿",
    personName: "张飒",
    sex: 0,
    age: 13,
  },
  {
    createBy: "admin",
    createTime: "2021-12-08 23:37:27",
    vaccineId: 244762,
    houseId: 3723,
    houseMasterName: "张三",
    relation: "儿子",
    personName: "张文",
    sex: 1,
    age: 8,
  },
  {
    createBy: "admin",
    createTime: "2021-12-05 14:29:55",
    vaccineId: 124669,
    houseId: 3723,
    houseMasterName: "张三",
    relation: "父亲",
    personName: "张工",
    sex: 1,
    age: 68,
  },
  {
    createBy: "admin",
    createTime: "2021-12-05 14:29:55",
    vaccineId: 124669,
    houseId: 3723,
    houseMasterName: "张三",
    relation: "父亲",
    personName: "张工",
    sex: 1,
    age: 68,
  },
  {
    createBy: "admin",
    createTime: "2021-12-05 14:29:55",
    vaccineId: 124669,
    houseId: 3723,
    houseMasterName: "张三",
    relation: "父亲",
    personName: "张工",
    sex: 1,
    age: 68,
  },
  {
    createBy: "admin",
    createTime: "2021-12-05 14:29:55",
    vaccineId: 124669,
    houseId: 3723,
    houseMasterName: "张三",
    relation: "父亲",
    personName: "张工",
    sex: 1,
    age: 68,
  },
]);
const opinionData1 = ref([
  {
    name: "0-5",
    value: 10,
  },
  {
    name: "5-10",
    value: 10,
  },
  {
    name: "10-20",
    value: 10,
  },
  {
    name: "20-30",
    value: 10,
  },
  {
    name: "30-40",
    value: 10,
  },
  {
    name: "40-50",
    value: 10,
  },
  {
    name: "50-60",
    value: 10,
  },
  {
    name: "60-70",
    value: 10,
  },
  {
    name: "70-80",
    value: 10,
  },
  {
    name: "80-90",
    value: 10,
  },
  {
    name: "90+",
    value: 10,
  },
]);
const opinionData2 = ref([]);
const opinionData3 = ref([]);
const opinionData4 = ref([]);
const opinionData5 = ref([]);
const total = ref(121345); // 总人数
const year = ref(0);
const month = ref(0);
const data = ref(0);
const hours = ref(0);
const minute = ref(0);
const second = ref(0);
const day = ref(0);
const ampm = ref(0);

// dom元素ref
const pie_age = ref(null);
const pie_fanzui = ref(null);
const line_time = ref(null);
const qufenbu_data = ref(null);

// 时间更新计时器
const timer = ref(null);

//初始化首页
function getList() {
  //获取当前时间
  let keyArray = [
    "0-5",
    "5-10",
    "10-20",
    "20-30",
    "30-40",
    "40-50",
    "50-60",
    "60-70",
    "70-80",
    "80-90",
    "90+",
  ];
  let valueArray = [100, 45, 433, 100, 200, 300, 155, 211, 102, 501, 300];
  opinionData1.value = [];
  valueArray.forEach((item, i) => {
    opinionData1.value.push({
      name: keyArray[i],
      value: item,
    });
  });
  let a = {
    暂住: 100,
    空住户: 200,
    常住: 300,
    外出: 400,
  };
  opinionData4.value = [];
  opinionData5.value = [];
  for (let key in a) {
    opinionData4.value.push(key);
    opinionData5.value.push({
      name: key,
      value: a[key],
    });
  }
  let x = {
    车站路社区: 9418,
    北正街社区: 7604,
    永安街道办事处: 2,
    西大街社区: 4305,
    三元社区: 13343,
    南山: 980,
    双龙社区: 6177,
    文笔路社区: 7710,
    凤凰社区: 12102,
    阳光社区: 15587,
    车站路: 674,
    环城社区: 2879,
    南山社区: 429,
    西河社区: 5113,
    南山社区: 14844,
    西街社区: 513,
    常住: 1,
    同心路社区: 4196,
  };
  opinionData2.value = [];
  opinionData3.value = [];
  for (let key in x) {
    opinionData2.value.push(key);
    opinionData3.value.push(x[key]);
  }
  initData();
}
//初始化数据
function initData() {
  let myChart = echarts.init(pie_age.value);
  // 绘制图表
  myChart.setOption({
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      x: "left",
      data: [
        "0-5",
        "5-10",
        "10-20",
        "20-30",
        "30-40",
        "40-50",
        "50-60",
        "60-70",
        "70-80",
        "80-90",
        "90+",
      ],
      textStyle: { color: "#fff" },
    },
    series: [
      {
        name: "人员年龄分布",
        type: "pie",
        radius: ["30%", "55%"],
        center: ["60%", "50%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "20",
            fontWeight: "bold",
          }
        },
        labelLine: {
          show: false,
        },
        data: opinionData1.value,
      },
    ],
  });
  //人员分析占比，带边框效果的饼图
  //let pie_fanzui =echarts.init(document.getElementById("pie_fanzui"),'macarons');
  let pieFanzui = echarts.init(
    pie_fanzui.value,
    "infographic"
  );
  let option = {
    title: {
      x: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: opinionData4.value,
      textStyle: { color: "#fff" },
    },

    // label: {
    //   color: "blue", // 改变标示文字的颜色
    // },
    series: [
      {
        name: "人员分析",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: opinionData5.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        }
      },
    ],
  };
  pieFanzui.setOption(option);
  //----------------------人员分析占比end---------------
  //===================人员录入情况统计=======================
  //let line_time =echarts.init(document.getElementById("line_time"),'shine');
  let lineTime = echarts.init(
    // document.getElementById("line_time"),
    line_time.value,
    "macarons"
  );
  //let line_time =echarts.init(document.getElementById("line_time"),'infographic');
  option = {
    // 给echarts图设置背景色
    //backgroundColor: '#FBFBFB',  // -----------> // 给echarts图设置背景色
    color: ["#7FFF00"],
    tooltip: {
      trigger: "axis",
    },

    grid: {
      x: 40,
      y: 30,
      x2: 5,
      y2: 20,
    },
    calculable: true,

    xAxis: [
      {
        type: "category",
        data: [
          "2021-12-06",
          "2021-12-07",
          "2021-12-08",
          "2021-12-09",
          "2021-12-10",
        ],
        axisLabel: {
          color: "#7FFF00", //刻度线标签颜色
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: "#7FFF00", //刻度线标签颜色
        },
      },
    ],
    series: [
      {
        name: "人次",
        type: "line",
        data: [800, 300, 500, 800, 300, 600],
      },
    ],
  };
  lineTime.setOption(option);
  if (userUnit.unitType == 3) return;
  //=========分区域人员分布开始=======================
  //let qufenbu_data =echarts.init(document.getElementById("qufenbu_data"),'shine');
  //let qufenbu_data =echarts.init(document.getElementById("qufenbu_data"),'macarons');
  let qufenbuData = echarts.init(
    // document.getElementById("qufenbu_data"),
    qufenbu_data.value,
    "infographic"
  );
  option = {
    color: ["#FADB71"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      x: 45,
      y: 20,
      x2: 15,
      y2: 20,
    },
    xAxis: [
      {
        type: "category",
        data: opinionData2.value,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          color: "#FADB71", //刻度线标签颜色
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: "#FADB71", //刻度线标签颜色
        },
      },
    ],
    series: [
      {
        name: "地区分布",
        type: "bar",
        barWidth: "80%",
        data: opinionData3.value,
      },
    ],
  };
  qufenbuData.setOption(option);
  //=========分区域人员分布结束=======================
}

onMounted(() => {
  timer.value = setInterval(() => {
    let date = new Date();
    year.value = date.getFullYear(); //当前年份
    month.value = date.getMonth(); //当前月份
    data.value = date.getDate(); //天
    hours.value = date.getHours(); //小时
    minute.value = date.getMinutes(); //分
    second.value = date.getSeconds(); //秒

    let weekday = ['日', '一', '二', '三', '四', '五', '六'];
    day.value = weekday[date.getDay()];

    ampm.value = hours < 12 ? "AM" : "PM";
  }, 1000);
  initMap();
  getList();
});

// 初始化地图
function initMap() {
  AMapLoader.load({
    key: "6d9a3b72bb4091566c4706419baa1808",             // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Geolocation', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.ToolBar', 'AMap.PolyEditor', 'AMap.InfoWindow'],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then((AMap) => {
    map.value = new AMap.Map("container", {  //设置地图容器id
      viewMode: "3D",    //是否为3D地图模式
      zoom: 5,           //初始化地图级别
      center: [105.602725, 37.076636], //初始化地图中心点位置
    });
  }).catch(e => {
    console.log(e);
  });
}

function loadClickMap() {
  //这里使用的是匿名函数，Vue中匿名函数的this指向window而不是Vue实例。改成箭头函数后就不用写vm了
  map.value.on("click", function (e) {
    curMark.value && map.value.remove(curMark.value);

    curMark.value = new AMap.Marker({
      map: map.value,
      icon: require("@/assets/location.png"),
      position: [e.lnglat.getLng(), e.lnglat.getLat()],
      offset: new AMap.Pixel(-13, -30),
      label: {
        content: "<div class='infos'>是否添加该点？</div>",
        direction: "top", // 文本标注方位 可选值：'top'|'right'|'bottom'|'left'|'center'，默认值:'right'
      },
    });
  });
}

function addMarker() {
  if (curMark.value) {
    const { lng, lat } = curMark.value.w.position;
    const marker = new AMap.Marker({
      position: [lng, lat],
      // offset: new AMap.Pixel(-13, -30),
    });
    map.value.add(marker);
    map.value.remove(this.curMark);
    curMark.value = null;
  } else {
    $modal.msgError("请先选择一个点");
  }
}

function rem() {
  let html = document.documentElement;
  html.style.fontSize = 90 * (html.clientWidth / 1920) + "px";
  // 监听 window 的 resize 事件．在浏览器窗口变化时再设置下区域高度．
  window.onresize = () => {
    let html = document.documentElement;
    html.style.fontSize = 90 * (html.clientWidth / 1920) + "px";
  };
}

function handleImage() {
  router.push("/user/image");
}

function handleBigData() {
  router.push("/user/bigDataCenter");
}

function handleAccount() {
  isaccount.value = true;
}
function handleSearch() {
  console.log(1);
  router.push("/user/searching/index");
}
function handleData() {
  router.push("/user/data");
}
function handleSetting() {
  console.log(111);
  router.push("/setting/index");
}
function handleNetOfThing() {
  router.push("/operation");
}
function handleOperation() {
  router.push("/fieldoperate/smartcar");
}

onUnmounted(() => {
  clearInterval(timer);
});
</script>
<style scoped>
.indexRoute .el-col:nth-child(n + 7)>div {
  margin-top: 20px;
}

.indexRoute {
  background-color: rgb(43, 43, 57);
}

.screen-bg {
  width: 100%;
  /* width: 1920px;
    height: 768px; */
  background: url("@/assets/images/screen-bg.png");
  color: white;
}

.img-small {
  background: rgba(255, 255, 255, 0.1);
  height: 170px;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  transition: all 0.5s;
}

.img-small:hover {
  transform: scale(1.1);
}

.screen-name {
  margin-top: 20px;
  color: #6ff7f4;
}
</style>

<style scoped>
html,
body {
  width: 100%;
  height: 100%;
}

/** 初始化 **/
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
input,
button,
textarea,
p,
blockquote,
th,
td,
form,
pre {
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  color: #333;
}

div {
  -webkit-font-feature-settings: "kern" 1;
  -moz-font-feature-settings: "kern" 1;
  font-feature-settings: "kern" 1;
  text-rendering: geometricPrecision;
  font-family: "Microsoft YaHei";
}

a:active,
a:hover {
  outline: 0;
}

img {
  display: inline-block;
  border: none;
  vertical-align: middle;
}

li {
  list-style: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

h1,
h2,
h3 {
  font-size: 14px;
  font-weight: 400;
}

h4,
h5,
h6 {
  font-size: 100%;
  font-weight: 400;
}

button,
input,
select,
textarea {
  font-size: 100%;
}

input,
button,
textarea,
select,
optgroup,
option {
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  outline: 0;
}

pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}

/** 滚动条 **/

::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

::-webkit-scrollbar-button:vertical {
  display: none;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background-color: rgba(14, 148, 234, 0.2);
}

::-webkit-scrollbar-thumb {
  border-radius: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb:vertical:hover {
  background-color: rgba(0, 0, 0, 0.35);
}

::-webkit-scrollbar-thumb:vertical:active {
  background-color: rgba(0, 0, 0, 0.38);
}

/*下拉框*/

.select {
  width: 147px;
  height: 56px;
  position: relative;
  font-size: 12.6px;
  color: #cdddf7;
  outline: none;
}

.chart-box {
  position: absolute;
  top: 29.4px;
  bottom: 0;
  width: 90%;
  margin: auto;
  left: 0;
  right: 0;
  height: auto;
}

.container-flex {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: left top no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  outline: none;
  background-color: #1e1f2d;
}

.box-left {
  width: 30%;
  height: 100%;
  background: url(@/views/userViews/index/images/line_img.png) top right repeat-y;
}

.left-top {
  width: 100%;
  height: 20.4%;
  position: relative;
}

.left-top>.current-num {
  width: 343px;
  height: 126px;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: url(@/views/userViews/index/images/border_bg01.png) top left no-repeat;
  background-size: 100% 100%;
}

.current-num>div {
  width: 100%;
  height: 56px;
  line-height: 56px;
  text-align: center;
  background: url(@/views/userViews/index/images/title_bg01.png) center center no-repeat;
  font-size: 14px;
  color: #0e94ea;
  background-size: 126px 17.5px;
  font-weight: 900;
}

.current-num>p {
  font-size: 32.2px;
  text-align: center;
  color: white;
}

.left-center {
  width: 100%;
  height: 37%;
  position: relative;
}

.pie-chart>div {
  float: left;
  width: 50%;
  height: 100%;
  position: relative;
}

.left-bottom {
  width: 100%;
  height: 42.6%;
  position: relative;
}

.box-center {
  width: 40%;
  height: 100%;
  /*    background: green;*/
}

.center-top {
  width: 100%;
  height: 8.8%;
  position: relative;
  top: 0;
  left: 0;
  background: url(@/views/userViews/index/images/title_border.png) bottom center no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.center-top>h1 {
  color: #cdddf7;
  font-size: 24.5px;
  font-weight: 900;
  letter-spacing: 5px;
}

.center-center {
  width: 100%;
  height: 15.3%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.weather-box {
  width: 427px;
  height: 77px;
  border: 1px solid #0e94ea;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
}

.weather-box>.data {
  /* width: 2.19*70px; */
  height: 45.5px;
  /* border-right: 2px solid #cdddf7; */
}

.data>p {
  font-size: 11.2px;
  margin: 0 5px;
  color: #cdddf7;
  text-align: center;
  margin: 0;
}

.data>p>span {
  margin: 0 5px;
}

.data>p.time {
  font-size: 29.4px;
  height: 29.4px;
  line-height: 29.4px;
}

.weather-box>.weather {
  width: 126px;
  height: 45.5px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  margin-left: 10px;
}

.weather>img {
  height: 100%;
}

.weather>div {
  width: 56px;
  height: 100%;
}

.weather>div>p {
  font-size: 8.4px;
  color: #cdddf7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 16.8px;
  line-height: 16.8px;
}

.weather>div>p.active {
  color: white;
  font-size: 11.2px;
}

.select-box>ul>li.active,
.select-pop>ul>li.active {
  background: #0e94eb;
  color: white;
}

.center-center>img {
  width: 9.1px;
  height: 77px;
  margin: 0 14px;
}

.center-bottom {
  width: 100%;
  height: 75.9%;
  position: relative;
}

.center-bottom>.city-data {
  width: 563.5px;
  height: 100%;
  margin: auto;
  position: absolute;
}

.city-btn>li.active,
.city-btn>li:hover,
.city-div>li.active,
.city-div>li:hover {
  background: #0e94ea;
}

.box-right {
  width: 30%;
  height: 100%;
  background: url(@/views/userViews/index/images/line_img.png) top left repeat-y;
}

.right-top {
  width: 100%;
  height: 41%;
  box-sizing: border-box;
  padding-top: 14px;
  position: relative;
}

.right-top>.data-box,
.right-top>.chart-box {
  top: 70px;
}


.right-center {
  width: 100%;
  height: 29%;
  position: relative;
}

.right-bottom {
  width: 100%;
  height: 30%;
  position: relative;
}

.title-box {
  width: 90%;
  height: 29.4px;
  background: url(@/views/userViews/index/images/box_title.png) top left no-repeat;
  background-size: 100% 100%;
  margin: auto;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
}

.title-box>h6,
.title-box>p {
  font-size: 14px;
  color: white;
  height: 29.4px;
  line-height: 29.4px;
  margin-left: 28px;
}

.title-box>p>span {
  /* cursor: pointer; */
  color: rgba(255, 255, 255, 0.6);
}

.title-box>p>span.active {
  color: rgba(255, 255, 255, 1);
}

.title-box>.line-img {
  position: absolute;
  right: 91px;
}

.title-box>button {
  font-size: 12.6px;
  border: none;
  background: transparent;
  color: #cdddf7;
  height: 29.4px;
  position: absolute;
  right: 42px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  cursor: pointer;
}

.title-box>button:hover {
  color: white;
}

.title-box>button>img {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}

.unit {
  font-size: 11.2px;
  height: 28px;
  color: #cdddf7;
  text-align: right;
  padding-right: 21px;
  line-height: 28px;
}

.pop-up .pie-chart {
  width: 76%;
  height: 80%;
}

.table3 {
  font-size: 11.2px;
  border: 1px solid #0e94ea;
  border-top: none;
  margin: 10px auto;
}

.table3 tr {
  border-top: 1px solid #0e94ea;
  background: rgba(14, 148, 234, 0.1);
}

.table3 thead tr {
  background: rgba(14, 148, 234, 0.4);
}

.table3 tr.bg-color {
  background: rgba(14, 148, 234, 0.2);
}

.table3 tr td:nth-child(2n + 1),
.table3 tr td:nth-child(2n + 1)>p {
  width: 210px;
}

.table3 tr td:nth-child(2n),
.table3 tr td:nth-child(2n)>p {
  width: 126px;
}

.table3 tr td,
.table3 tr th {
  border-right: 1px solid #0e94ea;
  height: 28px;
  line-height: 28px;
  color: #cdddf7;
  text-align: center;
}

.table3 tr td p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #cdddf7;
}

.table3 thead tr th {
  border-right: none;
}

@media screen and (max-height: 670px) {
  .right-top {
    height: 47%;
  }

  .right-center {
    height: 23%;
  }

  .data-box>.settings-box {
    height: 140px;
  }
}


.table3 tr td p.edit {
  color: #0e94eb;
  cursor: pointer;
}

.table3 tr td p.edit:hover,
.table3 tr td p.edit.active {
  color: #d09d26;
}


@media screen and (max-height: 610px) {
  .right-top {
    height: 49%;
  }

  .right-center {
    height: 21%;
  }
}

.screen-bg {
  width: 100%;
  /* width: 1920px;
    height: 768px; */
  background: url("@/assets/images/screen-bg.png");
  color: white;
}

.img-small {
  background: rgba(255, 255, 255, 0.1);
  height: 170px;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
}

.screen-name {
  margin-top: 20px;
  color: #6ff7f4;
}
</style>