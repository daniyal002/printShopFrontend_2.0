import axios, { CreateAxiosDefaults } from "axios"

// export const baseURL = "http://81.200.147.55:8000"
export const baseURL = "https://api.fabrika-kruzhek.ru"
// export const baseURL = "http://192.168.30.119:3030"
export const tel = "79288050695"

const options:CreateAxiosDefaults = {
    baseURL:baseURL,
    headers:{
        'Content-Type': 'application/json',
    },
    // withCredentials:true
}

const axiosClassic = axios.create(options)

export {axiosClassic}