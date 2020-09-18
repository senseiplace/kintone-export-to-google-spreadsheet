/* eslint-env node */
const path = require("path");
const KintonePlugin = require("@kintone/webpack-plugin-kintone-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "inline-cheap-module-source-map",
  entry: {
    config: "./src/js/config.ts",
    desktop: "./src/js/desktop.ts",
  },
  output: {
    path: path.resolve(__dirname, "plugin", "js"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.[t|j]sx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "usage",
                corejs: 3,
                modules: false,
              },
            ],
            "@babel/preset-typescript",
            "@babel/preset-react",
          ],
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new KintonePlugin({
      manifestJSONPath: "./plugin/manifest.json",
      privateKeyPath: "./private.ppk",
      pluginZipPath: "./dist/plugin.zip",
    }),
  ],
  node: {
    child_process: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
  },
};
