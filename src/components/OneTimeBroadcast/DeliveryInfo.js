'use client';
import React from 'react';

// Message-building step: what share of the list the WhatsApp message reaches, by message type (service vs marketing), and what
// happens to everyone it does not reach (SMS). The bars are an illustration of the principle, not a measured rate.
const GREEN = '#16a34a';
const AMBER = '#f59e0b';

function Bar({ title, sub, okPct, okLabel, restLabel }) {
  const restPct = 100 - okPct;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
        <b style={{ fontSize: 14 }}>{title}</b>
        <span style={{ fontSize: 12, color: '#64748b' }}>{sub}</span>
      </div>
      <div style={{ display: 'flex', height: 26, borderRadius: 8, overflow: 'hidden', background: '#e2e8f0' }} role="img" aria-label={`${title}: ${okLabel}; ${restLabel}`}>
        <div style={{ width: `${okPct}%`, background: GREEN, color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>
          {okLabel}
        </div>
        <div style={{ width: `${restPct}%`, background: AMBER, minWidth: 6 }} />
      </div>
      <div style={{ fontSize: 12, color: '#92400e', marginTop: 4 }}>
        <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: AMBER, marginInlineEnd: 6 }} />
        {restLabel}
      </div>
    </div>
  );
}

export default function DeliveryInfo() {
  return (
    <div className="otb-note" style={{ margin: '14px 0', padding: '14px 16px', textAlign: 'start' }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>📊 כמה מהרשימה תקבל את ההודעה בוואטסאפ?</div>

      <Bar
        title="הודעת שירות"
        sub="עדכון, תזכורת, אישור, מידע ללקוח קיים"
        okPct={97}
        okLabel="100% מי שיש לו וואטסאפ"
        restLabel="רק מספרים שאין להם וואטסאפ — לא יקבלו בוואטסאפ"
      />
      <Bar
        title="הודעה שיווקית"
        sub="מבצע, קידום, הצעה מסחרית"
        okPct={90}
        okLabel="רוב הרשימה"
        restLabel="אחוזים בודדים לא יישלחו (מגבלות של Meta על הודעות שיווק, או שאין וואטסאפ)"
      />

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: '#ecfdf5', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 10px', fontSize: 13, color: '#14532d' }}>
        <span aria-hidden="true">📩</span>
        <span><b>בכל מקרה</b> — מי שההודעה לא נשלחה אליו בוואטסאפ, אנחנו שולחים לו אותה ב-SMS.</span>
      </div>

      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
        הגרף להמחשה בלבד. סוג ההודעה נקבע על ידי Meta לפי תוכן ההודעה, ולא לפי בחירה בטופס.
      </div>
    </div>
  );
}
