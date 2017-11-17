import path from "path";
import MinifyPlugin from "babel-minify-webpack-plugin";

// Track current mode of execution development/production
const __development = process.env.NODE_ENV === "development";

const libraryName = "stush";
const outputFile = `${libraryName}.js`;

export default {
  entry: `${__dirname}/src/index.js`,
  devtool: __development ? "source-map": "",
  output: {
    path: `${__dirname}/lib`,
    filename: outputFile,
    library: libraryName,
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve("./src")
    ],
  },
  plugins: [
    ...(__development ? []: [
      new MinifyPlugin()
    ])
  ]
};