import React from 'react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '../shared/ModeToggle';
import { SidebarTrigger } from '../ui/sidebar';
import { Commander } from '../shared/Commander';
import { UserNav } from './UserNav';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "flex h-14 items-center gap-2 border-b px-4 w-full",
        className
      )}
    >
      <SidebarTrigger />

      <Commander />

    <div className="flex items-center gap-4 ml-auto">
  <LanguageSwitcher />
  <ModeToggle />
  <UserNav />
</div>
    </header>
  );
};