# Webpack Setup

## 1. npm & git initialization

### commands:

```
npm init
git init
touch .gitignore
mkdir src && cd src
touch index.js index.html
```

## 2. webpack installation

### commands:

```
npm install webpack webpack-cli webpack-dev-server
```

[webpack](https://webpack.js.org/) [webpack-cli](https://github.com/webpack/webpack-cli) [webpack-dev-server](https://github.com/webpack/webpack-dev-server)

### add scripts to package.json:

```
  "scripts": {
    "webpack": "webpack",
    "start": "webpack-dev-server --open"
  },
```

### now we can use webpack with commands:

```
npm start
npm run webpack
```

## 3. webpack configuration

### commands:

```
touch webpack.config.js
```

### configuration file

```
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js",
  },
  mode: process.env.NODE_ENV || "development",
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules'],
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    hot: true,
  }
};
```

[pushstate-webpack-dev-server](https://jaketrent.com/post/pushstate-webpack-dev-server/)

## 4. React, babel instalation

### commands:

```
npm install react react-dom
npm install @babel/core babel-loader @babel/preset-env @babel/preset-react
```

in `.babelrc`

```
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```
