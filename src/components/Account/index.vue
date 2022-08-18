<template>
    <el-dialog :title="hTitle" :before-close="handleClose" v-model="flag" draggable>
        <div class="info">
            <div class="info-img">
                <el-upload :auto-upload=false class="upload-demo" action="1" :show-file-list="false"
                    :file-list="temp.file" :on-change="handleAvatarChange">
                    <img v-if="temp.file" :src="temp.url" class="avatar" style="width:150px;height:150px">
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus/>
                    </el-icon>
                </el-upload>
            </div>
            <div class="info-form" style="right: 50px;position:absolute;">
                <el-form :rules="rules" ref="ruleForm" :model="temp" label-position="left" label-width="80px"
                    style="width:300px;" size="small">
                    <el-form-item :label="role" prop="userId">
                        <el-input v-model="temp.userId" placeholder="admin" disabled />
                    </el-form-item>
                    <el-form-item :label="uname" prop="userName">
                        <el-input v-model="temp.userName" placeholder="个人" />
                    </el-form-item>
                    <el-form-item :label="opassword" prop="oldpassword">
                        <el-input type="password" v-model="temp.oldpassword" placeholder="原密码" />
                    </el-form-item>
                    <el-form-item :label="newpassword" prop="newpassword">
                        <el-input type="password" v-model="temp.newpassword" placeholder="提示：不填写即为保持原密码" />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="newpassword2">
                        <el-input type="password" v-model="temp.newpassword2" placeholder="提示：不填写即为保持原密码" />
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer" align="center">
                <el-button size="small" @click="handleupdate" round>
                    保存
                </el-button>
                <el-button size="small" @click="handlecancel" round>
                    取消
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { updateaccount } from "@/api/account";
import { updateUserAccount } from "@/api/others";
import { login } from "@/api/user";
const emits = defineEmits(['handleisshow']);
const props = defineProps({
    isShow: {
        type: Boolean,
        default: false,
    },
    hTitle: {
        type: String,
        default: "个人信息",
    },
    role: {
        type: String,
        default: "用户名",
    },
    uname: {
        type: String,
        default: "姓名",
    },
    opassword: {
        type: String,
        default: "原密码",
    },
    newpassword: {
        type: String,
        default: "新密码",
    },
});
const { hTitle, role, uname, opassword, newpassword } = props
// 验证规则
const checkName = (rule, value, callback) => {
    if (!value) {
        return callback(new Error("姓名不能为空"));
    } else {
        callback();
    }
};
const validatePass = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入密码"));
    } else {
        if (value !== oldPassword.value) {
            callback(new Error("密码错误！"));
        } else {
            callback();
        }
    }
};
const validatePass1 = (rule, value, callback) => {
    if (value !== "") {
        if (value.length < 6) {
            callback(new Error("密码不能少于6个！"));
        } else {
            callback();
        }
    } else {
        callback();
    }
};
const validatePass2 = (rule, value, callback) => {
    // if (value === '') {
    //   callback(new Error('请再次输入密码'));
    // } else if (value !== this.temp.newpassword) {
    //   callback(new Error('两次输入密码不一致!'));
    // } else {
    //   callback();
    // }

    if (value !== "") {
        if (value.length < 6) {
            callback(new Error("密码不能少于6个！"));
        } else if (value !== temp.newpassword) {
            callback(new Error("两次输入密码不一致!"));
        } else {
            callback();
        }
    } else {
        callback();
    }
};

const flag = ref(false);
const imageUrl = ref("");
const rules = reactive({
    oldpassword: [{ validator: validatePass, trigger: "blur" }],
    newpassword: [{ validator: validatePass1, trigger: "blur" }],
    newpassword2: [{ validator: validatePass2, trigger: "blur" }],
    userName: [{ validator: checkName, trigger: "blur" }],
});
const oldPassword = ref("OldPassword");
const temp = reactive({
    url: "url",
    file: [],
    userId: "userId",
    username: "username",
    newpassword: "newpassword",
    newpassword2: "newpassword2",
});
// 表单dom元素
const ruleForm = ref(null);

inittemp();

function handleClose() {
    emits('handleisshow');
}
function inittemp() {

}
function resettemp() {
    temp.file = [];
    temp.userName = "";
    temp.userId = "";
    temp.oldpassword = "";
    temp.newpassword = "";
    temp.newpassword2 = "";
}

function handlecancel() {
    emits('handleisshow');
}

