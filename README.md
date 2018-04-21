# jsTools
造轮子，自己实现的一些js常用的方法。支持在浏览器和node环境中直接引入、也支持使用浏览器端的requirejs方式引入
=======
## 目前实现的方法
* >发布订阅模块 `_.on() _.off _.trigger()`\
  >上面三个函数分别用于订阅、移除、触发事件,用法和jQuery一样
  >>不同之处在于, 我加了命名空间的概念, 使用`_.create()`可以创建一个命名空间, 在该命名空间与全局、其他命名空间相隔离，可以发布订阅同名事件而不相互影响, 还有其他两个方法, `_.use() _.drop()`。用法如下：
  >  ```javascript
  >  var name2 = _.create('name1');
  >  name2.on('event1',callback)
  >  _.create('name2').on('event2',callback);
  >  _.use('name1').trigger('event1');
  >  _.drop('name1', 'name2', ...);//其返回一个数组，分别表示个命名空间删除是否成功
  >  ```
* >继承、扩展方法 `_.extend() 和 _.fn.extend()`\
  >`_.extend(true, target, {}, {})`第一个参数为布尔值true则进行深拷贝\
  >`_.fn.extend(true, {})`直接扩展到tools的原型fn上
  >>与jQuery的extend方法类似,不同之处在于：若目标对象中有相同属性,
  >* 若该属性非`object`或`array`, 则不复制, 即不覆盖目标对象中的该属性
  >* 若该属性为`object`或`array`, 且属性类型相同, 则将该属性扩展, 否则也不进行处理
* >对象的深拷贝 `deepClone()`\
  >`var obj = _.deepClone({} | [] | function)`输入一个进行深拷贝的对象, 返回一个包含属性的对象
* 数组的扁平化 `flattenDepth()`
* 数组去重 `unique()`
* 获取变量类型 `getType()`
* 字符串首字母大写，其他字符小写 `toUp()`
