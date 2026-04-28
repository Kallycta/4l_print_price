<script setup lang="ts">
import SeparatorLine from "@/components/public/SeparatorLine.vue"
import { useCardsStore } from "@/stores/cards.ts"
import { getGoodInfo } from "@/api/cardsApi.ts"
import { ConfirmService } from "@/services/confirmService.ts"
import { ref } from "vue"
import SearchModal from "@/components/public/modal/SearchModal.vue"
import { Tabs, useTabsStore } from "@/stores/tabs.ts"

const cardStore = useCardsStore()
const isVisibleModal = ref(false)
const code = ref("")
const storeTabs = useTabsStore()
const goToPage = (url: string): void => {
	setTimeout(() => {
		location.href = url
	}, 200)
}
const startScan = async (index: number, code: string = ""): Promise<void> => {
	if (code) {
		try {
			let res = { text: "" }

			if (!code) {
				res =
					window.Capacitor &&
					window?.module4lapy?.qrScanner?.startScanMlKitScanner &&
					(await window?.module4lapy?.qrScanner.startScanMlKitScanner())
			} else {
				res = { text: code }
			}

			if (res.text) {
				const response = await getGoodInfo({ ean: +res.text }, index)

				if (response?.result) {
					let action: Tabs = Tabs.DEFAULT
					const newEan = response.data.data.EAN
					// Проверяем есть ли ценник в ранее добавленных
					const scannedElement = cardStore.cards.find(
						(item) => item.EAN.toString() === newEan.toString(),
					)
					if (!scannedElement) {
						// Если нет, то делаем элемент активным и дополняем список ценников новым элементом
						response.data.data.CHECKED = true
						const card = response.data.data
						card.GSBER_VAL = card.GSBER[0]?.ZZGSBER ?? ""
						card.CATEGORY = cardStore.getCategoryCard(card)
						action = card.CATEGORY
						card.TIMESTAMP = new Date().getTime().toString()

						cardStore.addCards([card])
						cardStore.highlightCard(card.EAN)
					} else {
						// Если да, то прибавляем количество существующего на +1
						const newCards = cardStore.cards.map((card) => {
							if (card.EAN.toString() === newEan.toString()) {
								card.COPIES = Number(card.COPIES) + 1
								action = card.CATEGORY
								cardStore.highlightCard(card.EAN)
							}
							return card
						})
						cardStore.updateCards(newCards)
					}
					console.log('Number(storeTabs.TabsIndex[action])', storeTabs.TabsIndex, action )
					storeTabs.activeTab = Number(storeTabs.TabsIndex[action])
				} else {
					console.log("ОШИБКА! ", response?.errorText)
				}
			}
		} catch (e) {
			await ConfirmService.show({
				title: "Ошибка",
				message: (e as Error).message,
				buttons: [{ index: 1, title: "ОК", async: false }],
			})
			console.log(e)
		}
	}
}
const getGoodInfoByCode = async (): Promise<void> => {
	const index = 1
	try {
		const response = await getGoodInfo({ ean: +code.value }, index)

		if (response?.result) {

			let action: Tabs = Tabs.DEFAULT
			const newEan = response.data.data.EAN
			// Проверяем есть ли ценник в ранее добавленных
			const scannedElement = cardStore.cards.find(
				(item) => item.EAN.toString() === newEan.toString(),
			)
			if (!scannedElement) {
				// Если нет, то делаем элемент активным и дополняем список ценников новым элементом

				response.data.data.CHECKED = true
				const card = response.data.data
				card.GSBER_VAL = card.GSBER[0]?.ZZGSBER ?? ""
				card.CATEGORY = cardStore.getCategoryCard(card)
				action = card.CATEGORY
				card.TIMESTAMP = new Date().getTime().toString()


				cardStore.addCards([card])
			} else {
				// Если да, то прибавляем количество существующего на +1
				const newCards = cardStore.cards.map((card) => {
					if (card.EAN.toString() === newEan.toString()) {
						card.COPIES = Number(card.COPIES) + 1
						action = card.CATEGORY
					}
					return card
				})
				cardStore.updateCards(newCards)
			}
			isVisibleModal.value = false
			code.value = ''
			console.log('Number(storeTabs.TabsIndex[action])', Number(storeTabs.TabsIndex[action]))
			storeTabs.activeTab = Number(storeTabs.TabsIndex[action])
		} else {
			console.log("ОШИБКА! ", response?.errorText)
		}
	} catch (e) {
		console.log(e)
	}
}
</script>

