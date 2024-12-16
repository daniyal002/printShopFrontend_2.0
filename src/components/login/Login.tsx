import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("editer") === "true") {
      navigate("/admin"); // Перенаправление на страницу админ панели
    }
  }, []);

  const onFinish = async (value: { username: string; password: string }) => {
    setLoading(true);

    // Здесь вы можете использовать переменные окружения для проверки логина и пароля
    const validUsername = import.meta.env.VITE_ADMIN_LOGIN;
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    // Пример проверки (можно заменить на реальный запрос к API)
    if (value.username === validUsername && value.password === validPassword) {
      Cookies.set("editer", "true", { expires: 1 }); // Кука будет действительна 1 день
      message.success("Вы успешно авторизовались!");
      navigate("/admin"); // Перенаправление на страницу админ панели

      // Здесь можно перенаправить пользователя или выполнить другие действия
    } else {
      message.error("Не правильный логин или пароль!");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Вход</h2>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Логин"
          name="username"
          rules={[{ required: true, message: "Введите логин" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Введите пароль" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
