import { axiosAuth } from "../api/interseptots"
import { IStoreDto } from "../types"

export interface IStore extends IStoreDto {
    id: number
    createdAt: string
    updatedAt: string
}

export const StoreService = {
    async create(data: IStoreDto) {
        const response = await axiosAuth.post<IStore>('/stores', data)
        return response.data
    },

    async getAll() {
        const response = await axiosAuth.get<IStore[]>('/stores')
        return response.data
    },

    async getById(id: number) {
        const response = await axiosAuth.get<IStore>(`/stores/${id}`)
        return response.data
    },

    async update(id: number, data: Partial<IStoreDto>) {
        const response = await axiosAuth.patch<IStore>(`/stores/${id}`, data)
        return response.data
    },

    async delete(id: number) {
        const response = await axiosAuth.delete<IStore>(`/stores/${id}`)
        return response.data
    },

    async findByPhone(phone: string) {
        const response = await axiosAuth.get<IStore>(`/stores/search`, {
            params: { phone }
        })
        return response.data
    },

    async uploadImages(id: number, files: File[]) {
        const formData = new FormData()
        files.forEach(file => {
            formData.append('files', file)
        })

        const response = await axiosAuth.post<IStore>(
            `/stores/${id}/images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    },

    async deleteImages(id: number) {
        const response = await axiosAuth.delete<IStore>(`/stores/${id}/images`)
        return response.data
    }
}