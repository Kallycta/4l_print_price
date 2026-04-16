<script setup lang="ts">
import { ref, computed } from "vue"

const is_active = ref(false)
const namesList = ref([
	{
		label: "ООО “Маркет 1",
		value: "ООО “Маркет 1",
	},
	{
		label: "ООО “Маркет 2",
		value: "ООО “Маркет 2",
	},
	{
		label: "ООО “Маркет 3",
		value: "ООО “Маркет 3",
	},
	{
		label: "ООО “Маркет 4",
		value: "ООО “Маркет 4",
	},
])

const priceList = ref([
	{
		label: "Ценник FOOD 60х40",
		value: "Ценник FOOD 60х40",
	},
	{
		label: "Ценник FOOD 70х40",
		value: "Ценник FOOD 70х40",
	},
	{
		label: "Ценник FOOD 80х40",
		value: "Ценник FOOD 80х40",
	},
	{
		label: "Ценник FOOD 90х40",
		value: "Ценник FOOD 90х40",
	},
])

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

	// Если В финальном положении (карточка уехала влево)
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
	startX.value = e.touches[0].clientX
	isDragging.value = true

	// Если в финальном положении, currentX уже равен -SWIPE_THRESHOLD
	// не сбрасываем его!
}

const onTouchMove = (e: TouchEvent): void => {
	if (!isDragging.value) return

	const deltaX = e.touches[0].clientX - startX.value

	if (!is_finish.value) {
		if (deltaX < 0) {
			// Не даем уехать дальше порога
			const newX = Math.max(deltaX, -SWIPE_THRESHOLD)
			currentX.value = newX
			updateTrashVisibility(newX)
		}
	} else {
		//  Финальный режим (карточка уехала влево)
		// Свайп вправо (положительные значения) - возвращаем карточку
		// Но не даем уехать дальше 0
		const currentPosition = currentX.value
		const newX = Math.min(0, currentPosition + deltaX)

		// Разрешаем движение только в диапазоне от -SWIPE_THRESHOLD до 0
		if (newX <= 0 && newX >= -SWIPE_THRESHOLD) {
			currentX.value = newX

			// Если вернулись больше чем на RETURN_THRESHOLD, прячем корзину
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
		// Режим 1: Нормальный режим
		// Если свайп достаточно большой и показывает корзину
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
		// Режим 2: Финальный режим
		// Если карточка вернулась достаточно близко к началу (меньше -RETURN_THRESHOLD)
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
</script>

<template>
	<div
		class="print_price_card"
		ref="cardContainerRef"
		:style="cardStyle"
		@touchstart="onTouchStart"
		@touchmove="onTouchMove"
		@touchend="onTouchEnd"
	>
		<div>
			<div class="print_price_card_title">
				<div class="print_price_card_title_icon">
					<svg
						v-if="!is_active"
						class="print_inactive_svg"
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4.10352 0.5H10.8965C11.1016 0.500068 11.2983 0.581549 11.4434 0.726562C11.5884 0.871598 11.6699 1.06835 11.6699 1.27344V4.46191H13.1602C13.5154 4.46191 13.8562 4.60337 14.1074 4.85449C14.3586 5.10569 14.5 5.44651 14.5 5.80176V10.8965C14.4999 11.2517 14.3586 11.5926 14.1074 11.8438C13.8562 12.0948 13.5153 12.2363 13.1602 12.2363H11.1035V13.7266C11.1035 13.9317 11.022 14.1284 10.877 14.2734C10.7319 14.4184 10.5352 14.5 10.3301 14.5H4.66992C4.46482 14.5 4.26811 14.4184 4.12305 14.2734C3.97801 14.1284 3.89652 13.9317 3.89648 13.7266V12.2363H1.83984C1.48467 12.2363 1.14378 12.0948 0.892578 11.8438C0.641411 11.5926 0.500068 11.2517 0.5 10.8965V5.80176C0.500034 5.44651 0.641381 5.10569 0.892578 4.85449C1.14379 4.60337 1.48464 4.46191 1.83984 4.46191H3.33008V1.27344C3.33012 1.06876 3.41237 0.87113 3.55664 0.727539L3.55859 0.726562C3.70215 0.582364 3.89892 0.500069 4.10352 0.5ZM4.31152 14.085H10.6885V9.97168H4.31152V14.085ZM10.8965 5.72656C10.2299 5.72656 9.68868 6.26705 9.68848 6.93359C9.68848 7.25383 9.81557 7.56163 10.042 7.78809C10.2685 8.01455 10.5762 8.1416 10.8965 8.1416H12.0283C12.3484 8.1416 12.6554 8.01436 12.8818 7.78809C13.1083 7.56163 13.2363 7.25385 13.2363 6.93359C13.2362 6.61347 13.1082 6.30645 12.8818 6.08008C12.6554 5.85373 12.3485 5.72657 12.0283 5.72656H10.8965ZM3.74512 4.46191H11.2549V0.915039H3.74512V4.46191Z"
							fill="white"
							stroke="#777776"
						/>
					</svg>
					<svg
						v-if="is_active"
						class="print_active_svg"
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4.10352 0.5H10.8965C11.1016 0.500068 11.2983 0.581549 11.4434 0.726562C11.5884 0.871598 11.6699 1.06835 11.6699 1.27344V4.46191H13.1602C13.5154 4.46191 13.8562 4.60337 14.1074 4.85449C14.3586 5.10569 14.5 5.44651 14.5 5.80176V10.8965C14.4999 11.2517 14.3586 11.5926 14.1074 11.8438C13.8562 12.0948 13.5153 12.2363 13.1602 12.2363H11.1035V13.7266C11.1035 13.9317 11.022 14.1284 10.877 14.2734C10.7319 14.4184 10.5352 14.5 10.3301 14.5H4.66992C4.46482 14.5 4.26811 14.4184 4.12305 14.2734C3.97801 14.1284 3.89652 13.9317 3.89648 13.7266V12.2363H1.83984C1.48467 12.2363 1.14378 12.0948 0.892578 11.8438C0.641411 11.5926 0.500068 11.2517 0.5 10.8965V5.80176C0.500034 5.44651 0.641381 5.10569 0.892578 4.85449C1.14379 4.60337 1.48464 4.46191 1.83984 4.46191H3.33008V1.27344C3.33012 1.06876 3.41237 0.87113 3.55664 0.727539L3.55859 0.726562C3.70215 0.582364 3.89892 0.500069 4.10352 0.5ZM4.31152 14.085H10.6885V9.97168H4.31152V14.085ZM10.8965 5.72656C10.2299 5.72656 9.68868 6.26705 9.68848 6.93359C9.68848 7.25383 9.81557 7.56163 10.042 7.78809C10.2685 8.01455 10.5762 8.1416 10.8965 8.1416H12.0283C12.3484 8.1416 12.6554 8.01436 12.8818 7.78809C13.1083 7.56163 13.2363 7.25385 13.2363 6.93359C13.2362 6.61347 13.1082 6.30645 12.8818 6.08008C12.6554 5.85373 12.3485 5.72657 12.0283 5.72656H10.8965ZM3.74512 4.46191H11.2549V0.915039H3.74512V4.46191Z"
							fill="#34C759"
							stroke="#00860D"
						/>
					</svg>
				</div>
				<div class="print_price_card_title_icon">
					Monge Dog Fresh консервы для собак говядина 100г
				</div>
			</div>
			<div class="print_price_card_price">
				<div class="print_price_card_price-left">
					<div class="print_price_card_price-left_txt">Цена:</div>
					<div class="print_price_card_price-left_digits">444 руб.</div>
				</div>
				<div class="print_price_card_price-right">
					<select @change="(e) => onChangeNames(e.target.value)">
						<option v-for="elem in namesList" :value="elem.value" :key="elem.value">
							{{ elem.label }}
						</option>
					</select>
				</div>
			</div>
			<div class="print_price_card_count">
				<div class="print_price_card_count-left">
					<div class="print_price_card_count-left_txt">Кол-во:</div>
					<div class="print_price_card_count-left_digits">
						<input type="number" />
					</div>
				</div>
				<div class="print_price_card_count-right">
					<select @change="(e) => onChangePrice(e.target.value)">
						<option v-for="elem in priceList" :value="elem.value" :key="elem.value">
							{{ elem.label }}
						</option>
					</select>
				</div>
			</div>
			<div class="print_price_card_info">
				<div class="print_price_card_info_left">
					<div class="print_price_card_info_left_SHK">ШК:</div>
					<div class="print_price_card_info_left_digits">8009470013079</div>
				</div>
				<div class="print_price_card_info_right">
					<div class="print_price_card_info_right_SAP">Код SAP:</div>
					<div class="print_price_card_info_right_digits">000000000001027890</div>
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
.print_price_card {
	padding: 5px;
	border: 1px solid #777776;
	border-radius: 5px;
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
	gap: 13px;
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
