export function withInstall(comp: any) {
  comp.install = (app: any) => {
    // 注册组件
    app.component(comp.name, comp)
  }
  return comp
}
