import App from '@/App';
import { getCachedProducts, mapCleanProductToMadhubani } from '@/lib/products';

export const revalidate = 60; // 60s ISR baseline

export default async function HomePage() {
  const dbProducts = await getCachedProducts();
  const initialProducts = dbProducts.map(mapCleanProductToMadhubani);

  return <App initialProducts={initialProducts} />;
}
