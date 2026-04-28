import { defineStore } from "pinia"
import { ref } from "vue"




export const useBackListener = defineStore("backListener", () => {
	const current_back_button_listener = ref({value:{ remove: () => undefined }})

	return {current_back_button_listener}
})
