import axios, { CreateAxiosDefaults } from "axios"
import Cookies from "js-cookie"
import { EnumTokens } from "../service/auth-token.service"
import { AuthService } from "../service/auth.service"

// export const baseURL = "http://81.200.147.55:8000"
// export const baseURL = "http://192.168.30.119:3030"
export const baseURL = "https://api.fabrika-kruzhek.ru"
export const tel = "79288050695"

const options: CreateAxiosDefaults = {
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
}

// Создаем два экземпляра axios
export const axiosClassic = axios.create(options)
export const axiosAuth = axios.create(options)

// Интерцептор для добавления токена к запросам
axiosAuth.interceptors.request.use((config) => {
    const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
    if (config.headers && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

// Флаг для отслеживания процесса обновления токена
let isRefreshing = false
let failedQueue: any[] = []

// Обработка очереди запросов
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

// Интерцептор для обработки ответов
axiosAuth.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

         // Если это запрос на обновление токена и он не удался
         if (error.response?.status === 401 && error.config?.url?.includes('/auth/refresh')) {
            window.location.href = '/login'
            return Promise.reject(error)
        }

        // Если ошибка 401 и это не запрос на обновление токена
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Если уже идет обновление токена, добавляем запрос в очередь
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => {
                    return axiosAuth(originalRequest)
                }).catch(err => {
                    return Promise.reject(err)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                await AuthService.refresh()
                processQueue(null)

                // Обновляем токен в заголовке оригинального запроса
                const newToken = Cookies.get(EnumTokens.ACCESS_TOKEN)
                originalRequest.headers.Authorization = `Bearer ${newToken}`

                return axiosAuth(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError)
                // Если не удалось обновить токен, разлогиниваем пользователя
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)