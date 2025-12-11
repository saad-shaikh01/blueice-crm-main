import { Suspense } from 'react';
import { DottedSeparator } from './dotted-separator';
import { Logo } from './logo';
import { Navigation } from './navigation';

export const Sidebar = () => {
  return (
    <aside className="h-full bg-card/50 backdrop-blur-md border-r border-border p-4 flex flex-col gap-y-4">
      <Logo />
      <DottedSeparator className="opacity-50" />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <Navigation />
      </div>

      <div className="mt-auto">
         {/* Future footer items or user profile summary could go here */}
         <DottedSeparator className="opacity-50 my-4" />
      </div>
    </aside>
  );
};
