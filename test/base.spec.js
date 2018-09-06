const Convert = require("../index");
const Ajv = require("ajv")
const assert = require("assert");

describe("# Convert 转换测试", () => {
  let c
  before(() => {
    c = new Convert()
  });

  it('object type test', () => {
    const data = {
      id: 1,
      name: "mind",
      booleanTrue: true,
      booleanFalse: false,
      nullType: null,
      listEmpty: [],
      listNumber: [1],
      listString: ["1"],
      listObject: [
        { listId: 1, listName: "mind" }
      ],
      object: {
        userId: 1,
        child: {
          id: 1,
          name: "mind",
          listEmpty: [],
          listNumber: [1],
          listString: ["1"],
          listObject: [
            { listId: 1, listName: "mind" }
          ],
        }
      }
    }
    const schema = c.format(data)
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(data)
    assert.equal(valid, true)
  });

  it('empty array type test', () => {
    const data = []
    const schema = c.format(data)
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(data)
    assert.equal(valid, true)
  });


  it('base array type test', () => {
    const data = [1]
    const schema = c.format(data)
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(data)
    assert.equal(valid, true)
  });

  it('obj array type test', () => {
    const data = [{ id: 1, name: "mind" }]
    const schema = c.format(data)
    const ajv = new Ajv()
    const validate = ajv.compile(schema)
    const valid = validate(data)
    assert.equal(valid, true)
  });
})