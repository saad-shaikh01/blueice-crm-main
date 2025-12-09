import { redirect } from 'next/navigation';

import { getCurrent } from '@/features/auth/queries';
import DeliveriesClient from './client';

const DeliveriesPage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return <DeliveriesClient />;
};

export default DeliveriesPage;
