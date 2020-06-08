
### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 项目兼容性 ##
>  Vue 不支持 IE8 及以下版本，因为 Vue 使用了 IE8 无法模拟的 ECMAScript 5 特性。  
>  但它支持所有兼容 ECMAScript 5 的浏览器。
   
  
--------------------------
   
  
## 运行环境 ##
>  
>  Node.js(8.0.0 +) —— JavaScript 运行环境  
>  npm(6.0.0+) —— Nodejs 下的包管理器  
>  webpack(4.1.0) —— 模块打包器  
>  vue-cli(4.1.0) —— Vue脚手架
>  
>  
>  1. 全局安装 vue-cli  先删除低版本npm uninstall -g vue-cli
> `$ npm install -g @vue/cli`
>  2. 全局安装 webpack  
> `$ npm install webpack -g`
>  3. 全局安装 yarn  
> `$ npm install yarn -g`
>  4. 安装项目依赖包，不要从国内镜像cnpm安装，可能会导致后面缺了很多依赖库  
> `$ yarn install`
  
  
--------------------------
  
  
## 项目运行 ##
>  1. 开发环境，项目将运行在 `http:127.0.0.1:9000`  
> `$ npm run dev/serve` 
>  2. 生产打包，打包目录 dist  
> `$ npm run build`

## 集成环境 ##
>  1. less 方便css开发
>  2. mock 方便前期的接口对接模拟开发
>  3. eslint 代码质量检测，开发虽然麻烦，但确保代码质量，需要了解eslint规范
>  4. elementUI 集成elementUI组件库
>  5. 集成其他后续补充


## 开发规范 ##
>  1. 熟悉eslint代码质量检测规范
>  2. 注释规范：
>     1.公共组件使用说明
>     2.各组件中重要函数或者类说明
>     3.复杂的业务逻辑处理说明
>     4.特殊情况的代码处理说明,对于代码中特殊用途的变量、存在临界值、函数中使用的hack、使用了某种算法或思路等需要进行注释描述
>     5.注释块必须以/**（至少两个星号）开头**/；
>     6.单行注释使用//；
>  3. 命名规范：
>     1、文件命名使用驼峰法：headTitle.vue  headTitle.js headTitle.css ；
>     2、css命名使用横线分割：head-title ；
>     3、js变量命名使用驼峰法:headTitle；
>     4、组件命名使用横线分割：<vue-header></vue-header>；
>     5、引用其他来源组件库、js库、css库产生的非规范命名的除外；
>  4. src各目录作用：  
>     assets：src/assets/静态文件；
>     components：自定义的公共组件；
>     directives：自定义指令；
>     filters：全局过滤器；
>     mock：前期模拟网络接口返回数据；
>     net: 网络请求方法封装；
>     router/index.js：路由总控；
>     router/tabMethods: 页签跳转方法
>     store：全局状态管理；
>     views：功能模块页面；
>         pages: 业务功能页面;
>         error：系统错误页面；
>         login: 登录/注册页面
>         inverter: 逆变器其他页面

>  5. 布局规范：
>     1、html 的布局层次尽量不要过深，避免出现不必要的层级；
>     2、img a 禁止出现空地址或#,避免页面重绘；
>     3、对于出现多次的布局，建议做成组件提取出来放在src/components/下
>  6. css：
>     1、公共样式存放在src/style/下，单页面样式存放在模块下面；
>         base.less 重置标签默认样式 
>         color.less 颜色变量
>         main.less 覆盖element-ui默认样式
>         variable.scss 设置element-ui主题颜色
>     2、所有静态图片必须压缩减重（推荐：www.tinypng.com）,移动端尽量控制在50kb以下，pc端在150kb以下；
>     3、声明顺序尽量规范： 
>       1.位置属性(position, display, left, top, right, float, overflow, z-index等)
>       2.大小(width, height, margin, padding)
>       3.文字系列(font, color, text-align, line-height, letter-spacing等)
>       4.背景(background-color, background, border等)
>       5.其他(animation, transition等)
>  7. vue或组件、js：
>     1.使用ES6风格编码源码：定义变量使用let ,定义常量使用const；使用export ，import 模块化；
>     2.组件 props 原子化：提供默认值；使用 type 属性校验类型；使用 props 之前先检查该 prop 是否存在
>     3.调试信息console.log()使用完及时删除

## 路由路径配置要求 ##   
>  1. 一级菜单：必须以模块命名，例如：财务管理 /finace
>  2. 二级菜单：必须以一级名称+二级名, 例如：财务管理-->物流费用 /finance/logistics

## 页签跳转 ## 
> 1. this.$tab.open 打开新页签, 需要定义一个tabId
> 2. this.$tab.push 同this.$router.push 在已有的页签中查找,有则激活,无则新增
> 3. this.$tab.replace 替换已有页签,无则打开新页签
> 4. this.$tab.open 关闭当前tab,打开指定tab(如果存在就刷新)
 
