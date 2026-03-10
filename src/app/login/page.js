import LoginPage from '@/components/Login/LoginPage';

export const metadata = {
  title: 'כניסה לגמבוט | Gambot Login',
  description: 'התחברו לאיזור האישי של גמבוט - מערכת וואטסאפ עסקי מתקדמת',
  robots: { index: false, follow: false },
};

export default function LoginRoute() {
  return <LoginPage />;
}
