# Media Manager

## 安装

```sh
yarn add @onelab/mm -D
```

## 使用

在项目 `package.json` 的 `scripts` 中添加：

```json
  "scripts": {
    // ... other scripts
    "mm": "mm"
  },
```

再在控制台运行 `yarn mm`，就可以在 mm 配置中的目录下生成 `index.js` 模块代码，此模块会将 `import` 自身所在的所有图片并 `export` 出来。

之后您就可以在自己的组件中从上述模块 `import` 多个图片

## 配置

您可以在项目的 `package.json` 文件添加 `mmConfig` 对象配置 mm；

您也可以在项目跟目录创建 `mmConfig.js` 文件并在此文件中配置 mm；

默认项如下：

```javascript
module.exports = {
  // 需要加载的文件类型
  fileTypes: [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"],

  // 需要添加的前缀
  prefix: "",

  // 需要添加的后缀
  suffix: "",
  // 当存在非法开头时（如数字）添加的前缀
  illegalPrefix: "image",

  // 当存在非法开头时如何处理，alert：警告，error 抛错，none：不处理
  logLevel: "alert",

  // 是否遍历子目录
  subdir: true,

  // .svg 格式文件会同时生成
  // import xxx from 'some/dir/xxx.svg'
  // import { componentName as xxx } from 'some/dir/xxx.svg'
  // 两种导入
  // 此配置项设置上述的 componentName
  componentName: "ReactComponent",

  // 上面这些配置项都可以添加到 每个 folder，并权重更高
  // 图片路径文件夹列表
  // 后续更新会支持嵌套
  folders: [
    {
      // path 为必填项
      path: "src/assets/img",
      suffix: "Img",
    },
    {
      path: "src/assets/icon",
      suffix: "Icon",
    },
  ],
};
```

