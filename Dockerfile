FROM php:8.2-fpm

# Cài đặt các dependencies hệ thống & Node.js
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    nodejs \
    npm

# Xóa cache apt để làm nhẹ Image
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Cài đặt PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Cài đặt Redis extension cho PHP
RUN pecl channel-update pecl.php.net && pecl install redis && docker-php-ext-enable redis

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Thiết lập thư mục làm việc
WORKDIR /var/www/html

# ==========================================
# PHẦN THÊM MỚI DÀNH CHO CI/CD (ĐÓNG GÓI CODE)
# ==========================================

# 1. Copy toàn bộ source code từ máy vào trong Image
COPY . .

# 2. Cài đặt thư viện PHP (Tối ưu hóa autoloader, bỏ các gói Dev)
RUN composer install --no-dev --optimize-autoloader

# 3. Cài đặt thư viện Node và build frontend (Vite/Mix)
RUN npm install --legacy-peer-deps
RUN npm run build
# 4. Phân quyền cho Nginx/PHP-FPM có thể ghi file vào storage và cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache