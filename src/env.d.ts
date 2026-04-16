declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<object, object, never>
  export default component
}

declare global {
  interface Window {
    pulloadObject: {
      blocked: boolean
    }
  }
}
