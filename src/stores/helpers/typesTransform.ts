import type { ITemplateItem } from "@/stores/priceTypess.ts"


export function addSelectFields(templates:ITemplateItem[] ): ITemplateItem[] {

	return templates.map((item) => {
		item.value = item.SCAGR
		item.label = item.BEZEI20

		return item
	})
}
