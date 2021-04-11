const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

rules.push({
  test: /\.scss$/i,
  use: [
    { loader: MiniCssExtractPlugin.loader, options: { modules: {} } },
    "css-loader?modules",
    "sass-loader",
  ],
});
rules.push({
  test: /\.(png|jpe?g|gif)$/i,
  use: [
    {
      loader: "file-loader",
      options: {
        publicPath: "..",
      },
    },
  ],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".scss", ".png"],
  },
};
