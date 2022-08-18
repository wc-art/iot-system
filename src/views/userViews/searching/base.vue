<template>
    <Account :isShow="isaccount" @handleisshow="handleisshow" />
    <el-container>
        <el-header class="header">
            <div class="banner" @click="home">智慧农业搜索平台</div>
            <div class="user-info">
                <!-- <i class="el-icon-place" style="font-size: 25px" />
                    &nbsp;
                    <span>实验教学</span>
                    | -->
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <span>{{ name }}</span>
                        &nbsp;
                        <div style="
                  display: inline-block;
                  float: right;
                  height: 20px;
                  width: 20px;
                  margin-top: 5px;
                  margin-left: 15px;
                ">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                                size="small" />
                            <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                        </div>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item icon="User" command="info">个人信息</el-dropdown-item>
                            <el-dropdown-item icon="Back" command="index" divided>返回首页
                            </el-dropdown-item>
                            <el-dropdown-item command="logout" icon="DArrowLeft" divided>退出
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-header>
        <el-container style="width:100%">
            <router-view />
        </el-container>
    </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Account from "@/components/Account";
const mainheight = window.innerHeight - 60;
const name = ref("111");
const isaccount = ref(false);
const router = useRouter();

// 回到首页
function home() {
    router.push("/index");
}

// 点击账号
async function handleCommand(command) {
    if (command === "logout") {
        // this.$message({
        //     message: "跳转到登录页面！",
        //     type: "success",
        // });
        // await this.$store.dispatch("user/logout");
        router.push("/login");
    } else if (command == "index") {
        // this.$message({
        //     message: "跳转到首页！",
        //     type: "success",
        // });
        router.push("/index");
    } else if (command == "info") {
        console.log("info");
        handleAccount();
    }
}

function handleisshow() {
    isaccount.value = !isaccount.value;
}

function handleAccount() {
    console.log("账号");
    isaccount.value = true;
}
</script>
<style scoped>
.header {
    background: #1989fa;
    height: 60px;
    width: 100%;
}

.banner {
    float: left;
    width: 400px;
    font-size: 32px;
    font-weight: bold;
    font-family: 黑体;
    color: white;
    height: 60px;
    line-height: 60px;
}

.user-info {
    float: right;
    position: static;
    width: 100px;
    height: 60px;
    line-height: 60px;
    color: white;
}

.el-dropdown-link {
    width: 100px;
    height: 60px;
    color: white;
    cursor: pointer;
}

.el-dropdown-link:hover {
    color: #e97f35;
    font-weight: bold;
}

.nav-icon {
    width: 18px;
    height: 18px;
    margin: 0 5px 0 0;
    display: inline-block;
}
</style>
