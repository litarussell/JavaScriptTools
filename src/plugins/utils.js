const typeMap = {
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Undefined]': 'undefined',
  '[object Null]': 'null',
  '[object Function]': 'function',
  '[object Array]': 'array',
  '[object Date]': 'date',
  '[object RegExp]': 'regExp',
  '[object Object]': 'object'
}

const toString = Object.prototype.toString

function isType (type) {
  return function (obj) {
    return toString.call(obj) === '[object ' + type + ']';
  }
}

const isArray = isType('Array')
const isObject = isType('Object')
const isBoolean = isType('Boolean')

// 继承
const extend = function () {
  var obj, copy, name, own, arr, clone,
    len = arguments.length,
    target = arguments[0] || {},
    i = 1,
    deep = false;

  if (isBoolean(target)) {
    deep = target;
    target = arguments[i++] || {};
  }
  // 如果只有一个对象参数，则将其复制到tools上
  if (i === len) {
    target = this;
    i--;
  }
  for (; i < len; i++) {
    obj = arguments[i];

    for (name in obj) {
      copy = obj[name];
      own = target[name];

      if (target === copy) {
        continue;
      }
      if (deep && copy && isObject(copy) || (arr = isArray(copy))) {
        // 如果被扩展的对象有该属性,且属性类型相同,则将该属性扩展;否则不会将该属性覆盖
        clone = own && (getType(own) === getType(copy)) ? own : (arr ? [] : {});
        target[name] = extend(deep, clone, copy);
      } else if (!isUndefined(copy)) {
        if (!own) {
          target[name] = copy
        }
      }
    }
  }
  return target
}

// 函数柯里化
const curry = function () {
  let len = f.length
  const slice = [].slice
  return function curried() {
    let args = slice.call(arguments)
    if (args.length < len) {
      return function () {
        let more = slice.call(arguments)
        return curried.apply(this, args.concat(more))
      }
    } else {
      return f.apply(this, args)
    }
  }
}

// 防抖
const debounce = function (fn, flag = true, wait = 100) {
  let timer = null
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timer)
    if (flag) fn.apply(context, args)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, wait)
  }
}

// 节流 flag: 标示是否首次执行
const throttle = function (fn, flag = true, wait = 100) {
  let timer = null
  return function () {
    let context = this
    let args = arguments
    if (!timer) {
      if (flag) fn.apply(context, args)
      timer = setTimeout(function () {
        fn.apply(context, args)
        timer = null
      }, wait)
    }
  }
}

module.export = {
  isArray, isObject, isBoolean,
  extend,
  getType (obj) {
    return typeMap[toString.call(obj)];
  }
}
