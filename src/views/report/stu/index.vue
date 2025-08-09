<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import * as echarts from "echarts";
import { getStudentCountData, getStudentDegreeData } from "@/api/report";

// 左侧图表（班级人数统计柱状图）的引用
const leftChartRef = ref();
// 右侧图表（学员学历统计饼图）的引用
const rightChartRef = ref();

// 左侧图表实例
let leftChartInstance = null;
// 右侧图表实例
let rightChartInstance = null;

// 初始化左侧柱状图（班级人数统计）
const initLeftChart = async () => {
  if (!leftChartInstance) {
    leftChartInstance = echarts.init(leftChartRef.value);
  }

  // 显示加载动画
  leftChartInstance.showLoading();

  try {
    // 获取数据
    const res = await getStudentCountData();

    const option = {
      title: {
        text: "班级人数统计",
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: res.data.clazzList,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "人数",
          type: "bar",
          data: res.data.dataList,
          itemStyle: {
            color: "#67C23A",
          },
        },
      ],
    };

    leftChartInstance.setOption(option);
    leftChartInstance.hideLoading();
  } catch (error) {
    console.error("获取班级人数统计数据失败:", error);
    leftChartInstance.hideLoading();

    // 出错时使用静态数据
    const option = {
      title: {
        text: "班级人数统计",
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: ["Java1班", "Java2班", "Python1班", "前端1班"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "人数",
          type: "bar",
          data: [32, 28, 35, 30],
          itemStyle: {
            color: "#67C23A",
          },
        },
      ],
    };

    leftChartInstance.setOption(option);
  }
};

// 初始化右侧饼图（学员学历统计）
const initRightChart = async () => {
  if (!rightChartInstance) {
    rightChartInstance = echarts.init(rightChartRef.value);
  }

  // 显示加载动画
  rightChartInstance.showLoading();

  try {
    // 获取数据
    const res = await getStudentDegreeData();
    const degreeData = res.data;

    // 转换数据格式
    const chartData = degreeData.map((item) => ({
      value: item.value,
      name: item.name,
    }));

    const option = {
      title: {
        text: "学员学历统计",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "学历",
          type: "pie",
          radius: ["40%", "70%"], // 空心圆环效果
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: chartData,
        },
      ],
    };

    rightChartInstance.setOption(option);
    rightChartInstance.hideLoading();
  } catch (error) {
    console.error("获取学员学历统计数据失败:", error);
    rightChartInstance.hideLoading();

    // 出错时使用静态数据
    const option = {
      title: {
        text: "学员学历统计",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "学历",
          type: "pie",
          radius: ["40%", "70%"], // 空心圆环效果
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 45, name: "本科" },
            { value: 30, name: "专科" },
            { value: 8, name: "硕士" },
            { value: 2, name: "博士" },
          ],
        },
      ],
    };

    rightChartInstance.setOption(option);
  }
};

// 页面挂载后初始化图表
onMounted(() => {
  initLeftChart();
  initRightChart();

  // 窗口大小改变时重置图表大小
  const handleResize = () => {
    if (leftChartInstance) {
      leftChartInstance.resize();
    }
    if (rightChartInstance) {
      rightChartInstance.resize();
    }
  };

  window.addEventListener("resize", handleResize);

  // 在组件卸载前移除事件监听器
  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    if (leftChartInstance) {
      leftChartInstance.dispose();
    }
    if (rightChartInstance) {
      rightChartInstance.dispose();
    }
  });
});
</script>

<template>
  <div class="chart-container">
    <div class="chart-item">
      <div ref="leftChartRef" class="chart"></div>
    </div>
    <div class="chart-item">
      <div ref="rightChartRef" class="chart"></div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  justify-content: space-between;
  height: 500px;
}

.chart-item {
  width: 48%;
  height: 100%;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
