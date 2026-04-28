<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, ref } from "vue"

import SeparatorLine from "@/components/public/SeparatorLine.vue"
import { backButtonModal } from "@/components/public/modal/helpers/backButtonModal.ts"
import { backButtonDetail } from "@/components/public/modal/helpers/backButtonDetail.ts"
import { useBackListener } from "@/stores/backListener.ts"

interface SearchModalProps {
	isDraggingProp?: boolean
	isClosable?: boolean
	is_footer_padding?: string
}

const props = withDefaults(defineProps<SearchModalProps>(), {
	isDraggingProp: true,
	isClosable: true,
	is_footer_padding: "",
})

const emit = defineEmits<{
	closeModal: [value: boolean]
}>()
const store = useBackListener()

const isVisible = ref<boolean>(false)
const close_modal = ref<HTMLDivElement | null>(null)
const modalContent = ref<HTMLDivElement | null>(null)

// Для свайпа
const startY = ref<number>(0)
const currentY = ref<number>(0)
const isDragging = ref<boolean>(false)
const modalTransform = ref<string>("translateY(0)")
let newTranslateY = 0
const swipeAreaHeight = 50
const swipeIndicator = ref<HTMLDivElement | null>(null)


onMounted(async () => {
	document.body.classList.add("menu-active")
	store.current_back_button_listener?.value?.remove && store.current_back_button_listener?.value?.remove()
	if (window.Capacitor) {
		if (props.isClosable) {
			store.current_back_button_listener.value = window?.Capacitor?.Plugins?.App?.addListener("backButton", () =>
				backButtonModal(closeModal)
			)
		} else {
			store.current_back_button_listener.value = { remove: () => undefined }
		}
	}

	setTimeout(async () => {
		isVisible.value = true

		await nextTick()
		if (modalContent.value && props.isDraggingProp) {
			modalContent.value.addEventListener("touchstart", handleTouchStart, { passive: false })
			modalContent.value.addEventListener("touchmove", handleTouchMove, { passive: false })
			modalContent.value.addEventListener("touchend", handleTouchEnd)
		}
	}, 10)
})

onBeforeUnmount(() => {
	store?.current_back_button_listener?.value?.remove && store.current_back_button_listener.value.remove()
	if (window.Capacitor) {
		store.current_back_button_listener.value = window?.Capacitor?.Plugins?.App?.addListener("backButton", () =>
			backButtonDetail()
		)

	}
})


onUnmounted(() => {
	document.body.classList.remove("menu-active")
	if (modalContent.value && props.isDraggingProp) {
		modalContent.value.removeEventListener("touchstart", handleTouchStart)
		modalContent.value.removeEventListener("touchmove", handleTouchMove)
		modalContent.value.removeEventListener("touchend", handleTouchEnd)
	}
})

const startTime = ref<number>(0)

function handleTouchStart(e: TouchEvent): void {
	const target = e.target instanceof Element ? e.target : null
	const isButton = target?.closest("button") !== null
	const isSwipeIndicator = e.target === swipeIndicator.value ||
		(e.target instanceof Node ? swipeIndicator.value?.contains(e.target) : false)
	const is_open_element = document.body.classList.contains("element-open")

	if (isButton && !isSwipeIndicator || is_open_element) {
		isDragging.value = false
		return
	}

	const touchY = e.touches[0]?.clientY
	const modalRect = modalContent.value?.getBoundingClientRect()
	if (!modalRect) return

	const bottomArea = modalRect.bottom - swipeAreaHeight

	if ((touchY ?? 0) >= bottomArea || isSwipeIndicator) {
		startY.value = touchY ?? 0
		currentY.value = touchY ?? 0
		startTime.value = Date.now()
		isDragging.value = true
		if (modalContent.value) {
			modalContent.value.style.overflow = "hidden"
		}
		e.preventDefault()
	}
}

function handleTouchMove(e: TouchEvent): void {
	if (!isDragging.value) return

	const touch = e.touches[0]
	currentY.value = touch?.clientY ?? 0
	const deltaY = startY.value - (touch?.clientY ?? 0)

	if (deltaY > 10) {
		const maxOffset = window.innerHeight * 0.7
		newTranslateY = Math.min(maxOffset, deltaY)
		modalTransform.value = `translateY(-${newTranslateY}px)`
		e.preventDefault()
	}
}

function handleTouchEnd(): void {
	if (!isDragging.value) return
	isDragging.value = false
	if (modalContent.value) {
		modalContent.value.style.overflow = ""
	}
	const currentTranslate = newTranslateY
	const threshold = window.innerHeight * 0.5
	const duration = Date.now() - startTime.value
	const distance = startY.value - currentY.value
	const velocity = duration > 0 ? Math.abs(distance) / duration : 0

	if (currentTranslate > threshold || velocity > 0.5) {
		modalTransform.value = `translateY(-${window.innerHeight}px)`
		closeModal()
	} else {
		modalTransform.value = "translateY(0)"
	}
}



