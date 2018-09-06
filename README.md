# json2schema
JSON文件或者JavaScript对象转换成JSON-SCHEMA校验规则对象。

## 安装

```shell

npm install @mind029/json2schema --save

```

## Node.js 用法

```js
const Convert = require("@mind029/json2schema")
const c = new Convert()
const data = {
  id:1,
  name:"mind",
  age:18
}
// 生成的schema结构
const schema = c.format(data)
```