import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/admin/Sidebar';
import Cookies from 'js-cookie'
import { useEffect } from 'react';
import { EnumTokens } from '../../service/auth-token.service';

const { Content } = Layout;

export function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)

    if (!accessToken) {
      navigate('/login')
      return
    }
  }, [navigate])

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Content className="min-h-screen bg-gray-50 p-4 lg:p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
