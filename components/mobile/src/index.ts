import HelloWorld from './HelloWorld/HelloWorld'

const components = [
  HelloWorld,
]

function install(Vue: any) {
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}

export {
  HelloWorld,
}

export default install
