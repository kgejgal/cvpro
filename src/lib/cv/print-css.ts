// CSS used when rendering CV templates to PDF in a headless browser.
// Mirrors the .cv-* helper styles from globals.css — keep in sync when templates change.
export const PRINT_CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; }

#cv-doc {
  box-shadow: none !important;
  border-radius: 0 !important;
  width: 794px !important;
  min-height: auto !important;
  margin: 0 !important;
}

.cv-section-title {
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-poppins, sans-serif);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--cv-accent-deep, #3f5d80);
  margin-bottom: 14px;
}
.cv-section-title::before {
  content: '';
  display: block;
  width: 18px;
  height: 2px;
  background: var(--cv-accent, #5a7da6);
  border-radius: 2px;
  flex-shrink: 0;
}

.cv-timeline { position: relative; margin-left: 5px; padding-top: 2px; }
.cv-timeline::before {
  content: '';
  position: absolute;
  left: 0; top: 8px; bottom: 6px;
  width: 2px;
  background: var(--cv-tint-2, #e4edf6);
}

.cv-exp-item { position: relative; }
.cv-exp-item::before {
  content: '';
  position: absolute;
  left: -5px; top: 4px;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 2.5px solid var(--cv-accent, #5a7da6);
  box-shadow: 0 0 0 4px #fff;
}

.cv-exp-list { list-style: none; margin: 0; padding: 0; }
.cv-exp-list li {
  position: relative;
  font-size: 13px;
  color: #5d626c;
  padding-left: 16px;
  margin-bottom: 6px;
  line-height: 1.6;
}
.cv-exp-list li::before {
  content: '';
  position: absolute;
  left: 0; top: 9px;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--cv-accent, #5a7da6);
  opacity: 0.7;
}

.cv-panel { background: var(--cv-tint, #eef3f9); }

.cv2-bullet { list-style: none; margin: 0; padding: 0; }
.cv2-bullet li {
  position: relative;
  padding-left: 14px;
  margin-bottom: 5px;
  font-size: 12.5px;
  line-height: 1.65;
}
.cv2-bullet li::before {
  content: '';
  position: absolute;
  left: 0; top: 8px;
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--cv-accent, #2563eb);
  opacity: 0.75;
}

/* Pagination hygiene */
.cv-exp-item, .cv-section-title { page-break-inside: avoid; break-inside: avoid; }

/* Exact colors in print */
#cv-doc, #cv-doc *, .cv-panel {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
`

// Diagonal watermark for the free plan — position:fixed repeats on every printed page.
export const WATERMARK_HTML = `
<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:72px;font-weight:900;color:rgba(0,0,0,0.07);letter-spacing:0.08em;pointer-events:none;z-index:9999;white-space:nowrap;font-family:sans-serif;">cvpro.pl</div>
<div style="position:fixed;bottom:6mm;left:0;right:0;text-align:center;font-size:9px;color:rgba(0,0,0,0.35);font-family:sans-serif;letter-spacing:0.04em;">Pobierz bez znaku wodnego na cvpro.pl</div>
`
