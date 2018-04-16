# mpvue-wx-project

> mpvue 开发小程序

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production(default) with minification
npm run build

# build for different env with minification
npm run build -- -e development(服务开发环境)
npm run build -- -e testing(服务器测试环境)
npm run build -- -e release(服务器预发环境)
npm run build -- -e production(线上环境)

# build for production and view the bundle analyzer report
npm run build --report

# 开发注意事项
> 1. 代码检测标准采用经过各方确认采用统一的的airbnb-base(如果是用react开发时才用airbnb)，注意统一采用4个空格，不能用tab键,大家可以在自己的编辑器中配置tab所代表的空格数(要求4)
> 2. dist 目录是不会提交至版本库的，只有在需要发布上线特定版本的时候由开发人员自行编译上传到微信官网小程序并上线.
> 3. 为了后期web 和小程序之间的代码可复用问题考虑，所有的样式代码统一以px单位(基于 独立像素375px（750/2）)
> 4. 项目结构完成说明
A. 小程序架构基本配置，接入工程化scss,babel等.
B. 环境切换配置
C. 可复用的单位计算px
   (px2rpx-loader试下px到小程序可以识别的单位rpx.统一基于独立像素:375px计算)


# 目录结构

├── README.md                   # 项目说明文档
├── build                       # 构建文件配置目录
├── config                      # 环境变量配置目录
|    ├── dev.env.js             # 开发环境配置
│    ├── index.js               # 不同环境配置入口配置文件
│    ├── pre.env.js             # 预发环境配置
│    ├── test.env.js            # 测试环境配置
│    ├── prod.env.js            # 线上环境配置
├── dist                        # 小程序项目运行目录
├── node_modules
└── src
│    ├── components             # 公共组件目录(组件首字母大写，驼峰模式)
│    │   └── card.vue           # 特定组件
│    │   └── ...                # 其他components
|    ├── pages                  # 页面目录
│    │   └── index              # 首页
│    │       ├── index.vue
│    │       └── main.js 
│    │   └── ......             # 其他页面
│    ├── utils                  # 工具函数目录
│    ├── style                  # 公共样式文件/以及scss配置文件
│    │   └── base               # 首页
│    │       └── varibale       # 公用变量
│    │       └── function       # 公用函数
│    │       └── mixin          # 公用mixin
│    │       └── placeholder    # 公用占位符
│    │       └── reset          # 基本样式重置
│    │       └── common         # 公用样式入口
│    ├── static                 # 其他静态资源
│    │   └── img                # 图片
├──  .babelrc
├──  package.json
├── .eslintignore               # eslint 检测忽略文件
├── .eslintrc.js                # eslint相关配置
├── .gitignore                  # git 忽略文件目录
├── README.md                   # 特定项目文档说明文件
├── project.config.json         # 小程序配置文件(可以根据自己喜好情况配置，如果自己修改保存在个人仓库或者自己本地即可)
├── yarn.lock                   # yarn 

```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
