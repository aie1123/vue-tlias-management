<script setup>
import { ref, onMounted } from "vue";
import { getLogPage } from "@/api/log";

// 表格数据
const logList = ref([]);
// 分页相关数据
const pageData = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});
// 加载状态
const loading = ref(false);

// 获取日志列表
const fetchLogList = async () => {
  loading.value = true;
  try {
    const res = await getLogPage(pageData.value.page, pageData.value.pageSize);
    logList.value = res.data.rows;
    pageData.value.total = res.data.total;
  } catch (error) {
    console.error("获取日志列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 处理分页变化
const handlePageChange = (newPage) => {
  pageData.value.page = newPage;
  fetchLogList();
};

// 处理页面大小变化
const handleSizeChange = (newSize) => {
  pageData.value.pageSize = newSize;
  pageData.value.page = 1;
  fetchLogList();
};

// 页面加载时获取数据
onMounted(() => {
  fetchLogList();
});
</script>

<template>
  <h1>日志管理</h1>
  <div style="margin-bottom: 15px"></div>
  <el-table
    :data="logList"
    v-loading="loading"
    element-loading-text="数据加载中..."
    border
    style="width: 100%"
  >
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="operateEmpName" label="操作人" width="120" />
    <el-table-column prop="operateTime" label="操作时间" width="180">
      <template #default="scope">
        {{
          scope.row.operateTime ? scope.row.operateTime.replace("T", " ") : ""
        }}
      </template>
    </el-table-column>
    <el-table-column prop="className" label="类名" show-overflow-tooltip />
    <el-table-column prop="methodName" label="方法名" width="150" />
    <el-table-column prop="methodParams" label="请求参数" show-overflow-tooltip>
      <template #default="scope">
        <span class="param-cell">{{ scope.row.methodParams }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="returnValue" label="返回值" show-overflow-tooltip />
    <el-table-column prop="costTime" label="耗时(ms)" width="120" />
  </el-table>

  <!-- 分页 -->
  <el-pagination
    v-model:current-page="pageData.page"
    v-model:page-size="pageData.pageSize"
    :page-sizes="[10, 20, 50, 100]"
    :total="pageData.total"
    layout="total, sizes, prev, pager, next, jumper"
    @current-change="handlePageChange"
    @size-change="handleSizeChange"
    class="pagination"
  />
</template>

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
}
.param-cell {
  display: inline-block;
  padding: 4px 8px;
  border: 1px solid #409eff;
  border-radius: 4px;
  background-color: #ecf5ff;
  color: #409eff;
  font-size: 12px;
}
</style>
