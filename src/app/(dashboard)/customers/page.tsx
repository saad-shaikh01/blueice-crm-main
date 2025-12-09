import { redirect } from 'next/navigation';

import CustomersClient from './client';
import { getCurrent } from '@/features/auth/queries';

const CustomersPage = async () => {
  const user = await getCurrent();

  if (!user) redirect('/sign-in');

  return <CustomersClient />;
};

export default CustomersPage;
