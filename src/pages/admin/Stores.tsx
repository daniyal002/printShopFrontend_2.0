import { useState } from "react"
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
} from "antd"
import { UploadIcon, Edit2, Trash2, Plus } from "lucide-react"
import { ExtendedFile } from "../../types"
import { useStore } from "../../hooks/useStore"
import { baseURL } from "../../api/interseptots"
import { IStoreDto } from "../../types"

export function Stores() {
  const {
    useStores,
    useCreateStore,
    useUpdateStore,
    useDeleteStore,
    useUploadImages,
    useDeleteImages
  } = useStore()

  const { stores, isLoading } = useStores()
  const { createStore, isPending: createStorePending } = useCreateStore()
  const { updateStore, isPending: updateStorePending } = useUpdateStore()
  const { deleteStore } = useDeleteStore()
  const { uploadImages } = useUploadImages()
  const { deleteImages } = useDeleteImages()

  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingStore, setEditingStore] = useState<IStoreDto | null>(null)
  const [fileList, setFileList] = useState<ExtendedFile[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const columns = [
    { title: "Название", dataIndex: "name", key: "name" },
    { title: "Адрес", dataIndex: "address", key: "address" },
    { title: "Телефон", dataIndex: "phone", key: "phone" },
    { title: "Контактное лицо", dataIndex: "contactName", key: "contactName" },
    {
      title: "Изображения",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) =>
        images && images.length > 0 ? (
          <div className="flex gap-2">
            {images.map((src, index) => (
              <img
                key={index}
                src={`${baseURL}/uploads/stores/${src}`}
                alt={`Store Image ${index + 1}`}
                className="w-16 h-16 object-cover rounded"
              />
            ))}
          </div>
        ) : (
          "Нет изображений"
        ),
    },
    {
      title: "Действия",
      key: "actions",
      render: (record: IStoreDto) => (
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
  ]

  const handleEdit = (store: IStoreDto) => {
    setEditingStore(store)
    form.setFieldsValue(store)
    setFileList([])
    setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    deleteImages(id,{onSuccess:()=>{
      deleteStore(id)
    }})
  }

  const handleSubmit = async (values: IStoreDto) => {
    const isNew = !editingStore

    if (isNew) {
      createStore(values, {
        onSuccess: (newStore) => {
          if (fileList.length > 0) {
            uploadImages({
              id: newStore.id as number,
              files: fileList,
            })
          }
        },
      })
    } else {
      updateStore(
        {
          id: editingStore.id as number,
          data: values
        },
        {
          onSuccess: (updatedStore) => {
            if (fileList.length > 0) {
              uploadImages({
                id: updatedStore.id as number,
                files: fileList,
              })
            }
          },
        }
      )
    }

    setIsModalVisible(false)
    form.resetFields()
    setEditingStore(null)
    setFileList([])
  }

  const handleImageUploadChange = ({ fileList }: any) => {
    setFileList(
      fileList
        .filter((file: any) => file.originFileObj)
        .map((file: any) => file.originFileObj)
    )
  }

  const filteredStores = stores
    ? stores.filter((store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.phone.includes(searchTerm)
      )
    : []

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Магазины</h1>
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Добавить магазин
        </Button>
      </div>

      <Input
        placeholder="Поиск по названию или телефону"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full my-4"
        allowClear
      />

      <Table
        columns={columns}
        dataSource={filteredStores}
        loading={isLoading}
        scroll={{ x: 300 }}
        rowKey="id"
      />

      <Modal
        title={editingStore ? "Изменить магазин" : "Добавить магазин"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingStore(null)
          form.resetFields()
        }}
        onOk={form.submit}
        confirmLoading={createStorePending || updateStorePending}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Название магазина"
            rules={[{ required: true, message: "Введите название магазина" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Адрес"
            rules={[{ required: true, message: "Введите адрес" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Телефон"
            rules={[{ required: true, message: "Введите телефон" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="contactName"
            label="Контактное лицо"
            rules={[{ required: true, message: "Введите имя контактного лица" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Изображения">
            <Upload
              multiple
              beforeUpload={() => false}
              onChange={handleImageUploadChange}
              listType="picture-card"
              fileList={fileList.map((file) => ({
                uid: file.uid,
                name: file.name,
                status: "done",
                url: file ? URL.createObjectURL(file) : undefined,
              }))}
            >
              <div>
                <UploadIcon className="w-5 h-5" />
                <div className="mt-2">Загрузить</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}