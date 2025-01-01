import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Header } from "./components/layout/Header";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductListingPage } from "./pages/ProductListingPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Categories } from "./pages/admin/Categories";
import { Products } from "./pages/admin/Products";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CartButton from "./components/ui/CartButton";
import Login from "./components/login/Login";
import { Stores } from "./pages/admin/Stores";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <BrowserRouter>
          <Header />
          <div className="fixed bottom-5 right-5 bg-white z-40 shadow-sm p-3 my-2 rounded-xl border-solid border-2 border-blue-600">
            <CartButton />
          </div>
          <Routes>
            {/* Main Routes */}
            <Route
              path="/"
              element={
                <div className="min-h-scree">
                  <main>

                    <HomePage />
                  </main>
                </div>
              }
            />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route
              path="/category/:categoryId/:subcategoryId"
              element={<ProductListingPage />}
            />
            <Route path="/login" element={<Login/>}/>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="categories" element={<Categories />} />
              <Route path="products" element={<Products />} />
              <Route path="stores" element={<Stores />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
