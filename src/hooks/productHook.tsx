import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../service/product.service';
import { Product } from '../types';
import { message } from 'antd';

export const productData = () => {
  const { data: productsData, isLoading, error, isSuccess } = useQuery({ queryKey: ['products'], queryFn:() => productsService.getProducts(),
    // staleTime: Infinity,
   });
  return { productsData, isLoading, error, isSuccess };
};

export const productDataFilterByCategoryId = (categoryId:number) => {
  const { data: productsDataFilterByCategoryId, isLoading, error, isSuccess } = useQuery({ queryKey: ['productsFilterByCategoryId'], queryFn:() => productsService.getProductsFilteredByCategory(categoryId),
   });
  return { productsDataFilterByCategoryId, isLoading, error, isSuccess };
};


export const getProductById = (id:number) => {
    const { data: productData, isLoading, error, isSuccess } = useQuery({ queryKey: ['productsById',id], queryFn:() => productsService.getProductById(id) });
    return { productData, isLoading, error, isSuccess };
  };

export const useAddProduct = () => {
  const queryClient = useQueryClient();


  const { mutate,isPending } = useMutation({
    mutationFn: (newProduct: Product) => productsService.addProduct(newProduct),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["products"],
        (oldData: Product[] | undefined) => [...(oldData || []), data]
      );
      message.success("Товар успешно добавлен")
    },
    onError: () => {
      message.error("Произошла ошибка при добавлении товара")
    }
  });
  return { mutate,isPending };
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate,isPending } = useMutation({
    mutationFn: (updatedProduct: Product) => productsService.updateProduct(updatedProduct),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["products"],
        (oldData: Product[] | undefined) => oldData?.map((product) =>
          product.id === data.id ? data : product
        )
      )
      message.success("Товар успешно обновлен")
     },
     onError: () => { message.error("Произошла ошибка при обновлении товара") }
  });
  return { mutate,isPending };
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, error: errorProduct } = useMutation({
    mutationFn: (productId: number) => productsService.deleteProduct(productId),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["products"],
        (oldData: Product[] | undefined) => oldData?.filter((product) =>
          product.id !== data.id
        )
        )
      message.success("Товар успешно удален")
    },
    onError: () => {
      message.error("Произошла ошибка при удалении товара")
      }
  });
  return { mutate, errorProduct };
};

export const useUploadProductImages = () => {
  const { mutate } = useMutation({
    mutationFn: ({ productId, images }: { productId: number, images: File[] }) => {
      const formData = new FormData();
      images.forEach(image => formData.append('files', image));
      return productsService.uploadProductImages(productId, formData);
    },onSuccess: () => {
      message.success("Изображения успешно добавлены")
    }
  });
  return { mutate };
};

export const useUploadProductVideo = () => {
  const { mutate } = useMutation({
    mutationFn: ({ productId, video }: { productId: number, video: File }) => {
      const formData = new FormData();
     formData.append('file', video);
      return productsService.uploadProductVideo(productId, formData);
    },onSuccess: () => {
      // message.success("Видео успешно добавлено")
    }
  });
  return { mutate };
};