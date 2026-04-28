import api from "@/api/axiosConfig.ts"
import type { ITypePriceResponse } from "@/stores/priceTypess.ts"
import { ConfirmService } from "@/services/confirmService.ts"

const url = "/mobile_app/services/print_price_tag_2/"

export async function getPriceTypes(): Promise<ITypePriceResponse> {

	try {
		const response = await api.post<ITypePriceResponse>(
			url,
			{ action: "get_templates" },
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
