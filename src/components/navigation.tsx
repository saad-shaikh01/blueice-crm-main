// 'use client';

// import { MessageCircleDashedIcon, Settings, UsersIcon } from 'lucide-react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill, GoProjectRoadmap, GoProjectTemplate } from 'react-icons/go';

// import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
// import { cn } from '@/lib/utils';

// const routes = [
//   {
//     label: 'Home',
//     href: '',
//     icon: GoHome,
//     activeIcon: GoHomeFill,
//   },
//   {
//     label: 'Projects',
//     href: '/projects',
//     icon: GoProjectTemplate,
//     activeIcon: GoProjectRoadmap,
//   },
//   {
//     label: 'My Tasks',
//     href: '/tasks',
//     icon: GoCheckCircle,
//     activeIcon: GoCheckCircleFill,
//   },
//   {
//     label: 'Settings',
//     href: '/settings',
//     icon: Settings,
//     activeIcon: Settings,
//   },
//   {
//     label: 'Members',
//     href: '/members',
//     icon: UsersIcon,
//     activeIcon: UsersIcon,
//   },
//   {
//     label: 'Users',
//     href: '/users',
//     icon: UsersIcon,
//     activeIcon: UsersIcon,
//   },
//   {
//     label: 'Inbox',
//     href: '/chat',
//     icon: MessageCircleDashedIcon,
//     activeIcon: MessageCircleDashedIcon,
//   },
// ];

// export const Navigation = () => {
//   const pathname = usePathname();
//   const workspaceId = useWorkspaceId();

//   return (
//     <ul className="flex flex-col">
//       {routes.map((route) => {
//         const fullHref = `/workspaces/${workspaceId}${route.href}`;
//         const isActive = pathname === fullHref;
//         const Icon = isActive ? route.activeIcon : route.icon;

//         return (
//           <li key={fullHref}>
//             <Link
//               href={fullHref}
//               className={cn(
//                 'flex items-center gap-2.5 rounded-md p-2.5 font-medium text-neutral-500 transition hover:text-primary',
//                 isActive && 'bg-white text-primary shadow-sm hover:opacity-100',
//               )}
//             >
//               <Icon className="size-5 text-neutral-500" />
//               {route.label}
//             </Link>
//           </li>
//         );
//       })}
//     </ul>
//   );
// };



'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
// import { useCurrentMember } from '@/features/members/api/use-current-member';
import {
  GoHome, GoHomeFill, GoProjectTemplate, GoProjectRoadmap,
  GoCheckCircle, GoCheckCircleFill, GoGear, GoPerson, GoPersonFill, GoDatabase, GoPackage, GoPaperAirplane
} from 'react-icons/go';

const allowedRoutes = [
  {
    label: 'Home',
    href: '/',
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: GoProjectTemplate,
    activeIcon: GoProjectRoadmap,
  },
  {
    label: 'My Tasks',
    href: '/tasks',
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: GoGear,
    activeIcon: GoGear,
  },

  {
    label: 'Customers',
    href: '/customers',
    icon: GoDatabase,
    activeIcon: GoDatabase,
  },
  {
    label: 'Products',
    href: '/products',
    icon: GoPackage,
    activeIcon: GoPackage,
  },
  {
    label: 'Deliveries',
    href: '/deliveries',
    icon: GoPaperAirplane,
    activeIcon: GoPaperAirplane,
  },
  {
    label: 'Users',
    href: '/users',
    icon: GoPerson,
    activeIcon: GoPersonFill,
  },

];

export const Navigation = () => {
  const pathname = usePathname();
  // const workspaceId = useWorkspaceId();
  // const { data: memberData, isLoading } = useCurrentMember({ workspaceId });

  // const allowedRoutes = routes.filter((route) =>
  //   memberData?.member?.routePermissions.includes(route.href || '/')
  // );

  return (
    <ul className="flex flex-col">
      {allowedRoutes.map((route) => {
        const fullHref = route.href;
        const isActive = pathname === fullHref;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <li key={fullHref}>
            <Link
              href={fullHref}
              className={cn(
                'flex items-center gap-2.5 rounded-md p-2.5 font-medium text-muted-foreground transition hover:text-primary',
                isActive && 'bg-muted text-primary shadow-sm hover:opacity-100',
              )}
            >
              <Icon className="size-5 text-muted-foreground" />
              {route.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
