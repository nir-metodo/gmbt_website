import OneTimeBroadcastTerms from '@/components/Legal/OneTimeBroadcastTerms';

export const metadata = {
  title: 'תנאי שימוש לדיוור חד פעמי | גמבוט',
  description: 'תנאי השימוש בשירות הדיוור החד פעמי של גמבוט: אחריות הלקוח, הסכמת נמענים (סעיף 30א), הגבלת אחריות ושיפוי',
  alternates: { canonical: 'https://gambot.co.il/one-time-broadcast-terms/' },
};

export default function OneTimeBroadcastTermsPage() {
  return <OneTimeBroadcastTerms />;
}
