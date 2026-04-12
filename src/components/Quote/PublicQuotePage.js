'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

const CURRENCY_SYMBOLS = { ILS: '₪', USD: '$', EUR: '€', GBP: '£' };

const API_BASE = 'https://gambot.azurewebsites.net/api/Webhooks';

function renderTextWithLinks(text, linkColor = '#2e6155') {
  if (!text) return null;
  const markdownLink = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const rawUrl = /(?<!\]\()https?:\/\/[^\s\])"'>]+/g;
  const combined = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s\])"'>]+)/g;
  const parts = [];
  let last = 0;
  let match;
  combined.lastIndex = 0;
  while ((match = combined.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1] && match[2]) {
      parts.push(<a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer" style={{ color: linkColor, textDecoration: 'underline', fontWeight: 500 }}>{match[1]}</a>);
    } else {
      parts.push(<a key={match.index} href={match[3]} target="_blank" rel="noopener noreferrer" style={{ color: linkColor, textDecoration: 'underline', fontWeight: 500 }}>{match[3]}</a>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const STATUS_LABELS = {
  draft: { he: 'טיוטה', color: '#6b7280' },
  sent: { he: 'נשלחה', color: '#3b82f6' },
  accepted: { he: 'אושרה', color: '#10b981' },
  awaiting_payment: { he: 'ממתין לתשלום', color: '#f59e0b' },
  paid: { he: 'שולם', color: '#059669' },
  rejected: { he: 'נדחתה', color: '#ef4444' },
  expired: { he: 'פגה תוקף', color: '#9ca3af' },
};

export default function PublicQuotePage() {
  const searchParams = useSearchParams();
  const org = searchParams?.get('org');
  const quoteId = searchParams?.get('id');

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'quote-page-hide';
    style.textContent = 'nav, footer { display: none !important; } main { padding: 0 !important; margin: 0 !important; }';
    document.head.appendChild(style);
    return () => document.getElementById('quote-page-hide')?.remove();
  }, []);

  useEffect(() => {
    if (!org || !quoteId) {
      setError('קישור לא תקין');
      setLoading(false);
      return;
    }
    fetchQuote();
  }, [org, quoteId]);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/GetPublicQuoteById?org=${encodeURIComponent(org)}&quoteId=${encodeURIComponent(quoteId)}`);
      const data = res.data?.data || res.data;
      if (!data) { setError('הצעת המחיר לא נמצאה'); return; }
      setQuote(data);
      const customerName = data.contactName || '';
      const quoteNum = data.quoteNumber || '';
      document.title = `הצעת מחיר${customerName ? ` ל-${customerName}` : ''}${quoteNum ? ` | ${quoteNum}` : ''}`;
    } catch (err) {
      setError('הצעת המחיר לא נמצאה או שהקישור אינו תקין');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner}></div>
      <p style={{ color: '#555', marginTop: 16 }}>טוען הצעת מחיר...</p>
    </div>
  );

  if (error) return (
    <div style={styles.centered}>
      <img src="/new_logo.png" alt="Gambot" style={{ height: 50, marginBottom: 24 }} />
      <p style={{ color: '#ef4444', fontSize: 18 }}>{error}</p>
    </div>
  );

  if (!quote) return null;

  const branding = quote.branding || {};
  const primaryColor = branding.primaryColor || '#2e6155';
  const currency = CURRENCY_SYMBOLS[quote.currency] || '₪';
  const items = quote.items || [];
  const status = STATUS_LABELS[quote.status] || { he: quote.status || '', color: '#6b7280' };

  const formatNum = (n) => {
    const num = parseFloat(n) || 0;
    return num.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const subtotal = parseFloat(quote.subtotal) || 0;
  const discountAmount = parseFloat(quote.discountAmount) || 0;
  const taxAmount = parseFloat(quote.taxAmount) || 0;
  const total = parseFloat(quote.total) || 0;
  const taxRate = parseFloat(quote.taxRate) || 0;
  const showTax = taxRate > 0 && taxAmount > 0;

  return (
    <div style={styles.page}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Heebo', Arial, sans-serif; background: #f3f4f6; }
        @media print { .no-print { display: none !important; } body { background: white; } .quote-card { box-shadow: none !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        table { border-collapse: collapse; width: 100%; border-radius: 8px; overflow: hidden; }
        thead tr { border-radius: 8px; }
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
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.quoteTitle}>{quote.title || 'הצעת מחיר'}</div>
            {quote.quoteNumber && <div style={styles.quoteNumber}>מס׳ {quote.quoteNumber}</div>}
            {quote.date && <div style={styles.quoteDate}>{quote.date}</div>}
            <div style={{ ...styles.statusBadge, background: status.color }}>
              {status.he}
            </div>
          </div>
        </div>

        {/* Customer info */}
        {(quote.contactName || quote.contactPhone || quote.contactEmail) && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>פרטי לקוח</div>
            {quote.contactName && <div style={styles.infoRow}><span style={styles.infoLabel}>שם:</span> {quote.contactName}</div>}
            {quote.contactPhone && <div style={styles.infoRow}><span style={styles.infoLabel}>טלפון:</span> {quote.contactPhone}</div>}
            {quote.contactEmail && <div style={styles.infoRow}><span style={styles.infoLabel}>מייל:</span> {quote.contactEmail}</div>}
          </div>
        )}

        {/* Items table */}
        <div style={styles.section}>
          <div style={{ ...styles.sectionTitle, color: primaryColor }}>פירוט</div>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr style={{ background: primaryColor, color: 'white' }}>
                  <th style={{ textAlign: 'right' }}>תיאור</th>
                  <th style={{ textAlign: 'center', whiteSpace: 'nowrap', width: 70 }}>כמות</th>
                  <th style={{ textAlign: 'center', whiteSpace: 'nowrap', width: 120 }}>מחיר יחידה</th>
                  {items.some(i => i.discount) && <th style={{ textAlign: 'center', width: 80 }}>הנחה</th>}
                  <th style={{ textAlign: 'center', whiteSpace: 'nowrap', width: 110 }}>סה״כ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  if (item.type === 'section') {
                    return (
                      <tr key={idx}>
                        <td colSpan={5} style={{ background: '#f8fafc', fontWeight: 700, color: primaryColor, paddingTop: 16, paddingBottom: 8, borderBottom: `2px solid ${primaryColor}20` }}>
                          {item.description}
                        </td>
                      </tr>
                    );
                  }
                  const qty = parseFloat(item.quantity) || 1;
                  const price = parseFloat(item.unitPrice) || 0;
                  const disc = parseFloat(item.discount) || 0;
                  const lineTotal = qty * price * (1 - disc / 100);
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb', background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td>{item.description || ''}</td>
                      <td style={{ textAlign: 'center' }}>{qty}</td>
                      <td style={{ textAlign: 'center' }}>{currency}{formatNum(price)}</td>
                      {items.some(i => i.discount) && <td style={{ textAlign: 'center' }}>{disc ? `${disc}%` : '—'}</td>}
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{currency}{formatNum(lineTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div style={styles.totalsWrapper}>
          <div style={styles.totals}>
            {discountAmount > 0 && (
              <>
                <div style={styles.totalRow}>
                  <span>סכום לפני הנחה:</span>
                  <span>{currency}{formatNum(subtotal + discountAmount)}</span>
                </div>
                <div style={{ ...styles.totalRow, color: '#10b981' }}>
                  <span>הנחה:</span>
                  <span>-{currency}{formatNum(discountAmount)}</span>
                </div>
              </>
            )}
            {showTax && (
              <>
                <div style={styles.totalRow}>
                  <span>סכום לפני מע״מ:</span>
                  <span>{currency}{formatNum(total - taxAmount)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>מע״מ ({taxRate}%):</span>
                  <span>{currency}{formatNum(taxAmount)}</span>
                </div>
              </>
            )}
            <div style={{ ...styles.totalRow, ...styles.grandTotal, borderTop: `2px solid ${primaryColor}`, color: primaryColor }}>
              <span>סה״כ לתשלום:</span>
              <span>{currency}{formatNum(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>הערות</div>
            <div style={styles.noteText}>
              {quote.notes.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {renderTextWithLinks(line, primaryColor)}
                  {i < quote.notes.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Terms */}
        {quote.terms && (
          <div style={styles.section}>
            <div style={{ ...styles.sectionTitle, color: primaryColor }}>תנאים</div>
            <div style={styles.noteText}>
              {quote.terms.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {renderTextWithLinks(line, primaryColor)}
                  {i < quote.terms.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
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
  quoteTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 4,
  },
  quoteNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  quoteDate: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 8,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    color: 'white',
    fontSize: 13,
    fontWeight: 600,
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
  },
  poweredLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    textDecoration: 'none',
    opacity: 0.8,
    transition: 'opacity 0.2s',
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
