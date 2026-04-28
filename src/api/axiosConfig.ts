import axios from 'axios'

// Создаем кастомный экземпляр axios
const api = axios.create({
	headers: {
		'X-Requested-with': "XMLHttpRequest",
		"Content-Type": "multipart/form-data",
	}
})

export default api
