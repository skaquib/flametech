import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function attachGallery(slug: string, urls: string[], primaryIdx = 0) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    console.warn(`Skipped ${slug}: product not found`);
    return;
  }

  // Replace any existing images for this product with the real photo set
  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.createMany({
    data: urls.map((url, i) => ({
      productId: product.id,
      url,
      altText: `${product.name} — photo ${i + 1}`,
      position: i,
    })),
  });

  await prisma.product.update({
    where: { id: product.id },
    data: { image: urls[primaryIdx] },
  });

  console.log(`Attached ${urls.length} real photos to ${slug}`);
}

async function main() {
  const ft10 = [
    "/images/ft-10-real-1.jpg",
    "/images/ft-10-real-2.jpg",
    "/images/ft-10-real-3.jpg",
    "/images/ft-10-real-4.jpg",
  ];
  const ft15 = [
    "/images/ft-15-real-1.jpg",
    "/images/ft-15-real-2.jpg",
    "/images/ft-15-real-3.jpg",
    "/images/ft-15-real-4.jpg",
    "/images/ft-15-real-5.jpg",
    "/images/ft-15-real-6.jpg",
  ];
  const controlPanel = [
    "/images/control-panel-2motor-real-1.jpg",
    "/images/control-panel-2motor-real-2.jpg",
    "/images/control-panel-2motor-real-3.jpg",
    "/images/control-panel-2motor-real-4.jpg",
    "/images/control-panel-2motor-real-5.jpg",
    "/images/control-panel-2motor-real-6.jpg",
  ];

  await attachGallery("ft-10-gas-burner", ft10);
  // Uncertain which FT-15 variant these depict — attached to both per instruction
  await attachGallery("ft-15-gas-burner", ft15);
  await attachGallery("ft-15-two-stage-gas-burner", ft15);
  await attachGallery("2-motor-1-burner-hd-panel", controlPanel);

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
