const isBoolean = require("lodash.isboolean")
const isEmpty = require("lodash.isempty")
const isInteger = require("lodash.isinteger")
const isNull = require("lodash.isnull")
const isNumber = require("lodash.isnumber")
const isObject = require("lodash.isobject")
const isString = require("lodash.isstring")
const isArray = Array.isArray


class Convert {
  constructor(object) {
    // 数据校验，确保传入的的object只能是对象或数组
    if (!isObject(object)) {
      throw new TypeError("传入参数只能是对象或数组")
    }
    // 传入的对象
    this._object = object
    // 传入对象的类型
    this._objectIsArray = isArray(object)
  }

  /**
   * 暴露函数
   */
  convert() {
    let convertRes
    if (this._objectIsArray) {
      convertRes = this._arrayToSchema()
    } else {
      convertRes = this._objectToSchema()
    }
    return convertRes
  }

  /**
   * 数组类型转换成JSONSCHEMA
   */
  _arrayToSchema(rootId = "root") {
    let result = this._value2object(this._object, rootId, "", true)
    if (this._object.length > 0) {
      // 创建items对象的基本信息
      let objectItem = this._object[0]
      result["items"] = this._value2object(objectItem, `#/items`, 'items')
      if (isObject(objectItem) && !isEmpty(objectItem)) {
        let objectItemSchema = this._json2schema(objectItem, `#/items`)
        result["items"] = Object.assign(result["items"], objectItemSchema)
      }
    }
    return result
  }

  /**
   * 对象类型转换成JSONSCHEMA
   */
  _objectToSchema(rootId = "root") {
    let result = this._value2object(this._object, rootId, "", true)
    let objectSchema = this._json2schema(this._object)
    result = Object.assign(result, objectSchema)
    return result
  }

  /**
   * 递归函数，转换object对象为json schmea 格式
   * @param {*} object 需要转换对象
   * @param {*} name $id值
   */
  _json2schema(object, name = "") {

    // 如果递归值不是对象，那么return掉
    if (!isObject(object)) {
      return;
    }

    // 处理当前路径$id
    if (name === "" || name == undefined) {
      name = "#"
    }

    let result = {};
    // 判断传入object是对象还是数组。
    if (isArray(object)) {
      result.items = {}
    } else {
      result.properties = {}
    }

    // 遍历传入的对象
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const element = object[key];
        // $id 在 _objectType 不同情况下有不同的值
        let $id = `${name}/properties/${key}`
        // 判断当前 element 的值 是否也是对象，如果是就继续递归，不是就赋值给result
        if (isObject(element)) {
          // 创建当前属性的基本信息
          result["properties"][key] = this._value2object(element, $id, key)
          if (isArray(element)) {
            // 针对空数组和有值的数组做不同处理
            if (element.length > 0) {
              // 如果是数组，那么就取第一项
              let elementItem = element[0]
              // 创建items对象的基本信息
              result["properties"][key]["items"] = this._value2object(elementItem, `${$id}/items`, key + 'items')
              // 这里需要判断是否是对象,且对象属性不为空
              if (isObject(elementItem) && !isEmpty(elementItem)) {
                // 新增的properties才合并进来
                result["properties"][key]["items"] = Object.assign(result["properties"][key]["items"], this._json2schema(elementItem, `${$id}/items`))
              }
            }
          } else {
            result["properties"][key] = Object.assign(result["properties"][key], this._json2schema(element, $id))
          }
        } else {
          result["properties"][key] = this._value2object(element, $id, key)
        }
      }
    }


    return result;
  }

  /**
   * 把json的值转换成对象类型
   * @param {*} value 
   * @param {*} $id 
   * @param {*} key 
   */
  _value2object(value, $id, key = '', root = false) {
    let objectTemplate = {
      $id: $id,
      title: `The ${key} Schema`,
    }

    // 判断是否为初始化root数据
    if (root) {
      objectTemplate["$schema"] = "http://json-schema.org/draft-07/schema#"
    }

    if (isInteger(value)) {
      objectTemplate.type = "integer"
    } else if (isNumber(value)) {
      objectTemplate.type = "number"
    } else if (isString(value)) {
      objectTemplate.type = "string"
    } else if (isBoolean(value)) {
      objectTemplate.type = "boolean"
    } else if (isNull(value)) {
      objectTemplate.type = "null"
    } else if (isArray(value)) {
      objectTemplate.type = "array"
    } else if (isObject(value)) {
      objectTemplate.type = "object"
    }

    return objectTemplate
  }
}

module.exports = Convert