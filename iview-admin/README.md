# iview-admin-template

## Project setup
```
npm install
```

### 笔记
1、父组件通过ref方法调用子组件的方法
`this.$refs.sidebar.collapsedSider()`

2、使用`display:inline-block`标签元素不在同一条直线上,要使用` vertical-align: middle;`

3、`this.$route.matched`返回的是当前路由及当前路由的父路由数组

4、解决路由重复点击报错问题,在router.js文件下面,修改router的push方法
```js
// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
```
5、`graph`是根据antv/g6而制作的拓扑图
