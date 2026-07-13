'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  const [lightboxImages, setLightboxImages] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [actionsOpen, setActionsOpen] = useState(false);

  const openLightbox = useCallback((images) => {
    if (!images || images.length === 0) return;
    setLightboxImages(images);
    setLightboxIndex(0);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxImages(null);
    setLightboxIndex(0);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'quote-page-hide';
    style.textContent = 'nav, footer { display: none !important; } main { padding: 0 !important; margin: 0 !important; }';
    document.head.appendChild(style);
    return () => document.getElementById('quote-page-hide')?.remove();
  }, []);

  const fetchQuote = useCallback(async () => {
    if (!org || !quoteId) {
      setError('קישור לא תקין');
      setLoading(false);
      return;
    }
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
  }, [org, quoteId]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

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
  const hasAnyImage = items.some(i => i.image || (i.images && i.images.length > 0));
  const status = STATUS_LABELS[quote.status] || { he: quote.status || '', color: '#6b7280' };

  const formatNum = (n) => {
    const num = parseFloat(n) || 0;
    return num.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // ── Totals ── Mirror the internal QuoteForm/PDF model exactly so the public quote reconciles with
  // it (and the VAT/discount breakdown always shows):
  //   subtotal      = real line items only (type 'item')
  //   discounts     = global discount (quote.discount) + discount LINE items (type 'discount')
  //   afterDiscount = subtotal − discounts                → the "before VAT" amount
  //   VAT           = afterDiscount × rate
  //   total         = afterDiscount + VAT                 → the "after VAT" amount
  // Discount lines (type 'discount') must NOT inflate the subtotal — they are subtracted below.
  const realItems = items.filter(i => !i.type || i.type === 'item');
  const discountItems = items.filter(i => i.type === 'discount');

  const computedSubtotal = realItems.reduce((s, i) => {
    const qty = parseFloat(i.quantity) || 0;
    const price = parseFloat(i.unitPrice) || 0;
    const disc = parseFloat(i.discount) || 0;
    return s + qty * price * (1 - disc / 100);
  }, 0);
  const lineDiscounts = discountItems.reduce(
    (s, i) => s + (parseFloat(i.quantity) || 1) * Math.abs(parseFloat(i.unitPrice) || 0),
    0
  );

  // Prefer computed-from-items; fall back to the stored subtotal for quotes with no line items.
  const subtotal = computedSubtotal > 0 ? computedSubtotal : (parseFloat(quote.subtotal) || 0);

  const globalDiscount = quote.discountType === 'percent'
    ? subtotal * ((parseFloat(quote.discount) || 0) / 100)
    : (parseFloat(quote.discount) || 0);
  let discountAmount = globalDiscount + lineDiscounts;
  // Fallback for AI/automation quotes that only saved discountAmount (no discount line items).
  if (discountAmount === 0) discountAmount = parseFloat(quote.discountAmount) || 0;

  const afterDiscount = Math.max(0, subtotal - discountAmount);

  // VAT rate: editor saves it under `tax`; some docs use `taxRate`.
  let taxRate = parseFloat(quote.taxRate ?? quote.tax) || 0;
  let taxAmount = taxRate > 0 ? afterDiscount * taxRate / 100 : 0;
  // No rate but a VAT amount was stored → use it.
  if (taxAmount <= 0) {
    const storedTax = parseFloat(quote.taxAmount);
    if (!isNaN(storedTax) && storedTax > 0) taxAmount = storedTax;
  }

  let total = afterDiscount + taxAmount;
  const storedTotal = parseFloat(quote.total);
  // Last-resort: a stored total that's larger than the discounted amount implies VAT we couldn't
  // derive (AI/automation path that only saved `total`) — back it out so the breakdown shows.
  if (taxAmount <= 0 && !isNaN(storedTotal) && storedTotal > afterDiscount + 0.01) {
    taxAmount = Math.round((storedTotal - afterDiscount) * 100) / 100;
    total = storedTotal;
  }
  // Derive the rate from amounts when we have an amount but no rate (for the "מע״מ (X%)" label).
  if (!taxRate && taxAmount > 0 && afterDiscount > 0) {
    taxRate = Math.round((taxAmount / afterDiscount) * 100);
  }

  // Show the VAT breakdown whenever VAT was actually charged (don't depend on the rate field).
  const showTax = taxAmount > 0;
  const hasDiscount = discountAmount > 0;

  const handleDownloadPdf = () => {
    setActionsOpen(false);
    window.print();
  };

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

      {/* Floating Actions Button */}
      <div className="no-print" style={styles.fabContainer}>
        <button
          onClick={() => setActionsOpen(!actionsOpen)}
          style={{ ...styles.fabButton, background: primaryColor }}
        >
          {actionsOpen ? '✕' : '⚡'}
          <span style={{ fontSize: 12, fontWeight: 600 }}>פעולות</span>
        </button>
        {actionsOpen && (
          <div style={styles.fabMenu}>
            <button onClick={handleDownloadPdf} style={styles.fabMenuItem}>
              <span>📥</span> הורד PDF
            </button>
            <button onClick={() => { setActionsOpen(false); window.print(); }} style={styles.fabMenuItem}>
              <span>🖨️</span> הדפס
            </button>
            {quote.contactPhone && (
              <button
                onClick={() => { setActionsOpen(false); window.open(`https://wa.me/${quote.contactPhone.replace(/[^0-9]/g, '')}`, '_blank'); }}
                style={styles.fabMenuItem}
              >
                <span>💬</span> WhatsApp
              </button>
            )}
          </div>
        )}
      </div>

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
                  {hasAnyImage && <th style={{ width: 50 }}></th>}
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
                        <td colSpan={hasAnyImage ? 6 : 5} style={{ background: '#f8fafc', fontWeight: 700, color: primaryColor, paddingTop: 16, paddingBottom: 8, borderBottom: `2px solid ${primaryColor}20` }}>
                          {item.description}
                        </td>
                      </tr>
                    );
                  }
                  const isDiscountRow = item.type === 'discount';
                  const qty = parseFloat(item.quantity) || 1;
                  const price = parseFloat(item.unitPrice) || 0;
                  const disc = parseFloat(item.discount) || 0;
                  // A discount line is a negative amount (qty × |unitPrice|); a normal item applies its % discount.
                  const lineTotal = isDiscountRow
                    ? -(qty * Math.abs(price))
                    : qty * price * (1 - disc / 100);
                  const itemImages = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
                  const hasMultiple = itemImages.length > 1;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb', background: isDiscountRow ? '#fef2f2' : (idx % 2 === 0 ? '#fff' : '#f9fafb') }}>
                      {hasAnyImage && (
                        <td style={{ textAlign: 'center', padding: '4px', width: 50 }}>
                          {itemImages.length > 0 && (
                            <div
                              style={{ position: 'relative', display: 'inline-block', cursor: hasMultiple ? 'pointer' : 'default' }}
                              onClick={() => hasMultiple && openLightbox(itemImages)}
                            >
                              <img src={itemImages[0]} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                              {hasMultiple && (
                                <span style={{
                                  position: 'absolute', bottom: -2, right: -2,
                                  background: primaryColor, color: '#fff', fontSize: 9, fontWeight: 700,
                                  width: 16, height: 16, borderRadius: '50%',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  border: '1.5px solid white'
                                }}>
                                  {itemImages.length}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      )}
                      <td style={isDiscountRow ? { color: '#dc2626' } : undefined}>{item.description || ''}</td>
                      <td style={{ textAlign: 'center' }}>{qty}</td>
                      <td style={{ textAlign: 'center', color: isDiscountRow ? '#dc2626' : undefined }}>
                        {isDiscountRow ? `-${currency}${formatNum(Math.abs(price))}` : `${currency}${formatNum(price)}`}
                      </td>
                      {items.some(i => i.discount) && <td style={{ textAlign: 'center' }}>{disc ? `${disc}%` : '—'}</td>}
                      <td style={{ textAlign: 'center', fontWeight: 600, color: isDiscountRow ? '#dc2626' : undefined }}>
                        {isDiscountRow ? `-${currency}${formatNum(Math.abs(lineTotal))}` : `${currency}${formatNum(lineTotal)}`}
                      </td>
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
            {hasDiscount && (
              <>
                <div style={styles.totalRow}>
                  <span>סכום ביניים:</span>
                  <span>{currency}{formatNum(subtotal)}</span>
                </div>
                <div style={{ ...styles.totalRow, color: '#dc2626' }}>
                  <span>הנחה:</span>
                  <span>-{currency}{formatNum(discountAmount)}</span>
                </div>
              </>
            )}
            {showTax && (
              <>
                <div style={styles.totalRow}>
                  <span>סכום לפני מע״מ:</span>
                  <span>{currency}{formatNum(afterDiscount)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>מע״מ ({taxRate}%):</span>
                  <span>{currency}{formatNum(taxAmount)}</span>
                </div>
              </>
            )}
            <div style={{ ...styles.totalRow, ...styles.grandTotal, borderTop: `2px solid ${primaryColor}`, color: primaryColor }}>
              <span>{showTax ? 'סה״כ לתשלום (כולל מע״מ):' : 'סה״כ לתשלום:'}</span>
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

        {/* Bank Details */}
        {quote.showBankDetails && quote.bankDetails && (quote.bankDetails.bankName || quote.bankDetails.accountNumber) && (
          <div style={{ ...styles.section, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '16px 20px' }}>
            <div style={{ ...styles.sectionTitle, color: '#16a34a' }}>🏦 פרטי בנק לתשלום</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 6 }}>
              <tbody>
                {quote.bankDetails.bankName && (
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 600, width: 120, color: '#374151' }}>שם הבנק:</td>
                    <td style={{ padding: '4px 0', color: '#1f2937' }}>{quote.bankDetails.bankName}</td>
                  </tr>
                )}
                {quote.bankDetails.branchNumber && (
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 600, color: '#374151' }}>מספר סניף:</td>
                    <td style={{ padding: '4px 0', color: '#1f2937' }}>{quote.bankDetails.branchNumber}</td>
                  </tr>
                )}
                {quote.bankDetails.accountNumber && (
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 600, color: '#374151' }}>מספר חשבון:</td>
                    <td style={{ padding: '4px 0', color: '#1f2937', fontWeight: 700 }}>{quote.bankDetails.accountNumber}</td>
                  </tr>
                )}
                {quote.bankDetails.accountName && (
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 600, color: '#374151' }}>על שם:</td>
                    <td style={{ padding: '4px 0', color: '#1f2937' }}>{quote.bankDetails.accountName}</td>
                  </tr>
                )}
              </tbody>
            </table>
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

      {/* Image Lightbox */}
      {lightboxImages && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16
          }}
          onClick={closeLightbox}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '75vh' }} onClick={e => e.stopPropagation()}>
            <img
              src={lightboxImages[lightboxIndex]}
              alt=""
              style={{ maxWidth: '90vw', maxHeight: '75vh', objectFit: 'contain', borderRadius: 8 }}
            />
            {lightboxImages.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length)}
                  style={{
                    position: 'absolute', top: '50%', right: -50, transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                    width: 36, height: 36, fontSize: 20, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontWeight: 700
                  }}
                >›</button>
                <button
                  onClick={() => setLightboxIndex(i => (i + 1) % lightboxImages.length)}
                  style={{
                    position: 'absolute', top: '50%', left: -50, transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                    width: 36, height: 36, fontSize: 20, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontWeight: 700
                  }}
                >‹</button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {lightboxImages.length > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
              {lightboxImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setLightboxIndex(i)}
                  style={{
                    width: 56, height: 56, objectFit: 'cover', borderRadius: 6, cursor: 'pointer',
                    border: i === lightboxIndex ? `3px solid ${primaryColor}` : '3px solid transparent',
                    opacity: i === lightboxIndex ? 1 : 0.6, transition: 'all 0.15s'
                  }}
                />
              ))}
            </div>
          )}
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: 20, left: 20,
              background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
              width: 36, height: 36, fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
            }}
          >✕</button>
          <div style={{ color: '#fff', fontSize: 13, opacity: 0.7 }}>
            {lightboxIndex + 1} / {lightboxImages.length}
          </div>
        </div>
      )}
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
  fabContainer: {
    position: 'fixed',
    bottom: 24,
    left: 24,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'flex-start',
    gap: 8,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: 'none',
    color: 'white',
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
  },
  fabMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '8px 0',
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    border: '1px solid #e5e7eb',
    minWidth: 150,
    overflow: 'hidden',
  },
  fabMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 18px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    fontFamily: "'Heebo', Arial, sans-serif",
    textAlign: 'right',
    direction: 'rtl',
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
  },
};
