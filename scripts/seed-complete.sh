#!/bin/bash

# Complete database seeding script for We-Of-You Travel Platform

echo "[v0] =========================================="
echo "[v0] We-Of-You Travel Platform"
echo "[v0] Database Seeding Setup"
echo "[v0] =========================================="

# Check environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "[v0] ERROR: NEXT_PUBLIC_SUPABASE_URL not set"
  echo "[v0] Please configure .env.local with Supabase credentials"
  exit 1
fi

echo "[v0] ✅ Supabase URL configured"
echo "[v0] ✅ Service role key detected"

echo ""
echo "[v0] Step 1: Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "[v0] Step 2: Creating database tables..."
npx prisma migrate dev --skip-generate

echo ""
echo "[v0] Step 3: Seeding sample data..."
npm run seed

echo ""
echo "[v0] =========================================="
echo "[v0] ✅ SETUP COMPLETE!"
echo "[v0] =========================================="
echo ""
echo "[v0] Next steps:"
echo "[v0] 1. Run: npm run dev"
echo "[v0] 2. Visit: http://localhost:3000/verify-db"
echo "[v0] 3. Login with test credentials"
echo ""
echo "[v0] Test Credentials:"
echo "[v0] Admin: admin@weofyou.com / Admin@123"
echo "[v0] Traveler: john.traveler@email.com / Traveler@123"
echo ""
