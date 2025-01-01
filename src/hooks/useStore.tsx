import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { IStore, StoreService } from '../service/store.service'
import { IStoreDto } from '../types'

export const useStore = () => {
    const queryClient = useQueryClient()

    // Получение всех магазинов
    const useStores = () => {
        const {
            data: stores,
            isLoading,
            error,
            isSuccess
        } = useQuery({
            queryKey: ['stores'],
            queryFn: StoreService.getAll
        })
        return { stores, isLoading, error, isSuccess }
    }

    // Получение магазина по ID
    const useStoreById = (id: number) => {
        const {
            data: store,
            isLoading,
            error
        } = useQuery({
            queryKey: ['store', id],
            queryFn: () => StoreService.getById(id)
        })
        return { store, isLoading, error }
    }

    // Создание магазина
    const useCreateStore = () => {
        const { mutate: createStore, isPending } = useMutation({
            mutationFn: (data: IStoreDto) => StoreService.create(data),
            onSuccess: (newStore) => {
                queryClient.setQueryData(
                    ['stores'],
                    (oldStores: IStore[] | undefined) => [...(oldStores || []), newStore]
                )
                message.success('Магазин успешно создан')
            },
            onError: () => {
                message.error('Ошибка при создании магазина')
            }
        })
        return { createStore, isPending }
    }

    // Обновление магазина
    const useUpdateStore = () => {
        const { mutate: updateStore, isPending } = useMutation({
            mutationFn: ({ id, data }: { id: number, data: Partial<IStoreDto> }) =>
                StoreService.update(id, data),
            onSuccess: (updatedStore) => {
                queryClient.setQueryData(
                    ['stores'],
                    (oldStores: IStore[] | undefined) =>
                        oldStores?.map(store =>
                            store.id === updatedStore.id ? updatedStore : store
                        )
                )
                message.success('Магазин успешно обновлен')
            },
            onError: () => {
                message.error('Ошибка при обновлении магазина')
            }
        })
        return { updateStore, isPending }
    }

    // Удаление магазина
    const useDeleteStore = () => {
        const { mutate: deleteStore, isPending } = useMutation({
            mutationFn: (id: number) => StoreService.delete(id),
            onSuccess: (deletedStore) => {
                queryClient.setQueryData(
                    ['stores'],
                    (oldStores: IStore[] | undefined) =>
                        oldStores?.filter(store => store.id !== deletedStore.id)
                )
                message.success('Магазин успешно удален')
            },
            onError: () => {
                message.error('Ошибка при удалении магазина')
            }
        })
        return { deleteStore, isPending }
    }

    // Поиск магазина по телефону
    const useStoreByPhone = (phone: string) => {
        const {
            data: store,
            isLoading,
            error
        } = useQuery({
            queryKey: ['store', 'phone', phone],
            queryFn: () => StoreService.findByPhone(phone),
            enabled: !!phone // Запрос выполняется только если есть номер телефона
        })
        return { store, isLoading, error }
    }

    // Загрузка изображений
    const useUploadImages = () => {
        const { mutate: uploadImages, isPending: isUploading } = useMutation({
            mutationFn: ({ id, files }: { id: number, files: File[] }) =>
                StoreService.uploadImages(id, files),
            onSuccess: (updatedStore) => {
                // Обновляем данные магазина в кэше
                queryClient.setQueryData(
                    ['store', updatedStore.id],
                    updatedStore
                )
                // Обновляем список магазинов
                queryClient.setQueryData(
                    ['stores'],
                    (oldStores: IStore[] | undefined) =>
                        oldStores?.map(store =>
                            store.id === updatedStore.id ? updatedStore : store
                        )
                )
                message.success('Изображения успешно загружены')
            },
            onError: () => {
                message.error('Ошибка при загрузке изображений')
            }
        })
        return { uploadImages, isUploading }
    }

    // Удаление изображений
    const useDeleteImages = () => {
        const { mutate: deleteImages, isPending: isDeleting } = useMutation({
            mutationFn: (id: number) => StoreService.deleteImages(id),
            onSuccess: (updatedStore) => {
                // Обновляем данные магазина в кэше
                queryClient.setQueryData(
                    ['store', updatedStore.id],
                    updatedStore
                )
                // Обновляем список магазинов
                queryClient.setQueryData(
                    ['stores'],
                    (oldStores: IStore[] | undefined) =>
                        oldStores?.map(store =>
                            store.id === updatedStore.id ? updatedStore : store
                        )
                )
                message.success('Изображения успешно удалены')
            },
            onError: () => {
                message.error('Ошибка при удалении изображений')
            }
        })
        return { deleteImages, isDeleting }
    }

    return {
        useStores,
        useStoreById,
        useCreateStore,
        useUpdateStore,
        useDeleteStore,
        useStoreByPhone,
        useUploadImages,
        useDeleteImages
    }
}