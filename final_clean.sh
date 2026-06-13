#!/bin/bash
# Move schema to standard location and clean models folder
mv prisma/models/schema.prisma prisma/schema.prisma
rm -rf prisma/models
rm -rf prisma/generated

# Remove unnecessary root files
rm -rf clean.sh clean_advanced.sh clean3.sh frontend_integration_guide.md prisma.config.ts docs scripts

# Re-generate Prisma Client to fix the constructor error
npx prisma generate

echo "Root folder cleaned and Prisma generated!"
