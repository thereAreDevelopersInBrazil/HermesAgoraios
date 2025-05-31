import { faker } from "@faker-js/faker";
import { Products } from "generated/prisma";
import { writeFileSync } from "node:fs";

export function generateProducts(productsQuantity = 2000) {
  const products: Products[] = [];
  for (let i = 0; i <= productsQuantity; i++) {
    products.push({
      id: i,
      code: `COD_${i}_${faker.string.alphanumeric({ length: 5, casing: 'upper' })}`,
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price({ min: 1, max: 500, dec: 2 })),
      photo: faker.image.url()
    });
  }
  writeFileSync(__dirname + "/products.json", JSON.stringify(products));
}

const args = process.argv.slice(2);
let numberOfProducts = 2000;
if (args && args[0] && !isNaN(Number(args[0]))) {
  numberOfProducts = Number(args[0]);
}
generateProducts(numberOfProducts);