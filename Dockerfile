# ── Stage 1: build frontend assets ──────────────────────────────────────────
FROM node:22-alpine AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY resources/ resources/
COPY vite.config.js ./
COPY public/ public/

RUN npm run build

# ── Stage 2: PHP dependencies ─────────────────────────────────────────────────
FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --optimize-autoloader \
    --no-dev \
    --no-scripts \
    --no-interaction

# ── Stage 3: production image ─────────────────────────────────────────────────
FROM php:8.4-fpm-alpine AS production

# Runtime dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    git \
    zip \
    unzip \
    curl \
    && docker-php-ext-install opcache pcntl

# Install predis (pure PHP Redis client, no extension required)
# If you need phpredis extension instead, uncomment below:
# RUN apk add --no-cache $PHPIZE_DEPS \
#     && pecl install redis \
#     && docker-php-ext-enable redis \
#     && apk del $PHPIZE_DEPS

# PHP configuration
COPY docker/php/php.ini /usr/local/etc/php/conf.d/app.ini

WORKDIR /var/www/html

# Copy application
COPY --chown=www-data:www-data . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build

# Bootstrap caches (skipped during image build; run via release command in Cloud)
RUN php artisan package:discover --ansi

# Nginx config
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Supervisor config
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80

# Default: web server (nginx + php-fpm via supervisord)
# Override CMD to "php artisan queue:work ..." for worker containers
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
