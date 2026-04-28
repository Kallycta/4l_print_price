<script setup lang="ts">
import ParentComponent from "@/components/ParentComponent.vue"
import { onMounted, ref } from "vue"
import { usePriceTypesStore } from "@/stores/priceTypess.ts"
import { useCardsStore } from "@/stores/cards.ts"
import { ConfirmService } from "@/services/confirmService.ts"
import { convertToRawData } from "@/stores/helpers/cardsToRawData.ts"
import { backButtonDetail } from "@/components/public/modal/helpers/backButtonDetail.ts"
import { useBackListener } from "@/stores/backListener.ts"

const data = ref({
	EAN: "",
	COPIES: "",
	SCAGR: "",
	ZZGSBER: "",
	checked: false,
})

const storePriceTypesCards = usePriceTypesStore()
const storeCards = useCardsStore()
const store = useBackListener()

const { getTypesPrice } = storePriceTypesCards
const { saveRawCards, loadRawCards } = storeCards


onMounted(async () => {

	store.current_back_button_listener.value = window?.Capacitor?.Plugins?.App?.addListener("backButton", () =>
		backButtonDetail()
	)

	await getTypesPrice()
	await loadRawCards()
})

const onClickGetTemplate = (): any => {
	ConfirmService.show({
		title: 'Подтвердите действие',
		message:  "Очистить весь список?",
		showTitle: false,
		buttons: [{index: 1, title: 'Да', async: false}, {index: 2, title: 'Нет', async: false}],
	})
	getTypesPrice()
}

const onClickGetGood = (): any => {
	ConfirmService.show({
		title: 'Ошибка',
		message:  "Что то пошло не так!",
		buttons: [{index: 1, title: 'ОК', async: false}],
	})

	convertToRawData([...storeCards.cards])
}

const onClickSaveData = (): any => {
	saveRawCards()
}

const onClickRestoreData = (): any => {
	loadRawCards()
}

</script>

<template>
<!--	<div style="margin: 20px; display: flex; gap: 20px; flex-direction: column">-->
<!--		<button @click="onClickGetTemplate" type="button" style="border-radius: 10px; padding: 5px">-->
<!--			getTemplate-->
<!--		</button>-->
<!--		<button @click="onClickGetGood" type="button" style="border-radius: 10px; padding: 5px">-->
<!--			get_good_info ean 7613034451088-->
<!--		</button>-->
<!--		<button @click="onClickSaveData" type="button" style="border-radius: 10px; padding: 5px">-->
<!--			save_data-->
<!--		</button>-->
<!--		<button @click="onClickRestoreData" type="button" style="border-radius: 10px; padding: 5px">-->
<!--			restore data-->
<!--		</button>-->
<!--	</div>-->


<!--	<div style="margin: 20px; display: flex; flex-direction: column; gap: 20px">-->
<!--		<label for="EAN">EAN-->
<!--			<input id="EAN" v-model="data.EAN" type="text" />-->
<!--		</label>-->
<!--		<label for="COPIES">COPIES-->
<!--			<input id="COPIES" v-model="data.COPIES" type="text" />-->
<!--		</label>-->
<!--		<label for="SCAGR">SCAGR-->
<!--			<input id="SCAGR" v-model="data.SCAGR" type="text" />-->
<!--		</label>-->
<!--		<label for="ZZGSBER"-->
<!--			>ZZGSBER<input id="ZZGSBER" v-model="data.ZZGSBER" type="text"-->
<!--		/></label>-->
<!--		<label for="checked"-->
<!--			>checked-->
<!--			<input id="checked" v-model="data.checked" type="radio"-->
<!--		/></label>-->
<!--	</div>-->

	<ParentComponent />
</template>

<style scoped>
input {
	appearance: auto !important;
	border: 1px solid black;
	font-size: inherit;
}

</style>
