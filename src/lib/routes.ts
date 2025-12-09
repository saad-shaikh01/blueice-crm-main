import { GoBookmarkFill, GoCheckCircle, GoCheckCircleFill, GoDatabase, GoHome, GoHomeFill, GoProjectRoadmap, GoProjectTemplate, GoPackage } from 'react-icons/go';
import { MessageCircleDashedIcon, Settings, UsersIcon, Package } from 'lucide-react';


export const routes = [
  {
    label: 'Home',
    href: '/',
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: 'Customers',
    href: '/customers',
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
  {
    label: 'Products',
    href: '/products',
    icon: Package,
    activeIcon: Package,
  },
  {
    label: 'Deliveries',
    href: '/deliveries',
    icon: GoPackage,
    activeIcon: GoPackage,
  },
  {
    label: 'Leads',
    href: '/leads',
    icon: GoDatabase,
    activeIcon: GoBookmarkFill,
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
    icon: Settings,
    activeIcon: Settings,
  },
  {
    label: 'Members',
    href: '/members',
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
  {
    label: 'Users',
    href: '/users',
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
  {
    label: 'Inbox',
    href: '/chat',
    icon: MessageCircleDashedIcon,
    activeIcon: MessageCircleDashedIcon,
  },
];
