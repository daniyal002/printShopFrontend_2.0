import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/admin/Sidebar';
import Cookies from 'js-cookie'
const { Content } = Layout;

export function AdminLayout() {

  const editer = Cookies.get('editer')
  const navigate = useNavigate();

  if(!editer){
    navigate('/')
    return null
  }

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
