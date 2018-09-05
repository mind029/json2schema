const Convert = require("./lib/convert")
let obj = {
  id: 1,
  detail: {
    name: "mind",
    age: 18
  },
  desc: "描述"
}

let list = [
  {
    id: 1, name: "123", listEmpty: [], list: ["str"], listObj: [{
      objName: "123",
      objAge: 10
    }]
  }
]

console.log(JSON.stringify(list))
const json = new Convert(list)
let res = json.convert()
// console.log(JSON.stringify(res))