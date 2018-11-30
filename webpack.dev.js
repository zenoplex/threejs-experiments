// @ts-check
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const sources = glob.sync('./src/**/*.{js,ts}').filter(item => !/\.d\.ts/.test(item))

const entries = sources.reduce((acc, item) => {
  const p = path.parse(item);
  acc[`${p.dir.replace('src/', '')}/${p.name}`]= item;
  return acc;
}, {});

const pages = Object.keys(entries).filter(item => !/utils/.test(entries[item])).map(item => {
  const p = path.parse(entries[item]);
  
  return new HtmlWebpackPlugin({
  template: './src/assets/template.html',
  chunks: [item],
  filename: `${item}.html`,
})})

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'development',
  entry: entries,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options:{
            transpileOnly: true,
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: {
            loader: 'url-loader',
        }
      }

    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist/',
    port: 9000,
    host: '0.0.0.0'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ForkTsCheckerWebpackPlugin(),
    ...pages,
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
};
