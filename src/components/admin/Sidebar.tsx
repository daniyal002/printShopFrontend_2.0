import { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Package, Menu as MenuIcon, X } from 'lucide-react';

const { Sider } = Layout;

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  const menuItems = [
    {
      key: '/admin/products',
      icon: <ShoppingBag className="w-4 h-4" />,
      label: <Link to="/admin/products">Товары</Link>,
    },
    {
      key: '/admin/categories',
      icon: <Package className="w-4 h-4" />,
      label: <Link to="/admin/categories">Категории</Link>,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 z-20 m-4">
        <Button
          type="text"
          icon={collapsed ? <MenuIcon className="w-5 h-5" /> : <X className="w-5 h-5" />}
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center"
        />
      </div>

      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <Sider
        theme="light"
        className={`
          fixed lg:static z-40 transition-transform duration-300
          h-screen ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
        width={250}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Админ панель</h1>
          <Button
            type="text"
            icon={<X className="w-4 h-4" />}
            onClick={() => setCollapsed(true)}
            className="lg:hidden"
          />
        </div>

        {/* Sidebar Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="h-[calc(100%-4rem)] border-r-0 overflow-y-auto"
          onClick={() => setCollapsed(true)}
        />
      </Sider>
    </>
  );
}
