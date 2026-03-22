import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bazaar.com' },
    update: {},
    create: { email: 'admin@bazaar.com', password: adminPassword, name: 'Admin', role: 'ADMIN' },
  });

  const products = [
    { name: 'Sony WH-1000XM5 Headphones', price: 24999, mrp: 34990, category: 'Electronics', stock: 15, image: '🎧', badge: 'Best Seller', desc: 'Industry-leading noise cancellation with 30-hour battery life.', rating: 4.8, reviews: 2847 },
    { name: 'Apple MacBook Air M3', price: 114999, mrp: 124900, category: 'Electronics', stock: 8, image: '💻', badge: 'New', desc: 'Supercharged by M3. Up to 18 hours of battery life.', rating: 4.9, reviews: 1203 },
    { name: 'Nike Air Max 270', price: 7995, mrp: 12995, category: 'Fashion', stock: 42, image: '👟', badge: 'Sale', desc: 'Max Air unit delivers unrivaled, all-day comfort.', rating: 4.6, reviews: 5412 },
    { name: 'Instant Pot Duo 7-in-1', price: 5499, mrp: 8999, category: 'Home & Kitchen', stock: 23, image: '🍲', badge: 'Best Seller', desc: '7-in-1 functionality: pressure cooker, slow cooker, rice cooker & more.', rating: 4.7, reviews: 9834 },
    { name: 'Atomic Habits by James Clear', price: 299, mrp: 499, category: 'Books', stock: 100, image: '📚', badge: 'Top Rated', desc: 'Tiny changes, remarkable results. The #1 self-improvement book.', rating: 4.9, reviews: 15623 },
    { name: 'Yoga Mat Premium 6mm', price: 1299, mrp: 2499, category: 'Sports', stock: 34, image: '🧘', badge: 'Sale', desc: 'Non-slip, eco-friendly TPE material with alignment lines.', rating: 4.5, reviews: 3201 },
    { name: 'Samsung 65" QLED 4K TV', price: 84999, mrp: 129900, category: 'Electronics', stock: 5, image: '📺', badge: 'Sale', desc: 'Quantum HDR with 100% Color Volume delivers breathtaking picture quality.', rating: 4.7, reviews: 892 },
    { name: "Levi's 511 Slim Jeans", price: 2999, mrp: 4499, category: 'Fashion', stock: 67, image: '👖', badge: null, desc: 'Sits below the waist with a slim fit through the thigh and leg opening.', rating: 4.4, reviews: 7621 },
    { name: 'Dyson V15 Detect', price: 44900, mrp: 52900, category: 'Home & Kitchen', stock: 11, image: '🌀', badge: 'Premium', desc: 'Reveals invisible dust with laser precision. Intelligent reporting.', rating: 4.8, reviews: 1456 },
    { name: 'Garmin Forerunner 265', price: 34999, mrp: 41900, category: 'Sports', stock: 19, image: '⌚', badge: 'New', desc: 'AMOLED display with advanced training metrics and recovery insights.', rating: 4.6, reviews: 2103 },
    { name: 'The Psychology of Money', price: 249, mrp: 399, category: 'Books', stock: 100, image: '💰', badge: 'Top Rated', desc: 'Timeless lessons on wealth, greed, and happiness.', rating: 4.8, reviews: 12089 },
    { name: 'iPad Air 5th Gen', price: 59900, mrp: 64900, category: 'Electronics', stock: 14, image: '📱', badge: 'New', desc: 'Supercharged by M1 chip with 12MP Ultra Wide front camera.', rating: 4.8, reviews: 3421 },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('Seed complete. Admin:', admin.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
