/*
* 记录了一次 循环/闭包/块级作用域 踩坑的过程
* 起因是在写 test.js 时, 使用了 for 循环生成测试用例 it(), 代码如下
*
  describe("测试套件", function () {
    let expected,
      input,
      output

    let testData = [
      {input: [0,0], expected: 0},
      {input: [0,1], expected: 1},
      {input: [1,2], expected: 3},
    ]

    for (let data of testData) {
      expected    = data.expected
      input       = data.input
      output      = sum(...data.input) // 求和函数

      it("测试 sum 函数", function() {
        expect(output).to.be.equal(expected)
      });
    }
  })
* 这个 sum() 函数有问题:
*   sum(0,0) // 返回 1, 应该是通不过测试
*   sum(0,1) // 返回 2, 应该是通不过测试
*   sum(1,2) // 返回 3, 应该通过测试
*
* 结果显示 3 个测试用例都通过了, 为什么?
*
* 经过调试, 发现三个 it() 执行时, 传入的 output = 3, expected = 3
* 也就是测了 3 次最后一个测试用例
*
* 经过调试, 修改为以下即可正常测试
      it("测试 sum 函数", function() {
        expect(sum(...data.input)).to.be.equal(data.expected)
      });

* 所以有了以下探寻之旅, 看完全部即可了解为什么
*
* 参考链接:
* 1. [js关于for循环中的闭包问题？ - 天浩的回答 - 知乎](https://www.zhihu.com/question/33468703/answer/85182587)
* */

function foo1() {

  let ary = []

  for (var i = 0; i < 4; i++) {
    ary.push(function () {
      console.log(i)
    })
  }

  for (let f of ary) {
    f()
  }

  /*
      结果是 ?
      4,4,4,4

      为何 ?

      f 的 Scopes :
        0: Closure (foo1) {i: 4}
        1: Global

        // 这里的 i 等于 foo1 作用域内的 i 值, i=4是因为for-lopp 结束时还有一个 i++
  */

}

function foo2() {

  let ary = []

  for (let i = 0; i < 4; i++) {
    ary.push(function () {
      console.log(i)
    })
  }

  for (let f of ary) {
    f()
  }

  /*
      结果是 ?
      0,1,2,3

      为何 ? 每个匿名函数都被包在了一个块级作用域内了
      ary[0] 的 Scopes :
        0: Block {i: 0}
        1: Global

      ary[1] 的 Scopes :
        0: Block {i: 1}
        1: Global

      ary[2] 的 Scopes :
        0: Block {i: 2}
        1: Global

      ary[3] 的 Scopes :
        0: Block {i: 3}
        1: Global
  */
}

function foo3() {

  let ary = []

  for (var i = 0; i < 4; i++) {
    // 使用 let 时, xx 了块级作用域
    // 每次循环时都创建了一个块级作用域, 并且因为 下方有用到 copyI, 所以块级作用域没有销毁?
    let copyI = i
    ary.push(function () {
      console.log(copyI)
    })
  }

  for (let f of ary) {
    // f() 执行时, 函数自身内没有 copyI, 因此向作用域链上方寻找
    // 在块级作用域内找到了 copyI
    f()
  }

  /*
      结果是 ?
      0,1,2,3

      为何 ? 每个匿名函数都被包在了一个块级作用域内了
      ary[0] 的 Scopes :
        0: Block {copyI: 0}
        1: Global

      ary[1] 的 Scopes :
        0: Block {copyI: 1}
        1: Global

      ary[2] 的 Scopes :
        0: Block {copyI: 2}
        1: Global

      ary[3] 的 Scopes :
        0: Block {copyI: 3}
        1: Global
  */
}

// 与 foo3 对比学习
function foo4() {

  let ary = []
  let copyI

  for (var i = 0; i < 4; i++) {
    // copyI 并未在 for 循环内声明, 所以没有形成块级作用域
    // 匿名函数内引用了自身没有的变量, 此时形找到了成闭包, 函数被调用前是不知道 copyI 的值时多少的
    copyI = i
    ary.push(function () {
      console.log(copyI)
    })
  }

  for (let f of ary) {
    // 匿名函数被调用时向上寻找作用域, 最后在声明 copyI 的块级作用域内找到了, 等于 3
    f()
  }
  /*
      结果是 ?
      3,3,3,3

      为何 ?
      f 的 Scopes :
        0: Closure (foo4) {copyI: 3} // 这里的 copyI 等于 foo4 作用域内的 copyI 值
        1: Global
  */
}

function foo5() {

  let ary = []

  for (var i = 0; i < 4; i++) {
    var f = function () {
      console.log(i)
    }
    ary.push(f)
  }

  for (let f of ary) {

    f()
  }
  /*
      结果是 ?
      4,4,4,4

      为何?
      f 的 Scopes :
        0: Closure (foo5) {i: 4} // 这里的 i 等于 foo5 作用域内的 i 值
        1: Global
  */
}

function foo6() {

  let ary = []

  for (var i = 0; i < 4; i++) {
    let f = function () {
      console.log(i)
    }
    ary.push(f)
  }

  for (let f of ary) {

    f()
  }
  /*
      结果是 ?
      4,4,4,4

      为何?
      f 的 Scopes :
        0: Closure (foo6) {i: 4} // 这里的 i 等于 foo6 作用域内的 i 值
        1: Global
  */
}
