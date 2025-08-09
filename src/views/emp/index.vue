<script setup>
import { ref, onMounted, watch } from "vue";
import {
  queryPageApi,
  addApi,
  queryInfoApi,
  updateApi,
  deleteApi,
} from "@/api/emp";
import { queryAllApi } from "@/api/dept";
import { ElMessage, ElMessageBox } from "element-plus";
const searchEmp = ref({
  name: "",
  gender: "",
  date: [],
  begin: "",
  end: "",
});

const empList = ref([]);

// 职位转换函数
const getJobTitle = (job) => {
  switch (job) {
    case 1:
      return "班主任";
    case 2:
      return "讲师";
    case 3:
      return "学工主管";
    case 4:
      return "教研主管";
    case 5:
      return "咨询师";
    default:
      return "其他";
  }
};

//新增员工
const emp = ref({
  username: "",
  password: "",
  name: "",
  gender: "",
  phone: "",
  image: "",
  deptId: "",
  salary: "",
  entryDate: "",
  job: "",
  exprList: [],
});

//职位列表数据
const jobs = ref([
  { name: "班主任", value: 1 },
  { name: "讲师", value: 2 },
  { name: "学工主管", value: 3 },
  { name: "教研主管", value: 4 },
  { name: "咨询师", value: 5 },
  { name: "其他", value: 6 },
]);

//性别列表数据
const genders = ref([
  { name: "男", value: 1 },
  { name: "女", value: 2 },
]);

//对话框配置
const dialogFormVisible = ref(false);
const formTitle = ref("");
const labelWidth = ref(80);

// 分页配置
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});
// 分页处理
const handleSizeChange = (size) => {
  pagination.value.pageSize = size;
  pagination.value.currentPage = 1;
  search();
};
const handleCurrentChange = (page) => {
  pagination.value.currentPage = page;
  search();
};

//多选
const selectedIds = ref([]);
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id);
};
//编辑方法
const handleEdit = async (id) => {
  dialogFormVisible.value = true;
  formTitle.value = "修改员工";
  const result = await queryInfoApi(id);
  if (result.code) {
    emp.value = result.data;
    let exprList = emp.value.exprList;
    if (exprList && exprList.length > 0) {
      exprList.forEach((expr) => {
        expr.date = [expr.begin, expr.end];
      });
    }
  }
};

//删除单条数据方法
const handleDelete = (id) => {
  // console.log("Delete:", id);
  ElMessageBox.confirm("确定删除该员工吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const result = await deleteApi(id);
    if (result.code) {
      ElMessage.success("删除成功");
      search();
    } else {
      ElMessage.error(result.msg);
    }
  });
};
//查询方法
const search = async () => {
  // console.log("查询方法");
  const result = await queryPageApi(
    searchEmp.value.begin,
    searchEmp.value.end,
    searchEmp.value.gender,
    searchEmp.value.name,
    pagination.value.currentPage,
    pagination.value.pageSize
  );
  if (result.code) {
    empList.value = result.data.rows;
    pagination.value.total = result.data.total;
  } else {
    ElMessage.error(result.msg);
  }
};

//新增方法
const add = () => {
  dialogFormVisible.value = true;
  formTitle.value = "新增员工";
};

//清空方法
const clear = () => {
  searchEmp.value = {
    name: "",
    gender: "",
    date: [],
    begin: "",
    end: "",
  };
  pagination.value.currentPage = 1;
  search();
};

//侦听date
watch(
  () => searchEmp.value.date,
  (newValue) => {
    if (newValue.length == 2) {
      searchEmp.value.begin = newValue[0];
      searchEmp.value.end = newValue[1];
    } else {
      searchEmp.value.begin = "";
      searchEmp.value.end = "";
    }
  }
);

//获取部门数据
const depts = ref([]);
const queryAllDepts = async () => {
  const result = await queryAllApi();
  if (result.code) {
    depts.value = result.data;
  }
};

//文件上传
//上传成功后处理
const handleAvatarSuccess = (response) => {
  emp.value.image = response.data;
};
//上传之前处理
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("只支持上传图片");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error("只能上传10M以内图片");
    return false;
  }
  return true;
};

