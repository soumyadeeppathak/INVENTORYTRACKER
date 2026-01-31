import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SYSTEM_CATEGORIES = [
  { name: 'Electronics', emoji: '⚡' },
  { name: 'Clothes', emoji: '👕' },
  { name: 'Toiletries', emoji: '🧴' },
  { name: 'Kitchen', emoji: '🍳' },
  { name: 'Sports', emoji: '⚽' },
  { name: 'Tools', emoji: '🔧' },
  { name: 'Documents', emoji: '📄' },
  { name: 'Other', emoji: '📦' },
]

async function main() {
  console.log('🌱 Seeding system categories...')

  for (const category of SYSTEM_CATEGORIES) {
    // Check if category already exists
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        isSystem: true,
        groupId: null,
      },
    })

    if (existing) {
      // Update existing category
      const result = await prisma.category.update({
        where: { id: existing.id },
        data: {
          emoji: category.emoji,
        },
      })
      console.log(`  ↻ ${result.emoji} ${result.name} (updated)`)
    } else {
      // Create new category
      const result = await prisma.category.create({
        data: {
          name: category.name,
          emoji: category.emoji,
          isSystem: true,
          groupId: null,
        },
      })
      console.log(`  ✓ ${result.emoji} ${result.name} (created)`)
    }
  }

  console.log('\n✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
