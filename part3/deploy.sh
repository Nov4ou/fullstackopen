#!/bin/bash

cd "$(dirname "$0")"
cd phonebook_backend

echo "=== Deploy started at $(date) ===" >> ../deploy.log

git pull origin deploy >> ../deploy.log 2>&1
npm install >> ../../deploy.log 2>&1
pm2 restart backend >> ../deploy.log 2>&1

echo "=== Deploy finished at $(date) ===" >> ../deploy.log
