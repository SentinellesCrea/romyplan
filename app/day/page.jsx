import { Suspense } from 'react';
import DayPageClient from './DayPageClient';

export default function DayPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DayPageClient />
    </Suspense>
  );
}
