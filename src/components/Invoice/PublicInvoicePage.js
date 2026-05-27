'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const CURRENCY_SYMBOLS = { ILS: '₪', USD: '$', EUR: '€', GBP: '£' };

const API_BASE = 'https://gambot.azurewebsites.net/api/Webhooks';

const DOC_TYPE_LABELS = {
  invoice: 'חשבונית מס',
  receipt: 'קבלה',
  invoice_receipt: 'חשבונית מס / קבלה',
  credit_note: 'חשבונית זיכוי',
  delivery_note: 'תעודת משלוח',
  proforma: 'חשבון עסקה',
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
      const docNum = data.documentNumber || '';
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

  const subtotal = parseFloat(invoice.subtotal) || 0;
  const discount = parseFloat(invoice.discount) || 0;
  const vatAmount = parseFloat(invoice.vatAmount) || parseFloat(invoice.taxAmount) || 0;
  const total = parseFloat(invoice.total) || 0;
  const vatRate = parseFloat(invoice.vatRate) || parseFloat(invoice.taxRate) || 0;
  const showVat = vatRate > 0 && vatAmount > 0;

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
      `}</style>

      <div style={styles.container}>
        {/* Header */}
        <div style={{ ...styles.header, borderBottom: `4px solid ${primaryColor}` }}>
          <div style={styles.headerLeft}>
            {branding.logo && (
              <img src={branding.logo} alt="לוגו" style={styles.logo} />
            )}
            <div>
              {branding.companyName && <div style={{ ...styles.companyName, color: primaryColor }}>{branding.companyName}</div>}
              {branding.companyAddress && <div style={styles.companyDetail}>{branding.companyAddress}</div>}
              {branding.companyPhone && <div style={styles.companyDetail}>{branding.companyPhone}</div>}
              {branding.companyEmail && <div style={styles.companyDetail}>{branding.companyEmail}</div>}
              {branding.companyId && <div style={styles.companyDetail}>ח.פ / ע.מ: {branding.companyId}</div>}
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.docTitle}>{docLabel}</div>
            {invoice.documentNumber && <div style={styles.docNumber}>מס׳ {invoice.documentNumber}</div>}
            {invoice.date && <div style={styles.docDate}>תאריך: {invoice.date}</div>}
            {invoice.dueDate && <div style={styles.docDate}>תאריך פירעון: {invoice.dueDate}</div>}
            <div style={{ ...styles.statusBadge, background: status.color }}>
              {status.he}
            </div>
          </div>
        </div>

        {/* Customer info */}
        {(invoice.contactName || invoice.contactPhone || invoice.contactEmail) && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>פרטי לקוח</div>
            {invoice.contactName && <div style={styles.infoRow}><span style={styles.infoLabel}>שם:</span> {invoice.contactName}</div>}
            {invoice.contactPhone && <div style={styles.infoRow}><span style={styles.infoLabel}>טלפון:</span> {invoice.contactPhone}</div>}
            {invoice.contactEmail && <div style={styles.infoRow}><span style={styles.infoLabel}>מייל:</span> {invoice.contactEmail}</div>}
            {invoice.contactCompany && <div style={styles.infoRow}><span style={styles.infoLabel}>חברה:</span> {invoice.contactCompany}</div>}
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

        {/* Payment method */}
        {invoice.paymentMethod && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>אמצעי תשלום</div>
            <div style={styles.infoRow}>{invoice.paymentMethod}</div>
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

        {/* Footer */}
        <div style={styles.footer}>
          <button
            className="no-print"
            onClick={() => window.print()}
            style={{ border: 'none', background: primaryColor, color: '#fff', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14, marginLeft: 12 }}
          >
            🖨️ הדפס / שמור PDF
          </button>
          <a href="https://www.gambot.co.il" target="_blank" rel="noopener noreferrer" style={styles.poweredLink}>
            <img src="/new_logo.png" alt="Gambot" style={{ height: 26, opacity: 0.55 }} />
            <span style={{ color: '#9ca3af', fontSize: 12, marginRight: 6 }}>Powered by Gambot · WhatsApp CRM</span>
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f3f4f6',
    padding: '24px 16px',
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
    padding: '28px 32px',
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
    padding: '20px 32px',
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
    padding: '20px 32px',
  },
  totals: {
    minWidth: 280,
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
    padding: '20px 32px',
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
