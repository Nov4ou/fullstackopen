#!/bin/bash

cd "$(dirname "$0")"
cd phonebook_backend

# Test for deploy

echo "=== Deploy started at $(date) ===" >> ../deploy.log

git pull origin main >> ../deploy.log 2>&1
npm install >> ../deploy.log 2>&1
pm2 restart backend >> ../deploy.log 2>&1

echo "=== Deploy finished at $(date) ===" >> ../deploy.log
