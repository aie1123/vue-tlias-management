<script setup>
import { ref, onMounted } from "vue";
import { queryAllClazzApi } from "@/api/clazz";
import {
  queryPageApi,
  addStuApi,
  queryStuByIdApi,
  updateStuApi,
  deleteStuApi,
  violationApi,
} from "@/api/student";
import { ElMessage, ElMessageBox } from "element-plus";

//获取班级数据
const clazzs = ref([]);
const queryAllClazzs = async () => {
  const result = await queryAllClazzApi();
  if (result.code) {
    clazzs.value = result.data;
  }
};
//查询班级条件
const searchStu = ref({
  name: "",
  degree: "",
  clazzId: "",
});

//多选处理
const selectedIds = ref([]);
const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id);
};

//最高学历转换函数
const getDegreeTitle = (degree) => {
  switch (degree) {
    case 1:
      return "初中";
    case 2:
      return "高中";
    case 3:
      return "大专";
    case 4:
      return "本科";
    case 5:
      return "硕士";
    case 6:
      return "博士";
  }
};

//性别列表数据
const genders = ref([
  { name: "男", value: 1 },
  { name: "女", value: 2 },
]);

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

//表格数据
const stuList = ref([]);

//查询方法
const search = async () => {
  const result = await queryPageApi(
    searchStu.value.name,
    searchStu.value.degree,
    searchStu.value.clazzId,
    pagination.value.currentPage,
    pagination.value.pageSize
  );
  if (result.code) {
    stuList.value = result.data.rows;
    pagination.value.total = result.data.total;
  } else {
    ElMessage.error(result.msg);
  }
};

//清空搜索表单方法
const clear = () => {
  searchStu.value = {
    name: "",
    degree: "",
    clazzId: "",
  };
  search();
};
//对话框配置
const dialogFormVisible = ref(false);
const formTitle = ref("");
const labelWidth = ref(80);

//学员数据
const stu = ref({
  name: "",
  no: "",
  gender: "",
  phone: "",
  idCard: "",
  isCollege: "",
  address: "",
  degree: "",
  graduationDate: "",
  clazzId: "",
});

//新增学员方法
const add = () => {
  dialogFormVisible.value = true;
  formTitle.value = "新增学员";
};

