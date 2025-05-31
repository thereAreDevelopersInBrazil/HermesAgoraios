import { PrismaClient } from "../generated/prisma";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { generateProducts } from "./generate_products";

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    const args = process.argv.slice(2);
    let numberOfProducts = 2000;
    if (args && args[0] && !isNaN(Number(args[0]))) {
      numberOfProducts = Number(args[0]);
    }

    const filePath = join(__dirname, 'products.json');

    if (!existsSync(filePath)) {
      generateProducts(numberOfProducts);
      return;
    }

    const rawProducts = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(rawProducts);

    if (Array.isArray(parsed) && parsed.length > 0) {
      for (const product of parsed) {
        await prisma.products.upsert({
          where: { id: product.id },
          update: product,
          create: product,
        });
      }
      console.log("✅ Alimentação inicial dos produtos finalizada com sucesso!");
    } else {
      console.log("❌ Erro ao ler arquivo de produtos para rodar a alimentação inicial de produtos!");
    }
  } catch (error) {
    console.error("❌ Alimentação inicial de produtos falhou! Detalhes:", error);
  } finally {
    await prisma.$disconnect();
  }

}

(async () => {
  await seedProducts();
})();
