#!/bin/bash
set -e

echo "[v0] Starting database seeding process..."
echo "[v0] This script will populate all database tables with sample data"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "[v0] ERROR: DATABASE_URL environment variable not set"
    echo "[v0] Please set DATABASE_URL in your .env.local or environment"
    exit 1
fi

echo "[v0] Database URL found. Proceeding with seeding..."
echo ""

# Run Prisma migrations first
echo "[v0] Running database migrations..."
npx prisma migrate deploy

echo "[v0] Executing seed script..."
npx ts-node scripts/seed-data.ts

echo ""
echo "[v0] Seeding completed successfully!"
echo "[v0] You can now test the application with the demo credentials"
echo ""
echo "Demo Credentials:"
echo "  Admin:       admin@weofyou.com / password123"
echo "  Travel Agent: sarah.agent@weofyou.com / password123"
echo "  Traveler:    john.traveler@email.com / password123"
echo ""
echo "Visit http://localhost:3000/verify-db to check the database status"
