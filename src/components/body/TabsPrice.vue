<script setup lang="ts">
import { storeToRefs } from "pinia"
import { Tabs, useTabsStore } from "@/stores/tabs.ts"
import { useCardsStore } from "@/stores/cards.ts"
import { computed } from "vue"

interface ITab {
	name: string
	index: number
	value: Tabs
}

const store = useTabsStore()
const cardStore = useCardsStore()
const { getCountCategories } = cardStore
const { activeTab } = storeToRefs(store)

const tabs: ITab[] = [
	{
		name: "Белая бумага",
		index: 0,
		value: Tabs.DEFAULT,
	},
	{
		name: "Акция",
		index: 1,
		value: Tabs.ACTION,
	},
	{
		name: "Стикеры",
		index: 2,
		value: Tabs.STICKER,
	},
]


const tabsWithCount = computed(() => {
	return tabs
		.map(tab => ({
			...tab,
			count: getCountCategories(tab.value)
		}))
		.filter(tab => tab.count > 0)
})
const changeTab = (index: number): void => {
	activeTab.value = index
}
</script>

<template>
	<div class="print_price_tabs">
		<template v-for="{ name, index, count } in tabsWithCount" :key="index">
			<div
				@click="changeTab(index)"
				:class="{ active: activeTab === index }"
				class="print_price_tab"
			>
				{{ name }} ({{ count }})
			</div>
		</template>
	</div>
</template>

<style scoped>
.print_price_tabs {
	display: flex;
	gap: 20px;
	align-items: center;
	font-weight: 500;
	font-size: var(--text-s);
	line-height: var(--line-h-s);
	margin-bottom: 20px;
}

.print_price_tabs:has(> :nth-child(3)) {
	justify-content: space-between;
}
.print_price_tab {
	color: #1d1d1b;
	text-decoration: underline dotted #1d1d1b;
	text-decoration-thickness: 8%;
	text-underline-offset: 25%;
	transition: all 400ms ease;
}

.print_price_tab.disabled {
	color: #7c7c7c;
	text-decoration: underline dotted #7c7c7c;
}

.print_price_tab.active {
	color: #ff6a00;
	text-decoration: underline #ff6a00;
	text-decoration-style: solid;
	text-underline-offset: 25%;
	text-decoration-thickness: 8%;
}
</style>
