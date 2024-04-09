'use client';

import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

// import { userIdStore } from '@/hooks/userId-store';

import { Button } from '@/components/ui/button';
import { isTeacher } from '@/lib/teacher';

import { SearchInput } from './search-input';
import { useEffect, useState } from 'react';

export const NavbarRoutes = () => {
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState('');

  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage = pathname?.includes('/courses');
  const isSearchPage = pathname === '/search';

  useEffect(() => {
    // 检查本地存储中是否有用户 ID
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      // 如果存在，设置用户 ID 状态
      setUserId(storedUserId);
      // 同时设置 connected 状态为 true
      setConnected(true);
    }
  }, []);

  async function onButtonPress(el: any) {
    // el.target.disabled = true;

    const nnsCanisterId = '4c4fd-caaaa-aaaaq-aaa3a-cai';

    // Whitelist
    const whitelist = [nnsCanisterId];

    // Host
    const host = 'https://mainnet.dfinity.network';

    // const onConnectionUpdate = () => {
    //   console.log('c:' + window.ic.plug.sessionManager.sessionData);
    // };

    const hasAllowed = await window?.ic?.plug?.requestConnect(
      whitelist,
      host
      // onConnectionUpdate
    );

    const principalId = await window.ic.plug.agent.getPrincipal();

    const id = principalId.toString();
    // console.log(id);
    // userIdStore.setState({ userId: id });
    setUserId(id);
    localStorage.setItem('userId', id);
  }

  return (
    <>
      {isSearchPage && (
        <div className='hidden md:block'>
          <SearchInput />
        </div>
      )}
      <div className='flex gap-x-2 ml-auto'>
        {isTeacherPage || isCoursePage ? (
          <Link href='/'>
            <Button size='sm' variant='ghost'>
              <LogOut className='h-4 w-4 mr-2' />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href='/teacher/courses'>
            <Button size='sm' variant='ghost'>
              Admin mode
            </Button>
          </Link>
        ) : null}
        {connected ? (
          <Button onClick={onButtonPress}>
            {userId.slice(0, 4)}...{userId.slice(-4)}
          </Button>
        ) : (
          <Button onClick={onButtonPress}>Connect</Button>
        )}
      </div>
    </>
  );
};
