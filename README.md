# Tlias智能学习辅助系统前端

Tlias智能学习辅助系统是一个基于Vue 3 + Element Plus的管理系统，用于管理学校中的员工和学员信息。

## 推荐的IDE设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## 项目技术栈

- Vue 3 (Composition API)
- Vite
- Element Plus UI组件库
- Vue Router
- Axios (HTTP客户端)

## 项目功能模块

- 登录认证
- 员工管理 (增删改查、分页、批量删除)
- 学员管理 (增删改查、分页、批量删除、违纪处理)
- 部门管理
- 班级管理
- 数据统计展示

## 项目目录结构

src/  
  ├── api/ # 后端API接口封装  
  ├── assets/ # 静态资源文件  
  ├── components/ # 公共组件  
  ├── router/ # 路由配置  
  ├── utils/ # 工具类  
  ├── views/ # 页面视图  
  │ ├── login/ # 登录页面  
  │ ├── layout/ # 主布局页面  
  │ ├── emp/ # 员工管理页面  
  │ ├── stu/ # 学员管理页面  
  │ ├── dept/ # 部门管理页面  
  │ └── clazz/ # 班级管理页面  
  └── App.vue # 根组件

## 项目配置

参考 [Vite 配置参考](https://vitejs.dev/config/).

## 项目设置

```sh
npm install
```
## 编译和热重载（开发模式）

```sh
npm run dev
```

## 编译和压缩（生产模式）

```sh
npm run build
```

## 代码检查 ESLint
```sh
npm run lint
```
## 环境要求
*Node.js 14.x 或更高版本
*npm 6.x 或更高版本
## 开发规范
*使用Vue 3 Composition API
*遵循Element Plus组件库的设计规范
*API请求统一在src/api目录下管理
*组件和页面使用单文件组件(.vue)格式
*CSS样式使用scoped防止样式污染
