
# Приложение: Конкурсант Гранты (Тестовая сборка)

## Технологический стек

- **Backend**: Python, FastAPI
- **Frontend**: React, Material UI, Vite
- **Базы данных**: MongoDB
- **Развертывание**: Docker

## Установка

Следуйте инструкциям ниже для установки необходимых компонентов и развертывания приложения.

1. Обновите пакеты:

   ```bash
   sudo apt-get update
   ```

2. Установите Git:

   ```bash
   sudo apt install git
   ```

3. Установите необходимые пакеты для Docker:

   ```bash
   sudo apt-get update
   sudo apt-get install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc
   ```

4. Добавьте репозиторий Docker в список источников:

   ```bash
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt-get update
   ```

5. Установите Docker:

   ```bash
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

6. Клонируйте репозиторий проекта:

   ```bash
   git clone https://github.com/ChasovDS/konkursant-grants.git
   ```

7. Перейдите в директорию проекта:

   ```bash
   cd konkursant-grants
   ```

8. Соберите Docker-контейнеры:

   ```bash
   sudo docker compose build
   ```

9. Запустите приложение:

   ```bash
   sudo docker compose up
   ```

## Настройка

Для настройки Nginx отредактируйте файл конфигурации:

- Путь к файлу конфигурации: `konkursant-grants/nginx/conf.d/default.conf`

Убедитесь, что все параметры соответствуют требованиям вашего окружения.

## Запуск и тестирование

После установки и настройки, приложение будет доступно по адресу, указанному в конфигурации Nginx. Проверьте работоспособность приложения в различных браузерах и устройствах для обеспечения совместимости.

