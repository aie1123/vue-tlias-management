import request from "@/utils/request";

/**
 * 员工职位人数统计
 * @returns {Promise}
 */
export const getEmpJobData = () => request.get("/report/empJobData");

/**
 * 员工性别统计
 * @returns {Promise}
 */
export const getEmpGenderData = () => request.get("/report/empGenderData");

/**
 * 班级人数统计
 * @returns {Promise}
 */
export const getStudentCountData = () =>
  request.get("/report/studentCountData");

/**
 * 学员学历统计
 * @returns {Promise}
 */
export const getStudentDegreeData = () =>
  request.get("/report/studentDegreeData");
