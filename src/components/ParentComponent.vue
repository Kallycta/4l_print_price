<script setup lang="ts">
import FooterPrice from "@/components/footer/FooterPrice.vue"
import HeaderPrice from "@/components/header/HeaderPrice.vue"
import BodyPrice from "@/components/body/BodyPrice.vue"
import { nextTick, onMounted, onUnmounted, ref } from "vue"

const scrollableBlock = ref(null)
const handleScroll = (): void => {
	if (window?.pulloadObject?.blocked) {
		window.pulloadObject.blocked = scrollableBlock.value.scrollTop !== 0
	}
}

onMounted(async () => {
	await nextTick()

	if (scrollableBlock.value) {
		scrollableBlock.value.addEventListener("scroll", handleScroll)
	}
})

onUnmounted(() => {
	if (scrollableBlock.value) {
		scrollableBlock.value.removeEventListener("scroll", handleScroll)
	}
	document.body.classList.remove("menu-active")
	window.pulloadObject.blocked = false
})

const unlockScroll = (): void => {
	if (scrollableBlock.value) {
		scrollableBlock.value.style.overflow = "visible"
	}
}
</script>

<template>
	<HeaderPrice :parentElementRef="scrollableBlock" @unlock-scroll="unlockScroll" />
	<div ref="scrollableBlock" style="overflow: auto; flex-grow: 1" id="scrollableBlock">
		<BodyPrice />
	</div>
	<FooterPrice />
</template>

<style scoped></style>
