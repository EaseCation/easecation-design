// TS 6 起 noUncheckedSideEffectImports 默认开启：副作用导入（如 import './x.css'）
// 必须有对应的模块声明，否则报 TS2882。这里声明样式文件可被副作用导入。
declare module '*.css';
