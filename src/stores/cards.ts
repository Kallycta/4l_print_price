import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { restoreCardsData, saveCardsData } from "@/api/cardsApi.ts"
import { loadCardsFlow } from "@/stores/helpers/loadCardsFlow.ts"
import type { IGetGood , IGoodItem, TRawCards } from "@/types/cards.ts"
import { ConfirmService } from "@/services/confirmService.ts"
import { convertToRawData } from "@/stores/helpers/cardsToRawData.ts"
import { Tabs } from "@/stores/tabs.ts"

export const useCardsStore = defineStore("cards", () => {
	const cards = ref<IGetGood[]>([])
	const rawCards = ref<TRawCards>({})
	const sortedRawCards = ref<IGoodItem[]>([])
	const highlightedCards = ref<Set<string>>(new Set())

	const addCards = (goods: IGetGood[]): void => {
		cards.value.unshift(...goods)
		console.log('cards', cards)
	}

	const updateCards = (goods: IGetGood[]): void => {
		cards.value = goods
		console.log('cards', cards)
	}

	const clearCards = (): void => {
		cards.value = []
	}
	const saveSortedRawCards = (sortedCards: IGoodItem[]): void => {
		sortedRawCards.value = sortedCards
	}

	const isFullChoose = computed(():boolean => {
		return cards.value.every((elem) => elem.CHECKED === true)
	})

	const getCategoryCard = (card:IGetGood):Tabs => {
		if(card.ACTION === 'X') {
			return Tabs.ACTION
		} else if(card.ZSTICKER === 'X' && card.ACTION !== 'X') {
			return Tabs.STICKER
		} else {
			return Tabs.DEFAULT
		}
	}

	const getCountCategories = (category: Tabs):number => {
		return cards.value.filter((card) => card.CATEGORY === category).length
	}


	const updateGSBER = (index: number, newValue:string):void => {
		const currentCard = cards.value[index]
		if (!currentCard) return

		cards.value[index] = {
			...currentCard,
			GSBER_VAL: newValue
		};

		const rawCards = convertToRawData(cards.value)
		console.log('rawCards for fetch',  rawCards)
	};

	const updateSCAGR = (index: number, newValue:string):void => {
		const currentCard = cards.value[index]
		if (!currentCard) return

		cards.value[index] = {
			...currentCard,
			SCAGR: newValue
		};

		const rawCards = convertToRawData(cards.value)
		console.log('rawCards for fetch',  rawCards)
	};

	const loadRawCards = async (): Promise<TRawCards> => {
		try {
			const result = await restoreCardsData()
			rawCards.value = result
			clearCards()

			// инициируем сценарий загрузки
			await loadCardsFlow({
				rawCards: result,
				onCardBatch: addCards,
				onSaveSortedCards: saveSortedRawCards
			})

			console.log("Данные загружены:", result)
			return result
		} catch (err) {
			await ConfirmService.show({
				title: 'Ошибка',
				message: (err as Error).message,
				buttons: [{index: 1, title: 'ОК', async: false}],
			})
			console.error("Ошибка загрузки данных карточек:", err)
			return {}
		}
	}

	const highlightCard = (ean: string):void => {
		highlightedCards.value.add(ean)
		setTimeout(() => {
			highlightedCards.value.delete(ean)
			highlightedCards.value = new Set(highlightedCards.value)
		}, 1500)
	}

	const isHighlighted = (ean: string):boolean => highlightedCards.value.has(ean)

	const saveRawCards = async (): Promise<TRawCards> => {
		const data = convertToRawData([...cards.value])
		try {
			const result = await saveCardsData(data)
			console.log("Данные сохранены:", result)
			return result
		} catch (err) {
			await ConfirmService.show({
				title: 'Ошибка',
				message: (err as Error).message,
				buttons: [{index: 1, title: 'ОК', async: false}],
			})
			console.error("Ошибка сохранения данных карточек:", err)
			throw err
		}
	}


	// const getGood = (data: { ean: number }): Promise<IGetGoodResponse | undefined> => {
	// 	return getGoodInfo(data)
	// }

	return { cards, rawCards,isFullChoose, loadRawCards,updateGSBER, highlightCard, isHighlighted , getCategoryCard, getCountCategories, saveRawCards, updateCards, updateSCAGR ,addCards, clearCards }
})
