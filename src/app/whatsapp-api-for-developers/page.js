import LandingShell from '@/components/Landing/LandingShell';
import { landingMetadata, landingSchema } from '@/lib/landing';
import { data } from '@/components/Landing/data/developers';

export const metadata = landingMetadata(data);

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingSchema(data)) }} />
      <LandingShell data={data} />
    </>
  );
}
