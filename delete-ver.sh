#!/bin/bash

# Параметры
ENDPOINT="grpcs://ydb.serverless.yandexcloud.net:2135"
DATABASE="/ru-central1/b1gcs6cbrfbkvpichjvf/etnjjbh04sl87maveeo2"
FUNCTION_NAME="delete-func"
FOLDER_ID="b1gml2vc6n82r27sbrp4"
SERVICE_ACCOUNT_ID="ajevgpdknq422vd16icp"
SA_KEY_FILE="key.json"

# 1. Установка zip если отсутствует
if ! command -v zip &> /dev/null; then
    echo "Установка zip..."
    sudo apt-get update && sudo apt-get install -y zip
fi

# 2. Очистка
rm -rf ./build ./dist
mkdir -p ./build ./dist

# 3. Компиляция TypeScript
echo "Компиляция TypeScript..."
if ! npx tsc --build tsconfig.json; then
    echo "ОШИБКА: Ошибка компиляции TypeScript"
    exit 1
fi

# 4. Проверка наличия index.js
if [ ! -f "./dist/index.js" ]; then
    echo "ОШИБКА: index.js не найден после компиляции"
    exit 1
fi

# 5. Копирование только необходимых файлов (без node_modules)
echo "Копирование файлов..."
cp package.json ./dist/
[ -f "$SA_KEY_FILE" ] && cp "$SA_KEY_FILE" ./dist/

# 6. Создание ZIP-архива (исключая node_modules)
echo "Создание delete.zip..."
if ! (cd ./dist && zip -r ../build/delete.zip . -x "*node_modules*"); then
    echo "ОШИБКА: Не удалось создать ZIP-архив"
    exit 1
fi

# 7. Проверка архива
if [ ! -f "./build/delete.zip" ]; then
    echo "ОШИБКА: Архив delete.zip не создан"
    exit 1
fi

# 8. Деплой функции
echo "Деплой функции $FUNCTION_NAME..."
yc serverless function version create \
  --function-name="$FUNCTION_NAME" \
  --runtime nodejs16 \
  --entrypoint index.handler \
  --memory 256m \
  --execution-timeout 5s \
  --source-path ./build/delete.zip \
  --service-account-id="$SERVICE_ACCOUNT_ID" \
  --folder-id "$FOLDER_ID" \
  --environment "ENDPOINT=$ENDPOINT,DATABASE=$DATABASE"

if [ $? -ne 0 ]; then
    echo "ОШИБКА: Деплой не удался"
    exit 1
fi

echo "УСПЕХ: Функция $FUNCTION_NAME успешно обновлена!"