//添加工作经历
const addExprItem = () => {
  emp.value.exprList.push({
    date: [],
    company: "",
    job: "",
    begin: "",
    end: "",
  });
};
//删除工作经历
const deleteExprItem = (expr) => {
  if (emp.value.exprList) {
    const index = emp.value.exprList.indexOf(expr);
    if (index != -1) {
      emp.value.exprList.splice(index, 1);
    }
  }
};
//侦听员工作经历的开始和结束时间
watch(
  emp,
  () => {
    if (emp.value.exprList) {
      emp.value.exprList.forEach((expr) => {
        if (expr.date && expr.date.length == 2) {
          expr.begin = expr.date[0];
          expr.end = expr.date[1];
        }
      });
    }
  },
  { deep: true }
);

//保存方法
const save = async () => {
  empFormRef.value.validate(async (valid) => {
    if (valid) {
      let result = null;
      if (emp.value.id) {
        result = await updateApi(emp.value);
      } else {
        result = await addApi(emp.value);
      }
      if (result.code) {
        ElMessage.success("操作成功");
        dialogFormVisible.value = false;
        search();
        clearEmp();
        clearValidate();
      } else {
        ElMessage.error(result.msg);
      }
    }
  });
};
//清空emp
const clearEmp = () => {
  emp.value = {
    username: "",
    password: "",
    name: "",
    gender: "",
    phone: "",
    image: "",
    deptId: "",
    salary: "",
    entryDate: "",
    job: "",
    exprList: [],
  };
};

