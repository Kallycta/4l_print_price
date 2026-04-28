<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { usePriceTypesStore } from "@/stores/priceTypess.ts"
import { storeToRefs } from "pinia"
import type { ICompany, IGetGood } from "@/types/cards.ts"
import CheckboxComponent from "@/components/public/CheckboxComponent.vue"
import { useCardsStore } from "@/stores/cards.ts"



const props = defineProps<{
	card: IGetGood
}>()
const namesList = ref<ICompany[]>([])

onMounted(() => {
	if(props.card.GSBER) {
		namesList.value = props.card.GSBER
	}
})

const typesStore = usePriceTypesStore();
const {priceTypes} = storeToRefs(typesStore)
const cardStore = useCardsStore()
const indexCard:number = cardStore.cards.findIndex((element: IGetGood) => element.EAN === props.card.EAN )

const GSBER_VAL = computed({
	get: () => cardStore.cards[indexCard]?.GSBER_VAL,
	set: (value) => cardStore.updateGSBER(indexCard, value ?? 'default')
});

const SCAGR_VAL = computed({
	get: () => cardStore.cards[indexCard]?.SCAGR,
	set: (value) => cardStore.updateSCAGR(indexCard, value ?? 'default')
});


const startX = ref(0)
const currentX = ref(0)
const isDragging = ref(false)
const showTrash = ref(false)
const is_finish = ref(false)

const SWIPE_THRESHOLD = 70
const TRASH_THRESHOLD = 40
const RETURN_THRESHOLD = 20

// Вычисляемое смещение для стиля
const cardStyle = computed(() => {
	// Если НЕ в финальном положении
	if (!is_finish.value) {
		// Карточка на месте и не тащим
		if (!isDragging.value && currentX.value === 0) {
			return {
				transform: "translateX(0px)",
				transition: "transform 0.3s ease",
			}
		}

		// Ограничиваем свайп только влево (отрицательные значения)
		const translateX = Math.min(0, currentX.value)

		return {
			transform: `translateX(${translateX}px)`,
			transition: isDragging.value ? "none" : "transform 0.3s ease",
		}
	}

	// Если в финальном положении (карточка уехала влево)
	else {
		// Карточка зафиксирована в крайнем левом положении
		if (!isDragging.value && currentX.value === -SWIPE_THRESHOLD) {
			return {
				transform: `translateX(-${SWIPE_THRESHOLD}px)`,
				transition: "transform 0.3s ease",
			}
		}

		// При свайпе вправо - разрешаем движение до 0
		const translateX = Math.min(0, Math.max(-SWIPE_THRESHOLD, currentX.value))

		return {
			transform: `translateX(${translateX}px)`,
			transition: isDragging.value ? "none" : "transform 0.3s ease",
		}
	}
})

// Показываем корзину при свайпе влево
const updateTrashVisibility = (x: number): void => {
	showTrash.value = x < -TRASH_THRESHOLD
}

const onTouchStart = (e: TouchEvent): void => {
	// Всегда запоминаем начальную позицию
	startX.value = e.touches[0]?.clientX ?? 0
	isDragging.value = true

	// Если в финальном положении, currentX уже равен -SWIPE_THRESHOLD
	// не сбрасываем его!
}

const onTouchMove = (e: TouchEvent): void => {
	if (!isDragging.value) return

	const deltaX = e.touches[0]?.clientX ?? 0 - startX.value

	if (!is_finish.value) {
		if (deltaX < 0) {
			// Не даем уехать дальше порога
			const newX = Math.max(deltaX, -SWIPE_THRESHOLD)
			currentX.value = newX
			updateTrashVisibility(newX)
		}
	} else {
		//  Финальный режим (карточка уехала влево)
		// Свайп вправо (положительные значения)  возвращаем карточку
		// но не даем уехать дальше 0
		const currentPosition = currentX.value
		const newX = Math.min(0, currentPosition + deltaX)

		// Разрешаем движение только в диапазоне от -SWIPE_THRESHOLD до 0
		if (newX <= 0 && newX >= -SWIPE_THRESHOLD) {
			currentX.value = newX

			// Если вернулись больше чем на RETURN_THRESHOLD прячем корзину
			if (newX > -RETURN_THRESHOLD) {
				showTrash.value = false
			} else {
				showTrash.value = true
			}
		}
	}
}

