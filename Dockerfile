FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    nginx \
    supervisor

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip
RUN pecl channel-update pecl.php.net && pecl install redis && docker-php-ext-enable redis

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . /var/www/html
COPY docker/php/local.ini /usr/local/etc/php/conf.d/local.ini

COPY docker/nginx/default.conf /etc/nginx/sites-available/default

RUN composer install --no-dev --optimize-autoloader

RUN npm install --legacy-peer-deps

RUN npm run build

RUN echo "clear_env = no" >> /usr/local/etc/php-fpm.d/zz-docker.conf

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache

RUN touch /var/www/html/.env
# -------------------------------------------------------------

EXPOSE 80

CMD php-fpm -D && nginx -g "daemon off;"