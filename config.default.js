module.exports = {
  fileTypes: [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"], // 需要加载的文件类型
  prefix: "", // 需要添加的前缀
  suffix: "", // 需要添加的后缀
  illegalPrefix: "media", // 当存在非法开头时（如数字）添加的前缀
  logLevel: "alert", // 当存在非法开头时如何处理，alert：警告，error 抛错，none：不处理

  // 上面这些配置项都可以添加到 每个 folder
  folders: [
    {
      path: "src/assets/img",
      suffix: "Image",
    },
    {
      path: "src/assets/icon",
      suffix: "Icon",
    },
  ],
};