const onTouchEnd = (): void => {
	isDragging.value = false

	if (!is_finish.value) {
		// Нормальный режим
		// если свайп достаточно большой и показывает корзину
		if (currentX.value <= -SWIPE_THRESHOLD && showTrash.value) {
			// Фиксируем в крайнем положении
			currentX.value = -SWIPE_THRESHOLD
			is_finish.value = true
			showTrash.value = true
		} else {
			// Возвращаем на место
			resetPosition()
		}
	} else {
		// Финальный режим
		// если карточка вернулась достаточно близко к началу (меньше -RETURN_THRESHOLD)
		if (currentX.value > -RETURN_THRESHOLD) {
			// Полностью возвращаем карточку
			resetPosition()
			is_finish.value = false
			showTrash.value = false
		} else {
			// Иначе фиксируем обратно в крайнем положении
			currentX.value = -SWIPE_THRESHOLD
			showTrash.value = true
		}
	}
}

const resetPosition = (): void => {
	currentX.value = 0
	showTrash.value = false
	is_finish.value = false
}

const onChangeNames = (value: string): void => {

	console.log(value)
}

const onChangePrice = (value: string): void => {
	console.log(value)
}

const checkboxValue = ref(!!props.card.CHECKED)

const onChangeCB = (value: boolean, EAN: string):void => {
	const newCards = cardStore.cards.map((card) => {
		if(card.EAN.toString() === EAN.toString()) {
			card.CHECKED = value
		}
		return card
	})
	cardStore.updateCards(newCards)
}

</script>