<template>
	<div>
		<SeparatorLine />
		<div class="container_footer">
			<div class="pointer_menu" @click="goToPage('/mobile_app/')" style="border-radius: 50%">
				<svg
					v-wave
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clip-path="url(#clip0_117_489)">
						<path
							d="M20 8.95835V15.2675C20 17.8759 17.8763 20 15.2632 20H12.6316V15.2675C12.6316 13.8198 11.45 12.6407 10 12.6407C8.55 12.6407 7.36842 13.8198 7.36842 15.2675V20H4.73684C2.12368 20 0 17.8785 0 15.2675V8.95835C0 7.51859 0.644737 6.17622 1.76579 5.27078L7.02895 1.03836C8.75 -0.346121 11.2474 -0.346121 12.9684 1.03836L18.2316 5.26815C19.3553 6.17095 19.9974 7.51596 19.9974 8.95572L20 8.95835Z"
							fill="#FF6A00"
						/>
					</g>
					<defs>
						<clipPath id="clip0_117_489">
							<rect width="20" height="20" fill="white" />
						</clipPath>
					</defs>
				</svg>

				<div class="footer_sub_text">Главная</div>
			</div>

			<div
				class="pointer_menu"
				@click="isVisibleModal = true"
				@close="isVisibleModal = false"
			>
				<svg
					v-wave
					width="20"
					height="20"
					viewBox="0 0 22 22"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12.3801 12.3802C14.9794 9.78089 14.9794 5.55984 12.3801 2.94946C9.78085 0.35018 5.5598 0.35018 2.94942 2.94946C0.350141 5.54874 0.350141 9.76979 2.94942 12.3802C5.5487 14.9794 9.76975 14.9794 12.3801 12.3802Z"
						fill="white"
						stroke="#FF6A00"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path d="M12.669 12.669L21 21L12.669 12.669Z" fill="white" />
					<path
						d="M12.669 12.669L21 21"
						stroke="#FF6A00"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>

				<div class="footer_sub_text">
					<div>Поиск</div>
				</div>
			</div>

						<div @click="startScan(4,'4680368316263')" style="border-radius: 50%" class="container_scan pointer">
							<div style="z-index: 9999999999999999999999999999; position: relative">4</div>
							<img v-wave src="/assets/icons/scan.svg" alt="scan" />
						</div>

