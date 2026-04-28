<script setup lang="ts">
import TabsPrice from "@/components/body/TabsPrice.vue"
import CardPrice from "@/components/body/CardPrice.vue"
import { useCardsStore } from "@/stores/cards.ts"
import { storeToRefs } from "pinia"
import { useTabsStore } from "@/stores/tabs.ts"
import CheckboxComponent from "@/components/public/CheckboxComponent.vue"
import { computed, ref } from "vue"

const cardsStore = useCardsStore()
const tabsStore = useTabsStore()
const { getActivePage } = storeToRefs(tabsStore)
const { cards } = storeToRefs(cardsStore)
const mainCheckboxValue = ref(cardsStore.isFullChoose)

const filteredCards = computed(() =>
	cards.value.filter((card) => card.CATEGORY === getActivePage.value)
)

const onChangeCB = (checked: boolean): void => {
	const changedList = cards.value.map((card) => {
		card.CHECKED = checked
		return card
	})

	cardsStore.updateCards(changedList)
}


</script>

<template>
	<div>
		<TabsPrice />
		<div class="mainCheckbox">
			<CheckboxComponent
				v-model="mainCheckboxValue"
				label="Выбрать все"
				:checked="cardsStore.isFullChoose"
				name="name-checkbox-cards"
				@on-change-value="(e) => onChangeCB(e?.target.checked)"
			/>
		</div>
		<div class="print_price_body_container">
			<CardPrice
				v-for="elem in filteredCards"
				:key="elem.EAN"
				:card="elem"
				:class="{ 'card-highlight': cardsStore.isHighlighted(elem.EAN) }"
			/>
		</div>
	</div>
</template>

<style scoped>
.print_price_body_container {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.mainCheckbox {
	position: relative;
	margin-bottom: 15px;
	padding-left: 2px;
}

.card-highlight {
	animation: highlight 1.5s ease-out;
}

@keyframes highlight {
	0% {
		background-color: #f6e49e;
	}
	100% {
		background-color: transparent;
	}
}
</style>
