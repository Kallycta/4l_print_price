// stores/helpers/useApi.ts
import { ref, type Ref } from 'vue'

export interface UseApiReturn<T> {
	data: Ref<T | null>
	loading: Ref<boolean>
	error: Ref<string | null>
	execute: () => Promise<T>
}

export function useApi<T>(apiCall: () => Promise<T>): UseApiReturn<T> {
	const data = ref<T | null>(null) as Ref<T | null>
	const loading = ref(false)
	const error = ref<string | null>(null)

	const execute = async (): Promise<T> => {
		loading.value = true
		error.value = null

		try {
			const result = await apiCall()
			data.value = result
			return result
		} catch (err) {
			console.error(err)
			error.value = err instanceof Error ? err.message : 'Произошла неизвестная ошибка'
			throw err
		} finally {
			loading.value = false
		}
	}

	return { data, loading, error, execute }
}