function closeModal(arrow = false): void {
	if (arrow) {
		close_modal?.value?.classList.add("back-click_animation")
	}

	setTimeout(() => {
		isVisible.value = false

		emit("closeModal", false)
	}, 300)
}

defineExpose({ closeModal })

</script>

<template>
	<Transition name="modal">
		<div v-if="isVisible" @click.self="() =>{isClosable && closeModal(false)}" class="dark_mask"
			 style="height: 100vh">
			<div
				class="mask_container_mod"

				ref="modalContent"
				:style="{ transform: modalTransform, transition: isDragging ? 'none' : 'transform 0.3s ease' }"
			>
				<!-- Индикатор свайпа -->
				<div
					v-if="isDraggingProp"
					ref="swipeIndicator"
					class="swipe-indicator"
					:class="{ 'swipe-indicator-active': isDragging }"
				></div>

				<div class="container_mob_sub_block">
					<div class="mask_container_mod_sub">
						<div class="header_container_mod">
							<div class="header_container_top_block">
								<div class="header_container_top_mod">
									<div
										class="header_title_svg_mod "
									>
										<div ref="close_modal"
											 v-if="isClosable"
											 class="back-click_element"
											 @click="() => closeModal(true)" >
											<svg
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path d="M20 8.92729H0V11.0727H20V8.92729Z"
													  fill="#777776"/>
												<path
													d="M7.95681 1.5L0 8.92729L1.54476 10.47L9.50152 3.04234L7.95681 1.5Z"
													fill="#777776"
												/>
												<path
													d="M7.95681 18.5L0 11.0727L1.54476 9.52996L9.50152 16.9577L7.95681 18.5Z"
													fill="#777776"
												/>
											</svg>
										</div>

									</div>
								</div>

								<div class="header_title_mod" >
									<div class="header_title_container_flex">
										<div class="header_title_container_flex_up">
											<slot name="title_up"></slot>
										</div>
									</div>
								</div>
							</div>
							<SeparatorLine/>
						</div>
						<div class="middle_container">
							<div>
								<slot name="inputs"></slot>
							</div>
						</div>
					</div>

				</div>

			</div>
		</div>
	</Transition>
</template>

<style scoped>
.mask_container_mod {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1001;
	background: #ffffff;
	display: flex;
	flex-direction: column;
	padding: 10px;
	height: 90vh;
	touch-action: pan-y; /* Разрешаем вертикальные жесты */
}

.pb-30 {
	padding-bottom: 30px;
}


.dark_mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
	background-color: rgba(0, 0, 0, 0.5);
}

.container_mob_sub_block {
	flex-grow: 1;
	flex-direction: column;
	display: flex;
	justify-content: space-between;
}

.mask_container_mod_sub {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.header_container_mod {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
}

.middle_container {
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
	margin-top: 30px;
}

.header_container_top_mod {
	position: relative;
	display: flex;
	justify-content: start;
	align-items: center;
}

.header_container_top_block {
	display: flex;
	position: relative;
}

.header_title_mod {
	font-weight: bold;
	font-size: var(--text-l);
	margin: 0 auto;
	text-align: center;
}

.header_title_mod {
	text-align: center;
	width: 100%;
}

.header_title_svg_mod {
	position: absolute;
	top: 50%;
	transform: translate(0, -50%);
	border-radius: 50%;
}

.textarea_mod {
	width: 97%;
	height: 50vh;
	outline: none;
	resize: none;
	display: block;
	margin: 0 auto;
	margin-top: 15px;
}

.input_mod {
	display: block;
	margin: 0 auto;
	margin-top: 15px;
}

.header_title_container_flex {
	display: flex;
	flex-direction: column;
	gap: 5px;
	align-items: center;
	justify-content: center;
}

.header_title_container_flex_up {
	min-height: 25px;
	display: flex;
	align-items: center;
}

.header_title_container_flex_down {
	min-height: 19px;
}

/* Добавленные стили только для анимации */
.modal-enter-active,
.modal-leave-active {
	transition: all 300ms ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.3s ease;
}

.modal-enter-active .mask_container_mod,
.modal-leave-active .mask_container_mod {
	transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-leave-to .mask_container_mod {
	transform: translateY(-100%);
}

.btn_container_mod button {
	touch-action: manipulation;
	position: relative;
	z-index: 1002;
}

/* Стили для индикатора свайпа */
.swipe-indicator {
	position: absolute;
	bottom: 1px;
	left: 50%;
	transform: translateX(-50%);
	width: 100px;
	height: 6px;
	background-color: rgba(0, 0, 0, 0.2);
	border-radius: 8px;
	z-index: 1003;
	transition: all 0.3s ease;
}

.swipe-indicator-active {
	background-color: rgba(0, 0, 0, 0.4);
	width: 80px;
	height: 7px;
}

.back-click_animation {
	animation: back-click 0.3s ease;
}

@keyframes back-click {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(0.95);
	}
	100% {
		transform: scale(1);
	}
}


</style>
