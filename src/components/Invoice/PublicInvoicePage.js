'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const CURRENCY_SYMBOLS = { ILS: '₪', USD: '$', EUR: '€', GBP: '£' };

// Display-only: show just the running number (drop the cosmetic "INV-"/"REC-" prefix).
const stripDocPrefix = (n) => (n == null ? '' : String(n).replace(/^[A-Za-z]+[-\s/]?/, ''));

const GAMBOT_URL = 'https://www.gambot.co.il';

const API_BASE = 'https://gambot.azurewebsites.net/api/Webhooks';

// Keep in sync with the editor's DOCUMENT_TYPES so the public view shows the exact same title as the PDF.
const DOC_TYPE_LABELS = {
  tax_invoice: 'חשבונית מס',
  receipt: 'קבלה',
  combined: 'חשבונית מס קבלה',
  credit_invoice: 'חשבונית זיכוי',
  credit_receipt: 'קבלת זיכוי',
  delivery_note: 'תעודת משלוח',
  return_note: 'תעודת החזרה',
  order: 'הזמנה',
  work_order: 'הזמנת עבודה',
  proforma: 'חשבון עסקה',
  // legacy aliases
  invoice: 'חשבונית מס',
  invoice_receipt: 'חשבונית מס קבלה',
  credit_note: 'חשבונית זיכוי',
};

const PAYMENT_METHODS = {
  bank_transfer: 'העברה בנקאית',
  credit_card: 'כרטיס אשראי',
  cash: 'מזומן',
  check: "צ'ק",
  bit: 'ביט',
  paybox: 'פייבוקס',
  paypal: 'פייפאל',
  app_payment: 'תשלום באפליקציה',
  other: 'אחר',
};

const STATUS_LABELS = {
  draft: { he: 'טיוטה', color: '#6b7280' },
  issued: { he: 'הופקה', color: '#3b82f6' },
  sent: { he: 'נשלחה', color: '#8b5cf6' },
  paid: { he: 'שולם', color: '#10b981' },
  partially_paid: { he: 'שולם חלקית', color: '#f59e0b' },
  overdue: { he: 'באיחור', color: '#ef4444' },
  cancelled: { he: 'בוטלה', color: '#9ca3af' },
};

