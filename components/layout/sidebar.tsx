// file components/layout/sidebar.tsx

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useProjectState } from '@/hooks/useProjectState';
import socket, { getUnreadCount, initiateSocketConnection } from '@/lib/socket';
import { auth } from '@/auth';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface MenuItem {
  name: string;
  iconName: string;
  href: string;
}

interface SideMenuItem {
  name: string;
  iconName: string;
  items?: MenuItem[];
  href?: string;
}

interface SidebarProps {
  defaultProjectId: number;
  sideMenuItems: SideMenuItem[];
  dynamicVariable: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  defaultProjectId,
  sideMenuItems: initialCategories,
  dynamicVariable
}) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [fontSizes, setFontSizes] = useState<Record<string, number>>({});
  const menuItemRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const { data: session } = useSession();

  const { currentProjectId, setCurrentProjectId } = useProjectState();

  const [categories, setCategories] =
    useState<SideMenuItem[]>(initialCategories);

  useEffect(() => {
    if (currentProjectId === 0 && defaultProjectId !== 0) {
      setCurrentProjectId(defaultProjectId);
    }
  }, [currentProjectId, defaultProjectId, setCurrentProjectId]);

  useEffect(() => {
    console.log('Current Project ID changed:', currentProjectId);
    const updatedCategories = initialCategories.map((category) => {
      if (category.items) {
        return {
          ...category,
          items: category.items.map((item) => ({
            ...item,
            href: item.href.replace(
              dynamicVariable,
              currentProjectId.toString()
            )
          }))
        };
      }
      return category;
    });
    setCategories(updatedCategories);
  }, [currentProjectId, initialCategories, dynamicVariable]);

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    return pathname.startsWith(href) && href !== '/dashboard';
  };

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as
      | React.ElementType
      | undefined;

    if (!Icon) {
      return null;
    }

    return <Icon className="h-5 w-5 flex-shrink-0" />;
  };

  useEffect(() => {
    if (isExpanded) {
      const newFontSizes: Record<string, number> = {};
      Object.keys(menuItemRefs.current).forEach((key) => {
        const el = menuItemRefs.current[key];
        if (el) {
          let fontSize = 14; // Start with default font size
          el.style.fontSize = `${fontSize}px`;
          while (el.scrollWidth > el.offsetWidth && fontSize > 8) {
            fontSize -= 0.5;
            el.style.fontSize = `${fontSize}px`;
          }
          newFontSizes[key] = fontSize;
        }
      });
      setFontSizes(newFontSizes);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (session && session?.user?.id) {
      if (!socket?.connected) {
        initiateSocketConnection(session?.user?.apiUserToken || '', [
          {
            event: 'newConversation',
            callback: (data) => {
              console.log(data);
            }
          }
        ]);
      }
      getUnreadCount(session?.user?.id as number, (res) => {
        if (res?.success) {
          setUnreadCount(res?.data?.unreadCount);
        }
      });
    }
  }, [session]);

  return (
    <motion.aside
      className="flex h-screen flex-col overflow-y-auto bg-[hsl(var(--sidebar-bg))] text-white scrollbar-none"
      initial={{ width: isExpanded ? '240px' : '70px' }}
      animate={{ width: isExpanded ? '240px' : '70px' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-grow p-4">
        <Link href="/dashboard">
          <motion.h1
            className="mb-6 overflow-hidden whitespace-nowrap text-center text-2xl font-bold"
            animate={{ opacity: isExpanded ? 1 : 0 }}
          >
            Buildify AI
          </motion.h1>
        </Link>
        <nav className="space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="mb-4">
              {category.items ? (
                <>
                  <motion.div
                    className={`flex cursor-pointer items-center rounded-md p-2 transition-colors ${
                      expandedCategory === category.name
                        ? 'bg-[hsl(var(--sidebar-active))] text-white'
                        : 'hover:bg-[hsl(var(--sidebar-hover))]'
                    }`}
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === category.name
                          ? null
                          : category.name
                      )
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent iconName={category.iconName} />
                    {isExpanded && (
                      <motion.span className="ml-3 overflow-hidden whitespace-nowrap">
                        {category.name}
                      </motion.span>
                    )}
                    {isExpanded && (
                      <motion.span className="ml-auto">
                        <IconComponent
                          iconName={
                            expandedCategory === category.name
                              ? 'ChevronDown'
                              : 'ChevronRight'
                          }
                        />
                      </motion.span>
                    )}
                  </motion.div>
                  {isExpanded && expandedCategory === category.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {category.items.map((item) => (
                        <Link key={item.name} href={item.href}>
                          <motion.div
                            className={`flex items-center rounded-md p-2 pl-8 transition-colors ${
                              isActive(item.href)
                                ? 'bg-[hsl(var(--sidebar-active))] text-white'
                                : 'hover:bg-[hsl(var(--sidebar-hover))]'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <IconComponent iconName={item.iconName} />
                            <span className="ml-3 overflow-hidden whitespace-nowrap">
                              {item.name}
                            </span>
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </>
              ) : (
                <Link href={category.href || ''}>
                  <motion.div
                    className={`flex cursor-pointer items-center rounded-md p-2 transition-colors ${
                      isActive(category.href || '')
                        ? 'bg-[hsl(var(--sidebar-active))] text-white'
                        : 'hover:bg-[hsl(var(--sidebar-hover))]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent iconName={category.iconName} />
                    {isExpanded && (
                      <motion.span
                        className="ml-3 overflow-hidden whitespace-nowrap"
                        ref={(el) => (menuItemRefs.current[category.name] = el)}
                        style={{
                          fontSize: `${fontSizes[category.name] || 14}px`
                        }}
                      >
                        {category.name}
                      </motion.span>
                    )}
                    <span
                      className={cn(
                        'invisible ml-auto flex h-6 w-6 min-w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white',
                        unreadCount &&
                          unreadCount > 0 &&
                          category.name === 'Messages' &&
                          'visible'
                      )}
                    >
                      {unreadCount}
                    </span>
                  </motion.div>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      <motion.button
        className="m-4 rounded-full bg-[hsl(var(--sidebar-hover))] p-2"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isExpanded ? '«' : '»'}
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;
