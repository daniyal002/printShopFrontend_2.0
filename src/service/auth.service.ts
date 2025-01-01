import { getRefreshToken, removeAccessTokenFromStorage, removeRefreshTokenFromStorage, saveAccessToken, saveRefreshToken } from './auth-token.service'
import { axiosAuth, axiosClassic } from '../api/interseptots'

export enum EnumTokens {
    'ACCESS_TOKEN' = 'access_token',
    'REFRESH_TOKEN' = 'refresh_token',
}


export const AuthService = {
    // async register(login: string, password: string) {
    //     const response = await axiosClassic.post('/auth/register', { login, password })
    //     const { accessToken, refreshToken } = response.data

    //     saveAccessToken(accessToken)
    //     saveRefreshToken(refreshToken)

    //     return response.data
    // },

    async login(login: string, password: string) {
        const response = await axiosClassic.post('/auth/login', { login, password })
        const { accessToken, refreshToken } = response.data

        saveAccessToken(accessToken)
        saveRefreshToken(refreshToken)

        return response.data
    },

    async refresh() {
        const refreshToken = getRefreshToken()
        if (!refreshToken) throw new Error('Отсутствует refresh token')

        const response = await axiosAuth.post('/auth/refresh', { refreshToken })
        const { accessToken, refreshToken: newRefreshToken } = response.data

        saveAccessToken(accessToken)
        saveRefreshToken(newRefreshToken)

        return response.data
    },

    async logout() {
        try {
            await axiosAuth.post('/auth/logout')
        } finally {
            removeAccessTokenFromStorage()
            removeRefreshTokenFromStorage()
        }
    }
}