'use strict'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const paths = require('../utils/paths')

const isProd = process.env.NODE_ENV === 'production'

const plugins = []
if (isProd) {
  const filename = paths.getAssetPath(`css/[name].[contenthash:8].css`)

  plugins.push(
    new MiniCssExtractPlugin({
      filename,
      chunkFilename: filename,
    })
  )
}

const genStyleRules = () => {
  const cssLoader = {
    loader: 'css-loader',
    options: {
      // how many loaders before css-loader should be applied to [@import]ed resources.
      // stylePostLoader injected by vue-loader + postcss-loader
      importLoaders: 1 + 1,
      esModule: false, // css-loader using ES Modules as default in v4, but vue-style-loader support cjs only.
    },
  }
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('autoprefixer'),
          require('postcss-px-to-viewport')({
            unitToConvert: 'px', //需要转换的单位，默认为"px"
            viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度
            unitPrecision: 13, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
            propList: ['*'], // 能转化为vw的属性列表
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
            fontViewportUnit: 'vw', //字体使用的视口单位
            selectorBlackList: ['.ignore-', '.hairlines'], //指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
            minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
            mediaQuery: false, // 允许在媒体查询中转换`px`
            replace: true, //是否直接更换属性值，而不添加备用属性
            exclude: [/RightBar/, /gotop.vue/], //忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
            landscape: false, //是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
            landscapeUnit: 'vw', //横屏时使用的单位
            landscapeWidth: 1134, //横屏时使用的视口宽度
          }),
        ],
      },
    },
  }
  const extractPluginLoader = {
    loader: MiniCssExtractPlugin.loader,
  }
  const vueStyleLoader = {
    loader: 'vue-style-loader',
  }

  function createCSSRule(test, loader, loaderOptions) {
    const loaders = [cssLoader, postcssLoader]

    if (isProd) {
      loaders.unshift(extractPluginLoader)
    } else {
      loaders.unshift(vueStyleLoader)
    }

    if (loader) {
      loaders.push({ loader, options: loaderOptions })
    }

    return { test, use: loaders }
  }

  return [
    createCSSRule(/\.css$/),
    createCSSRule(/\.p(ost)?css$/),
    createCSSRule(/\.scss$/, 'sass-loader'),
  ]
}

module.exports = {
  plugins,
  module: {
    rules: genStyleRules(),
  },
}
