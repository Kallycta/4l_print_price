import type { IGoodItem, TRawCards } from "@/types/cards.ts"


export function convertToSortedArrays(rawData: TRawCards): IGoodItem[] {
	const result: IGoodItem[] = []
	const categories = ["action_goods", "default_goods", "sticker_goods"] as const

	for (const category of categories) {
		const categoryData = rawData[category]
		if (!categoryData) continue

		const sortedItems = Object.entries(categoryData).map(([timestamp, item]) => ({
			...item,
			timestamp,
		}))

		result.push(...sortedItems)
	}

	// Сначала отдаем самые свежие карточки.
	return result.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
}
