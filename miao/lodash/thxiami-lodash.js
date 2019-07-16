function compact(ary) {
  return ary.filter(it => it)
}

function flatten(ary) {
  return [].concat(...ary.slice())
}

function flattenDeep(ary) {
  let flatted = []
  for (let i = 0; i < ary.length; i++) {
    let item = ary[i]

    if (Array.isArray(item)) {
      flatted = flatted.concat(flattenDeep(item))
    } else {
      flatted.push(item)
    }
  }
  return flatted
}

function flattenDepth(ary, depth = 0) {
  for (let i = 0; i < depth; i++) {
    ary = flatten(ary)
  }
  return ary
}

function flip(func) {
  return function (...args) {
    return func(...args.reverse())
  }
}

function before(n, func) {
  let count = 0
  let lastResult
  return function (...args) {
    count += 1
    if (count < n) {
      lastResult = func(...args)
      return lastResult
    } else {
      return lastResult
    }
  }
}

function negate(f) {
  return function () {
    return !f.apply(null, arguments)
  }
}

function memorize(f) {
  let cache = {}
  return function (arg) {
    if (arg in cache) {
      return cache[arg]
    } else {
      return cache[arg] = f(...arg)
    }
  }
}

function spread(func, start = 0) {
  return function (argsAry) {
    let spreadArgs = argsAry.slice(start)
    return func(...spreadArgs)
  }
}

// 必须使用 var
// 函数变量名小写
var thxiami = {
  compact,
  flatten,
  flattenDeep,
  flattenDepth,
  before,
  // every,
  // some,
  spread,
  // ary,
  // unary,
  // memorize,
  // curry,
}
