<script setup>
import { ref, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { updatePwdApi } from "@/api/emp";

const router = useRouter();
const userName = ref("");
//表单配置
const dialogFormVisible = ref(false);

//修改密码表单规则
const pwdChangeRef = ref();

//// 添加密码强度验证函数
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error("密码为必填项"));
  } else if (value.length < 6) {
    callback(new Error("密码长度不能少于6位"));
  } else if (!/[a-zA-Z]/.test(value)) {
    callback(new Error("密码至少包含一个英文字符"));
  } else {
    callback();
  }
};

const pwdRules = ref({
  oldPwd: [
    { required: true, message: "旧密码为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && value.length < 6) {
          callback(new Error("密码长度不能少于6位"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  newPwd: [
    { required: true, message: "新密码为必填项", trigger: "blur" },
    { validator: validatePassword, trigger: "blur" },
  ],
  newPwdValid: [
    { required: true, message: "新密码为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== changePwdForm.value.newPwd) {
          callback(new Error("两次输入的新密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
    { validator: validatePassword, trigger: "blur" },
  ],
});

const changePwdForm = ref({
  id: "",
  oldPwd: "",
  newPwd: "",
  newPwdValid: "",
});

//重置修改密码表单
const resetForm = () => {
  changePwdForm.value = { id: "", oldPwd: "", newPwd: "", newPwdValid: "" };
  pwdChangeRef.value.resetFields();
};
//退出登录
const logout = () => {
  ElMessageBox.confirm("是否退出登录？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    localStorage.removeItem("loginUser");
    ElMessage.success("退出登录成功");
    router.push("/login");
  });
};

//修改密码
const handleChangePwd = () => {
  dialogFormVisible.value = true;
};

//保存密码
const save = async () => {
  pwdChangeRef.value.validate(async (valid) => {
    if (valid) {
      let loginUser = JSON.parse(localStorage.getItem("loginUser"));
      let pwdChange = {
        id: loginUser.id,
        password: changePwdForm.value.newPwd,
      };
      const result = await updatePwdApi(pwdChange);
      if (result.code) {
        ElMessage.success("修改密码成功！请重新登录。。。");
        localStorage.removeItem("loginUser");
        dialogFormVisible.value = false;
        router.push("/login");
      } else {
        ElMessage.error(result.msg);
      }
    }
  });
};

//挂载
onMounted(() => {
  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  if (loginUser) {
    userName.value = loginUser.name;
  }
});
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- Header 区域 -->
      <el-header class="header">
        <span class="title">Tlias智能学习辅助系统</span>
        <span class="right_tool">
          <a href="javascript:void(0)" @click="handleChangePwd">
            <el-icon>
              <EditPen />
            </el-icon>
            修改密码 &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
          </a>
          <a href="javascript:void(0)" @click="logout">
            <el-icon>
              <SwitchButton />
            </el-icon>
            退出登录[{{ userName }}]
          </a>
        </span>
      </el-header>

      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="aside">
          <el-menu router>
            <!-- 首页菜单 -->
            <el-menu-item index="/index">
              <el-icon>
                <Promotion />
              </el-icon>
              首页
            </el-menu-item>

            <!-- 班级管理菜单 -->
            <el-sub-menu index="/manage">
              <template #title>
                <el-icon>
                  <Menu />
                </el-icon>
                班级学员管理
              </template>
              <el-menu-item index="/clazz">
                <el-icon> <HomeFilled /> </el-icon>班级管理
              </el-menu-item>
              <el-menu-item index="/stu">
                <el-icon> <UserFilled /> </el-icon>学员管理
              </el-menu-item>
            </el-sub-menu>

            <!-- 系统信息管理 -->
            <el-sub-menu index="/system">
              <template #title>
                <el-icon> <Tools /> </el-icon>系统信息管理
              </template>
              <el-menu-item index="/dept">
                <el-icon> <HelpFilled /> </el-icon>部门管理
              </el-menu-item>
              <el-menu-item index="/emp">
                <el-icon> <Avatar /> </el-icon>员工管理
              </el-menu-item>
            </el-sub-menu>

            <!-- 数据统计管理 -->
            <el-sub-menu index="/report">
              <template #title>
                <el-icon> <Histogram /> </el-icon>数据统计管理
              </template>
              <el-menu-item index="/empReport">
                <el-icon> <InfoFilled /> </el-icon>员工信息统计
              </el-menu-item>
              <el-menu-item index="/stuReport">
                <el-icon> <Share /> </el-icon>学员信息统计
              </el-menu-item>
              <el-menu-item index="/log">
                <el-icon> <Document /> </el-icon>日志信息统计
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <!-- 修改密码对话框 -->
  <el-dialog
    v-model="dialogFormVisible"
    title="修改密码"
    width="30%"
    @close="resetForm"
  >
    <el-form :model="changePwdForm" :rules="pwdRules" ref="pwdChangeRef">
      <el-form-item label="请输入旧密码" prop="oldPwd">
        <el-input v-model="changePwdForm.oldPwd" type="password" />
      </el-form-item>
      <el-form-item label="请输入新密码" prop="newPwd">
        <el-input v-model="changePwdForm.newPwd" type="password" />
      </el-form-item>
      <el-form-item label="请再次输入新密码" prop="newPwdValid">
        <el-input v-model="changePwdForm.newPwdValid" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.header {
  background-image: linear-gradient(
    to right,
    #c71585,
    #d22b8e,
    #dc3c96,
    #e74a9f,
    #f158a8,
    #f665ab,
    #fb71af,
    #ff7db3,
    #ff8cb4,
    #ff9ab7,
    #ffa8bb,
    #ffb6c1
  );
}

.title {
  color: white;
  font-size: 38px;
  font-family: "STKaiti", "华文楷体", "KaiTi", "楷体", "Serif";
  line-height: 60px;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
  letter-spacing: 3px;
}

.right_tool {
  float: right;
  line-height: 60px;
}

a {
  color: white;
  text-decoration: none;
}

.aside {
  width: 220px;
  border-right: 1px solid #ccc;
  height: 730px;
}
</style>
