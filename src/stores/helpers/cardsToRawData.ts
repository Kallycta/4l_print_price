import type { IGetGood, IGoodItem, TRawCards } from "@/types/cards.ts"

export function convertToRawData(cards: IGetGood[]):TRawCards {


	const res:TRawCards = {}

	cards.forEach((card) => {
		const tm:string = card.TIMESTAMP

		const rawObject:IGoodItem = {
			EAN: Number(card.EAN),
			COPIES: card.COPIES,
			SCAGR: card.SCAGR_VAL,
			ZZGSBER: card.GSBER_VAL,
			checked: !!card.CHECKED
		}

		if(card.ACTION === 'X') {
			res.action_goods = {...res.action_goods, [tm]: rawObject }
		} else if(card.ZSTICKER === 'X' && card.ACTION !== 'X') {
			res.sticker_goods = {...res.sticker_goods, [tm]: rawObject}
		} else {
			res.default_goods = {...res.default_goods, [tm]: rawObject }
		}
	})

	console.log('convertToRawData', res)

	return res
}
