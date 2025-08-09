import request from "@/utils/request";

//学员分页条件查询
export const queryPageApi = (name, degree, clazzId, page, pageSize) =>
  request.get(
    `/students?name=${name}&degree=${degree}&clazzId=${clazzId}&page=${page}&pageSize=${pageSize}`
  );
//新增学员
export const addStuApi = (stuData) => request.post("/students", stuData);

//根据id查询学员
export const queryStuByIdApi = (id) => request.get(`/students/${id}`);

//修改学员
export const updateStuApi = (stuData) => request.put("/students", stuData);

//删除学员
export const deleteStuApi = (ids) => request.delete(`/students/${ids}`);

//违纪处理
export const violationApi = (id, score) =>
  request.put(`/students/violation/${id}/${score}`);
