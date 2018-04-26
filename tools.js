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
        isNaN = tools.isNaN = function(num) {
            if (Number.isNaN) {
                return Number.isNaN(num);
            }
            return num !== num;
        },
        isBoolean = isType('Boolean');

    // 首字母大写,其他字母小写
    var toUp = tools.toUp = function(str) {
        if (typeof str === 'string') {
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

    // 单例模式
    var getSingle = tools.getSingle = function(fn) {
        var re;
        return function() {
            return re || (re = fn.call(this, arguments));
        }
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

    // 表单校验
    var fromStrategies = {
        isNonEmpty: function(val, err) {
            if (val === '') return err;
        },
        minLength: function(val, len, err) {
            if (val.length < len) return err;
        },
        isMobile: function(val, err) {
            if (! /(^1[3|5|8][0-9]{9$})/.test(val)) return err;
        }
    }
    var Validator = tools.form = function() { this.cache = []; }
    Validator.prototype.add = function(dom, rules) {
        var self = this;
        for (var i = 0, rule; rule = rules[i++];) {
            (function(rule){
                var ary = rule.strategy.split(':');
                var err = rule.err;
                self.cache.push(function(){
                    var strategy = ary.shift();
                    ary.unshift(dom.value);
                    ary.push(err);
                    return fromStrategies[strategy].apply(dom, ary);
                })
            })(rule)
        }
    }
    Validator.prototype.start = function() {
        var msg;
        for (var i = 0, fn; fn = this.cache[i++];) {
            if (msg = fn()) {
                return msg;
            }
        }
    }

    // 动画
    // 参数: 动画已消耗时间、原始位置、目标位置、持续总时间
    var tween = {
        linear: function(t, b , c, d) {
            return c * t / d + b;
        },
        easeIn: function(t, b , c, d) {
            return c * (t /= d) * t + b;
        },
        strongEaseIn: function(t, b , c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        strongEaseOut: function(t, b , c, d) {
            return c * ( (t /= d - 1) * t * t * t * t + 1 ) + b;
        },
        sineaseIn: function(t, b , c, d) {
            return c * (t /= d) * t * t + b;
        },
        sineaseOut: function(t, b , c, d) {
            return c * ( (t /= d - 1) * t * t + 1 ) + b;
        },
    }
    var Animate = function(dom) {
        this.dom = dom;
        this.startTime = 0;
        this.startPos = 0;          //初始位置
        this.endPos = 0;
        this.propertyName = null;   //需要被改变的css属性名
        this.easing = null;         //缓动算法
        this.duration = null;       //持续时间
    }
    Animate.prototype.start = function(propertyName, endPos, duration, easing) {
        this.startTime = +new Date;
        this.startPos = this.dom.getBoundingClientReact()[propertyName];
        this.propertyName = propertyName;
        this.endPos = endPos;
        this.duration = duration
        this.easing = tween[easing];

        var self = this;
        var timeId = setInterval(function(){
            if (self.step() === false) { //若动画结束则清楚计时器
                clearInterval(timeId);
            }
        }, 19);
    }
    Animate.prototype.step = function() {
        var t = + new Date;
        if (t >= this.startTime + this.duration) {
            this.update(this.endPos);
            return false;
        }
        var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
        this.update(pos);
    }
    Animate.prototype.update = function(pos) {
        this.dom.style[this.propertyName] = pos + 'px';
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