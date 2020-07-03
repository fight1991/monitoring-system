const path = require('path')
const SpritesmithPlugin = require('webpack-spritesmith') // 雪碧图插件
const templateFunc = require(path.join(__dirname, './spriteTemplate')) // 雪碧图文件模板
const CompressionPlugin = require('compression-webpack-plugin') // Gzip压缩
const FileManagerPlugin = require('filemanager-webpack-plugin') // 将build后的文件压缩
const webpackConfig = {
  publicPath: '/', // 应用部署路径
  outputDir: process.env.VUE_APP_VERSION === 'abroad' ? 'dist/欧服' : 'dist/国服', // 生产环境构建目录
  assetsDir: 'assets', // 放置生成的静态资源
  lintOnSave: process.env.NODE_ENV !== 'production', // 生产环境不启用lint
  runtimeCompiler: false, // 是否在 Vue 组件中使用 template 选项
  productionSourceMap: false, // 不需要生产环境的 source map
  css: {
    sourceMap: process.env.NODE_ENV === 'development'
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/style/variable/color.less')
      ]
    }
  },
  devServer: {
    // proxy: {}
    overlay: { // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    open: true,
    host: '127.0.0.1',
    port: 9000,
    https: false,
    hotOnly: false,
    proxy: { // 设置代理
      '/api': { // =>相当于 http://127.0.0.1:9000/api(需要将axios配置的baseUrl='/api')接口以api开头的需要代理防止html, css, js静态资源也用了代理
        target: process.env.VUE_APP_API, // => 代理到 http://192.168.10.118:8000/c/v0
        ws: true,
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          '^/api': '' // 替代/api(因为接口地址没有/api)
        }
      }
    }
  },
  chainWebpack: config => { // npm run build --report查看打包后的文件结构
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
        config.plugins.delete('prefetch')
      }
    }
  },
  configureWebpack: { // 配置webpack
    plugins: [
      new SpritesmithPlugin({
        src: {
          cwd: './src/assets/plantIcon',
          glob: '*.png'
        },
        target: {
          image: path.resolve(__dirname, './src/assets/sprite/sprite.png'),
          css: [
            [
              path.resolve(__dirname, './src/style/sprite.less'),
              {
                format: 'function_based_template'
              }
            ]
          ]
        },
        apiOptions: {
          cssImageRef: '../assets/sprite/sprite.png'
        },
        customTemplates: {
          function_based_template: templateFunc
        }
      })
    ],
    externals: {
      'element-ui': 'ELEMENT',
      'vue-i18n': 'VueI18n',
      'vue': 'Vue',
      'vuex': 'Vuex',
      'axios': 'axios',
      'vue-router': 'VueRouter',
      'BMap': 'BMap',
      'google': 'google',
      'echarts': 'echarts'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          elementUI: {
            name: 'chunk-elementUI', // 单独将 elementUI 拆包
            priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
            test: /[\\/]node_modules[\\/]element-ui[\\/]/
          },
          xlsx: {
            name: 'chunk-xlsx',
            priority: 30, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
            test: /[\\/]node_modules[\\/]xlsx[\\/]/
          }
        }
      }
    }
  }
}
if (process.env.NODE_ENV === 'production') {
  // .js .css .html文件压缩
  let tempCompress = new CompressionPlugin({
    test: /\.js$|\.html$|\.css/, // 匹配文件名
    threshold: 10240, // 对超过10k的数据压缩
    deleteOriginalAssets: false // 不删除源文件
  })
  // 压缩打包后的文件包
  let tempFileManager = new FileManagerPlugin({
    onEnd: {
      delete: [ // 首先需要删除项目根目录下的dist.zip
        './dist/国服.zip',
        './dist/欧服.zip'
      ],
      archive: [ // 然后我们选择dist文件夹将之打包成dist.zip并放在根目录
        { source: './dist/国服', destination: './dist/国服.zip' },
        { source: './dist/欧服', destination: './dist/欧服.zip' }
      ]
    }
  })
  webpackConfig.configureWebpack.plugins.push(tempCompress)
  webpackConfig.configureWebpack.plugins.push(tempFileManager)
}
module.exports = webpackConfig
