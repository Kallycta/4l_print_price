import { defineStore } from "pinia"
import { ref } from "vue"
import { addSelectFields } from "@/stores/helpers/typesTransform.ts"



export interface ITemplateItem {
	SCAGR: string,
	BEZEI20: string,
	PAPER_SIZE: string
	value?: string,
	label?: string
}


export interface ITypePriceResponse {
	result: boolean
	data: ITemplateItem[]
}

export const usePriceTypesStore = defineStore("priceTypes", () => {
	const priceTypes = ref<ITemplateItem[]>([])


	const getTypesPrice = async (): Promise<ITypePriceResponse> => {
		try {
			// const result = await getPriceTypes()
			const response = await fetch('/templates.json')
			const result:ITypePriceResponse = await response.json()

			if( result) {
				priceTypes.value = addSelectFields(result.data)
			}
			console.log("Данные сохранены:", result.data)
			return result
		} catch (err) {
			console.error("Ошибка:", err)
			throw err
		}
	}

	return { priceTypes, getTypesPrice }
})
