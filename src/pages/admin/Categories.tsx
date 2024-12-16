import { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Upload } from "antd";
import { Edit2, Trash2, Plus, UploadIcon } from "lucide-react";
import { Category, ExtendedFile } from "../../types";
import {
  useAddCategory,
  useCategoryData,
  useDeleteCategory,
  useUpdateCategory,
} from "../../hooks/categoryHook";
import { baseURL } from "../../api/interseptots";

export function Categories() {
  const { categoriesData: categories, isLoading } = useCategoryData();
  const { mutate: addCategory, isPending: addCategoryIsPending } =
    useAddCategory();
  const { mutate: updateCategory, isPending: updateCategoryIsPending } =
    useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [file, setFile] = useState<ExtendedFile | null>(null); // Состояние для файла
  const [searchTerm, setSearchTerm] = useState('');


  const columns = [
    { title: "Категория", dataIndex: "category_name", key: "category_name" },
    {
      title: "Родитель",
      dataIndex: "parent_id",
      key: "parent_id",
      render: (record: number) => {
        return (
          categories?.find((category) => category.id === record)
            ?.category_name || "Нет родителя"
        );
      },
    },
    {
        title: "Изображение",
        dataIndex: "image_url",
        key: "image_url",
        render: (image_url: string) =>
            image_url ? (
            <div className="flex gap-2">
                <img
                  src={`${baseURL}/uploads/${image_url}`}
                  alt={image_url}
                  className="w-16 h-16 object-cover"
                />
            </div>
          ) : (
            "Нет изображения"
          ),
      },
    {
      title: "Действия",
      key: "actions",
      render: (record: Category) => (
        <div className="flex space-x-2">
          <Button
            type="text"
            onClick={() => handleEdit(record)}
            icon={<Edit2 className="w-4 h-4" />}
          />
          <Button
            type="text"
            danger
            onClick={() => handleDelete(record.id)}
            icon={<Trash2 className="w-4 h-4" />}
          />
        </div>
      ),
    },
  ];

  const handleFileChange = (info: any) => {
    const { fileList } = info;
    if (fileList.length > 0) {
      setFile(fileList[fileList.length - 1].originFileObj);
    } else {
      setFile(null);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    deleteCategory(id);
  };

  const handleSubmit = async (values: any) => {
    if (editingCategory) {
      updateCategory({
        category: { ...values, id: editingCategory.id },
        file: file as File,
      });
    } else {
      addCategory({ category: values,file:file as File });
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingCategory(null);
  };

  const filteredCategories = categories
    ? categories.filter((categories) =>
        categories.category_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Добавить категорию
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
        dataSource={filteredCategories}
        loading={isLoading}
        scroll={{ x: 300 }}
        rowKey="id"
      />

      <Modal
        title={editingCategory ? "Изменить категорию" : "Добавить категорию"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        onOk={form.submit}
        confirmLoading={addCategoryIsPending || updateCategoryIsPending}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ icon: "Box" }}
        >
          <Form.Item
            name="category_name"
            label="Название категории"
            rules={[{ required: true, message: "Введите название категории" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="parent_id" label="Категория родитель">
            <Select>
              {categories?.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.category_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Upload
              accept="image/*"
              beforeUpload={() => false} // Не загружать файл автоматически
              onChange={handleFileChange}
              maxCount={1} // Ограничиваем загрузку одним файлом
              listType="picture"
              fileList={file ? [
                {
                  uid: file?.uid as string,
                  name: file?.name as string,
                  status: "done",
                  url: file ? URL.createObjectURL(file) : undefined,
                },
              ]:[]}
            >
              <Button icon={<UploadIcon />}>Выберите файл</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
