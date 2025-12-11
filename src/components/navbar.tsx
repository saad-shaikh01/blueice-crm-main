'use client';

import { usePathname } from 'next/navigation';

import { UserButton } from '@/features/auth/components/user-button';
import { MobileSidebar } from './mobile-sidebar';
import { ModeToggle } from './toggle-btn';

const pathnameMap = {
  tasks: {
    title: 'My Tasks',
    description: 'View all of your tasks here.',
  },
  projects: {
    title: 'My Project',
    description: 'View tasks of your project here.',
  },
  users: {
    title: 'All Users',
    description: 'View All users here.',
  },
  customers: {
    title: 'Customers',
    description: 'Manage your customer base.',
  },
  products: {
    title: 'Products',
    description: 'Inventory management.',
  },
  deliveries: {
    title: 'Deliveries',
    description: 'Track and schedule deliveries.',
  },
  invoices: {
    title: 'Invoices',
    description: 'View and manage invoices.',
  },
  driver: {
    title: 'Driver View',
    description: 'Your daily delivery route.',
  },
};

const defaultMap = {
  title: 'Home',
  description: 'Monitor all of your projects and tasks here.',
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split('/');
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap; // This logic assumes /workspaces/[id]/[feature] structure?
  // Wait, looking at paths like /invoices, /driver...
  // The original code was extracting index 3?
  // Let's make it more robust.

  const lastSegment = pathnameParts[pathnameParts.length - 1] as keyof typeof pathnameMap;
  // Or check if path includes the key.

  // Simple heuristic for now based on the known map keys
  let matchedKey = Object.keys(pathnameMap).find(key => pathname.includes(key)) as keyof typeof pathnameMap | undefined;

  const { title, description } = matchedKey ? pathnameMap[matchedKey] : defaultMap;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-3 transition-all">
      <div className="flex items-center justify-between">
        <div className="hidden flex-col lg:flex">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="lg:hidden">
           <MobileSidebar />
        </div>

        <div className="flex items-center gap-x-4">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </nav>
  );
};
