#!/bin/bash

ENDPOINT="grpcs://ydb.serverless.yandexcloud.net:2135"
DATABASE="/ru-central1/b1gcs6cbrfbkvpichjvf/etnjjbh04sl87maveeo2"
FUNCTION_NAME="create-func"
FOLDER_ID="b1gml2vc6n82r27sbrp4"
SERVICE_ACCOUNT_ID="ajevgpdknq422vd16icp"
SA_KEY_FILE="key.json"

echo "Удалить $FUNCTION_NAME"
yc serverless function delete --name=$FUNCTION_NAME

echo "Создать $FUNCTION_NAME"
yc serverless function create --name=$FUNCTION_NAME
echo "сделать функцию публичной"
yc serverless function allow-unauthenticated-invoke $FUNCTION_NAME
