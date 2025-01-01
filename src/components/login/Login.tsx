import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Cookies from "js-cookie"
import { Loader2, Lock, User } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"



export default function Login() {
  const navigate = useNavigate()
  const { useLogin } = useAuth()
  const { login, isLoginPending } = useLogin()

  useEffect(() => {
    if (Cookies.get("access_token")) {
      navigate("/admin")
    }
  }, [navigate])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    login({
      login: formData.get('login') as string,
      password: formData.get('password') as string
    }, {
      onSuccess: () => {
        navigate("/admin")
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Вход в систему
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="login" className="sr-only">
                Логин
              </label>
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="login"
                name="login"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Логин"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoginPending}
              className={`group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white
                ${isLoginPending
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
            >
              {isLoginPending ? (
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              ) : null}
              {isLoginPending ? 'Вход...' : 'Войти'}
            </button>
            <div className="text-sm mt-4 text-center">
              {/* <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Зарегистрироваться
              </Link> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
