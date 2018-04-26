var i, o;
// var j = tools.noConflict()


// 测试发布订阅模块
// var a = _.create('a')
// a.on('a',(arg1, arg2)=>{console.log(arg1,arg2)})
// _.on('a',(arg1, arg2)=>{console.log(arg1,arg2)})
// console.log(_._events)
// console.log(_._cache)
// _.trigger('a',0,1).off('a')
// a.trigger('a',1,2).off('a')
// console.log(_._events)
// console.log(_._cache)
// _.create('b')
// console.log(_._cache)
// _.drop('a','b')
// console.log(_._cache)


// extend
// console.log("对象扩展")
// 测试原型上的extend
// i = {
// 	'a':[1, 2, {
// 		a:['a','a']
// 	}],
// 	'b': 1
// }
// _.fn.extend(i);
// console.log(_.fn)
// 测试浅拷贝和深拷贝
// i = {
// 	'a':[1, 2, {
// 		a:['a','a']
// 	}],
// 	'b': 1
// }
// _.extend(o, i)
// o['a'][2].a[0] = 'b'
// console.log('input ', i)
// console.log('output: ',o)
// _.extend(true,o,i)
// o['a'][2].a[0] = 'b'
// console.log('input ', i)
// console.log('output: ',o)
// 测试函数对象及被扩展对象含有相应属性的情况
// i = function(){}
// i.a = [1,2,{a:['a','a']}]
// i.b = 1
// i.c = {'a':1}
// i.d = function(){console.log('d')}
// o = {}
// o.b = 2
// o.c = {'a':2}
// _.extend(o, i)
// console.log('input ')
// console.log(i.a)
// console.log(i.b)
// console.log(i.c)
// console.log('output: ')
// console.log(o.a)
// console.log(o.b)
// console.log(o.c)
// o.d()
// i.d = function(){console.log('dd')}
// o.d()


// 数组扁平化, 第二个参数表示扁平化深度
// console.log("数组扁平化, 第二个参数表示扁平化深度")
// i = [
//     [1, 2, 3], 1, [
//         [1, [1, 2]],
//         [1, 2]
//     ]
// ]
// o = _.flattenDepth(i, 2)
// console.log('input ', i)
// console.log('output: ', o)


// 对象深拷贝
// console.log("对象深拷贝")
// i = {
// 	'a':[1, 2, {
// 		a:['a','a']
// 	}],
// 	'b': 1,
// 	'c': {
// 		'a': 1,
// 		'b': 2
// 	}
// }
// o = _.deepClone(i)
// o['a'][2].a[0] = 'b'
// console.log('input ', i)
// console.log('output: ',o)


// 数组去重
// console.log("数组去重")
// i = [1,1,2,3,4,5,,1]
// o = _.unique(i)
// console.log('input ', i)
// console.log('output: ',o)


// // 柯里化
// console.log("柯里化")
// i = function(a,b,c,d){
// 	console.log(a,b,c,d)
// }
// o = _.curry(i)
// o(1)(2,3)(4)