<!--			<div-->
<!--				@click="startScan(5, '8429037016877')"-->
<!--				style="border-radius: 50%"-->
<!--				class="container_scan pointer"-->
<!--			>-->
<!--				<div style="z-index: 9999999999999999999999999999; position: relative">5</div>-->
<!--				<img v-wave src="/assets/icons/scan.svg" alt="scan" />-->
<!--			</div>-->
			<div class="pointer_menu">
				<svg
					v-wave
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M7.1875 3.75V1.875H12.8125V3.75H7.1875ZM5.3125 3.75V1.25C5.3125 0.918479 5.4442 0.600537 5.67862 0.366117C5.91304 0.131696 6.23098 0 6.5625 0L13.4375 0C13.769 0 14.087 0.131696 14.3214 0.366117C14.5558 0.600537 14.6875 0.918479 14.6875 1.25V3.75H17.8125C18.0611 3.75 18.2996 3.84877 18.4754 4.02459C18.6512 4.2004 18.75 4.43886 18.75 4.6875C18.75 4.93614 18.6512 5.1746 18.4754 5.35041C18.2996 5.52623 18.0611 5.625 17.8125 5.625H17.3563L16.4275 17.6912C16.3793 18.3193 16.0958 18.906 15.6337 19.3341C15.1716 19.7621 14.5649 20 13.935 20H6.065C5.4351 20 4.82842 19.7621 4.36631 19.3341C3.90419 18.906 3.62069 18.3193 3.5725 17.6912L2.64375 5.625H2.1875C1.93886 5.625 1.7004 5.52623 1.52459 5.35041C1.34877 5.1746 1.25 4.93614 1.25 4.6875C1.25 4.43886 1.34877 4.2004 1.52459 4.02459C1.7004 3.84877 1.93886 3.75 2.1875 3.75H5.3125Z"
						fill="#FF6A00"
					/>
				</svg>

				<div class="footer_sub_text">
					<div>Очистить</div>
					<div>список</div>
				</div>
			</div>

			<div style="border-radius: 50%" class="pointer_menu">
				<svg
					v-wave
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M5.47168 0.5H14.5283C14.8461 0.500005 15.1513 0.6259 15.376 0.850586C15.6006 1.07527 15.7266 1.38052 15.7266 1.69824V5.7832H17.5469C18.0648 5.7832 18.5615 5.98924 18.9277 6.35547C19.2939 6.72169 19.5 7.21845 19.5 7.73633V14.5283C19.5 15.0462 19.294 15.543 18.9277 15.9092C18.5615 16.2753 18.0647 16.4814 17.5469 16.4814H14.9717V18.3018C14.9717 18.6195 14.8458 18.9247 14.6211 19.1494C14.3964 19.3741 14.0912 19.5 13.7734 19.5H6.22656C5.90881 19.5 5.60359 19.3741 5.37891 19.1494C5.15422 18.9247 5.02832 18.6195 5.02832 18.3018V16.4814H2.45312C1.93528 16.4814 1.43848 16.2753 1.07227 15.9092C0.706043 15.543 0.500005 15.0462 0.5 14.5283V7.73633C0.5 7.21845 0.706096 6.72169 1.07227 6.35547C1.43849 5.98924 1.9352 5.7832 2.45312 5.7832H4.27344V1.69824C4.27344 1.38116 4.40022 1.07539 4.62402 0.852539L4.62598 0.850586C4.84884 0.626698 5.15453 0.500005 5.47168 0.5ZM5.91504 18.6133H14.085V13.4619H5.91504V18.6133ZM14.5283 7.80176C13.7315 7.80176 13.0851 8.4483 13.085 9.24512C13.085 9.62789 13.2372 9.99494 13.5078 10.2656C13.7785 10.5363 14.1455 10.6885 14.5283 10.6885H16.0381C16.4208 10.6884 16.788 10.5362 17.0586 10.2656C17.3291 9.99496 17.4814 9.62781 17.4814 9.24512C17.4814 8.86241 17.3292 8.49525 17.0586 8.22461C16.788 7.954 16.4208 7.80185 16.0381 7.80176H14.5283ZM5.16016 5.7832H14.8398V1.38672H5.16016V5.7832Z"
						fill="#34C759"
						stroke="#00860D"
					/>
				</svg>

				<div class="footer_sub_text">
					<div>Напечатать</div>
					<div>ценники</div>
				</div>
			</div>
		</div>
	</div>

	<SearchModal v-if="isVisibleModal" is-dragging-prop @close-modal="isVisibleModal = false">
		<template #title_up> Поиск </template>
		<template #inputs>
			<div class="modal_search_text">Введите ШК или артикул</div>
			<div class="modal_search_container">
				<div class="modal_search_input">
					<svg
						width="17"
						height="17"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5.9375 10C4.80208 10 3.84125 9.60667 3.055 8.82C2.26875 8.03333 1.87542 7.0725 1.875 5.9375C1.87458 4.8025 2.26792 3.84167 3.055 3.055C3.84208 2.26833 4.80292 1.875 5.9375 1.875C7.07208 1.875 8.03313 2.26833 8.82063 3.055C9.60813 3.84167 10.0013 4.8025 10 5.9375C10 6.39583 9.92708 6.82812 9.78125 7.23438C9.63542 7.64062 9.4375 8 9.1875 8.3125L12.6875 11.8125C12.8021 11.9271 12.8594 12.0729 12.8594 12.25C12.8594 12.4271 12.8021 12.5729 12.6875 12.6875C12.5729 12.8021 12.4271 12.8594 12.25 12.8594C12.0729 12.8594 11.9271 12.8021 11.8125 12.6875L8.3125 9.1875C8 9.4375 7.64063 9.63542 7.23438 9.78125C6.82813 9.92708 6.39583 10 5.9375 10ZM5.9375 8.75C6.71875 8.75 7.38292 8.47667 7.93 7.93C8.47708 7.38333 8.75042 6.71917 8.75 5.9375C8.74958 5.15583 8.47625 4.49188 7.93 3.94563C7.38375 3.39938 6.71958 3.12583 5.9375 3.125C5.15542 3.12417 4.49146 3.39771 3.94563 3.94563C3.39979 4.49354 3.12625 5.1575 3.125 5.9375C3.12375 6.7175 3.39729 7.38167 3.94563 7.93C4.49396 8.47833 5.15792 8.75167 5.9375 8.75Z"
							fill="#777776"
						/>
					</svg>
					<input v-model="code" type="number" />
				</div>

				<button @click="getGoodInfoByCode">Поиск</button>
			</div>
		</template>
	</SearchModal>
</template>

<style scoped>
.modal_search_container button {
	height: 30px;
	flex: 0.2;
	background-color: #ff6a00;
	color: #ffffff;
	outline: none;
	border: 0;
	border-radius: 5px;
}
.modal_search_container {
	height: 30px;
	padding: 7px;
	gap: 5px;
}
.modal_search_input {
	border: 1px solid #777776;
	border-radius: 8px;
	flex: 0.8;
	height: 30px;
	display: flex;
	align-items: center;
	padding-inline: 5px;
}
.modal_search_input input {
	border: 0;
	width: 100%;
	outline: none;
}

.modal_search_container {
	display: flex;
	align-items: center;
	gap: 5px;
}
.modal_search_text {
	font-weight: 400;
	font-size: 14px;
	line-height: 17px;
	margin-bottom: 5px;
}

.container_footer {
	display: flex;
	justify-content: space-around;
	align-items: start;
}

.container_scan {
	position: relative;
	padding-inline: 50px;
}

.container_scan img,
.container_scan svg {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -35%);
}

.footer_sub_text {
	font-size: 11px;
	color: #777776;
}

.pointer_menu {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	gap: 5px;
	width: 59px;
}

body .container_footer {
	white-space: nowrap;
}

@media (max-width: 360px) {
	.container_scan {
		padding-inline: 40px;
	}
}

@media (max-width: 420px) {
	.container_scan {
		padding-inline: 45px;
	}
}
</style>
