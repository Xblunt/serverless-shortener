#!/bin/bash

# Скрипт для сборки конкретного index.ts из папки create

# Пути к файлам
SRC_DIR="src/functions/create"
DIST_DIR="dist/functions/create"
TS_FILE="$SRC_DIR/index.ts"
OUT_FILE="$DIST_DIR/index.js"

# Очищаем предыдущую сборку
echo "Очистка предыдущей сборки..."
rm -rf "$DIST_DIR"

# Создаем директорию для сборки
mkdir -p "$DIST_DIR"

# Компилируем только нужный файл
echo "Компиляция $TS_FILE..."
npx tsc "$TS_FILE" --outDir "$DIST_DIR" --module commonjs --target ES2020

# Проверяем успешность компиляции
if [ $? -ne 0 ]; then
  echo "Ошибка компиляции TypeScript"
  exit 1
fi

# Копируем package.json если есть
if [ -f "package.json" ]; then
  echo "Копирование package.json..."
  cp package.json "$DIST_DIR/"
fi

# Копируем key.json если есть
if [ -f "key.json" ]; then
  echo "Копирование key.json..."
  cp key.json "$DIST_DIR/"
fi

# Устанавливаем зависимости (если package.json был скопирован)
if [ -f "$DIST_DIR/package.json" ]; then
  echo "Установка зависимостей..."
  (cd "$DIST_DIR" && npm install --production)
fi

# Создаем zip-архив
echo "Создание create.zip..."
(cd "$DIST_DIR" && zip -r "../../../create.zip" .)

echo "Сборка завершена успешно! Результат в create.zip"