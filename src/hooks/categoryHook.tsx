import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../service/category.service";
import { Category } from "../types";
import { message } from "antd";

export const useCategoryData = () => {
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getCategories,
  });
  return { categoriesData, isLoading, error };
};

export const categoryDataHierarchy = () => {
  const {
    data: categoriesDataHierarchy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categoriesHierarchy"],
    queryFn: categoriesService.getCategoriesHierarchy,
    staleTime: Infinity,
  });
  return { categoriesDataHierarchy, isLoading, error };
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  const { mutate,isPending } = useMutation({
    mutationFn: ({ category, file }: { category: Category; file?: File }) => {
      return categoriesService.addCategories(category, file); // Передаем и данные, и файл
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["categories"],
        (oldData: Category[] | undefined) => [...(oldData || []), data]
      );
      message.success("Категория успешно добавлена");
    },
    onError: () => {
      message.error("Ошибка при создании категории");
    },
  });
  return { mutate,isPending };
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const { mutate,isPending } = useMutation({
    mutationFn: ({ category, file }: { category: Category; file?: File }) => {
      return categoriesService.updateCategory(category, file); // Передаем и категорию, и файл (если есть)
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["categories"],
        (oldData: Category[] | undefined) => {
          if (!oldData) return [];
          return oldData.map(
            (cat) =>
              cat.id === variables.category.id ? variables.category : cat // Обновляем категорию в списке
          );
        }
      );
      message.success("Категория успешно обновлена");
    },
    onError: () => {
      message.error("Ошибка при обновлении категории");
    },
  });
  return { mutate,isPending };
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient(); // Получаем экземпляр queryClient
  const { mutate, error: errorCategory } = useMutation({
    mutationFn: (category_id: number) =>
      categoriesService.deleteCategory(category_id),
    onSuccess: (_, category_id) => {
      // Обновляем кэш, удаляя категорию
      queryClient.setQueryData(
        ["categories"],
        (oldData: Category[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((category) => category.id !== category_id);
        }
      );
      message.success("Категория успешно удалена");
    },
    onError: () => {
      message.error("Ошибка при удалении категории");
    },
  });
  return { mutate, errorCategory };
};
