<script setup lang="ts">
import { ref } from "vue"
import type { ConfirmButton, ConfirmDialogExpose, ConfirmIndex } from "@/services/confirmService"

interface ConfirmGlobalProps {
	buttons: ConfirmButton[]
	title?: string
	message?: string
	showTitle?: boolean
}

const props = withDefaults(defineProps<ConfirmGlobalProps>(), {
	title: "Подтверждение",
	message: "",
	showTitle: true
})

const emit = defineEmits<{
	selected: [index: ConfirmIndex, isAsync: boolean, callback: () => void]
}>()

const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const show = (): void => {
	isOpen.value = true
	isLoading.value = false
}

const close = (): void => {
	isOpen.value = false
}

const setLoading = (state: boolean): void => {
	isLoading.value = state
}

const handleAction = async (index: ConfirmIndex, isAsync = false): Promise<void> => {
	if (isLoading.value) return

	if (isAsync) {
		isLoading.value = true
		emit("selected", index, isAsync, () => {
			// Колбэк для ручного закрытия после асинхронной операции.
			isLoading.value = false
			close()
		})
	} else {
		emit("selected", index, isAsync, close)
	}
}

defineExpose<ConfirmDialogExpose>({
	show,
	close,
	setLoading,
})
</script>

<template>
	<Transition name="fade">
		<div
			v-if="isOpen"
			class="confirm_global_mask"
			@click.self="!isLoading && handleAction('cancel', false)"
		>
			<Transition name="scale">
				<div class="confirm_container">
					<div v-if="showTitle" class="confirm_header">
						<slot name="header">
							<div>{{ props.title }}</div>
						</slot>
					</div>

					<div class="confirm_body">
						<slot>{{ props.message }}</slot>
					</div>

					<div class="confirm_actions">
						<button
							v-for="button in props.buttons"
							:key="button.index"
							@click="handleAction(button.index, button.async)"
							:disabled="isLoading"
							:class="[
					'confirm_button',
					button.index === 1 ? 'confirm_button--orange' :
					button.index === 2 ? 'confirm_button--grey' :
					'confirm_button--neutral',
					{'confirm_button--loading': isLoading}
					]"
						>
							<span v-if="isLoading && button.async">Загрузка...</span>
							<span v-else>{{button.title}}</span>
						</button>
					</div>
				</div>
			</Transition>
		</div>
	</Transition>
</template>



<style scoped>
.confirm_global_mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1005;
}

.confirm_container {
	background: #fff;
	border-radius: 8px;
	min-width: 320px;
	width: 100%;
	max-width: 90vw;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	overflow: hidden;
}

.confirm_header {
	padding: 16px 24px;
	border-bottom: 1px solid #eaeaea;
	font-weight: 600;
	font-size: 1.1em;
	text-align: center;
}

.confirm_body {
	padding: 25px 20px 10px 20px;
	text-align: center;
	white-space: pre-line;
}

.confirm_actions {
	display: flex;
	justify-content: space-around;
	gap: 12px;
	padding: 16px 24px;

}

.confirm_button {
	min-width: 100px;
	padding: 8px 16px;
	cursor: pointer;
	transition: background-color 0.2s ease;
	font-size: var(--text-m);
	font-weight: 500;
	border-radius: 8px;
	text-align: center;
}


.confirm_button--grey {
	color: #ffffff;
	border: 0;
	background-color: #B3B3B3;
}

.confirm_button--orange {
	background: #FF6A00;
	color: #ffffff;
	border: 0;
}

.confirm_button--neutral {
	background-color: #e0e0e0;
}

.confirm_button--neutral:hover {
	background-color: #d0d0d0;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
	transition: all 300ms ease;
}

.scale-enter-from,
.scale-leave-to {
	transform: scale(0.95);
	opacity: 0;
}
.confirm_button--loading {
	opacity: 0.7;
	cursor: not-allowed;
}
</style>
