import { useParams, Link } from 'react-router-dom';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ArrowLeft } from 'lucide-react';
import { categoryDataHierarchy } from '../hooks/categoryHook';
import { useState } from 'react';
import { OrderForm } from '../components/ui/OrderForm';
import { productData } from '../hooks/productHook';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const {categoriesDataHierarchy} = categoryDataHierarchy()
  const category = categoriesDataHierarchy?.find((c) => c.id === Number(categoryId));
  const [isFormVisible, setFormVisible] = useState(false);
  const {productsData} = productData()
  //@ts-ignore
  const product = productsData?.find(product => product.category_id === category?.subcategories[0].id as number)

  if (!category) {
    return <div>Категория не найдена</div>;
  }

  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  const onClose = () =>{
    setFormVisible(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад в категории
        </Link>
      </div>

      <Breadcrumb
        items={[
          { label: 'Главная', href: '/' },
          { label: category.category_name, href: `/category/${category.id}` },
        ]}
      />

      <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-8">
        {category.category_name}
      </h1>

      {product && (
             <button
             onClick={toggleFormVisibility}
             className='p-6 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition duration-200 text-lg font-bold mb-4 transform hover:scale-105'
         >
             Индивидуальный заказ
         </button>
            )}

      {isFormVisible && <OrderForm categories={category} onClose={onClose} price={product?.price as number}/>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.subcategories?.map((subcategory) => (
          <Link
            key={subcategory.id}
            to={`/category/${categoryId}/${subcategory.id}`}
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-lg hover:border-white transition duration-200 border-black border-[1px]"
          >
            <h3 className="text-lg font-medium text-gray-900">
              {subcategory.category_name}
            </h3>
            {/* <p className="mt-2 text-sm text-gray-500">{subcategory.category_name}</p> */}
          </Link>
        ))}
      </div>
    </div>
  );
}