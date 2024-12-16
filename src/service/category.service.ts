import { axiosClassic } from "../api/interseptots"
import { Category } from "../types"

export const categoriesService = {
    async getCategories (){
        const response = await axiosClassic.get<Category[]>('/categories')
        return response.data
    },

    async getCategoriesHierarchy(){
        const response = await axiosClassic.get<Category[]>('/categories/findAllfindAllHierarchy')
        return response.data
    },

    async addCategories(data: Category, file?: File) {
        const formData = new FormData();
        if (file) {
            formData.append('file', file); // добавляем файл, если он есть
        }
        formData.append('category_name', data.category_name);
        if (data.parent_id) {
            formData.append('parent_id', data.parent_id.toString());
        }

        const response = await axiosClassic.post<Category>('/categories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async updateCategory(updatedCategory: Category, file?: File) {
        const formData = new FormData();
        if (file) {
            formData.append('file', file); // добавляем файл, если он есть
        }
        formData.append('category_name', updatedCategory.category_name);
        if (updatedCategory.parent_id) {
            formData.append('parent_id', updatedCategory.parent_id.toString());
        }

        const response = await axiosClassic.patch<Category>(`/categories/${updatedCategory.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async deleteCategory(id:number){
        const response = await axiosClassic.delete(`/categories/${id}`)
        return response.data
    }
}