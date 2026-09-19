'use client';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  API_BASE, API_BASE_FALLBACK, API_INTRO, API_SECTIONS, API_SCOPES, API_INBOUND, API_MCP, DEV_GUIDE_TX,
} from '@/lib/apiDocsData';
import styles from './DeveloperGuideContent.module.css';

function CodeBlock({ code, label, copyLabel, copiedLabel }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <div className={styles.codeWrap} dir="ltr">
      {label && <span className={styles.codeLabel}>{label}</span>}
      <button type="button" className={styles.copyBtn} onClick={onCopy}>
        {copied ? copiedLabel : copyLabel}
      </button>
      <pre className={styles.code}><code>{code}</code></pre>
    </div>
  );
}

function MethodBadge({ method }) {
  return <span className={`${styles.method} ${styles[`m_${method}`] || ''}`}>{method}</span>;
}

function EndpointCard({ endpoint, lang, tx }) {
  const anchor = `${endpoint.method}-${endpoint.path}`.replace(/[^\w]+/g, '-').toLowerCase();
  return (
    <div className={styles.endpoint} id={anchor}>
      <div className={styles.endpointHead} dir="ltr">
        <MethodBadge method={endpoint.method} />
        <code className={styles.path}>{endpoint.path}</code>
        {endpoint.scope && <span className={styles.scope}>{tx.scopeLabel}: {endpoint.scope}</span>}
      </div>
      <p className={styles.summary}>{endpoint.summary[lang]}</p>

      {endpoint.params?.length > 0 && (
        <div className={styles.paramsWrap}>
          <div className={styles.subLabel}>{tx.params}</div>
          <div className={styles.tableScroll}>
            <table className={styles.paramsTable}>
              <thead>
                <tr>
                  <th>{tx.name}</th>
                  <th>{tx.type}</th>
                  <th>{tx.location}</th>
                  <th>{tx.required}</th>
                  <th>{tx.description}</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.params.map((p) => (
                  <tr key={p.name}>
                    <td><code>{p.name}</code></td>
                    <td className={styles.mono}>{p.type}</td>
                    <td className={styles.mono}>{p.in}</td>
                    <td>{p.required ? tx.yes : tx.no}</td>
                    <td>{p.desc[lang]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {endpoint.request && (
        <CodeBlock code={endpoint.request} label={tx.requestBody} copyLabel={tx.copy} copiedLabel={tx.copied} />
      )}
      {endpoint.curl && (
        <CodeBlock code={endpoint.curl} label={tx.exampleRequest} copyLabel={tx.copy} copiedLabel={tx.copied} />
      )}
      {endpoint.response && (
        <CodeBlock code={endpoint.response} label={tx.exampleResponse} copyLabel={tx.copy} copiedLabel={tx.copied} />
      )}

      {endpoint.notes && (
        <p className={styles.endpointNote}>{endpoint.notes[lang]}</p>
      )}

      {endpoint.examples?.length > 0 && (
        <div className={styles.examplesWrap}>
          <div className={styles.subLabel}>{tx.moreExamples}</div>
          {endpoint.examples.map((ex, i) => (
            <CodeBlock
              key={i}
              code={ex.code}
              label={ex.label ? ex.label[lang] : undefined}
              copyLabel={tx.copy}
              copiedLabel={tx.copied}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DeveloperGuideContent() {
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage === 'en' ? 'en' : 'he';
  const dir = lang === 'he' ? 'rtl' : 'ltr';
  const tx = DEV_GUIDE_TX[lang];
  const intro = API_INTRO;

  return (
    <div style={{ paddingTop: '68px' }} dir={dir}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.badge}>{tx.badge}</div>
          <h1>{tx.title}</h1>
          <p>{tx.sub}</p>
        </div>
      </section>

      <div className={styles.layout}>
        {/* Sidebar TOC */}
        <aside className={styles.sidebar}>
          <nav className={styles.toc}>
            <div className={styles.tocTitle}>{tx.onThisPage}</div>
            <a href="#authentication" className={styles.tocLink}>{intro.auth.title[lang]}</a>
            {API_SECTIONS.map((s) => (
              <div key={s.id} className={styles.tocGroup}>
                <a href={`#${s.id}`} className={styles.tocLink}>{s.title[lang]}</a>
              </div>
            ))}
            <a href="#scopes" className={styles.tocLink}>{tx.scopesTitle}</a>
            <a href="#inbound" className={styles.tocLink}>{API_INBOUND.title[lang]}</a>
            <a href="#mcp" className={styles.tocLink}>{API_MCP.title[lang]}</a>
          </nav>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          {/* Base URL + Auth */}
          <section id="authentication" className={styles.block}>
            <h2>{intro.auth.title[lang]}</h2>

            <div className={styles.subLabel}>{tx.baseUrlLabel}</div>
            <CodeBlock code={API_BASE} copyLabel={tx.copy} copiedLabel={tx.copied} />
            <p className={styles.hint} dir="ltr">Fallback: {API_BASE_FALLBACK}</p>

            <p dangerouslySetInnerHTML={{ __html: intro.auth.body[lang] }} />
            <ul>
              {intro.auth.methods[lang].map((m, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: m }} />
              ))}
            </ul>
            <p dangerouslySetInnerHTML={{ __html: intro.auth.where[lang] }} />
            <div className={styles.note} dangerouslySetInnerHTML={{ __html: intro.auth.security[lang] }} />

            <h3>{intro.envelope.title[lang]}</h3>
            <p>{intro.envelope.body[lang]}</p>
            <CodeBlock code={intro.envelope.example} copyLabel={tx.copy} copiedLabel={tx.copied} />

            <h3>{intro.errors.title[lang]}</h3>
            {intro.errors.body && <p dangerouslySetInnerHTML={{ __html: intro.errors.body[lang] }} />}
            {intro.errors.example && (
              <CodeBlock code={intro.errors.example} copyLabel={tx.copy} copiedLabel={tx.copied} />
            )}
            <div className={styles.tableScroll}>
              <table className={styles.paramsTable}>
                <thead>
                  <tr><th>HTTP</th><th>code</th><th>error</th><th>{tx.description}</th></tr>
                </thead>
                <tbody>
                  {intro.errors.rows.map((r, i) => (
                    <tr key={i}>
                      <td className={styles.mono}>{r.code}</td>
                      <td><code>{r.machineCode || '—'}</code></td>
                      <td><code>{r.key}</code></td>
                      <td>{r[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {intro.agents && (
              <>
                <h3>{intro.agents.title[lang]}</h3>
                <p dangerouslySetInnerHTML={{ __html: intro.agents.body[lang] }} />
                <div className={styles.tableScroll}>
                  <table className={styles.paramsTable}>
                    <thead>
                      <tr><th>code</th><th>{tx.description}</th></tr>
                    </thead>
                    <tbody>
                      {intro.agents.rows.map((r, i) => (
                        <tr key={i}>
                          <td className={styles.mono}><code>{r.code}</code></td>
                          <td>{r[lang]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          {/* Endpoint sections */}
          {API_SECTIONS.map((s) => (
            <section id={s.id} key={s.id} className={styles.block}>
              <h2>{s.title[lang]}</h2>
              {/* Section descriptions are authored with inline HTML (<code>, <strong>, <br/>) — render as
                  HTML like every other rich field, otherwise the tags show up as literal text. Trusted
                  static content from apiDocsData.js. */}
              <p dangerouslySetInnerHTML={{ __html: s.description[lang] }} />
              {s.endpoints.map((ep) => (
                <EndpointCard key={`${ep.method}-${ep.path}`} endpoint={ep} lang={lang} tx={tx} />
              ))}
            </section>
          ))}

          {/* Scopes */}
          <section id="scopes" className={styles.block}>
            <h2>{tx.scopesTitle}</h2>
            <p>{tx.scopesIntro}</p>
            <div className={styles.tableScroll}>
              <table className={styles.paramsTable}>
                <thead>
                  <tr><th>{tx.scopeLabel}</th><th>{tx.description}</th></tr>
                </thead>
                <tbody>
                  {API_SCOPES.map((s) => (
                    <tr key={s.scope}>
                      <td><code>{s.scope}</code></td>
                      <td>{s[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Inbound forwarding */}
          <section id="inbound" className={styles.block}>
            <h2>{API_INBOUND.title[lang]}</h2>
            <p dangerouslySetInnerHTML={{ __html: API_INBOUND.intro[lang] }} />

            <h3>{API_INBOUND.howTitle[lang]}</h3>
            <p dangerouslySetInnerHTML={{ __html: API_INBOUND.how[lang] }} />

            <h3>{API_INBOUND.requestTitle[lang]}</h3>
            <p dangerouslySetInnerHTML={{ __html: API_INBOUND.request[lang] }} />
            <div className={styles.tableScroll}>
              <table className={styles.paramsTable}>
                <thead>
                  <tr><th>Header</th><th>{tx.description}</th></tr>
                </thead>
                <tbody>
                  {API_INBOUND.headers.map((h) => (
                    <tr key={h.key}>
                      <td><code>{h.key}</code></td>
                      <td>{h[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.subLabel}>{API_INBOUND.payloadNote[lang]}</p>
            <CodeBlock code={API_INBOUND.payload} copyLabel={tx.copy} copiedLabel={tx.copied} />
            <div className={styles.note} dangerouslySetInnerHTML={{ __html: API_INBOUND.tip[lang] }} />
          </section>

          {/* MCP */}
          <section id="mcp" className={styles.block}>
            <h2>{API_MCP.title[lang]}</h2>
            <p dangerouslySetInnerHTML={{ __html: API_MCP.intro[lang] }} />

            <h3>{API_MCP.installTitle[lang]}</h3>
            <CodeBlock code={API_MCP.install} copyLabel={tx.copy} copiedLabel={tx.copied} />

            <h3>{API_MCP.configTitle[lang]}</h3>
            <p dangerouslySetInnerHTML={{ __html: API_MCP.configNote[lang] }} />
            <CodeBlock code={API_MCP.config} copyLabel={tx.copy} copiedLabel={tx.copied} />
            <div dir="ltr" style={{ margin: '16px 0' }}>
              <a
                href={API_MCP.cursorDeeplink}
                style={{ display: 'inline-block', background: '#25D366', color: '#04220f', fontWeight: 700, padding: '11px 22px', borderRadius: 10, textDecoration: 'none' }}
              >
                {API_MCP.cursorButton[lang]}
              </a>
              <span style={{ display: 'block', marginTop: 8, fontSize: 13, opacity: 0.7 }}>{API_MCP.cursorButtonNote[lang]}</span>
            </div>

            {/* Online / hosted MCP — generic flow for web-based AI tools */}
            <h3>{API_MCP.remoteTitle[lang]}</h3>
            <p dangerouslySetInnerHTML={{ __html: API_MCP.remoteIntro[lang] }} />
            <CodeBlock code={API_MCP.remoteUrl} label={API_MCP.remoteUrlLabel[lang]} copyLabel={tx.copy} copiedLabel={tx.copied} />
            <div className={styles.subLabel}>{API_MCP.remoteAuthTitle[lang]}</div>
            <p dangerouslySetInnerHTML={{ __html: API_MCP.remoteAuthNote[lang] }} />
            <div className={styles.note} dangerouslySetInnerHTML={{ __html: API_MCP.remoteManifestNote[lang] }} />

            <div className={styles.subLabel}>{API_MCP.remoteStepsTitle[lang]}</div>
            <ol>
              {API_MCP.remoteSteps[lang].map((step, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
              ))}
            </ol>

            <h3>{API_MCP.remoteConfigTitle[lang]}</h3>
            <p dangerouslySetInnerHTML={{ __html: API_MCP.remoteConfigNote[lang] }} />
            <CodeBlock code={API_MCP.remoteConfig} copyLabel={tx.copy} copiedLabel={tx.copied} />
            <div className={styles.note} dangerouslySetInnerHTML={{ __html: API_MCP.remoteTip[lang] }} />

            <div className={styles.note} dangerouslySetInnerHTML={{ __html: API_MCP.toolsNote[lang] }} />
          </section>

          {/* CTA */}
          <div className={styles.ctaBox}>
            <h3>{tx.ctaTitle}</h3>
            <p>{tx.ctaBody}</p>
            <a href="https://gambot.co.il/OnboardingProcess" className={styles.ctaBtn} target="_blank" rel="noopener noreferrer">
              {tx.ctaBtn}
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
