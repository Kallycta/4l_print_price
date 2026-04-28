import { createApp, h } from "vue"
import ConfirmGlobal from "@/components/public/confirm/ConfirmGlobal.vue"

export type ConfirmIndex = number | string

export interface ConfirmButton {
	index: ConfirmIndex
	title: string
	async?: boolean
}

export interface ConfirmOptions {
	buttons: ConfirmButton[]
	title?: string
	message?: string
	showTitle?: boolean
}

export interface ConfirmAsyncResult {
	index: ConfirmIndex
	complete: () => void
}

export type ConfirmResult = ConfirmIndex | ConfirmAsyncResult

export interface ConfirmDialogExpose {
	show: () => void
	close: () => void
	setLoading: (state: boolean) => void
}

export type ConfirmShow = (options: ConfirmOptions) => Promise<ConfirmResult>

export const ConfirmService = {
	async show(options: ConfirmOptions): Promise<ConfirmResult> {
		return new Promise<ConfirmResult>((resolve) => {
			const mountNode = document.createElement("div")
			document.body.appendChild(mountNode)

			let confirmRef: ConfirmDialogExpose | null = null

			const tempApp = createApp({
				setup() {
					// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
					return () =>
						h(ConfirmGlobal, {
							...options,
							ref: (el: unknown) => {
								confirmRef = el as ConfirmDialogExpose | null
							},
							onSelected: (index: ConfirmIndex, isAsync: boolean, callback: () => void) => {
							if (isAsync) {
								// Для асинхронных операций возвращаем объект с индексом и функцией завершения
								resolve({
									index,
									complete: () => {
										callback()
										setTimeout(() => {
											tempApp.unmount()
											document.body.removeChild(mountNode)
										}, 300)
									}
								})
							} else {
								// Для синхронных сразу закрываем
								resolve(index)
								callback()
								setTimeout(() => {
									tempApp.unmount()
									document.body.removeChild(mountNode)
								}, 300)
							}
						}
						})
				}
			})

			tempApp.mount(mountNode)

			setTimeout(() => {
				if (confirmRef) {
					confirmRef.show()
				}
			}, 10)
		})
	}
}

