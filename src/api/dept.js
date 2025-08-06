import request from "@/utils/request";

//部门列表查询
export const queryAllApi = () => request.get("/depts");
//新增部门
export const addDeptApi = (deptData) => request.post("/depts", deptData);

//根据id查询部门
export const queryDeptByIdApi = (id) => request.get(`/depts/${id}`);

//修改部门
export const updateDeptApi = (deptData) => request.put("/depts", deptData);

//根据id删除部门
export const deleteDeptByIdApi = (id) => request.delete(`/depts?id=${id}`);
