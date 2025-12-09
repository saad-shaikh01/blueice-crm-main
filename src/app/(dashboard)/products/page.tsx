import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import ProductsClient from './client';

const ProductsPage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return <ProductsClient />;
};

export default ProductsPage;
