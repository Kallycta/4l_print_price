import type { ConfirmShow } from "@/services/confirmService"

declare module "*.vue" {
	import type { DefineComponent } from "vue"
	const component: DefineComponent<object, object, never>
	export default component
}

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$confirm: ConfirmShow
	}
}

declare global {
	interface Window {
		Capacitor?: any
		_resolveScannerPromise: (a) => void | null
		module4lapy?: {
			qrScanner?: {
				startScanMlKitScanner: () => Promise<void>;
			}
		}
		pulloadObject: {
			blocked: boolean
		}
	}
}
export {}
