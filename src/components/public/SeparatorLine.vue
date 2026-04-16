<script setup lang="ts"></script>

<template>
	<div class="separator_container">
		<div class="separator_line"></div>
	</div>
</template>

<style scoped>
.separator_container {
	position: relative;
	width: 100%;
	height: 1px;
	margin-bottom: 10px;
	margin-top: 10px;
}

.separator_line {
	position: absolute;
	width: 100%;
	height: 1px;
	background: #777776;
	opacity: 0.3;
	z-index: -1;
}
</style>
