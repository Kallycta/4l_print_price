<script setup lang="ts">
import TabsPrice from "@/components/body/TabsPrice.vue"
import CardPrice from "@/components/body/CardPrice.vue"
</script>

<template>
	<div>
		<TabsPrice />
		<div class="print_price_body_container">
			<CardPrice v-for="elem in [1, 2, 3, 4, 5]" :key="elem" />
		</div>
	</div>
</template>

<style scoped>
.print_price_body_container {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>