//表单校验规则
const empFormRef = ref();
const rules = ref({
  username: [
    { required: true, message: "用户名为必填项", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度为2-20个字", trigger: "blur" },
  ],
  name: [
    { required: true, message: "姓名为必填项", trigger: "blur" },
    { min: 2, max: 10, message: "姓名长度为2-10个字", trigger: "blur" },
  ],
  gender: [{ required: true, message: "性别为必填项", trigger: "change" }],
  phone: [
    { required: true, message: "手机号为必填项", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/g,
      message: "请输入合法的手机号",
      trigger: "blur",
    },
  ],
  salary: [
    { pattern: /^[1-9]\d*$/g, message: "请输入合法的数字", trigger: "blur" },
  ],
});

//清空表单校验
const clearValidate = () => {
  empFormRef.value.resetFields();
};

//取消方法
const handleCancel = () => {
  dialogFormVisible.value = false;
  clearValidate();
};

//批量删除方法
const deleteBatch = () => {
  if (selectedIds.value.length == 0) {
    ElMessage.warning("请选择要删除的员工数据！");
    return;
  }
  ElMessageBox.confirm(
    `确定删除选中的${selectedIds.value.length}条员工数据吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(async () => {
    const result = await deleteApi(selectedIds.value.join(","));
    if (result.code) {
      ElMessage.success("删除成功");
      search();
    } else {
      ElMessage.error(result.msg);
    }
  });
};
//定义上传文件需要的token
const token = ref("");

//挂载函数
onMounted(() => {
  let loginUser = localStorage.getItem("loginUser");
  if (loginUser) {
    token.value = JSON.parse(loginUser).token;
  }
  search();
  queryAllDepts();
});
</script>

<template>
  <h1>员工管理</h1>
  <!-- {{ searchEmp }}
  {{ selectedIds }} -->
  <br />
  <!-- 搜索表单 -->
  <el-form :inline="true" :model="searchEmp">
    <el-form-item label="姓名">
      <el-input
        placeholder="请输入员工姓名"
        v-model="searchEmp.name"
        clearable
      />
    </el-form-item>
    <el-form-item label="性别">
      <el-select placeholder="请选择" v-model="searchEmp.gender" clearable>
        <el-option label="男" value="1" />
        <el-option label="女" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="入职时间">
      <el-date-picker
        v-model="searchEmp.date"
        type="daterange"
        range-separator="到"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="info" @click="clear">清空</el-button>
    </el-form-item>
  </el-form>
  <el-button type="primary" @click="add">+新增员工</el-button>
  <el-button type="danger" @click="deleteBatch">-批量删除</el-button>
  <div style="margin-bottom: 15px"></div>
  <!-- 列表展示 -->
  <el-table
    :data="empList"
    border
    style="width: 100%"
    fit
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" label="姓名" align="center" width="130px" />
    <el-table-column prop="gender" label="性别" align="center" width="100px">
      <template #default="scope">
        {{ scope.row.gender == 1 ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column prop="image" label="头像" align="center">
      <template #default="scope">
        <img :src="scope.row.image" alt="avatar" class="avatar" />
      </template>
    </el-table-column>
    <el-table-column prop="deptName" label="所属部门" align="center" />
    <el-table-column prop="job" label="职位" align="center" width="100px">
      <template #default="scope">
        {{ getJobTitle(scope.row.job) }}
      </template>
    </el-table-column>
    <el-table-column
      prop="entryDate"
      label="入职时间"
      align="center"
      width="130px"
    />
    <el-table-column prop="updateTime" label="最后修改时间" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.row.id)"
          >编辑</el-button
        >
        <el-button
          type="danger"
          size="small"
          @click="handleDelete(scope.row.id)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <br />

  <!-- 分页组件Pagination -->
  <el-pagination
    v-model:current-page="pagination.currentPage"
    v-model:page-size="pagination.pageSize"
    :page-sizes="[5, 10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pagination.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
  <!-- 新增员工 / 修改员工的 DiaLog对话框 -->
  <el-dialog v-model="dialogFormVisible" :title="formTitle">
    <el-form
      :model="emp"
      label-width="labelWidth"
      ref="empFormRef"
      :rules="rules"
    >
      <!-- 第一行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="用户名"
            :label-width="labelWidth"
            prop="username"
          >
            <el-input
              v-model="emp.username"
              placeholder="请输入员工用户名，2-20个字"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" :label-width="labelWidth" prop="name">
            <el-input
              v-model="emp.name"
              placeholder="请输入员工姓名，2-10个字"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" :label-width="labelWidth" prop="gender">
            <el-select
              v-model="emp.gender"
              placeholder="请选择性别"
              style="width: 100%"
            >
              <el-option
                v-for="gender in genders"
                :label="gender.name"
                :value="gender.value"
                :key="gender.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" :label-width="labelWidth" prop="phone">
            <el-input v-model="emp.phone" placeholder="请输入员工手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="薪资" :label-width="labelWidth">
            <el-input v-model="emp.salary" placeholder="请输入员工薪资" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期" :label-width="labelWidth">
            <el-date-picker
              v-model="emp.entryDate"
              type="date"
              placeholder="请选择入职日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属部门" :label-width="labelWidth">
            <el-select
              v-model="emp.deptId"
              placeholder="请选择部门"
              style="width: 100%"
            >
              <el-option
                v-for="dept in depts"
                :label="dept.name"
                :value="dept.id"
                :key="dept.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职位" :label-width="labelWidth">
            <el-select
              v-model="emp.job"
              placeholder="请选择职位"
              style="width: 100%"
            >
              <el-option
                v-for="job in jobs"
                :label="job.name"
                :value="job.value"
                :key="job.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="头像" :label-width="labelWidth">
            <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :headers="{ token: token }"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="emp.image" :src="emp.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第六行 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="工作经历" :label-width="labelWidth">
            <el-button type="success" size="small" @click="addExprItem"
              >+ 添加工作经历</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第七行 -->
      <el-row :gutter="5" v-for="(expr, index) in emp.exprList" :key="index">
        <el-col :span="10">
          <el-form-item label="时间" size="small" :label-width="labelWidth">
            <el-date-picker
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              v-model="expr.date"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="公司" size="small">
            <el-input placeholder="请输入公司名称" v-model="expr.company" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="职位" size="small">
            <el-input placeholder="请输入职位" v-model="expr.job" />
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item size="small">
            <el-button type="danger" @click="deleteExprItem(expr)"
              >- 删除</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <!-- {{ emp }} -->
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.avatar {
  height: 40px;
}

.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  /* 添加灰色的虚线边框 */
  border: 1px dashed var(--el-border-color);
}
</style>
