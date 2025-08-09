import request from "@/utils/request";

//班级分页条件查询
export const queryPageApi = (name, begin, end, page, pageSize) =>
  request.get(
    `/clazzs?begin=${begin}&end=${end}&name=${name}&page=${page}&pageSize=${pageSize}`
  );
//新增班级
export const addClazzApi = (clazzData) => request.post("/clazzs", clazzData);

//根据id查询班级
export const queryClazzByIdApi = (id) => request.get(`/clazzs/${id}`);

//修改班级
export const updateClazzApi = (clazzData) => request.put("/clazzs", clazzData);

//根据id删除班级
export const deleteClazzByIdApi = (id) => request.delete(`/clazzs/${id}`);

//查询所有班级信息
export const queryAllClazzApi = () => request.get("/clazzs/list");
