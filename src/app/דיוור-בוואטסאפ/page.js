import { buildMetadata } from '@/lib/pageMeta';
import LandingPageContent from '@/components/shared/LandingPageContent';
import { SOLUTIONS } from '@/lib/solutionContent';

export const metadata = buildMetadata('whatsappNewsletter');

export default function WhatsAppMailingPage() {
  return <LandingPageContent content={SOLUTIONS.whatsappMailing} />;
}
