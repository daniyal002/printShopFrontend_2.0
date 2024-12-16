import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { ProductCard } from "../components/ui/ProductCard";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { productDataFilterByCategoryId } from "../hooks/productHook";
import { useCategoryData } from "../hooks/categoryHook";
import { Input, Pagination } from "antd";

export function ProductListingPage() {
  const { categoryId, subcategoryId } = useParams<{
    categoryId: string;
    subcategoryId: string;
  }>();
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc">("price-asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // Количество продуктов на странице

  const { categoriesData } = useCategoryData();
  const { productsDataFilterByCategoryId } = productDataFilterByCategoryId(
    Number(subcategoryId)
  );

  const category = categoriesData?.find((c) => c.id === Number(categoryId));
  const subcategory = categoriesData?.find(
    (s) => s.id === Number(subcategoryId)
  );

  const filteredProducts = productsDataFilterByCategoryId
    ? productsDataFilterByCategoryId.filter((product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    return sortBy === "price-asc" ? a.price - b.price : b.price - a.price;
  });

  // Определяем продукты для текущей страницы
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  // if (!category || !subcategory) {
  //   return <div>Category or subcategory not found</div>;
  // }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          to={`/category/${categoryId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {category?.category_name}
        </Link>
      </div>

      <Breadcrumb
        items={[
          { label: "Главная", href: "/" },
          {
            label: category?.category_name ? category?.category_name : "",
            href: `/category/${categoryId}`,
          },
          {
            label: subcategory?.category_name ? subcategory?.category_name : "",
            href: `/category/${categoryId}/${subcategoryId}`,
          },
        ]}
      />

      <div className="sticky top-0 bg-white z-10 shadow-sm p-4 my-2">
        <div className="flex justify-between items-center">
          <h1 className="text-xs sm:text-3xl font-bold text-gray-900">
            {subcategory?.category_name}
          </h1>
          <div className="flex items-center space-x-4">
            <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "price-asc" | "price-desc")
              }
              className="border-gray-300 rounded-md text-xs focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="price-asc">Цена: По возрастанию</option>
              <option value="price-desc">Цена: По убыванию</option>
            </select>
          </div>
        </div>
        <Input
          placeholder="Поиск товаров"
          value={searchTerm}
          onChange={(e) => {
            setCurrentPage(1);
            setSearchTerm(e.target.value);
          }}
          className="w-full mt-4"
          allowClear
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {paginatedProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={sortedProducts.length}
        onChange={(page) => setCurrentPage(page)}
        className="mt-6"
      />
    </div>
  );
}
