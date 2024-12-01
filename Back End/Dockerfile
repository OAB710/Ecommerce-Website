# Sử dụng một base image Node.js nhẹ
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy các file package để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Expose cổng 5173 (Vite thường chạy trên cổng này)
EXPOSE 4000

# Thiết lập lệnh mặc định để chạy ứng dụng ở chế độ development với Vite và bật chế độ host để truy cập từ bên ngoài
CMD ["node", "index.js"]
