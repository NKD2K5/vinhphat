'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

export default function TimKiemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get('q');

  useEffect(() => {
    if (query) {
      // Redirect to products page with search parameter
      router.replace(`/san-pham?search=${encodeURIComponent(query)}`);
    } else {
      // If no query, redirect to products page
      router.replace('/san-pham');
    }
  }, [query, router]);

  // Show loading while redirecting
  return <LoadingSkeleton />;
}
