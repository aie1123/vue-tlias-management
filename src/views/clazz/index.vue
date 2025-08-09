<script setup>
import { ref, onMounted, watch } from "vue";
import {
  queryPageApi,
  addClazzApi,
  updateClazzApi,
  queryClazzByIdApi,
  deleteClazzByIdApi,
} from "@/api/clazz";
import { queryAllApi } from "@/api/emp";
import { ElMessage, ElMessageBox } from "element-plus";
// 查询条件
const searchClazz = ref({
  name: "",
  date: [],
  begin: "",
  end: "",
});

//对话框配置
const dialogFormVisible = ref(false);
const formTitle = ref("");

//定义新增clazz表单数据
const clazzForm = ref({
  name: "",
  room: "",
  beginDate: "",
  endDate: "",
  masterId: "",
  subject: "",
});

//获取员工数据
const emps = ref([]);
const queryAllEmps = async () => {
  const result = await queryAllApi();
  if (result.code) {
    emps.value = result.data;
  }
};

//表格数据
const clazzList = ref([]);

//表单校验规则
const clazzFormRef = ref();
const rules = ref({
  name: [
    { required: true, message: "班级名称为必填项", trigger: "blur" },
    { min: 4, max: 30, message: "班级名称长度为4-30个字", trigger: "blur" },
  ],
  beginDate: [{ required: true, message: "开课时间为必填项", trigger: "blur" }],
  endDate: [{ required: true, message: "结课时间为必填项", trigger: "blur" }],
  subject: [{ required: true, message: "班级名称为必填项", trigger: "blur" }],
});

//重置表单方法
const resetForm = () => {
  clazzForm.value = {
    name: "",
    room: "",
    beginDate: "",
    endDate: "",
    masterId: "",
    subject: "",
  };
  clazzFormRef.value.resetFields();
};

//学科列表数据
const subjects = ref([
  { name: "Java", value: 1 },
  { name: "前端", value: 2 },
  { name: "大数据", value: 3 },
  { name: "Python", value: 4 },
  { name: "Go", value: 5 },
  { name: "嵌入式", value: 6 },
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

//查询方法
const search = async () => {
  const result = await queryPageApi(
    searchClazz.value.name,
    searchClazz.value.begin,
    searchClazz.value.end,
    pagination.value.currentPage,
    pagination.value.pageSize
  );
  if (result.code) {
    clazzList.value = result.data.rows;
    pagination.value.total = result.data.total;
  } else {
    ElMessage.error(result.msg);
  }
};
//清空方法
const clear = () => {
  searchClazz.value = { name: "", date: [], begin: "", end: "" };
  search();
};

//侦听date
watch(
  () => searchClazz.value.date,
  (newValue) => {
    if (newValue.length == 2) {
      searchClazz.value.begin = newValue[0];
      searchClazz.value.end = newValue[1];
    } else {
      searchClazz.value.begin = "";
      searchClazz.value.end = "";
    }
  }
);

//添加方法
const add = () => {
  dialogFormVisible.value = true;
  formTitle.value = "新增班级";
};

//保存方法
const save = async () => {
  clazzFormRef.value.validate(async (valid) => {
    if (valid) {
      let result = null;
      if (clazzForm.value.id) {
        result = await updateClazzApi(clazzForm.value); //修改
      } else {
        result = await addClazzApi(clazzForm.value); //新增
      }
      if (result.code) {
        ElMessage.success("操作成功");
        //关闭对话框
        dialogFormVisible.value = false;
        //重置表单
        resetForm();
        //重写加载数据
        search();
      } else {
        ElMessage.error(result.msg);
      }
    }
  });
};

//修改方法
const handleEdit = async (id) => {
  formTitle.value = "修改班级";
  dialogFormVisible.value = true;
  const result = await queryClazzByIdApi(id);
  clazzForm.value = result.data;
};

//删除方法
const handleDelete = async (id) => {
  ElMessageBox.confirm("您确认删除此数据吗？", "删除班级", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const result = await deleteClazzByIdApi(id);
    if (result.code) {
      ElMessage.success("删除成功");
      search();
    } else {
      ElMessage.error(result.msg);
    }
  });
};

//挂载
onMounted(() => {
  search();
  queryAllEmps();
});
</script>

<template>
  <h1>班级管理</h1>
  <br />
  <!-- 搜索表单 -->
  <el-form :inline="true" :model="searchClazz">
    <el-form-item label="班级名称">
      <el-input
        placeholder="请输入班级名称"
        v-model="searchClazz.name"
        clearable
      />
    </el-form-item>
    <el-form-item label="结课时间">
      <el-date-picker
        v-model="searchClazz.date"
        type="daterange"
        range-separator="至"
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
  <el-button type="success" @click="add">+新增班级</el-button>
  <div style="margin-bottom: 15px"></div>
  <!-- {{ searchClazz }} -->
  <!-- 列表展示 -->
  <el-table :data="clazzList" border style="width: 100%" fit>
    <el-table-column type="index" label="序号" width="70" align="center" />
    <el-table-column
      prop="name"
      label="班级名称"
      align="center"
      width="130px"
    />
    <el-table-column
      prop="room"
      label="班级教室"
      align="center"
      width="100px"
    />
    <el-table-column prop="masterName" label="班主任" align="center" />
    <el-table-column prop="beginDate" label="开课时间" align="center" />
    <el-table-column prop="endDate" label="结课时间" align="center" />
    <el-table-column prop="status" label="状态" align="center" />
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
  <!-- 对话框 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="formTitle"
    width="30%"
    @close="resetForm"
  >
    <el-form :model="clazzForm" :rules="rules" ref="clazzFormRef">
      <el-form-item label="班级名称" prop="name">
        <el-input v-model="clazzForm.name" placeholder="请输入班级名称" />
      </el-form-item>
      <el-form-item label="班级教室">
        <el-input v-model="clazzForm.room" placeholder="请输入班级教室" />
      </el-form-item>
      <el-form-item label="开课时间" prop="beginDate">
        <el-date-picker
          v-model="clazzForm.beginDate"
          type="date"
          placeholder="请选择开课时间"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="结课时间" prop="endDate">
        <el-date-picker
          v-model="clazzForm.endDate"
          type="date"
          placeholder="请选择结课时间"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="班主任">
        <el-select
          v-model="clazzForm.masterId"
          placeholder="请选择班主任"
          style="width: 100%"
        >
          <el-option
            v-for="emp in emps"
            :label="emp.name"
            :value="emp.id"
            :key="emp.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学科" prop="subject">
        <el-select
          v-model="clazzForm.subject"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="subject in subjects"
            :label="subject.name"
            :value="subject.value"
            :key="subject.value"
          />
        </el-select>
      </el-form-item>
      <!-- {{ clazzForm }} -->
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
