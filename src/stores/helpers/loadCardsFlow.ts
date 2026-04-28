import { getGoodInfo } from "@/api/cardsApi.ts"
import { convertToSortedArrays } from "@/stores/helpers/cardsTransform.ts"
import type { IGetGood, IGoodItem, TRawCards } from "@/types/cards.ts"
import { useCardsStore } from "@/stores/cards.ts"

interface LoadCardsFlowOptions {
	rawCards: TRawCards
	onCardBatch: (cards: IGetGood[]) => void
	onSaveSortedCards: (sortedCards:IGoodItem[]) => void
	renderIntervalMs?: number
}

export async function loadCardsFlow({ rawCards, onCardBatch, onSaveSortedCards, renderIntervalMs = 300 }: LoadCardsFlowOptions): Promise<void> {

	const sortedRawCards = convertToSortedArrays(rawCards)

	const pendingCards: IGetGood[] = []
	let intervalId: number | null = null
	let isCompleted = false
	let successCount = 0
	const store = useCardsStore()

	const renderReadyCards = (): void => {
		if (pendingCards.length === 0) return


		onSaveSortedCards(sortedRawCards)
		console.log('sortedRawCards', sortedRawCards)
		const transformPendingCards = pendingCards.map((card) => {


			card.CHECKED = sortedRawCards.find((elem) => {
				if( elem.EAN.toString() === card.EAN.toString()) {
					card.GSBER_VAL = elem.ZZGSBER ?? ''
					card.SCAGR = elem.SCAGR ?? ''
					card.CATEGORY =  store.getCategoryCard(card)
					card.TIMESTAMP = elem.timestamp?.toString() ?? ''
					return elem
				}
			})?.checked


			return card
		})
		console.log('transformPendingCards', transformPendingCards)

		onCardBatch([...transformPendingCards])
		pendingCards.length = 0

	}

	const stopTimer = (): void => {
		intervalId && clearInterval(intervalId)
		intervalId = null;

	}
	const startTimer = (): void => {
		intervalId = setInterval(() => {
			renderReadyCards()
		if (isCompleted && pendingCards.length === 0) {
			stopTimer()
		}
		},renderIntervalMs)
	}

	startTimer()
	let index = 1
	for (const item of sortedRawCards) {
		try {
			const details = await getGoodInfo({ ean: item.EAN }, index)
			index++
			if (details) {
				pendingCards.push(details?.data?.data)
				successCount++
			}
		} catch (e) {
			console.log(e)
		}
	}

	isCompleted = true
	renderReadyCards()
	stopTimer()


	console.log(`Загружено ${successCount} из ${sortedRawCards.length} карточек`)
}
