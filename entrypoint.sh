#!/bin/sh

# Wait for DB to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z nestjs_pxlhut_db 5432; do
  sleep 1
done

echo "Database is up. Running Prisma migrations..."
npx prisma db push

echo "Starting the app..."
npm run start:dev
