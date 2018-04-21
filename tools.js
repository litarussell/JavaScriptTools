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

    var toString = Object.prototype.toString;

    var isType = function(type) {
        return function(obj) {
            return toString.call(obj) === '[object ' + type + ']';
        }
    }

    var tools = function() {
        // if (!(this instanceof tools)) {
        //     return new tools;
        // }
        return new tools.fn.init();
    }

    var fn = tools.fn = tools.prototype = {};

    // 使用tools()返回的实例, 其原型与tools的原型一样
    var init = tools.fn.init = function() {};
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
    // 深拷贝
    var deepClone = tools.deepClone = function(obj) {
        var copy, arr, name;
        
        if ( (arr = isArray(obj)) || isObject(obj) ) {
            copy = arr ? [] : {};
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
        extend(this, ...arg)
        return this
    }

    // 发布订阅模块
    var Event = function() {
        this._events = {};
    }
    Event.prototype = {
        on : function(e, fn) {
            if (!this._events[e])
                this._events[e] = []
            this._events[e].push(fn);
            return this;
        },

        off : function(e, fn) {
            var event = this._events[e];
            if (!event)
                return false;

            if (!fn)
                event && (delete this._events[e]) 
            else
                for (var i = event.length - 1; i >= 0; i--) {
                    if (event[i] === fn)
                        event.splice(i, 1)
                }
            return this;
        },

        trigger : function() {
            var args = [].slice.call(arguments),
                e = args.shift(),
                fns = this._events[e]

            if (!fns || fns.length === 0)
                return false

            fns.forEach(function(fn){
                fn.apply(this, args)
            })
            return this;
        }
    }

    tools.extend(new Event)

    // 事件模块的命名空间
    tools.extend({
        create : function(name){
            var cache = this._cache ? this._cache : (this._cache = {}),
                space;

            if (!(typeof name === "string")) {
                return new Error('命名空间名必须是字符串');
            }

            if ( (space = cache[name]) && (space instanceof Event) ) {
                return space;
            } else {
                space = this._cache[name] = new Event;
                return space;
            }
        },
        use: function(name){
            if (!(typeof name === "string")) {
                return new Error('命名空间名必须是字符串');
            }
            if (this._cache) {
                return this._cache.hasOwnProperty(name) ? this._cache[name] : false;
            }
            return false;
        },
        drop: function(){
            var re = {},
                arr = [].slice.call(arguments),
                len = arr.length,
                args = tools.unique(arr),
                that = this;
            args.forEach(function(name){
                if (!(typeof name === "string")) {
                    re[name] = false;
                }else if (that._cache && that._cache.hasOwnProperty(name)) {
                    that._cache[name] ? 
                    (delete that._cache[name] ? re[name] = true : re[name] = false) : re[name] = false;
                }
            })
            return re;
        }
    })

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