//表单校验规则
const stuFormRef = ref();
const rules = ref({
  name: [
    { required: true, message: "姓名为必填项", trigger: "blur" },
    { min: 2, max: 20, message: "姓名长度为2-20个字", trigger: "blur" },
  ],
  no: [
    { required: true, message: "学号为必填项", trigger: "blur" },
    { len: 10, message: "学号长度必须为10个字符", trigger: "blur" },
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
  idCard: [
    { required: true, message: "身份证号为必填项", trigger: "blur" },
    {
      pattern: /^[1-9]\d{17}$/,
      message: "请输入合法的18位身份证号",
      trigger: "blur",
    },
  ],
  isCollege: [
    { required: true, message: "是否院校为必填项", trigger: "change" },
  ],
});
//清空stu
const clearStu = () => {
  stu.value = {
    id: null,
    name: "",
    sex: "",
    birth: "",
    phone: "",
    idCard: "",
    isCollege: "",
    clazzId: "",
  };
};
//清空表单校验
const clearValidate = () => {
  stuFormRef.value.resetFields();
};
//保存方法
const save = async () => {
  stuFormRef.value.validate(async (valid) => {
    if (valid) {
      let result = null;
      if (stu.value.id) {
        result = await updateStuApi(stu.value);
      } else {
        result = await addStuApi(stu.value);
      }
      if (result.code) {
        ElMessage.success("操作成功");
        dialogFormVisible.value = false;
        search();
        clearStu();
        clearValidate();
      } else {
        ElMessage.error(result.msg);
      }
    }
  });
};

//编辑方法
const handleEdit = async (id) => {
  formTitle.value = "修改学员";
  dialogFormVisible.value = true;
  const result = await queryStuByIdApi(id);
  if (result.code) {
    stu.value = result.data;
  } else {
    ElMessage.error(result.msg);
  }
};

//批量删除方法
const deleteBatch = () => {
  if (selectedIds.value.length == 0) {
    ElMessage.warning("请选择要删除的学员数据！");
    return;
  }
  ElMessageBox.confirm(
    `确定删除选中的${selectedIds.value.length}条学员数据吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(async () => {
    const result = await deleteStuApi(selectedIds.value.join(","));
    if (result.code) {
      ElMessage.success("删除成功");
      search();
    } else {
      ElMessage.error(result.msg);
    }
  });
};

//删除单条数据
const handleDelete = (id) => {
  ElMessageBox.confirm("确定删除该学员吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const result = await deleteStuApi(id);
    if (result.code) {
      ElMessage.success("删除成功");
      search();
    } else {
      ElMessage.error(result.msg);
    }
  });
};

//违纪处理方法
const handleViolation = (id) => {
  ElMessageBox.prompt("请输入违纪扣分", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    inputPattern: /^[1-9]\d*$/,
    inputErrorMessage: "请输入正整数",
    inputPlaceholder: "请输入扣分值",
  })
    .then(({ value }) => {
      // 处理违纪扣分逻辑
      processViolation(id, value);
    })
    .catch(() => {
      // 用户取消操作
      ElMessage.info("已取消违纪处理");
    });
};

//处理违纪扣分逻辑
const processViolation = async (id, score) => {
  const result = await violationApi(id, score);
  if (result.code) {
    ElMessage.success("违纪处理成功");
    search(); // 刷新列表
  } else {
    ElMessage.error(result.msg);
  }
};

//挂载
onMounted(() => {
  search();
  queryAllClazzs();
});
</script>

<template>
  <h1>学员管理</h1>
  <br />
  <!-- 搜索表单 -->
  <el-form :inline="true" :model="searchStu">
    <el-form-item label="姓名">
      <el-input
        placeholder="请输入学生姓名"
        v-model="searchStu.name"
        clearable
      />
    </el-form-item>
    <el-form-item label="最高学历">
      <el-select placeholder="请选择" v-model="searchStu.degree" clearable>
        <el-option label="初中" value="1" />
        <el-option label="高中" value="2" />
        <el-option label="大专" value="3" />
        <el-option label="本科" value="4" />
        <el-option label="硕士" value="5" />
        <el-option label="博士" value="6" />
      </el-select>
    </el-form-item>
    <el-form-item label="所属班级">
      <el-select placeholder="请选择" v-model="searchStu.clazzId" clearable>
        <el-option
          v-for="(clazz, index) in clazzs"
          :key="index"
          :label="clazz.name"
          :value="clazz.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="info" @click="clear">清空</el-button>
    </el-form-item>
  </el-form>
  <el-button type="success" @click="add">+新增学员</el-button>
  <el-button type="danger" @click="deleteBatch">-批量删除</el-button>
  <div style="margin-bottom: 15px"></div>
  <!-- 列表展示 -->
  <el-table
    :data="stuList"
    border
    style="width: 100%"
    fit
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" label="姓名" align="center" width="80px" />
    <el-table-column prop="no" label="学号" align="center" width="250px" />
    <el-table-column
      prop="clazzName"
      label="班级"
      align="center"
      width="100px"
    />
    <el-table-column prop="gender" label="性别" align="center" width="100px">
      <template #default="scope">
        {{ scope.row.gender == 1 ? "男" : "女" }}
      </template>
    </el-table-column>
    <el-table-column prop="phone" label="手机号" align="center" />
    <el-table-column
      prop="degree"
      label="最高学历"
      align="center"
      width="100px"
    >
      <template #default="scope">
        {{ getDegreeTitle(scope.row.degree) }}
      </template>
    </el-table-column>
    <el-table-column prop="violationCount" label="违纪次数" align="center" />
    <el-table-column prop="violationScore" label="违纪扣分" align="center" />
    <el-table-column prop="updateTime" label="最后修改时间" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.row.id)"
          >编辑</el-button
        >
        <el-button
          type="warning"
          size="small"
          @click="handleViolation(scope.row.id)"
          >违纪</el-button
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
      :model="stu"
      label-width="labelWidth"
      ref="stuFormRef"
      :rules="rules"
      @close="clearStu"
    >
      <!-- 第一行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" :label-width="labelWidth" prop="name">
            <el-input v-model="stu.name" placeholder="请输入学员姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号" :label-width="labelWidth" prop="no">
            <el-input v-model="stu.no" placeholder="请输入学员学号" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" :label-width="labelWidth" prop="gender">
            <el-select
              v-model="stu.gender"
              placeholder="请选择"
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
            <el-input v-model="stu.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="身份证号"
            :label-width="labelWidth"
            prop="idCard"
          >
            <el-input v-model="stu.idCard" placeholder="请输入身份证号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否院校"
            :label-width="labelWidth"
            prop="isCollege"
          >
            <el-select
              v-model="stu.isCollege"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系地址" :label-width="labelWidth">
            <el-input v-model="stu.address" placeholder="请输入联系地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最高学历" :label-width="labelWidth">
            <el-select
              v-model="stu.degree"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="degree in 6"
                :label="getDegreeTitle(degree)"
                :value="degree"
                :key="degree"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="毕业时间" :label-width="labelWidth">
            <el-date-picker
              v-model="stu.graduationDate"
              type="date"
              placeholder="请选择毕业时间"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属班级" :label-width="labelWidth">
            <el-select
              v-model="stu.clazzId"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="clazz in clazzs"
                :label="clazz.name"
                :value="clazz.id"
                :key="clazz.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
