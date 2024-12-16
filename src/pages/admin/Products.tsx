import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import { UploadIcon, Edit2, Trash2, Plus } from "lucide-react";
import { ExtendedFile, Product } from "../../types";
import { useCategoryData } from "../../hooks/categoryHook";
import {
  productData,
  useAddProduct,
  useDeleteProduct,
  useUpdateProduct,
  useUploadProductImages,
  useUploadProductVideo,
} from "../../hooks/productHook";
import { baseURL } from "../../api/interseptots";



export function Products() {
  const { productsData: products, isLoading } = productData();
  const { mutate: addProduct, isPending: addProductIsPending } =
    useAddProduct();
  const { mutate: updateProduct, isPending: updateProductIsPending } =
    useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: uploadImages } = useUploadProductImages();
  const { mutate: uploadVideo } = useUploadProductVideo();
  const { categoriesData: categories } = useCategoryData();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [fileList, setFileList] = useState<ExtendedFile[]>([]);
  const [videoFile, setVideoFile] = useState<ExtendedFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');


  const columns = [
    { title: "Товар", dataIndex: "product_name", key: "product_name" },
    { title: "Размер", dataIndex: "size", key: "size" },
    { title: "Цена", dataIndex: "price", key: "price" },
    {
      title: "Категория",
      key: "category",
      render: (record: Product) => {
        const category = categories?.find((c) => c.id === record.category_id);
        return category?.category_name || "Unknown";
      },
    },
    {
        title: "Изображение",
        dataIndex: "image_src",
        key: "image_src",
        render: (imageSrc: string[]) =>
          imageSrc && imageSrc.length > 0 ? (
            <div className="flex gap-2">
              {imageSrc.map((src, index) => (
                <img
                  key={index}
                  src={`${baseURL}/uploads/${src}`}
                  alt={`Product Image ${index + 1}`}
                  className="w-16 h-16 object-cover"
                />
              ))}
            </div>
          ) : (
            "Нет изображения"
          ),
      },
    {
      title: "Действия",
      key: "actions",
      render: (record: Product) => (
        <div className="flex space-x-2">
          <Button
            type="text"
            onClick={() => handleEdit(record)}
            icon={<Edit2 className="w-4 h-4" />}
          />
          <Button
            type="text"
            danger
            onClick={() => handleDelete(record.id as number)}
            icon={<Trash2 className="w-4 h-4" />}
          />
        </div>
      ),
    },
  ];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setFileList([]);
    setVideoFile(null);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    deleteProduct(id);
  };

  const handleSubmit = async (values: any) => {
    const isNew = !editingProduct;
    const productData = editingProduct
      ? { ...values, id: editingProduct.id, price: String(values.price) }
      : { ...values, price: String(values.price) };

    if (isNew) {
      addProduct(productData, {
        onSuccess: (newProduct) => {
          if (fileList.length > 0) {
            uploadImages({
              productId: newProduct.id as number,
              images: fileList,
            });
          }
          if (videoFile) {
            uploadVideo({
              productId: newProduct.id as number,
              video: videoFile,
            });
          }
        },
      });
    } else {
      updateProduct(productData, {
        onSuccess: (updateProduct) => {
          if (fileList.length > 0) {
            uploadImages({
              productId: updateProduct.id as number,
              images: fileList,
            });
          }
          if (videoFile) {
            uploadVideo({
              productId: updateProduct.id as number,
              video: videoFile,
            });
          }
        },
      });
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
    setFileList([]);
    setVideoFile(null);
  };

  const handleImageUploadChange = ({ fileList }: any) => {
    setFileList(
      fileList
        .filter((file: any) => file.originFileObj)
        .map((file: any) => file.originFileObj)
    );
  };

  const handleVideoUploadChange = (info: any) => {
    const { fileList } = info;
    if (fileList.length > 0) {
      setVideoFile(fileList[fileList.length - 1].originFileObj);
    } else {
      setVideoFile(null);
    }
  };

  useEffect(() => {
    if (!isModalVisible) {
      setFileList([]);
      setVideoFile(null);
    }
  }, [isModalVisible]);

  const filteredProducts = products
    ? products.filter((product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Добавить товар
        </Button>
      </div>
      <Input
          placeholder="Поиск товаров"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full my-4"
          allowClear
        />
      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={isLoading}
        scroll={{ x: 300 }}
        rowKey="id"
      />

      <Modal
        title={editingProduct ? "Изменить товар" : "Добавить товар"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProduct(null);
          form.resetFields();
        }}
        onOk={form.submit}
        confirmLoading={addProductIsPending || updateProductIsPending}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="product_name"
            label="Название товара"
            rules={[{ required: true, message: "Введите название товара" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Цена"
            rules={[{ required: true, message: "Введите цену товара" }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="category_id"
            label="Категория"
            rules={[{ required: true, message: "Выберите категорию товара" }]}
          >
            <Select>
              {categories?.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.category_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="size"
            label="Размер"
            rules={[{ required: true, message: "Введите размер товара" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Upload
              multiple
              beforeUpload={() => false}
              onChange={handleImageUploadChange}
              listType="picture"
              fileList={fileList.map((file) => ({
                uid: file.uid,
                name: file.name,
                status: "done",
                url: file ? URL.createObjectURL(file) : undefined,
              }))}
            >
              <Button icon={<UploadIcon />}>Загрузить изображения</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Видео">
            <Upload
              beforeUpload={() => false}
              accept="video/*"
              onChange={handleVideoUploadChange}
              fileList={
                videoFile
                  ? [
                      {
                        uid: "video",
                        name: videoFile.name,
                        status: "done",
                        url: URL.createObjectURL(videoFile),
                      },
                    ]
                  : []
              }
            >
              <Button icon={<UploadIcon />}>Загрузить видео</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
