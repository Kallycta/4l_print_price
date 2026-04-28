type BackButtonHandler = () => void

export const backButtonModal = (func: BackButtonHandler): void => {
	func()
}
