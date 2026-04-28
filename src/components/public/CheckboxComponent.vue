<script setup lang="ts">
import { onMounted } from "vue"

const props = defineProps({
	label: { type: String, required: false },
	name: { type: String, required: true },
	checked: {type: Boolean, required: false, default: false}


})
const model = defineModel()
const emit = defineEmits(['onChangeValue'])
onMounted(() => {
	console.log('props.checked', props.checked)
})
</script>

<template>

	<label class="checkbox-component_container">
		<input
			type="checkbox"
			@change="emit('onChangeValue', $event)"
			v-model="model"
			:checked="props.checked"
			:name="props.name"
		/>
		{{label}}
		<span class="checkbox-component_checkmark" style="top: 2px"></span>
	</label>
</template>

<style>

.checkbox-component_container {
	display: block;
	position: relative;
	padding-left: 25px;
	color: #1D1D1B;
	cursor: pointer;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	width: fit-content;
	line-height: unset;
}


.checkbox-component_container input {
	position: absolute !important;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}


.checkbox-component_checkmark {
	position: absolute !important;
	top: 0;
	left: 0;
	height: 15px;
	width: 15px;
	background-color: #ffffff;
	border: 1px solid #777776;
	border-radius: 3px;
}


.checkbox-component_container:hover input ~ .checkbox-component_checkmark {
	background-color: #ffffff;
	border: 1px solid #777776;
}


.checkbox-component_container input:checked ~ .checkbox-component_checkmark {
	border: 1px solid #ff6927;
}


.checkbox-component_checkmark:after {
	content: '';
	position: absolute;
	display: none;
}


.checkbox-component_container input:checked ~ .checkbox-component_checkmark:after {
	display: block;
}


.checkbox-component_container .checkbox-component_checkmark:after {
	top: 1px;
	left: 4px;
	width: 4px;
	height: 7px;
	border: 0.5px solid #ff6927;
	border-width: 0 2px 2px 0;
	-webkit-transform: rotate(45deg);
	-ms-transform: rotate(45deg);
	transform: rotate(45deg);
}
</style>
