var website ={
    publicPath:"http://192.168.0.102:1717"//这里的IP和端口，是你本机的ip或者是你devServer配置的IP和端口
}
const glob = require('glob');//node的glob对象使用
const PurifyCSSPlugin = require("purifycss-webpack");//消除未使用的CSS
const path=require('path');
const htmlPlugin= require('html-webpack-plugin');//html打包到path.resolve(__dirname,'dist')
const extractTextPlugin = require("extract-text-webpack-plugin");//分离css
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');//压缩代码
module.exports={
    entry:{ // 入口文件的配置项
        entry:'./src/index.js'
    },
    output:{  // 出口文件的配置项
        path:path.resolve(__dirname,'dist'),
        filename:'index.js',
        publicPath:website.publicPath
    },
    module:{ // 模块：例如解读CSS,图片如何转换，压缩
        rules: [
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },//自动处理CSS3属性前缀
                        'postcss-loader'
                    ]
                })
            },{
                test:/\.(png|jpg|gif)/ ,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:500000,
                        outputPath:'images/' // 把图片打包到images文件夹里
                    }
                }]
            },{
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader']//解决在hmtl文件中引入<img>标签的问题
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader" // 分离sass
                    }, {
                        loader: "less-loader" // 分离less
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            }
        ]
    },
    plugins:[  // 插件，用于生产模版和各项功能
        new UglifyJsPlugin(),//压缩代码
        new extractTextPlugin("css/index.css"),//分离css
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./src/index.html'

        }),
        new PurifyCSSPlugin({ //消除未使用的CSS
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        })
    ],
    devServer:{ // 配置webpack开发服务功能
        contentBase:path.resolve(__dirname,'dist'),//设置基本目录结构
        host:'0.0.0.0',//服务器的IP地址，可以使用IP也可以使用localhost
        compress:true, //服务端压缩是否开启
        port:1717//配置服务端口号
    }
}