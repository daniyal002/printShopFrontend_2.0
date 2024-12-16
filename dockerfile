# Используем официальный образ Node.js в качестве базового образа
FROM node:latest

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Удаляем node_modules и package-lock.json если они существуют (чистим проект)
RUN rm -rf node_modules package-lock.json

# Устанавливаем зависимости с учетом кэша
RUN npm install

# Копируем только необходимые файлы
COPY . .

# Собираем проект с помощью Vite
RUN npm run build

EXPOSE 4173

# Определяем команду для запуска приложения
CMD ["npm", "run", "preview"]
