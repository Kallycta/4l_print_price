import type { App, InjectionKey, Plugin } from "vue"
import { ConfirmService, type ConfirmShow } from "./confirmService"

export const confirmInjectionKey: InjectionKey<ConfirmShow> = Symbol("confirm")

const confirmPlugin: Plugin = {
	install(app: App) {
		app.config.globalProperties.$confirm = ConfirmService.show
		app.provide(confirmInjectionKey, ConfirmService.show)
	},
}

export default confirmPlugin