<template>

	<div
		class="print_price_card"
		:class="{'action-card': card.ACTION === 'X', 'active-card': card.CHECKED}"
		ref="cardContainerRef"
		:style="cardStyle"
		@touchstart="onTouchStart"
		@touchmove="onTouchMove"
		@touchend="onTouchEnd"
	>
		<div>
			<div class="print_price_card_title">
				<div class="print_price_card_title_icon">
					<CheckboxComponent
						v-model="checkboxValue"
						:checked="!!card.CHECKED"
						:name="'name-checkbox-card' + card.EAN"
						@on-change-value="(e) => onChangeCB(e?.target.checked, card.EAN)"
						:label="card.MATTXT"
					/>
				</div>
			</div>
			<div v-if="card.BB_DATA.BB_SCAGR" class="print_price_card_subtitle">
				<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="7.5" cy="7.5" r="7.5" fill="#FF6A00"/>
					<path d="M3.62207 5.02393V4.53516C3.62207 4.18392 3.69824 3.86442 3.85059 3.57666C4.00293 3.2889 4.2251 3.05827 4.51709 2.88477C4.81331 2.71126 5.17301 2.62451 5.59619 2.62451C6.02783 2.62451 6.38965 2.71126 6.68164 2.88477C6.97786 3.05827 7.20003 3.2889 7.34814 3.57666C7.50049 3.86442 7.57666 4.18392 7.57666 4.53516V5.02393C7.57666 5.3667 7.50049 5.68197 7.34814 5.96973C7.20003 6.25749 6.97998 6.48812 6.68799 6.66162C6.396 6.83512 6.0363 6.92188 5.60889 6.92188C5.18148 6.92188 4.81966 6.83512 4.52344 6.66162C4.22721 6.48812 4.00293 6.25749 3.85059 5.96973C3.69824 5.68197 3.62207 5.3667 3.62207 5.02393ZM4.7583 4.53516V5.02393C4.7583 5.18473 4.78792 5.33708 4.84717 5.48096C4.91064 5.62061 5.00586 5.73486 5.13281 5.82373C5.25977 5.9126 5.41846 5.95703 5.60889 5.95703C5.79932 5.95703 5.95378 5.9126 6.07227 5.82373C6.19499 5.73486 6.28597 5.62061 6.34521 5.48096C6.40869 5.33708 6.44043 5.18473 6.44043 5.02393V4.53516C6.44043 4.37012 6.40869 4.21566 6.34521 4.07178C6.28597 3.9279 6.19287 3.81152 6.06592 3.72266C5.9432 3.63379 5.78662 3.58936 5.59619 3.58936C5.40999 3.58936 5.25342 3.63379 5.12646 3.72266C5.00374 3.81152 4.91064 3.9279 4.84717 4.07178C4.78792 4.21566 4.7583 4.37012 4.7583 4.53516ZM8.05908 10.2227V9.73389C8.05908 9.38688 8.13525 9.0695 8.2876 8.78174C8.44417 8.49398 8.67057 8.26335 8.9668 8.08984C9.26302 7.91634 9.62061 7.82959 10.0396 7.82959C10.4754 7.82959 10.8394 7.91634 11.1313 8.08984C11.4233 8.26335 11.6434 8.49398 11.7915 8.78174C11.9438 9.0695 12.02 9.38688 12.02 9.73389V10.2227C12.02 10.5697 11.9438 10.887 11.7915 11.1748C11.6434 11.4626 11.4233 11.6932 11.1313 11.8667C10.8436 12.0402 10.4839 12.127 10.0522 12.127C9.62907 12.127 9.26725 12.0402 8.9668 11.8667C8.67057 11.6932 8.44417 11.4626 8.2876 11.1748C8.13525 10.887 8.05908 10.5697 8.05908 10.2227ZM9.20166 9.73389V10.2227C9.20166 10.3877 9.23551 10.5422 9.30322 10.686C9.37093 10.8257 9.46826 10.9399 9.59521 11.0288C9.7264 11.1177 9.87874 11.1621 10.0522 11.1621C10.2638 11.1621 10.431 11.1177 10.5537 11.0288C10.6764 10.9399 10.7632 10.8257 10.814 10.686C10.8647 10.5422 10.8901 10.3877 10.8901 10.2227V9.73389C10.8901 9.56885 10.8584 9.4165 10.7949 9.27686C10.7314 9.13298 10.6362 9.0166 10.5093 8.92773C10.3866 8.83887 10.23 8.79443 10.0396 8.79443C9.85335 8.79443 9.69678 8.83887 9.56982 8.92773C9.4471 9.0166 9.354 9.13298 9.29053 9.27686C9.23128 9.4165 9.20166 9.56885 9.20166 9.73389ZM10.4585 4.07812L5.94531 11.3018L5.11377 10.8384L9.62695 3.61475L10.4585 4.07812Z" fill="white"/>
				</svg>
				<div class="print_price_card_subtitle-text">
					{{card.BB_DATA?.BB_Z006_DATA?.BONUS_NAME}}
				</div>
			</div>
			<div class="print_price_card_price">
				<div class="print_price_card_price-left-1">
						<svg v-if="card.ACTION === 'X' " width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="7.5" cy="7.5" r="7.5" fill="#FF6A00"/>
							<path d="M3.62207 5.02393V4.53516C3.62207 4.18392 3.69824 3.86442 3.85059 3.57666C4.00293 3.2889 4.2251 3.05827 4.51709 2.88477C4.81331 2.71126 5.17301 2.62451 5.59619 2.62451C6.02783 2.62451 6.38965 2.71126 6.68164 2.88477C6.97786 3.05827 7.20003 3.2889 7.34814 3.57666C7.50049 3.86442 7.57666 4.18392 7.57666 4.53516V5.02393C7.57666 5.3667 7.50049 5.68197 7.34814 5.96973C7.20003 6.25749 6.97998 6.48812 6.68799 6.66162C6.396 6.83512 6.0363 6.92188 5.60889 6.92188C5.18148 6.92188 4.81966 6.83512 4.52344 6.66162C4.22721 6.48812 4.00293 6.25749 3.85059 5.96973C3.69824 5.68197 3.62207 5.3667 3.62207 5.02393ZM4.7583 4.53516V5.02393C4.7583 5.18473 4.78792 5.33708 4.84717 5.48096C4.91064 5.62061 5.00586 5.73486 5.13281 5.82373C5.25977 5.9126 5.41846 5.95703 5.60889 5.95703C5.79932 5.95703 5.95378 5.9126 6.07227 5.82373C6.19499 5.73486 6.28597 5.62061 6.34521 5.48096C6.40869 5.33708 6.44043 5.18473 6.44043 5.02393V4.53516C6.44043 4.37012 6.40869 4.21566 6.34521 4.07178C6.28597 3.9279 6.19287 3.81152 6.06592 3.72266C5.9432 3.63379 5.78662 3.58936 5.59619 3.58936C5.40999 3.58936 5.25342 3.63379 5.12646 3.72266C5.00374 3.81152 4.91064 3.9279 4.84717 4.07178C4.78792 4.21566 4.7583 4.37012 4.7583 4.53516ZM8.05908 10.2227V9.73389C8.05908 9.38688 8.13525 9.0695 8.2876 8.78174C8.44417 8.49398 8.67057 8.26335 8.9668 8.08984C9.26302 7.91634 9.62061 7.82959 10.0396 7.82959C10.4754 7.82959 10.8394 7.91634 11.1313 8.08984C11.4233 8.26335 11.6434 8.49398 11.7915 8.78174C11.9438 9.0695 12.02 9.38688 12.02 9.73389V10.2227C12.02 10.5697 11.9438 10.887 11.7915 11.1748C11.6434 11.4626 11.4233 11.6932 11.1313 11.8667C10.8436 12.0402 10.4839 12.127 10.0522 12.127C9.62907 12.127 9.26725 12.0402 8.9668 11.8667C8.67057 11.6932 8.44417 11.4626 8.2876 11.1748C8.13525 10.887 8.05908 10.5697 8.05908 10.2227ZM9.20166 9.73389V10.2227C9.20166 10.3877 9.23551 10.5422 9.30322 10.686C9.37093 10.8257 9.46826 10.9399 9.59521 11.0288C9.7264 11.1177 9.87874 11.1621 10.0522 11.1621C10.2638 11.1621 10.431 11.1177 10.5537 11.0288C10.6764 10.9399 10.7632 10.8257 10.814 10.686C10.8647 10.5422 10.8901 10.3877 10.8901 10.2227V9.73389C10.8901 9.56885 10.8584 9.4165 10.7949 9.27686C10.7314 9.13298 10.6362 9.0166 10.5093 8.92773C10.3866 8.83887 10.23 8.79443 10.0396 8.79443C9.85335 8.79443 9.69678 8.83887 9.56982 8.92773C9.4471 9.0166 9.354 9.13298 9.29053 9.27686C9.23128 9.4165 9.20166 9.56885 9.20166 9.73389ZM10.4585 4.07812L5.94531 11.3018L5.11377 10.8384L9.62695 3.61475L10.4585 4.07812Z" fill="white"/>
						</svg>
					<div class="print_price_card_price-left">
						<div class="print_price_card_price-left_txt">Цена:</div>
						<div class="print_price_card_price-left_digits">{{card.PRICE}} руб.</div>
					</div>
				</div>

				<div class="print_price_card_price-right">

					<select v-if="namesList.length > 1" v-model="GSBER_VAL" @change="(e: Event) => onChangeNames((e.target as HTMLSelectElement).value)" >
						<option v-for="(elem) in namesList"  :value="elem.ZZGSBER" :key="elem.ZZGSBER" >
							{{ elem.ZZGTEXT }}
						</option>
					</select>
					<div v-if="namesList.length === 1">
						{{namesList[0]?.ZZGTEXT ?? ''}}
					</div>
				</div>
			</div>
			<div class="print_price_card_count">
				<div class="print_price_card_count-left">
					<div class="print_price_card_count-left_txt">Кол-во:</div>
					<div class="print_price_card_count-left_digits">
						<input type="number" :value="card.COPIES" min="1" />
					</div>
				</div>
				<div class="print_price_card_count-right">
					<select v-model="SCAGR_VAL" @change="(e: Event) => onChangePrice((e.target as HTMLSelectElement).value)">
						<option v-for="elem in priceTypes" :value="elem.value" :key="elem.value">
							{{ elem.label }}
						</option>
					</select>
				</div>
			</div>
			<div class="print_price_card_info">
				<div class="print_price_card_info_left">
					<div class="print_price_card_info_left_SHK">ШК:</div>
					<div class="print_price_card_info_left_digits">{{card.EAN}}</div>
				</div>
				<div class="print_price_card_info_right">
					<div class="print_price_card_info_right_SAP">Код SAP:</div>
					<div class="print_price_card_info_right_digits">{{Number(card.MATNR)}}</div>
				</div>
			</div>
		</div>
		<div class="trash-icon" :class="{ 'trash-visible': showTrash }">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M8.625 4.5V2.25H15.375V4.5H8.625ZM6.375 4.5V1.5C6.375 1.10218 6.53304 0.720644 6.81434 0.43934C7.09564 0.158035 7.47718 0 7.875 0L16.125 0C16.5228 0 16.9044 0.158035 17.1857 0.43934C17.467 0.720644 17.625 1.10218 17.625 1.5V4.5H21.375C21.6734 4.5 21.9595 4.61853 22.1705 4.8295C22.3815 5.04048 22.5 5.32663 22.5 5.625C22.5 5.92337 22.3815 6.20952 22.1705 6.4205C21.9595 6.63147 21.6734 6.75 21.375 6.75H20.8275L19.713 21.2295C19.6552 21.9832 19.315 22.6872 18.7604 23.2009C18.2059 23.7146 17.4779 23.9999 16.722 24H7.278C6.52211 23.9999 5.79411 23.7146 5.23957 23.2009C4.68502 22.6872 4.34483 21.9832 4.287 21.2295L3.1725 6.75H2.625C2.32663 6.75 2.04048 6.63147 1.8295 6.4205C1.61853 6.20952 1.5 5.92337 1.5 5.625C1.5 5.32663 1.61853 5.04048 1.8295 4.8295C2.04048 4.61853 2.32663 4.5 2.625 4.5H6.375ZM5.43 6.75H18.57L17.469 21.057C17.4546 21.2454 17.3697 21.4214 17.2313 21.5498C17.0928 21.6783 16.9109 21.7498 16.722 21.75H7.278C7.0891 21.7498 6.90723 21.6783 6.76875 21.5498C6.63026 21.4214 6.54536 21.2454 6.531 21.057L5.43 6.75Z"
					fill="#EEEEEE"
				/>
			</svg>
		</div>
	</div>