export default function PublicInvoicePage() {
  const searchParams = useSearchParams();
  const org = searchParams?.get('org');
  const invoiceId = searchParams?.get('id');

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'invoice-page-hide';
    style.textContent = 'nav, footer { display: none !important; } main { padding: 0 !important; margin: 0 !important; }';
    document.head.appendChild(style);
    return () => document.getElementById('invoice-page-hide')?.remove();
  }, []);

  useEffect(() => {
    if (!org || !invoiceId) {
      setError('קישור לא תקין');
      setLoading(false);
      return;
    }
    fetchInvoice();
  }, [org, invoiceId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/GetPublicInvoiceById?org=${encodeURIComponent(org)}&invoiceId=${encodeURIComponent(invoiceId)}`);
      const data = res.data?.data || res.data;
      if (!data) { setError('המסמך לא נמצא'); return; }
      setInvoice(data);
      const customerName = data.contactName || '';
      const docNum = stripDocPrefix(data.documentNumber);
      const docLabel = DOC_TYPE_LABELS[data.type] || 'חשבונית';
      document.title = `${docLabel}${customerName ? ` - ${customerName}` : ''}${docNum ? ` | ${docNum}` : ''}`;
    } catch (err) {
      setError('המסמך לא נמצא או שהקישור אינו תקין');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner}></div>
      <p style={{ color: '#555', marginTop: 16 }}>טוען מסמך...</p>
    </div>
  );

  if (error) return (
    <div style={styles.centered}>
      <img src="/new_logo.png" alt="Gambot" style={{ height: 50, marginBottom: 24 }} />
      <p style={{ color: '#ef4444', fontSize: 18 }}>{error}</p>
    </div>
  );

  if (!invoice) return null;

  const branding = invoice.branding || {};
  const primaryColor = branding.primaryColor || '#2e6155';
  const currency = CURRENCY_SYMBOLS[invoice.currency] || '₪';
  const items = invoice.items || [];
  const status = STATUS_LABELS[invoice.status] || { he: invoice.status || '', color: '#6b7280' };
  const docLabel = DOC_TYPE_LABELS[invoice.type] || 'חשבונית';

  const formatNum = (n) => {
    const num = parseFloat(n) || 0;
    return num.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // Totals are stored inconsistently across creation paths: the editor saves
  // subtotal/vatAmount(taxAmount)/total/vatRate, while AI/automation-created documents may save
  // only `total`. Compute everything defensively from the line items so the VAT breakdown always
  // shows when VAT was actually charged.
  const itemsSubtotal = items
    .filter(i => i.type !== 'section')
    .reduce((s, i) => {
      const qty = parseFloat(i.quantity) || 1;
      const price = parseFloat(i.unitPrice) || 0;
      return s + qty * price;
    }, 0);

  const subtotal = parseFloat(invoice.subtotal) || itemsSubtotal;
  const discount = parseFloat(invoice.discount) || 0;
  const afterDiscount = Math.max(0, subtotal - discount);

  // VAT rate: editor saves it under `vatRate`; some docs use `taxRate`/`tax`.
  let vatRate = parseFloat(invoice.vatRate ?? invoice.taxRate ?? invoice.tax) || 0;

  // VAT amount: prefer the stored value; otherwise derive it.
  let vatAmount = parseFloat(invoice.vatAmount ?? invoice.taxAmount);
  if (isNaN(vatAmount)) vatAmount = vatRate > 0 ? afterDiscount * vatRate / 100 : 0;

  // Total: prefer stored; otherwise items + VAT.
  let total = parseFloat(invoice.total);
  if (isNaN(total)) total = afterDiscount + vatAmount;

  // Last-resort inference: if the stored total is bigger than the (discounted) items but no VAT was
  // recorded (AI/automation path that only saved `total`), treat the gap as VAT so it's shown.
  if (vatAmount <= 0 && total > afterDiscount + 0.01) {
    vatAmount = Math.round((total - afterDiscount) * 100) / 100;
  }
  // Derive the rate from amounts when we have an amount but no rate (for the "מע״מ (X%)" label).
  if (!vatRate && vatAmount > 0 && afterDiscount > 0) {
    vatRate = Math.round((vatAmount / afterDiscount) * 100);
  }

  // Show the VAT breakdown whenever VAT was actually charged (don't depend on the rate field).
  const showVat = vatAmount > 0;

  // Receipt-type documents carry payment rows; show a "Payments Received" section like the PDF.
  const isReceipt = ['receipt', 'combined', 'credit_receipt'].includes(invoice.type);
  const paymentRows = (invoice.payments || []).filter(p => (parseFloat(p.amount) || 0) > 0 || p.method);
  const totalReceived = paymentRows.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
  const showSignatureImg = branding.showSignature !== false && !!branding.signature;

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Heebo', Arial, sans-serif; background: #f3f4f6; }
        @media print { .no-print { display: none !important; } body { background: white; } .invoice-card { box-shadow: none !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        table { border-collapse: collapse; width: 100%; border-radius: 8px; overflow: hidden; }
        th { padding: 11px 14px; text-align: right; font-size: 14px; font-weight: 600; letter-spacing: 0.3px; }
        td { padding: 10px 14px; text-align: right; }
        @media (max-width: 640px) {
          th { padding: 8px 8px; font-size: 12.5px; }
          td { padding: 8px 8px; font-size: 13px; }
        }
      `}</style>

      <div style={styles.container}>
        {/* Header */}
        <div style={{ ...styles.header, borderBottom: `1px solid ${primaryColor}33` }}>
          <div style={styles.headerLeft}>
            {branding.logo && (
              <img src={branding.logo} alt="לוגו" style={styles.logo} />
            )}
            <div style={{ background: `${primaryColor}14`, padding: '12px 16px', borderRadius: 10 }}>
              {branding.companyName && <div style={{ ...styles.companyName, color: primaryColor }}>{branding.companyName}</div>}
              {branding.companyAddress && <div style={styles.companyDetail}>{branding.companyAddress}</div>}
              {branding.companyPhone && <div style={styles.companyDetail}>{branding.companyPhone}</div>}
              {branding.companyEmail && <div style={styles.companyDetail}>{branding.companyEmail}</div>}
              {(branding.taxId || branding.companyId) && <div style={styles.companyDetail}>ח.פ / ע.מ: {branding.taxId || branding.companyId}</div>}
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.docTitle}>{docLabel}</div>
            {invoice.documentNumber && <div style={styles.docNumber}>מס׳ {stripDocPrefix(invoice.documentNumber)}</div>}
            {invoice.date && <div style={styles.docDate}>תאריך: {invoice.date}</div>}
            {invoice.dueDate && <div style={styles.docDate}>תאריך פירעון: {invoice.dueDate}</div>}
            <div style={{ ...styles.statusBadge, background: status.color }}>
              {status.he}
            </div>
          </div>
        </div>

        {/* Customer info */}
        {(invoice.contactName || invoice.contactPhone || invoice.contactEmail || invoice.contactCompany || invoice.contactTaxId) && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>פרטי לקוח</div>
            {invoice.contactName && <div style={styles.infoRow}><span style={styles.infoLabel}>שם:</span> {invoice.contactName}</div>}
            {invoice.contactPhone && <div style={styles.infoRow}><span style={styles.infoLabel}>טלפון:</span> {invoice.contactPhone}</div>}
            {invoice.contactEmail && <div style={styles.infoRow}><span style={styles.infoLabel}>מייל:</span> {invoice.contactEmail}</div>}
            {invoice.contactCompany && <div style={styles.infoRow}><span style={styles.infoLabel}>חברה:</span> {invoice.contactCompany}</div>}
            {invoice.contactTaxId && <div style={styles.infoRow}><span style={styles.infoLabel}>ח.פ / ת.ז:</span> {invoice.contactTaxId}</div>}
          </div>
        )}

        {/* Items table */}
        {items.length > 0 && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>פירוט ({items.length} פריטים)</div>
            <div style={{ overflowX: 'auto', maxHeight: items.length > 15 ? 500 : 'none', overflowY: items.length > 15 ? 'auto' : 'visible' }}>
              <table>
                <thead>
                  <tr style={{ background: primaryColor, color: 'white', position: items.length > 15 ? 'sticky' : 'static', top: 0, zIndex: 1 }}>
                    <th style={{ textAlign: 'right', whiteSpace: 'nowrap', width: 90 }}>מק"ט</th>
                    <th style={{ textAlign: 'right' }}>תיאור</th>
                    <th style={{ textAlign: 'center', whiteSpace: 'nowrap', width: 70 }}>כמות</th>
                    <th style={{ textAlign: 'center', whiteSpace: 'nowrap', width: 120 }}>מחיר יחידה</th>
                    <th style={{ textAlign: 'center', whiteSpace: 'nowrap', width: 110 }}>סה״כ</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const qty = parseFloat(item.quantity) || 1;
                    const price = parseFloat(item.unitPrice) || 0;
                    const lineTotal = qty * price;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                        <td style={{ whiteSpace: 'nowrap', color: '#6b7280' }}>{item.sku || '—'}</td>
                        <td>{item.description || item.name || ''}</td>
                        <td style={{ textAlign: 'center' }}>{qty}</td>
                        <td style={{ textAlign: 'center' }}>{currency}{formatNum(price)}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{currency}{formatNum(lineTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Totals */}
        <div style={styles.totalsWrapper}>
          <div style={styles.totals}>
            {discount > 0 && (
              <>
                <div style={styles.totalRow}>
                  <span>סכום לפני הנחה:</span>
                  <span>{currency}{formatNum(subtotal + discount)}</span>
                </div>
                <div style={{ ...styles.totalRow, color: '#10b981' }}>
                  <span>הנחה:</span>
                  <span>-{currency}{formatNum(discount)}</span>
                </div>
              </>
            )}
            {showVat && (
              <>
                <div style={styles.totalRow}>
                  <span>סכום לפני מע״מ:</span>
                  <span>{currency}{formatNum(total - vatAmount)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>מע״מ ({vatRate}%):</span>
                  <span>{currency}{formatNum(vatAmount)}</span>
                </div>
              </>
            )}
            <div style={{ ...styles.totalRow, ...styles.grandTotal, borderTop: `2px solid ${primaryColor}`, color: primaryColor }}>
              <span>סה״כ לתשלום:</span>
              <span>{currency}{formatNum(total)}</span>
            </div>
          </div>
        </div>

        {/* Payments received (structured) — mirrors the PDF's "פירוט תקבולים" table */}
        {isReceipt && paymentRows.length > 0 && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>💳 פירוט תקבולים</div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr style={{ background: primaryColor, color: 'white' }}>
                    <th style={{ textAlign: 'right' }}>אמצעי תשלום</th>
                    <th style={{ textAlign: 'right' }}>פירוט</th>
                    <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>תאריך</th>
                    <th style={{ textAlign: 'center', whiteSpace: 'nowrap', width: 110 }}>סכום</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.map((pmt, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td>{PAYMENT_METHODS[pmt.method] || pmt.method || '—'}</td>
                      <td>{[pmt.reference, pmt.bank, pmt.account].filter(Boolean).join(' · ') || '—'}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{pmt.date || '—'}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{(CURRENCY_SYMBOLS[pmt.currency] || currency)}{formatNum(pmt.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ ...styles.totalsWrapper, padding: '12px 0 0' }}>
              <div style={styles.totals}>
                <div style={{ ...styles.totalRow, ...styles.grandTotal, borderTop: `2px solid ${primaryColor}`, color: primaryColor }}>
                  <span>סה״כ שולם:</span>
                  <span>{currency}{formatNum(totalReceived)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legacy single payment-method fallback */}
        {(!isReceipt || paymentRows.length === 0) && invoice.paymentMethod && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>אמצעי תשלום</div>
            <div style={styles.infoRow}>{PAYMENT_METHODS[invoice.paymentMethod] || invoice.paymentMethod}</div>
          </div>
        )}

        {/* Bank details */}
        {(branding.bankAccount || branding.bankName) && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>🏦 פרטי בנק לתשלום</div>
            {branding.bankName && <div style={styles.infoRow}>בנק: {branding.bankName}{branding.bankBranch ? ` · סניף: ${branding.bankBranch}` : ''}</div>}
            {branding.bankAccount && <div style={styles.infoRow}>חשבון: {branding.bankAccount}</div>}
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>הערות</div>
            <div style={styles.noteText}>
              {invoice.notes.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < invoice.notes.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Digital Signature — minimal & elegant (Green-Invoice style), matches the editor/PDF */}
        {invoice.isLocked && (
          <div style={{ margin: '22px 0 4px', paddingTop: 10, borderTop: '1px solid #eef0f2', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: primaryColor, lineHeight: 1 }}>🔒</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: primaryColor }}>חתום דיגיטלית</div>
              <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 1 }}>
                מסמך ממוחשב חתום דיגיטלית ומאובטח מפני שינויים · הופק על ידי <a href={GAMBOT_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#2e6155', fontWeight: 700, textDecoration: 'none' }}>Gambot</a>
              </div>
            </div>
          </div>
        )}

        {/* Handwritten/graphic signature from the document design settings */}
        {showSignatureImg && (
          <div style={{ ...styles.section, textAlign: 'left' }}>
            <img src={branding.signature} alt="חתימה" style={{ height: 60, maxWidth: 220, objectFit: 'contain' }} />
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{branding.signatureName || branding.companyName || ''}</div>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <button
            className="no-print"
            onClick={() => window.print()}
            style={{ border: 'none', background: primaryColor, color: '#fff', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14, marginLeft: 12 }}
          >
            🖨️ הדפס / שמור PDF
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f3f4f6',
    padding: '24px clamp(8px, 3vw, 16px)',
    fontFamily: "'Heebo', Arial, sans-serif",
    direction: 'rtl',
  },
  container: {
    maxWidth: 860,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '28px clamp(16px, 4vw, 32px)',
    gap: 16,
    flexWrap: 'wrap',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
  },
  headerRight: {
    textAlign: 'left',
    minWidth: 160,
  },
  logo: {
    maxHeight: 72,
    maxWidth: 120,
    objectFit: 'contain',
    borderRadius: 8,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 1.6,
  },
  docTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 4,
  },
  docNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  docDate: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 4,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    color: 'white',
    fontSize: 13,
    fontWeight: 600,
    marginTop: 6,
  },
  section: {
    padding: '20px clamp(16px, 4vw, 32px)',
    borderBottom: '1px solid #f1f5f9',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  infoRow: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 1.8,
  },
  infoLabel: {
    fontWeight: 600,
    color: '#6b7280',
  },
  totalsWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '20px clamp(16px, 4vw, 32px)',
  },
  totals: {
    width: '100%',
    maxWidth: 380,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    fontSize: 15,
    color: '#374151',
  },
  grandTotal: {
    fontWeight: 700,
    fontSize: 18,
    paddingTop: 12,
    marginTop: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 1.7,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px clamp(16px, 4vw, 32px)',
    borderTop: '1px solid #f1f5f9',
    gap: 16,
    flexWrap: 'wrap',
  },
  poweredLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    textDecoration: 'none',
    opacity: 0.8,
  },
  centered: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Heebo', Arial, sans-serif",
  },
  spinner: {
    width: 48,
    height: 48,
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #2d6a4f',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};
