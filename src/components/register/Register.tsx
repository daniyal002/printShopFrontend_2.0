// import { useNavigate } from "react-router-dom"
// import { useEffect } from "react"
// import Cookies from "js-cookie"
// import { Loader2, Lock, User, ArrowLeft } from "lucide-react"
// import { Link } from "react-router-dom"
// import { useAuth } from "../../hooks/useAuth"


// export default function Register() {
//   const navigate = useNavigate()
//   const { useRegister } = useAuth()
//   const { register, isRegisterPending } = useRegister()

//   useEffect(() => {
//     if (Cookies.get("access_token")) {
//       navigate("/admin")
//     }
//   }, [navigate])

//   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)
//     const password = formData.get('password') as string
//     const confirmPassword = formData.get('confirmPassword') as string

//     if (password !== confirmPassword) {
//       alert('Пароли не совпадают')
//       return
//     }

//     register({
//       login: formData.get('login') as string,
//       password: password
//     }, {
//       onSuccess: () => {
//         navigate("/admin")
//       }
//     })
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <Link
//             to="/login"
//             className="flex items-center text-indigo-600 hover:text-indigo-500"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Вернуться к входу
//           </Link>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Регистрация
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={onSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div className="relative">
//               <label htmlFor="login" className="sr-only">
//                 Логин
//               </label>
//               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 id="login"
//                 name="login"
//                 type="text"
//                 required
//                 className="appearance-none rounded-none relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Логин"
//               />
//             </div>
//             <div className="relative">
//               <label htmlFor="password" className="sr-only">
//                 Пароль
//               </label>
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Пароль"
//               />
//             </div>
//             <div className="relative">
//               <label htmlFor="confirmPassword" className="sr-only">
//                 Подтвердите пароль
//               </label>
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Подтвердите пароль"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isRegisterPending}
//               className={`group relative w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white
//                 ${isRegisterPending
//                   ? 'bg-indigo-400 cursor-not-allowed'
//                   : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
//                 }`}
//             >
//               {isRegisterPending ? (
//                 <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
//               ) : null}
//               {isRegisterPending ? 'Регистрация...' : 'Зарегистрироваться'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }