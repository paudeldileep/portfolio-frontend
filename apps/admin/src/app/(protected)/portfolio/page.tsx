import { getAdminPortfolio, requireAdminIdentity } from '@/lib/admin-api';
import { PortfolioEditor } from '@/components/PortfolioEditor';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Portfolio',
};

export default async function PortfolioPage() {
  const identity = await requireAdminIdentity();

  if (identity.role !== 'owner') {
    redirect('/unauthorized');
  }

  return <PortfolioEditor portfolio={await getAdminPortfolio()} />;
}
