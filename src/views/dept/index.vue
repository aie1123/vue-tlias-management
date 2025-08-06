<script setup>
import { ref, onMounted } from "vue";
import {
  queryAllApi,
  addDeptApi,
  queryDeptByIdApi,
  updateDeptApi,
  deleteDeptByIdApi,
} from "@/api/dept";
import { ElMessage, ElMessageBox } from "element-plus";

const tableData = ref([]);
//定义对话框变量
const formTitle = ref("");
//新增对话框的状态
const dialogFormVisible = ref(false);
const formLabelWidth = ref("120px");
//表单数据
const deptForm = ref({ name: "" });
// 表单引用
const deptFormRef = ref(null);

// 表单验证规则
const formRules = ref({
  name: [
    { required: true, message: "请输入部门名称", trigger: "blur" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
  ],
});

// 重置表单
const resetForm = () => {
  deptFormRef.value.resetFields();
};
//新增方法
const add = () => {
  formTitle.value = "新增部门";
  deptForm.value = { name: "" };
  dialogFormVisible.value = true;
};

//保存方法
const save = async () => {
  await deptFormRef.value.validate(async (valid) => {
    if (!valid) return;
    //提交表单
    let result = null; //
    if (deptForm.value.id) {
      result = await updateDeptApi(deptForm.value); //修改
    } else {
      result = await addDeptApi(deptForm.value); //新增
    }
    if (result.code) {
      ElMessage.success("操作成功");
      //关闭对话框
      dialogFormVisible.value = false;
      //重置表单
      resetForm();
      //重新加载数据
      queryAll();
    } else {
      ElMessage.error(result.msg);
    }
  });
};
//查询部门方法
const queryAll = async () => {
  const result = await queryAllApi();
  tableData.value = result.data;
};

//修改方法
const handleEdit = async (row) => {
  console.log(`当前行数据id为${row.id}`);
  formTitle.value = "修改部门";
  dialogFormVisible.value = true;
  const result = await queryDeptByIdApi(row.id);
  deptForm.value = result.data;
};

//删除方法
const handleDelete = (row) => {
  ElMessageBox.confirm("此操作将永久删除改部门，是否继续？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    const result = await deleteDeptByIdApi(row.id);
    if (result.code) {
      ElMessage.success("删除成功");
      queryAll();
    } else {
      ElMessage.error(result.msg);
    }
  });
};

//挂载
onMounted(() => {
  queryAll();
});
</script>

<template>
  <h1>部门管理</h1>
  <el-button type="primary" style="float: right" @click="add"
    >+新增部门</el-button
  >
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="index" label="序号" width="100" align="center" />
    <el-table-column prop="name" label="部门名称" width="300" align="center" />
    <el-table-column
      prop="updateTime"
      label="最后修改时间"
      width="300"
      align="center"
    />
    <el-table-column label="操作" align="center">
      <template #default="{ row }">
        <el-button size="small" @click="handleEdit(row)"> 修改 </el-button>
        <el-button size="small" type="danger" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="formTitle"
    width="30%"
    @close="resetForm"
  >
    <el-form :model="deptForm" :rules="formRules" ref="deptFormRef">
      <el-form-item label="部门名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="deptForm.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
