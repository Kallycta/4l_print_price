<script setup lang="ts">

import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useTabsStore} from "@/stores/storeTabs.ts";

interface ITab {
	name: string,
	index: number
}

const tabs:ITab[] = [
	{
		name: 'Белая бумага',
		index: 0
	},
	{
		name: 'Акция',
		index: 1
	},
	{
		name: 'Сложная механика',
		index: 2
	},
]
const store = useTabsStore()
const {activeTab} = storeToRefs(store)

const changeTab = (index: number):void => {
	activeTab.value = index
}

</script>

<template>
	<div class="print_price_tabs">
		<div v-for="{name, index} in tabs" :key="index" @click="changeTab(index)" :class="{'active': activeTab === index}" class="print_price_tab">
			{{name}}
		</div>
	</div>
</template>

<style scoped>
.print_price_tabs {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: 500;
	font-size: var(--text-s);
	line-height: var(--line-h-s);
}

.print_price_tab {
	color: #7C7C7C;
	text-decoration: underline dotted #7C7C7C;
	text-decoration-thickness: 8%;
	text-underline-offset: 25%;
	transition: all 400ms ease;

}

.print_price_tab.active {
	color: #FF6A00;
	text-decoration: underline #FF6A00;
	text-decoration-style: solid;
	text-underline-offset: 25%;
	text-decoration-thickness: 8%;
}
</style>
