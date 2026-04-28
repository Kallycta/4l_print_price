import { ref, computed } from "vue"
import { defineStore } from "pinia"

export enum Tabs {
	DEFAULT = 'DEFAULT',
	ACTION = 'ACTION',
	STICKER = 'STICKER'
}

export const useTabsStore = defineStore("storeTabs", () => {
	const activeTab = ref<number>(0)

	const dictionaryTab:Record<string, Tabs> = {
		'0': Tabs.DEFAULT,
		'1': Tabs.ACTION,
		'2': Tabs.STICKER
	}

	const TabsIndex:Record<Tabs, number> = {
		 [Tabs.DEFAULT]: 0,
		[Tabs.ACTION]: 1,
		[Tabs.STICKER]: 2
	}

	const getActivePage = computed(() => {
		const t:string = activeTab.value.toString()
		return dictionaryTab[t] ?? '0'
	})

	return { activeTab, getActivePage, TabsIndex }
})
