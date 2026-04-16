<script setup lang="ts">
import SeparatorLine from "@/components/public/SeparatorLine.vue"
import { ref } from "vue"

const close_elem = ref(null)
const emit = defineEmits<{
	unlockScroll: []
}>()

const goBack = (): void => {
	emit("unlockScroll")
	close_elem?.value && close_elem?.value?.classList.add("back-click_animation")

	setTimeout(() => {
		close_elem?.value && close_elem?.value?.classList.remove("back-click_animation")
		location.href = "/mobile_app/"
	}, 400)
}
</script>

<template>
	<div class="header_container">
		<div class="header_container_top">
			<div class="header_title_svg">
				<div
					ref="close_elem"
					class="back-click_element"
					style="position: relative; width: fit-content"
				>
					<svg
						@click="goBack()"
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M20 8.92729H0V11.0727H20V8.92729Z" fill="#777776" />
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
			<div>
				<div class="header_title" style="margin-bottom: 5px">Печать ценников</div>
			</div>
			<div class="header_title_svg" style="display: flex; justify-content: end">
				<div
					class="back-click_element"
					style="position: relative; width: fit-content"
				></div>
			</div>
		</div>

		<SeparatorLine />
	</div>
</template>

<style scoped>
.header_container_top {
	position: relative;
	display: flex;
	justify-content: start;
	align-items: center;

}

.header_title {
	font-weight: bold;
	font-size: var(--text-m);
	line-height: var(--line-h-m);
}

.header_title_svg {
	flex: 0.5;
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
