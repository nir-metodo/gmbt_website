import { Suspense } from 'react';
import ThankYouContent from './ThankYouContent';

export const metadata = {
  title: 'תודה שפנית | Gambot',
  description: 'קיבלנו את פרטייך ונחזור אליך בהקדם.',
  robots: 'noindex, nofollow',
};

export default function ThankYouPage() {
  // Content is a client component that reads ?lang=en via useSearchParams; it MUST be wrapped in a
  // Suspense boundary so the statically-exported page can prerender (Hebrew) and hydrate the language
  // on the client. Reading searchParams on the server here would make the route dynamic and break
  // `next export`.
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}