</template>

<style scoped>
.print_price_card_price-right {
	font-size: var(--text-xxs);
	line-height: var(--line-h-xxs);
	color: #1D1D1B;
}
.print_price_card_subtitle {
	display: flex;
	align-items: center;
	gap: 5px;
	margin-bottom: 15px;
}
.print_price_card_subtitle svg {
	display: flex;
}
.print_price_card_subtitle-text {
	font-weight: 500;
	font-size: 15px;
	line-height: 15px;
	color: #FF6A00;
}

.print_price_card_price-left-1 {
	display: flex;
	gap: 4px;
	align-items: center;
}
.print_price_card_price-left-1 svg {
	display: flex;
}
.print_price_card {
	padding: 5px;
	border: 1px solid #777776;
	border-radius: 5px;
}
.print_price_card.active-card {
	border-color: #FF6A00;
}
.print_price_card.action-card {
	background: #FFFCF0;
}

.print_price_card select {
	width: 175px;
	height: 25px;
	border: 0.5px solid #aba1ff;
	border-radius: 5px;
	outline: none;
}

.print_price_card.active {
	border-color: #ff6a00;
}

.print_price_card_title {
	display: flex;
	gap: 5px;
	font-weight: 500;
	font-size: var(--text-s);
	line-height: var(--line-h-s);
	color: #1d1d1b;
	margin-bottom: 10px;
}

