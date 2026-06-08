import Script from 'next/script';
import AddPayment from '@/components/OnBoard/AddPayment';

export const metadata = {
  title: 'השלמת פרטי תשלום | Gambot',
  description: 'השלם את פרטי התשלום שלך להמשך השימוש בגמבוט.',
};

const urlFixScript = `(function(){
  var h=location.href;
  if(/addpayment%3F/i.test(h)){location.replace(h.replace(/addpayment%3F/i,'addpayment?'));return;}
  var p=location.pathname.replace(/\\/$/,'');
  if(p.indexOf('/addpayment')===0&&p.length>'/addpayment'.length&&!p.startsWith('/addpayment/')){
    var r=p.slice('/addpayment'.length).replace(/^%3F/i,'').replace(/^\\?/,'');
    location.replace('/addpayment?'+r+location.search.replace(/^\\?/,'&'));
  }
})();`;

export default function AddPaymentPage() {
  return (
    <>
      <Script id="addpayment-url-fix" strategy="beforeInteractive">
        {urlFixScript}
      </Script>
      <AddPayment />
    </>
  );
}
