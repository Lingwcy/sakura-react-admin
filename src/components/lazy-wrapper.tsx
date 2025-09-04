// LazyWrapper.tsx
import { Suspense } from 'react';
import { BorderLoading } from '@/components/loading';

export function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<BorderLoading />}>
      {children}
    </Suspense>
  );
}