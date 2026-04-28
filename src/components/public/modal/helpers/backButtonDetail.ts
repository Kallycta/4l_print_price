const stopScan = (): void => {
	if (window._resolveScannerPromise) {
		window._resolveScannerPromise(null)
	}
	window.Capacitor?.Plugins?.BarcodeScanner?.stopScan?.()
	document.querySelector("body")?.classList.remove("barcode-scanner-active")
	document.querySelector(".scan_block")?.classList.remove("scanning")
	document.querySelector(".scan_block")?.remove()
	window.Capacitor?.Plugins?.Torch?.disable?.()
}

export const backButtonDetail = (): void => {
	console.log("backButtonDetail")
	if (document.body.classList.contains("barcode-scanner-active")) {
		console.log("stopScan")
		stopScan()
	} else {
		console.log("Back")
		if (!document.querySelector(".mask_container_mod")) {
			// Если модальное окно не открыто, возвращаемся на корневой маршрут приложения.
			window.location.href = "/mobile_app/"
		}
	}
}
