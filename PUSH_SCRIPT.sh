#!/bin/bash
# سكريبت رفع التعديلات على GitHub
# تشغيل: bash PUSH_SCRIPT.sh

echo "🔧 رفع الإصلاح على GitHub..."

# التأكد أنك في مجلد المشروع الأصلي
if [ ! -d ".git" ]; then
  echo "❌ هذا المجلد ليس git repository"
  echo "   شغّل السكريبت من داخل مجلد food-order-v16"
  exit 1
fi

# نسخ الملفات المُصلَحة
SCRIPT_DIR="$(dirname "$0")"

cp "$SCRIPT_DIR/api/orders/save.js"   api/orders/save.js
cp "$SCRIPT_DIR/api/orders/delete.js" api/orders/delete.js
cp "$SCRIPT_DIR/api/orders/clear.js"  api/orders/clear.js
cp "$SCRIPT_DIR/api/menu/save.js"     api/menu/save.js
cp "$SCRIPT_DIR/api/prices/save.js"   api/prices/save.js
cp "$SCRIPT_DIR/vercel.json"          vercel.json

echo "✅ الملفات منسوخة"

git add api/orders/save.js api/orders/delete.js api/orders/clear.js \
        api/menu/save.js api/prices/save.js vercel.json

git commit -m "fix: correct relative import paths ../../../ → ../../lib/storage.js

- api/orders/save.js
- api/orders/delete.js
- api/orders/clear.js
- api/menu/save.js
- api/prices/save.js
- vercel.json: add includeFiles for lib/ bundling"

git push origin main

echo ""
echo "✅ تم الرفع! Vercel سيبدأ deployment تلقائياً"
