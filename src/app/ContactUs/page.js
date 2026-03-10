import ContactUs from '@/components/Contact/ContactUs';

export const metadata = {
  title: 'צור קשר | Gambot - WhatsApp API ישראל',
  description: 'צרו קשר עם צוות גמבוט. תמיכה טכנית, שאלות על מחירים והדגמות. נציג יחזור אליכם תוך שעה.',
  alternates: { canonical: 'https://gambot.co.il/ContactUs/' },
};

export default function ContactPage() {
  return <ContactUs />;
}
