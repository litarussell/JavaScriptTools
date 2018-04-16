(function(fn) {

    "use strict"

    var hasDefine = typeof define === 'function',
        hasExports = typeof module !== 'undefined' && module.exports,
        root =  (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);
    if (hasDefine) {
        define(fn);
    } else if (hasExports) {
        module.exports = fn(root);
    } else {
        fn(root);
    }
})(function(root) {
    // 该对象主要用于获取变量类型、声明深拷贝时支持的引用类型、返回特定引用类型的实例
    var typeMap = {
        'reference': ['object', 'array', 'function', 'date', 'regExp'],
        // 'object': function() { return new Object() },
        // 'array': function() { return new Array() },
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }

    var toString = Object.prototype.toString;

    var isType = function(type) {
        return function(obj) {
            return toString.call(obj) === '[object ' + type + ']';
        }
    }

    // 判断变量是否为引用类型
    var isReference = function(obj) {
        var type = getType(obj);
        if (typeMap['reference'].indexOf(type) === -1)
            return false;
        return true;
    }
    // var returnType = function(obj) {
    //     if (isReference(obj)) {
    //         return typeMap[getType(obj)]();
    //     }
    //     return new Error("returnType()不支持该变量类型");
    // }

    var tools = function() {
        // if (!(this instanceof tools)) {
        //     return new tools;
        // }
        return new tools.fn.init();
    }

    var fn = tools.fn = tools.prototype = {}

    // 使用tools()返回的实例, 其原型与tools的原型一样
    var init = tools.fn.init = function() {}
    init.prototype = tools.fn;

    var isArray = tools.isArray = isType('Array'),
        isObject = tools.isObject = isType('Object'),
        isUndefined = tools.isUndefined = isType('Undefined'),
        isString = isType('String'),
        isBoolean = isType('Boolean');

    // 首字母大写,其他字母小写
    var toUp = tools.toUp = function(str) {
        if (isString(str)) {
            var s = str.toLowerCase();

            return s[0].toUpperCase() + s.slice(1);
        }
        return new Error("toUp()类型错误");
    }
    // 获取变量类型
    var getType = tools.getType = function(obj) {
        return typeMap[toString.call(obj)];
    }
    // 拷贝策略
    // var cloneStrategies = {
    //     isArray: function(copy, arr) {
    //         arr.forEach(function(item) {
    //             copy.push(deepClone(item));
    //         })
    //     },
    //     isObject: function(copy, obj) {
    //         for (var key in obj) {
    //             copy[key] = deepClone(obj[key]);
    //         }
    //     }
    // }
    // 深拷贝
    var deepClone = tools.deepClone = function(obj) {
        // var type = "is" + toUp(getType(obj));
        var copy, arr, name;

        // if (isReference(obj)) {
            // copy = returnType(obj);
        if ( (arr = isArray(obj)) || isObject(obj) ) {
            copy = arr ? [] : {};
            // cloneStrategies[type](copy, obj);
            for (name in obj) {
                copy[name] = deepClone(obj[name]);
            }
        } else {
            return obj;
        }

        return copy;
    }
    // 用于扁平化数组
    var flattenDepth = tools.flattenDepth = function(arr, depth = 1) {
        let re = []
        if (isArray(arr)) {
            arr.forEach(item => {
                let d = depth
                if (isArray(item) && d > 0) {
                    re.push(...(flattenDepth(item, --d)))
                } else {
                    re.push(item)
                }
            })
            return re
        }

        return new Error("flattenDepth()类型错误")
    }
    // 数组去重
    tools.unique = function(arr) {
        var re = []
        if (isArray(arr)) {
            arr.forEach(function(item) {
                if (re.indexOf(item) === -1)
                    re.push(item)
            })
            return re;
        }
        return new Error("unique()类型错误")
    }
    // 函数柯里化
    tools.curry = function(f) {
        var len = f.length,
            slice = [].slice
        return function curried() {
            var args = slice.call(arguments)
            if (args.length < len) {
                return function() {
                    var more = slice.call(arguments)
                    return curried.apply(this, args.concat(more))
                }
            } else {
                return f.apply(this, args)
            }
        }
    }
    // 继承
    var extend = tools.extend = function() {
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
        if ( i === len ) {
            target = this;
            i--;
        }
        for(; i < len; i++) {
            obj = arguments[i];

            for(name in obj) {
                copy = obj[name];
                own = target[name];

                if (target === copy) {
                    continue;
                }
                if ( deep && copy && isObject(copy) || (arr = isArray(copy)) ){
                    // 如果被扩展的对象有该属性,且属性类型相同,则将该属性扩展;否则不会将该属性覆盖
                    clone = own && (getType(own) === getType(copy)) ? own : (arr ? [] : {});
                    target[name] = extend(deep, clone, copy);
                }else if (!isUndefined(copy)) {
                    if (!own) {target[name] = copy}
                }
            }
        }
        return target
    }
    fn.extend = function() {
        var arg = [].slice.call(arguments)
        extend(this, arg)
        return this
    }

    // 发布订阅模块
    var Event = function() {
        var _cache = {},
            on, off, trigger

        on = function(e, fn) {
            if (!_cache[e])
                _cache[e] = []
            _cache[e].push(fn)
        }

        off = function(e, fn) {
            var event = _cache[e]
            if (!event)
                return false

            if (!fn)
                event && (event.length = 0)
            else
                for (var i = event.length - 1; i >= 0; i--) {
                    if (event[i] === fn)
                        event.splice(i, 1)
                }
        }

        trigger = function() {
            var e = [].shift.call(arguments),
                fns = _cache[e]

            if (!fns || fns.length === 0)
                return false

            fns.forEach(function(fn){
                fn.apply(this, arguments)
            })
        }

        return {
            on: on,
            off: off,
            trigger: trigger
        }
    }

    var previous_ = root._,
        previous_tools = root.tools;

    tools.noConflict = function(deep) {
        if ( root._ === tools ) {
            root._ = previous_;
        }

        if ( deep && root.tools === tools ) {
            root.tools = previous_tools;
        }

        return tools;
    }

    root._ = root.tools = tools;

    return tools;
})