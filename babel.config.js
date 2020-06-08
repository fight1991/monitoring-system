module.exports = {
  presets: [
    // '@vue/cli-plugin-babel/preset'
    '@vue/app',
    [
      '@babel/preset-env', {
        modules: false
      }
    ]
  ],
  plugins: [
    [
      'component',
      { // 按需加载scss文件(项目中theme.scss配置自定义主题),否则会出现样式文件引入2次
        'libraryName': 'element-ui/packages',
        'styleLibraryName': 'theme-chalk/src',
        'ext': '.scss'
      }
    ]
  ]
}
