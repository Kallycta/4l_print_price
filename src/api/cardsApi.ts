import api from "@/api/axiosConfig.ts"
import type { IGetGoodResponse, TRawCards } from "@/types/cards.ts"
import { ConfirmService } from "@/services/confirmService.ts"
import { useTabsStore } from "@/stores/tabs.ts"

const url = "/mobile_app/services/print_price_tag_2/"

export async function restoreCardsData(): Promise<TRawCards> {
	try {
		// Временный локальный mock для production вернуть `await api.post(...)`.


		const response = await fetch("/price.json")
		const result: TRawCards = await response.json()

		return result
	} catch (err) {
		await ConfirmService.show({
			title: 'Ошибка',
			message: (err as Error).message,
			buttons: [{index: 1, title: 'ОК', async: false}],
		})
		console.error("Ошибка загрузки списка карточек:", err)
		return {}
	}
}

export async function saveCardsData(saveData: TRawCards): Promise<TRawCards> {
	try {
		const response = await api.post<TRawCards>(
			url,
			{ data: JSON.stringify(saveData), action: "save_data" },
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			},
		)

		return response.data
	} catch (err) {
		await ConfirmService.show({
			title: 'Ошибка',
			message: (err as Error).message,
			buttons: [{index: 1, title: 'ОК', async: false}],
		})
		console.error("Ошибка сохранения карточек:", err)
		throw err
	}
}

export async function getGoodInfo(data: { ean: number }, index: number): Promise<IGetGoodResponse | undefined> {
	try {
		// Временный локальный mock. Для production вернуть `await api.post(...)`.
		const response = await fetch(`good${index}.json`)
		const result: IGetGoodResponse = await response.json()

		return result
	} catch (err) {
		await ConfirmService.show({
			title: 'Ошибка',
			message: (err as Error).message,
			buttons: [{index: 1, title: 'ОК', async: false}],
		})
		console.error("Ошибка получения информации о товаре:", err)
		return undefined
	}
}


/*

const response = await api.post<TRawCards>(
	url,
	{ action: "restore_data" },
	{
		headers: {
			"Content-Type": "multipart/form-data",
		},
	},
)

const response = await api.post<IGetGoodResponse>(
	url,
	{ ...data, action: "get_good_info" },
	{
		headers: {
			"Content-Type": "multipart/form-data",
		},
	},
)
*/