function handleupdate() {
    ruleForm.value.validate((valid) => {
        if (valid) {
            console.log(temp);
            if (temp.newpassword == "") {
                temp.newpassword = oldPassword.value;
                temp.newpassword2 = oldPassword.value;
            }
            console.log(temp);
            const createTeacherData = new FormData();
            createTeacherData.append(
                "newPassword",
                temp.newpassword
            );
            createTeacherData.append(
                "oldPassword",
                temp.oldpassword
            );
            createTeacherData.append("teacherId", temp.userId);
            createTeacherData.append("teacherName", temp.userName);
            if (temp.file.length) {
                createTeacherData.append("file", temp.file[0].raw);
            } else {
                console.log("nofile");
            }

            const createStudentData = new FormData();
            createStudentData.append(
                "newPassword",
                temp.newpassword
            );
            createStudentData.append(
                "oldPassword",
                temp.oldpassword
            );
            createStudentData.append("studentId", temp.userId);
            createStudentData.append("studentName", temp.userName);
            if (temp.file.length) {
                createStudentData.append("file", temp.file[0].raw);
            } else {
                console.log("nofile");
            }
            const createUserData = new FormData();
            createUserData.append("newPassword", temp.newpassword);
            createUserData.append("oldPassword", temp.oldpassword);
            createUserData.append("userId", temp.userId);
            createUserData.append("userName", temp.userName);
            if (temp.file.length) {
                createUserData.append("file", temp.file[0].raw);
            } else {
                console.log("nofile");
            }

            console.log(roles === "student");
            let fd;
            if (roles === "student") {
                fd = createStudentData;
                updateaccount(fd).then(() => {
                    oldPassword.value = temp.newpassword;
                    // this.$store.commit("user/SET_ID", this.temp.userId);
                    // this.$store.commit(
                    //     "user/SET_NAME",
                    //     this.temp.userName
                    // );
                    // this.$store.commit(
                    //     "user/SET_PASSWORD",
                    //     this.temp.newpassword2
                    // );
                    login({
                        username: this.temp.userId.trim(),
                        password: this.temp.newpassword2,
                    }).then((res) => {
                        console.log(res);
                        const { url } = res.data;
                        // this.$store.commit("user/SET_AVATAR", url);
                        // localStorage.setItem('url', url);//修改本地存储图片

                        emits("handleisshow");
                        if (
                            oldPassword.value !== temp.newpassword
                        ) {
                            // this.$alert("", {
                            //     title: "",
                            //     message: "修改成功!请重修登录",
                            //     type: "success",
                            //     duration: 2000,
                            // });
                            logout();
                            // console.log('logout');
                        } else {
                            // this.$alert("", {
                            //     title: "",
                            //     message: "修改成功",
                            //     type: "success",
                            //     duration: 2000,
                            // });
                            resettemp();
                            inittemp();
                            console.log("after resettemp:");
                            console.log(temp);
                        }
                    });

                    // this.resettemp()//？
                });
            } else if (roles === "teacher" || roles === 'admin') {
                fd = createTeacherData;
                updateaccount(fd).then(() => {
                    oldPassword.value = temp.newpassword;
                    // this.$store.commit("user/SET_ID", this.temp.userId);
                    // this.$store.commit(
                    //     "user/SET_NAME",
                    //     this.temp.userName
                    // );
                    // this.$store.commit(
                    //     "user/SET_PASSWORD",
                    //     this.temp.newpassword2
                    // );
                    login({
                        username: this.temp.userId.trim(),
                        password: this.temp.newpassword2,
                    }).then((res) => {
                        console.log(res);
                        const { url } = res.data;
                        // this.$store.commit("user/SET_AVATAR", url);
                        localStorage.setItem('url', url);//修改本地存储图片

                        emits("handleisshow");
                        if (
                            oldPassword.value !== temp.newpassword
                        ) {
                            // this.$alert("", {
                            //     title: "",
                            //     message: "修改成功!请重修登录",
                            //     type: "success",
                            //     duration: 2000,
                            // });
                            logout();
                            // console.log('logout');
                        } else {
                            // this.$alert("", {
                            //     title: "",
                            //     message: "修改成功",
                            //     type: "success",
                            //     duration: 2000,
                            // });
                            resettemp();
                            inittemp();
                            console.log("after resettemp:");
                            console.log(temp);
                        }
                    });

                    // this.resettemp()//？
                });
            } else {
                fd = createUserData;
                updateUserAccount(fd).then(() => {
                    oldPassword.value = temp.newpassword;
                    // this.$store.commit("user/SET_ID", this.temp.userId);
                    // this.$store.commit(
                    //     "user/SET_NAME",
                    //     this.temp.userName
                    // );
                    // this.$store.commit(
                    //     "user/SET_PASSWORD",
                    //     this.temp.newpassword2
                    // );
                    login({
                        username: temp.userId.trim(),
                        password: temp.newpassword2,
                    }).then((res) => {
                        console.log(res);
                        const { url } = res.data;
                        // this.$store.commit("user/SET_AVATAR", url);
                        localStorage.setItem('url', url);//修改本地存储图片

                        emits("handleisshow");
                        if (
                            oldPassword.value !== temp.newpassword
                        ) {
                            // this.$alert("", {
                            //     title: "",
                            //     message: "修改成功!请重修登录",
                            //     type: "success",
                            //     duration: 2000,
                            // });
                            logout();
                            // console.log('logout');
                        } else {
                            // this.$alert("", {
                            //     title: "",
                            //     message: "修改成功",
                            //     type: "success",
                            //     duration: 2000,
                            // });
                            resettemp();
                            inittemp();
                            console.log("after resettemp:");
                            console.log(temp);
                        }
                    });
                });
            }
        }
    });
}
function handleAvatarChange(file, fileList) {
    temp.file = fileList;
    temp.url = URL.createObjectURL(file.raw);
    console.log(temp);
}
async function logout() {
    router.push("/login");
}

watch(() => props.isShow, (val) => {
    flag.value = val
})
</script>
<style >
:deep(.el-dialog .el-dialog__header) {
    background-color: #1890ff;
}

:deep(.el-dialog__title) {
    color: #fff;
}

:deep(.el-dialog__body) {
    text-align: center;
}
</style>
<style scoped>
.info {
    width: 100%;
    height: 200px;
    position: relative;
}

.info-img {
    position: absolute;
    /* width:100px;
   height:100px;
   border:1px solid #bbb;
   border-radius:10px; */
}

.info-form {
    right: 50px;
    position: absolute;
}
</style>