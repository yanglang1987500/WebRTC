const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = (env, options) => {
  const isDevelopment = options.mode === "development";
  const publicPath = "" ;
  console.log(options.mode, isDevelopment);
  return {
    devServer: {
      contentBase: path.join(__dirname, "../dist"),
      host: "0.0.0.0",
      compress: true,
      port: 8085,
    },
    context: path.join(__dirname, "../src"),
    resolve: {
      modules: [path.join(__dirname, "../src"), "node_modules"],
      alias: {
        "@business": path.join(__dirname, "../src/business"),
        "@common": path.join(__dirname, "../src/common"),
        "@pages": path.join(__dirname, "../src/pages"),
        "@containers": path.join(__dirname, "../src/containers"),
        "@store": path.join(__dirname, "../src/store"),
        "@router": path.join(__dirname, "../src/router"),
        "@components": path.join(__dirname, "../src/components"),
        "@locales": path.join(__dirname, "../src/locales"),
        "@http": path.join(__dirname, "../src/common/utils/http.ts")
      },
      extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".less", ".mess"]
    },
    entry: {
      index: "index.tsx"
    },
    output: {
      filename: "[name].js",
      chunkFilename: "chunks/[name].[chunkhash:8].js",
      publicPath: publicPath
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "source-map-loader"
        },
        {
          test: /(\.js)|(\.jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: ["react", "es2015", "stage-0", "mobx"],
            plugins: ["transform-runtime"]
          }
        },
        {
          test: /(\.ts)|(\.tsx)$/,
          exclude: [/node_modules/, /\.test.tsx?$/],
          use: [{
            loader: path.resolve(__dirname, 'image-prefix-loader.js'),
            options: {
              prefix: publicPath
            }
          }, {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"]
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: ["style-loader", "css-loader", "postcss-loader", "less-loader"]
        },
        {
          test: /\.(png|jpg|gif|svg|eot|svg|ttf|woff|woff2)$/,
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "react/sources/images/[name].[ext]"
          }
        }
      ]
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.join(__dirname, "../tsconfig.json")
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require("../dist/dll/vendor-manifest.json")
      }),
      new HtmlWebpackPlugin({
        hash: true,
        inject: true,
        chunks: ["index"],
        template: "index.html",
        filename: "index.html"
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(options.mode),
          RES_PATH: JSON.stringify(publicPath)
        }
      })
    ],
    externals: {
      "hls.js/dist/hls.light.min": "Hls",
      "moment": "moment"
    }
  };
};