.print_price_card_price,
.print_price_card_count,
.print_price_card_info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10px;
}

.print_price_card_count {
	margin-bottom: 5px;
}

.print_price_card_info {
	margin-bottom: 0;
}

.print_price_card_price-left {
	display: flex;
	gap: 6px;
	align-items: center;
}

.print_price_card_count-left {
	display: flex;
	gap: 3.5px;
	align-items: center;
}

.print_price_card_count-left input {
	width: 45px;
	height: 25px;
	border: 0.5px solid #aba1ff;
	outline: none;
	border-radius: 5px;
}

.print_price_card_count-left_txt,
.print_price_card_price-left_txt {
	font-weight: 400;
	font-size: var(--text-xs);
	line-height: var(--line-h-xs);
	color: #7c7c7c;
}

.print_price_card_count-left_digits input,
.print_price_card_price-left_digits {
	font-weight: 500;
	font-size: var(--text-xs);
	line-height: var(--line-h-xs);
	color: #1d1d1b;
}

.print_price_card_info_left,
.print_price_card_info_right {
	display: flex;
	align-items: center;
	gap: 3px;
}

.print_price_card_info_left_SHK,
.print_price_card_info_right_SAP {
	font-weight: 400;
	font-size: var(--text-xxs);
	line-height: var(--line-h-xxs);
	color: #7c7c7c;
}

.print_price_card_info_left_digits input,
.print_price_card_info_left_digits,
.print_price_card_info_right_digits {
	font-weight: 400;
	font-size: var(--text-xxs);
	line-height: var(--line-h-xxs);
	color: #1d1d1b;
}
.trash-icon {
	width: 50px;
	height: 100%;
	display: flex;
	border-radius: 5px;
	justify-content: center;
	align-items: center;
	background-color: #ff6a00;
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	font-size: 24px;
	opacity: 0;
	transition: all 0.2s ease;
	pointer-events: none;
}

.trash-visible {
	opacity: 1;
	right: -70px;
	transition: right 0s ease;
}
</style>
