import Cookies from 'js-cookie'

export enum EnumTokens {
    'ACCESS_TOKEN' = 'access_token',
    'REFRESH_TOKEN' = 'refresh_token',
    'APPROVAL_COUNT' = 'approval_count',
}

export const getAccessToken = () => {
    const access_token = Cookies.get(EnumTokens.ACCESS_TOKEN)
    return access_token || null
}

export const saveAccessToken = (access_token: string) => {
    Cookies.set(EnumTokens.ACCESS_TOKEN,access_token)
}

export const removeAccessTokenFromStorage = () => {
    Cookies.remove(EnumTokens.ACCESS_TOKEN)
}

export const getRefreshToken = () => {
    const refresh_token = Cookies.get(EnumTokens.REFRESH_TOKEN)
    return refresh_token || null
}

export const saveRefreshToken = (refresh_token: string) => {
    Cookies.set(EnumTokens.REFRESH_TOKEN,refresh_token)
}

export const removeRefreshTokenFromStorage = () => {
    Cookies.remove(EnumTokens.REFRESH_TOKEN)
}
