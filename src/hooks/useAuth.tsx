import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { AuthService } from '../service/auth.service'

export const useAuth = () => {
    const queryClient = useQueryClient()

    // const useRegister = () => {
    //     const { mutate: register, isPending: isRegisterPending } = useMutation({
    //         mutationFn: ({ login, password }: { login: string, password: string }) =>
    //             AuthService.register(login, password),
    //         onSuccess: () => {
    //             message.success('Регистрация успешна')
    //         },
    //         onError: () => {
    //             message.error('Ошибка при регистрации')
    //         }
    //     })
    //     return { register, isRegisterPending }
    // }

    const useLogin = () => {
        const { mutate: login, isPending: isLoginPending } = useMutation({
            mutationFn: ({ login, password }: { login: string, password: string }) =>
                AuthService.login(login, password),
            onSuccess: () => {
                message.success('Вход выполнен успешно')
            },
            onError: () => {
                message.error('Ошибка при входе')
            }
        })
        return { login, isLoginPending }
    }

    const useLogout = () => {
        const { mutate: logout, isPending: isLogoutPending } = useMutation({
            mutationFn: AuthService.logout,
            onSuccess: () => {
                queryClient.clear() // Очищаем кэш при выходе
                message.success('Выход выполнен успешно')
            },
            onError: () => {
                message.error('Ошибка при выходе')
            }
        })
        return { logout, isLogoutPending }
    }

    return { useLogin, useLogout }
}