(function(tools) {
    var hasDefine = typeof define === 'function'
      , hasExports = typeof module !== 'undefined' && module.exports;
    if (hasDefine) {
        define(tools);
    } else if (hasExports) {
        module.exports = tools();
    } else {
        this.tools = tools();
    }
}
)(function() {
    var _typeMap = {
        'reference' : ['object', 'array'/*, 'date', 'regExp', 'function'*/],
        'object': function(){return new Object()},
        'array': function(){return new Array()},
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

    var _toString = Object.prototype.toString

    var _isType = function(type) {
        return function(obj) {
            return _toString.call(obj) === '[object ' + type + ']';
        }
    }
    
    var _isString = _isType('String'),
        _isArray = _isType('Array')

    var _isReference = function(obj) {
        var type = getType(obj)
        if (_typeMap['reference'].indexOf(type) === -1)
            return false
        return true
    }
    var _returnType = function(obj){
        var type = getType(obj)
        return _typeMap[type]()
    }

    var tools = function() {}

    // 首字母大写,其他字母小写
    var toUp = function(str){
        if (_isString(str)) {
            var s = str.toLowerCase()

            return s[0].toUpperCase() + s.slice(1)
        }
        return new Error("toUp()类型错误")
    }
    // 获取变量类型
    var getType = function(obj) {
        return _typeMap[_toString.call(obj)];
    }
    // 用于抹平数组
    var flattenDepth = function(arr, depth=1) {
        let re = []
        if (isArray(arr)) {
            arr.forEach(item=>{
                let d = depth
                if (Array.isArray(item) && d > 0) {
                    re.push(...(flattenDepth(item, --d)))
                } else {
                    re.push(item)
                }
            })
            return re
        }
            
        return new Error("flattenDepth()类型错误")
    }
    // 深拷贝
    // 拷贝策略
    var _cloneStrategies = {
        isArray: function(copy, arr){
            arr.forEach(function(item){
                copy.push(deepClone(item))
            })
        },
        isObject: function(copy, obj){
            for(var key in obj){
                copy[key] = deepClone(obj[key])
            }
        },
    }
    var deepClone = function(obj){
        var type = "is" + toUp(getType(obj))

        if (_isReference(obj)) {
            var copy = _returnType(obj)
            _cloneStrategies[type](copy, obj)
        }else{
            return obj
        }
        
        return copy
    }
    // 数组去重
    var unique = function(arr){
        var re = []
        if (isArray(arr)) {
            arr.forEach(function(item){
                if (re.indexOf(item) === -1)
                    re.push(item)
            })
            return re;
        }
        return new Error("unique()类型错误")
    }
    

    var fn = tools.prototype = {
        isString: _isString,
        isArray: _isArray,
    }

    fn.flattenDepth = flattenDepth
    fn.getType = getType
    fn.toUp = toUp
    fn.deepClone = deepClone
    fn.unique = unique

    return new tools;
})
