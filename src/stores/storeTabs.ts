import { ref, computed } from "vue"
import { defineStore } from "pinia"

export const useTabsStore = defineStore("storeTabs", () => {
	const activeTab = ref<number>(0)

	return { activeTab }
})
