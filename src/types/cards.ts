import type { Tabs } from "@/stores/tabs.ts"

export interface IGoodItem {
	EAN: number
	COPIES: number
	SCAGR: string
	ZZGSBER: string
	checked: boolean
	timestamp?: number
}

export interface IGroupCards {
	[key: string]: IGoodItem
}

export interface TRawCards {
	action_goods?: IGroupCards
	default_goods?: IGroupCards
	sticker_goods?: IGroupCards
}

export interface IGetGood {
	EAN: string,
	GSBER: ICompany[]
	GSBER_VAL: string
	SCAGR_VAL:string
	COPIES: number
	BB_DATA : IBonusBay
	MATNR: string
	MATTXT: string
	SCAGR: string
	ZSTICKER: string
	ACTION: string
	PRICE: number
	CHECKED?:boolean
	TIMESTAMP: string
	ZZGSBER: string
	CATEGORY: Tabs

}
export interface IBonusBay {
	BB_SCAGR: string
	BB_Z006_DATA: Record<string, any>
}

export interface ICompany {
	ZZGSBER: string,
	ZZGTEXT:string
}
export interface IGetGoodResponse {
	data: {
		data: IGetGood
	},
	result: boolean
	errorText?: string

}
