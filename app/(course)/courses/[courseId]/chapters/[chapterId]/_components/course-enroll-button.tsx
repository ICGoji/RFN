'use client';

import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      // const nnsCanisterId = '4c4fd-caaaa-aaaaq-aaa3a-cai';

      // Whitelist
      // const whitelist = [nnsCanisterId];

      // // Host
      // const host = 'https://mainnet.dfinity.network';

      // const onConnectionUpdate = () => {
      //   console.log(window.ic.plug.sessionManager.sessionData);
      // };

      // const hasAllowed = await window?.ic?.plug?.requestConnect(
      //   whitelist,
      //   host,
      //   onConnectionUpdate
      // );

      const principalId = await window.ic.plug.agent.getPrincipal();
      const userId = principalId.toString();
      console.log(userId);

      // const response = await axios.post(`/api/courses/${courseId}/checkout`);

      const params = {
        to: 'ryoil-idqct-oopws-4mgov-ool77-ez6cl-q2oz5-3sj2k-wcm6f-eyjez-qae',
        strAmount: price.toString(),
        token: '4c4fd-caaaa-aaaaq-aaa3a-cai',
      };

      const result = await window.ic.plug.requestTransferToken(params);

      console.log(result);
      if (result) {
        const response = await axios.post(`/api/courses/${courseId}/checkout`, {
          userId: userId,
        });
        console.log(response.data);
      }
      // window.location.assign(response.data.url);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size='sm'
      className='w-full md:w-auto'
    >
      Enroll for {formatPrice(price)} ICP
    </Button>
  );
};
