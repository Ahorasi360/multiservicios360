'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveToVault } from '../../../lib/save-to-vault';
import { PDFDocument } from 'pdf-lib';
import { lockPdf } from '../../../lib/lock-pdf';
import Navbar from '../../components/Navbar';

const NOTARY_DOCS = ['affidavit', 'revocation_poa', 'certification_of_trust', 'small_estate_affidavit', 'quitclaim_deed'];
// Guardianship gets notary for standard+ tiers (handled separately below)

const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const DownloadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);
const PrintIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>);
const EmailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const PenIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>);
const GlobeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>);

const DOC_TITLES = {
  bill_of_sale: { en: 'BILL OF SALE', es: 'CARTA DE VENTA' },
  affidavit: { en: 'GENERAL AFFIDAVIT', es: 'DECLARACION JURADA GENERAL' },
  revocation_poa: { en: 'REVOCATION OF POWER OF ATTORNEY', es: 'REVOCACION DE PODER NOTARIAL' },
  authorization_letter: { en: 'AUTHORIZATION LETTER', es: 'CARTA DE AUTORIZACION' },
  promissory_note: { en: 'PROMISSORY NOTE', es: 'PAGARE' },
  guardianship_designation: { en: 'LEGAL PROTECTION PLAN FOR MINOR CHILDREN', es: 'PLAN DE PROTECCION LEGAL PARA HIJOS MENORES' },
  travel_authorization: { en: 'PARENTAL TRAVEL AUTHORIZATION FOR MINOR CHILDREN', es: 'AUTORIZACIÓN PARENTAL DE VIAJE PARA HIJOS MENORES' },
  // Estate Planning
  pour_over_will: { en: 'POUR-OVER WILL', es: 'TESTAMENTO DE TRASPASO AL FIDEICOMISO' },
  simple_will: { en: 'LAST WILL AND TESTAMENT', es: 'TESTAMENTO SIMPLE' },
  hipaa_authorization: { en: 'HIPAA AUTHORIZATION', es: 'AUTORIZACIÓN HIPAA' },
  certification_of_trust: { en: 'CERTIFICATION OF TRUST', es: 'CERTIFICACIÓN DE FIDEICOMISO' },
  // Corporate
  s_corp_formation: { en: 'S-CORPORATION FORMATION PACKAGE', es: 'PAQUETE DE FORMACIÓN S-CORPORATION' },
  c_corp_formation: { en: 'C-CORPORATION FORMATION PACKAGE', es: 'PAQUETE DE FORMACIÓN C-CORPORATION' },
  corporate_minutes: { en: 'CORPORATE MINUTES', es: 'ACTAS CORPORATIVAS' },
  banking_resolution: { en: 'BANKING RESOLUTION', es: 'RESOLUCIÓN BANCARIA' },
  // Phase 2
  small_estate_affidavit: { en: 'SMALL ESTATE AFFIDAVIT (§13100)', es: 'DECLARACIÓN JURADA DE SUCESIÓN SIMPLIFICADA (§13100)' },
  quitclaim_deed: { en: 'QUITCLAIM DEED', es: 'ESCRITURA DE TRASPASO (QUITCLAIM DEED)' },
  contractor_agreement: { en: 'INDEPENDENT CONTRACTOR AGREEMENT', es: 'CONTRATO DE CONTRATISTA INDEPENDIENTE' },
  demand_letter: { en: 'DEMAND LETTER', es: 'CARTA DE DEMANDA DE PAGO' },
  apostille_letter: { en: 'APOSTILLE COVER LETTER', es: 'CARTA DE SOLICITUD DE APOSTILLA' },
};

// ============================================================
// UNIVERSAL PDF RENDERER — Takes clause library sections → PDF
// ============================================================

function renderSectionsToPDF(doc, sections, { m, cw, pw, ph, lang }) {
  let y = doc.__startY || 22;
  const NAVY = [30, 58, 138];
  const GOLD = [245, 158, 11];
  const GRAY = [100, 116, 139];

  // Helper: add branded header strip on continuation pages
  const addPageHeader = () => {
    doc.setFillColor(...NAVY); doc.rect(0, 0, pw, 12, 'F');
    doc.setFillColor(...GOLD); doc.rect(0, 12, pw, 1.5, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
    doc.text('MULTI SERVICIOS 360', pw / 2, 7.5, { align: 'center' });
    doc.setFontSize(5.5); doc.setFont('helvetica', 'normal');
    doc.text('DOCUMENT PREPARATION PLATFORM', pw / 2, 10.5, { align: 'center' });
    doc.setTextColor(0, 0, 0); doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
  };

  const wrap = (text, x, startY, maxW, lineH = 5.2) => {
    const lines = doc.splitTextToSize(String(text || ''), maxW);
    lines.forEach(line => { if (startY > ph - 28) { doc.addPage(); addPageHeader(); startY = 22; } doc.text(line, x, startY); startY += lineH; });
    return startY;
  };

  const newPage = (curY, need = 50) => { if (curY + need > ph - 28) { doc.addPage(); addPageHeader(); return 22; } return curY; };

  const addSectionTitle = (title, curY) => {
    curY = newPage(curY, 28);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(...NAVY);
    doc.text(title.toUpperCase(), m, curY); curY += 3;
    doc.setDrawColor(...NAVY); doc.setLineWidth(0.6);
    doc.line(m, curY, m + cw, curY); curY += 8;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
    return curY;
  };

  const addField = (label, value, curY) => {
    curY = newPage(curY, 16);
    // Boxed field style
    doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240);
    doc.roundedRect(m + 2, curY - 4, cw - 4, 12, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...NAVY);
    doc.text(label + ':', m + 6, curY + 1);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
    const valX = m + 6 + doc.getTextWidth(label + ':  ');
    const maxW = cw - (valX - m) - 8;
    if (maxW < 30) { curY += 12; curY = wrap(value || '________________________', m + 6, curY, cw - 12, 5.2); }
    else { doc.text(String(value || '________________________').substring(0, 60), valX, curY + 1); curY += 10; }
    return curY + 4;
  };

  const addSignatureBlock = (label, name, curY) => {
    curY = newPage(curY, 65); curY += 16;
    // Signature line
    doc.setDrawColor(0); doc.setLineWidth(0.4);
    doc.line(m, curY, m + 100, curY); curY += 6;
    // Name (printed)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(0, 0, 0);
    doc.text(name, m, curY); curY += 6;
    // Role label
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...GRAY);
    doc.text(label, m, curY); curY += 12;
    // Date line
    doc.setDrawColor(0); doc.line(m, curY, m + 65, curY); curY += 6;
    doc.setFontSize(9); doc.setTextColor(0, 0, 0);
    doc.text(lang === 'es' ? 'Fecha' : 'Date', m, curY);
    return curY + 10;
  };

  for (const section of sections) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);

    switch (section.type) {
      case 'paragraph': {
        if (section.style === 'subtitle') {
          y = newPage(y, 16);
          doc.setFont('helvetica', 'italic'); doc.setFontSize(12); doc.setTextColor(...NAVY);
          doc.text(section.text, pw / 2, y, { align: 'center' }); y += 8;
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
        } else if (section.style === 'compliance_header') {
          y = newPage(y, 14);
          doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(...GRAY);
          doc.text(section.text, pw / 2, y, { align: 'center' }); y += 5;
          // Decorative gold divider
          doc.setDrawColor(...GOLD); doc.setLineWidth(0.8);
          doc.line(pw / 2 - 30, y, pw / 2 + 30, y); y += 12;
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
        } else if (section.style === 'execution') {
          y = newPage(y, 40); y += 10;
          // Execution header bar
          doc.setFillColor(248, 250, 252); doc.setDrawColor(...NAVY);
          doc.roundedRect(m, y - 5, cw, 8, 2, 2, 'FD');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...NAVY);
          doc.text(lang === 'es' ? 'EJECUCIÓN' : 'EXECUTION', pw / 2, y, { align: 'center' }); y += 12;
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
          y = wrap(section.text, m, y, cw, 5.2); y += 8;
        } else if (section.bold) {
          y = newPage(y, 18); doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5);
          doc.text(section.text, m, y); y += 8;
        } else {
          y = newPage(y, 22); y = wrap(section.text, m, y, cw, 5.2); y += 7;
        }
        break;
      }
      case 'field_inline': { y = addField(section.label, section.value, y); break; }
      case 'venue': {
        y = newPage(y, 35);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5);
        doc.text(section.state, m, y); y += 7;
        doc.text((lang === 'es' ? 'CONDADO DE' : 'COUNTY OF') + ': ' + section.county, m, y); y += 12;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
        break;
      }
      case 'article': {
        // ── PREMIUM ARTICLE HEADER ──
        y = newPage(y, 55); y += 8;

        // Navy background bar for article number
        if (section.article_num) {
          const artLabel = (lang === 'es' ? 'ARTÍCULO' : 'ARTICLE') + ' ' + section.article_num;
          doc.setFillColor(...NAVY);
          doc.roundedRect(m, y - 5, cw, 10, 2, 2, 'F');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(255, 255, 255);
          doc.text(artLabel, pw / 2, y + 1, { align: 'center' }); y += 10;
        }

        // Article title
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...NAVY);
        doc.text(section.title.toUpperCase(), pw / 2, y, { align: 'center' }); y += 3;

        // Gold underline
        const titleW = Math.min(doc.getTextWidth(section.title.toUpperCase()) + 16, cw);
        doc.setDrawColor(...GOLD); doc.setLineWidth(0.8);
        doc.line((pw - titleW) / 2, y, (pw + titleW) / 2, y); y += 10;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);

        // Body text
        if (section.text) { y = wrap(section.text, m, y, cw, 5.2); y += 5; }

        // Fields (for guardian info) — boxed style
        if (section.fields) {
          y += 2;
          for (const f of section.fields) { y = addField(f.label, f.value, y); }
          y += 4;
        }

        // Field groups (for children etc) — labeled sets of boxed fields
        if (section.field_groups) {
          y += 2;
          for (const group of section.field_groups) {
            y = newPage(y, 30);
            // Group title (e.g., "Minor 1 / Menor 1")
            doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...NAVY);
            doc.text(group.title, m + 4, y); y += 6;
            doc.setFont('helvetica', 'normal'); doc.setTextColor(0, 0, 0);
            for (const f of group.fields) { y = addField(f.label, f.value, y); }
            y += 4;
          }
        }

        // Post-text after fields
        if (section.posttext) {
          y = newPage(y, 16);
          doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(...GRAY);
          y = wrap(section.posttext, m + 4, y, cw - 8, 5); y += 5;
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
        }

        // Subtext (for children info etc)
        if (section.subtext) {
          y = newPage(y, 16);
          // Highlighted box for children info
          const stLines = doc.splitTextToSize(String(section.subtext), cw - 16);
          const boxH = stLines.length * 5.5 + 8;
          doc.setFillColor(239, 246, 255); doc.setDrawColor(...NAVY); doc.setLineWidth(0.3);
          doc.roundedRect(m + 2, y - 3, cw - 4, boxH, 2, 2, 'FD');
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
          stLines.forEach((line, i) => { doc.text(line, m + 8, y + 3 + i * 5.5); });
          y += boxH + 6;
        }

        // Numbered items (1. 2. 3.)
        if (section.numbered_items) {
          for (let i = 0; i < section.numbered_items.length; i++) {
            y = newPage(y, 16);
            const num = `${i + 1}.`;
            doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...NAVY);
            doc.text(num, m + 6, y);
            doc.setFont('helvetica', 'normal'); doc.setTextColor(0, 0, 0);
            y = wrap(section.numbered_items[i], m + 16, y, cw - 20, 5.2); y += 4;
          }
          y += 3;
        }

        // Lettered items (a) b) c))
        if (section.lettered_items) {
          for (let i = 0; i < section.lettered_items.length; i++) {
            y = newPage(y, 16);
            const letter = '(' + String.fromCharCode(97 + i) + ')';
            doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...NAVY);
            doc.text(letter, m + 6, y);
            doc.setFont('helvetica', 'normal'); doc.setTextColor(0, 0, 0);
            y = wrap(section.lettered_items[i], m + 18, y, cw - 22, 5.2); y += 4;
          }
          y += 3;
        }

        // Subsections (6.1, 6.2, etc.) — Premium styled
        if (section.subsections) {
          for (const sub of section.subsections) {
            y = newPage(y, 30); y += 4;
            // Subsection header with accent bar
            doc.setFillColor(248, 250, 252);
            doc.rect(m + 4, y - 4, cw - 8, 9, 'F');
            doc.setFillColor(...NAVY); doc.rect(m + 4, y - 4, 2, 9, 'F'); // left accent bar
            doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...NAVY);
            const subHeader = (lang === 'es' ? 'Sección' : 'Section') + ' ' + sub.num + ' — ' + sub.title;
            doc.text(subHeader, m + 10, y + 1); y += 10;
            doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
            y = wrap(sub.text, m + 10, y, cw - 14, 5.2); y += 6;
          }
        }

        // Bullets (fallback)
        if (section.bullets) {
          for (const bullet of section.bullets) {
            y = newPage(y, 14);
            doc.setTextColor(...NAVY); doc.text('●', m + 6, y); doc.setTextColor(0, 0, 0);
            y = wrap(bullet, m + 14, y, cw - 18, 5.2); y += 3;
          }
          y += 5;
        }

        y += 4;
        break;
      }
      case 'section': {
        if (section.title) { y = addSectionTitle(section.title, y); }
        if (section.fields) { for (const f of section.fields) { y = addField(f.label, f.value, y); } y += 3; }
        if (section.text) { y = newPage(y, 22); y = wrap(section.text, m, y, cw, 5.2); y += 5; }
        if (section.subtext) { y = newPage(y, 18); doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); y = wrap(section.subtext, m + 6, y, cw - 12, 5.2); y += 5; }
        if (section.bullets) {
          for (const bullet of section.bullets) {
            y = newPage(y, 14);
            doc.setTextColor(...NAVY); doc.text('●', m + 6, y); doc.setTextColor(0, 0, 0);
            y = wrap(bullet, m + 14, y, cw - 18, 5.2); y += 3;
          }
          y += 5;
        }
        y += 3;
        break;
      }
      case 'jurat': {
        y = newPage(y, 90); y += 8;
        y = addSectionTitle(section.title, y);
        doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5);
        y = wrap(section.text, m, y, cw, 4.5); y += 10;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
        doc.text(lang === 'es' ? 'Estado de California' : 'State of California', m, y); y += 6;
        doc.text((lang === 'es' ? 'Condado de ' : 'County of ') + section.county, m, y); y += 10;
        y = wrap(section.body, m, y, cw, 5.2); y += 22;
        doc.setDrawColor(0); doc.setLineWidth(0.4);
        doc.line(m, y, m + 90, y); y += 6;
        doc.setFontSize(9); doc.text(lang === 'es' ? 'Firma del Notario Público' : 'Notary Public Signature', m, y); y += 10;
        doc.line(m, y, m + 90, y); y += 6;
        doc.text(lang === 'es' ? 'Nombre del Notario (Sello)' : 'Notary Name (Seal)', m, y); y += 10;
        doc.text(lang === 'es' ? 'Mi comisión expira: _______________' : 'My commission expires: _______________', m, y); y += 12;
        break;
      }
      case 'signatures': {
        // Force new page for signature section
        y = newPage(y, 80);
        for (const block of section.blocks) { y = addSignatureBlock(block.label, block.name, y); }
        break;
      }
      case 'witness_block': {
        y = newPage(y, 80); y += 10;
        // Witness header bar
        doc.setFillColor(248, 250, 252); doc.setDrawColor(...NAVY); doc.setLineWidth(0.4);
        doc.roundedRect(m, y - 5, cw, 10, 2, 2, 'FD');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...NAVY);
        doc.text(section.title, pw / 2, y + 1, { align: 'center' }); y += 14;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...GRAY);
        doc.text(lang === 'es' ? '(Recomendado pero no requerido por ley de California)' : '(Recommended but not required under California law)', pw / 2, y, { align: 'center' }); y += 10;
        // Witness preamble (if provided)
        if (section.preamble) {
          y = newPage(y, 30);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
          const pLines = doc.splitTextToSize(section.preamble, cw - 10);
          for (const pl of pLines) { y = newPage(y, 8); doc.text(pl, m + 5, y); y += 5.2; }
          y += 6;
        }
        doc.setTextColor(0, 0, 0); doc.setFontSize(9.5);
        for (const w of section.witnesses) {
          y = newPage(y, 45); y += 12;
          doc.setDrawColor(0); doc.setLineWidth(0.4);
          doc.line(m, y, m + 90, y); y += 6;
          doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...NAVY);
          doc.text(w.label + ' — ' + (lang === 'es' ? 'Firma' : 'Signature'), m, y); y += 10;
          doc.setFont('helvetica', 'normal'); doc.setTextColor(0, 0, 0);
          doc.line(m, y, m + 90, y); y += 6;
          doc.text(lang === 'es' ? 'Nombre Impreso' : 'Printed Name', m, y); y += 10;
          doc.line(m, y, m + 65, y); y += 6;
          doc.text(lang === 'es' ? 'Fecha' : 'Date', m, y); y += 10;
        }
        break;
      }
      case 'attachment': {
        // Each attachment starts on a new page with branded header
        doc.addPage(); y = 22;
        // Navy header bar
        doc.setFillColor(...NAVY);
        doc.rect(0, 0, pw, 12, 'F');
        doc.setFillColor(...GOLD);
        doc.rect(0, 12, pw, 1.5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
        doc.text('MULTI SERVICIOS 360', pw / 2, 6, { align: 'center' });
        doc.setFont('helvetica', 'normal'); doc.setFontSize(5.5);
        doc.text('DOCUMENT PREPARATION PLATFORM | www.multiservicios360.net | 855.246.7274', pw / 2, 10, { align: 'center' });
        doc.setTextColor(0, 0, 0);
        // Attachment title
        y += 8;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(...NAVY);
        const titleLines = doc.splitTextToSize(section.title, cw);
        for (const tl of titleLines) { doc.text(tl, pw / 2, y, { align: 'center' }); y += 7; }
        // Gold divider
        doc.setDrawColor(...GOLD); doc.setLineWidth(0.8);
        doc.line(pw / 2 - 40, y, pw / 2 + 40, y); y += 8;
        // Attachment content
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(30, 30, 30);
        if (section.content) {
          const contentLines = section.content.split('\n');
          for (const line of contentLines) {
            if (y > ph - 28) {
              doc.addPage(); y = 22;
              doc.setFillColor(...NAVY); doc.rect(0, 0, pw, 12, 'F');
              doc.setFillColor(...GOLD); doc.rect(0, 12, pw, 1.5, 'F');
              doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
              doc.text('MULTI SERVICIOS 360', pw / 2, 6, { align: 'center' });
              doc.setFont('helvetica', 'normal'); doc.setFontSize(5.5);
              doc.text('DOCUMENT PREPARATION PLATFORM', pw / 2, 10, { align: 'center' });
              doc.setTextColor(30, 30, 30); doc.setFontSize(9.5);
            }
            const trimmed = line.trim();
            if (!trimmed) { y += 4; continue; }
            // Bold lines (headers, section titles)
            if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !trimmed.startsWith('[') && !trimmed.startsWith('•')) {
              doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...NAVY);
              const wrapped = doc.splitTextToSize(trimmed, cw);
              for (const wl of wrapped) { y = newPage(y, 8); doc.text(wl, m, y); y += 5.5; }
              doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(30, 30, 30);
              y += 2;
            } else if (trimmed.startsWith('•')) {
              // Bullet points
              const wrapped = doc.splitTextToSize(trimmed.substring(1).trim(), cw - 8);
              for (let i = 0; i < wrapped.length; i++) { y = newPage(y, 8); doc.text(i === 0 ? '•' : '', m, y); doc.text(wrapped[i], m + 5, y); y += 5.2; }
            } else if (/^\d+\./.test(trimmed)) {
              // Numbered items
              const numMatch = trimmed.match(/^(\d+\.)\s*(.*)/);
              if (numMatch) {
                doc.setFont('helvetica', 'bold'); doc.text(numMatch[1], m, y);
                doc.setFont('helvetica', 'normal');
                const wrapped = doc.splitTextToSize(numMatch[2], cw - 10);
                for (let i = 0; i < wrapped.length; i++) { y = newPage(y, 8); doc.text(wrapped[i], m + 8, y); y += 5.2; }
              }
            } else {
              const wrapped = doc.splitTextToSize(trimmed, cw);
              for (const wl of wrapped) { y = newPage(y, 8); doc.text(wl, m, y); y += 5.2; }
            }
          }
        }
        break;
      }
      default: break;
    }
  }
  return y;
}


function SuccessContent() {
  const searchParams = useSearchParams();
  const matterId = searchParams.get('matter_id');
  const docType = searchParams.get('doc_type');

  const [matter, setMatter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('es');
  const [executionDate, setExecutionDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [electronicSignature, setElectronicSignature] = useState('');
  const [signatureAccepted, setSignatureAccepted] = useState(false);
  const [signatureError, setSignatureError] = useState('');
  const [isFinalized, setIsFinalized] = useState(false);
  const [translationCache, setTranslationCache] = useState(null);
  const [translating, setTranslating] = useState(false);

  const getLADate = () => {
    const now = new Date();
    const la = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    return String(la.getMonth() + 1).padStart(2, '0') + '/' + String(la.getDate()).padStart(2, '0') + '/' + la.getFullYear();
  };

  const validateDate = (d) => {
    if (!d || !d.trim()) return false;
    const r = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!r.test(d)) return false;
    const [mo, dy, yr] = d.split('/').map(Number);
    const td = new Date(yr, mo - 1, dy);
    return td.getMonth() === mo - 1 && td.getDate() === dy && td.getFullYear() === yr;
  };

  const formatDateInput = (v) => {
    const d = v.replace(/\D/g, '');
    if (d.length <= 2) return d;
    if (d.length <= 4) return d.slice(0, 2) + '/' + d.slice(2);
    return d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4, 8);
  };

  const toggleLang = () => setLanguage(p => p === 'es' ? 'en' : 'es');

  useEffect(() => {
    const fetchMatter = async () => {
      if (matterId) {
        try {
          const res = await fetch('/api/simple-doc/matters/' + matterId);
          const data = await res.json();
          if (data.success) {
            setMatter(data.matter);
            setLanguage(data.matter.language || 'es');
            if (data.matter.execution_date) { setExecutionDate(data.matter.execution_date); setIsFinalized(true); }
            if (data.matter.electronic_signature) { setElectronicSignature(data.matter.electronic_signature); setSignatureAccepted(true); }
          }
        } catch (e) { console.error('Fetch error:', e); }
      }
      setLoading(false);
    };
    fetchMatter();
  }, [matterId]);

  const t = language === 'es' ? {
    title: 'Pago Exitoso!', subtitle: 'Su documento esta listo',
    thankYou: 'Gracias por su compra. Su documento esta listo para descargar.',
    orderNumber: 'Numero de Orden',
    downloadSpanish: 'Descargar PDF Espanol', downloadEnglish: 'Descargar PDF Ingles',
    print: 'Imprimir', email: 'Enviar por Email',
    nextSteps: 'Proximos Pasos',
    step1: 'Complete la fecha de ejecucion y firma electronica abajo',
    step2: 'Descargue sus documentos PDF',
    step3: 'Revise el documento cuidadosamente',
    step4: 'Si es necesario, firme ante un notario publico',
    step5: 'Guarde copias en un lugar seguro',
    questions: 'Preguntas?', contact: 'Contactenos al 855.246.7274', backHome: 'Volver al Inicio',
    legalNote: 'Nota: El documento en ingles es el documento legal oficial. El documento en espanol es para su referencia.',
    executionDateLabel: 'Fecha de Ejecucion (Requerida)', executionDatePlaceholder: 'MM/DD/AAAA',
    useTodayDate: 'Usar Fecha de Hoy', executionDateRequired: 'La fecha de ejecucion es obligatoria.',
    executionDateHelp: 'Esta es la fecha en que firmara el documento.',
    signatureLabel: 'Firma Electronica (Requerida)', signaturePlaceholder: 'Escriba su nombre completo',
    signatureHelp: 'Al escribir su nombre, confirma que creo este documento usted mismo.',
    signatureRequired: 'La firma electronica es obligatoria.',
    signatureAcceptLabel: 'Acepto que cree este documento yo mismo usando las herramientas de software de Multiservicios 360, y que no recibi asesoria legal.',
    signatureAcceptRequired: 'Debe aceptar los terminos para continuar.',
    finalized: 'Documento finalizado', langToggle: 'EN',
  } : {
    title: 'Payment Successful!', subtitle: 'Your document is ready',
    thankYou: 'Thank you for your purchase. Your document is ready to download.',
    orderNumber: 'Order Number',
    downloadSpanish: 'Download Spanish PDF', downloadEnglish: 'Download English PDF',
    print: 'Print', email: 'Send by Email',
    nextSteps: 'Next Steps',
    step1: 'Complete the execution date and electronic signature below',
    step2: 'Download your PDF documents',
    step3: 'Review the document carefully',
    step4: 'If required, sign before a notary public',
    step5: 'Keep copies in a safe place',
    questions: 'Questions?', contact: 'Contact us at 855.246.7274', backHome: 'Back to Home',
    legalNote: 'Note: The English document is the official legal document. The Spanish document is for your reference.',
    executionDateLabel: 'Execution Date (Required)', executionDatePlaceholder: 'MM/DD/YYYY',
    useTodayDate: "Use Today's Date", executionDateRequired: 'Execution date is required.',
    executionDateHelp: 'This is the date you will sign the document.',
    signatureLabel: 'Electronic Signature (Required)', signaturePlaceholder: 'Type your full name',
    signatureHelp: 'By typing your name, you confirm that you created this document yourself.',
    signatureRequired: 'Electronic signature is required.',
    signatureAcceptLabel: 'I accept that I created this document myself using Multiservicios 360 software tools, and that I did not receive legal advice.',
    signatureAcceptRequired: 'You must accept the terms to continue.',
    finalized: 'Document finalized', langToggle: 'ES',
  };

  // ============================================================
  // PDF GENERATION — Clause Library Driven
  // ============================================================
  const generatePDF = async (isSpanish = false, returnOnly = false) => {
    if (!matter?.form_data) { alert('No data available'); return; }
    if (!validateDate(executionDate)) { setDateError(t.executionDateRequired); return; }
    setDateError('');
    if (!electronicSignature || electronicSignature.trim().length < 2) { setSignatureError(t.signatureRequired); return; }
    if (!signatureAccepted) { setSignatureError(t.signatureAcceptRequired); return; }
    setSignatureError('');

    const { default: jsPDF } = await import('jspdf');
    const { buildDocument } = await import('../../../lib/clause-libraries');

    const doc = new jsPDF('p', 'mm', 'letter');
    let d = { ...matter.form_data };

    // === TRANSLATE FREE-TEXT FIELDS FOR ENGLISH PDF ===
    if (!isSpanish) {
      let translations = translationCache;
      if (!translations) {
        try {
          setTranslating(true);
          const res = await fetch('/api/simple-doc/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ form_data: matter.form_data, document_type: docType }),
          });
          const result = await res.json();
          if (result.success && result.translations) {
            translations = result.translations;
            setTranslationCache(translations);
          }
        } catch (err) {
          console.error('Translation failed, using original text:', err);
        } finally {
          setTranslating(false);
        }
      }
      // Apply translations to form data copy
      if (translations) {
        for (const [field, translated] of Object.entries(translations)) {
          if (translated && d[field]) {
            d[field] = translated;
          }
        }
        // Mark that this doc contains translations
        d._translated = true;
      }
    }

    const lang = isSpanish ? 'es' : 'en';
    const pw = 215.9, ph = 279.4, m = 20, cw = pw - 2 * m;

    const versionId = 'MS360-' + Date.now().toString(16).toUpperCase();
    const auditData = { signedAtUtc: new Date().toISOString(), signedAtLocal: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }), documentVersionId: versionId };

    // === PREMIUM HEADER (page 1 — branded) ===
    doc.setFillColor(30, 58, 138); doc.rect(0, 0, pw, 22, 'F');
    doc.setFillColor(245, 158, 11); doc.rect(0, 22, pw, 2, 'F'); // gold accent stripe
    doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.setTextColor(255, 255, 255);
    doc.text('MULTI SERVICIOS 360', pw / 2, 11, { align: 'center' });
    doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.text('DOCUMENT PREPARATION PLATFORM  |  www.multiservicios360.net  |  855.246.7274', pw / 2, 18, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    let y = 34;
    const docTitle = DOC_TITLES[docType]?.[lang] || docType.toUpperCase();
    doc.setFontSize(16); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 58, 138);
    doc.text(docTitle, pw / 2, y, { align: 'center' }); y += 8;
    doc.setFontSize(10); doc.setFont('helvetica', 'italic'); doc.setTextColor(80, 80, 80);
    doc.text(lang === 'es' ? 'Estado de California' : 'State of California', pw / 2, y, { align: 'center' }); y += 5;
    doc.setDrawColor(245, 158, 11); doc.setLineWidth(1);
    doc.line(pw / 2 - 40, y, pw / 2 + 40, y); y += 12;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);

    // === TRANSLATION NOTICE (English PDF only) ===
    if (!isSpanish && d._translated) {
      doc.setFillColor(239, 246, 255); doc.setDrawColor(30, 58, 138); doc.setLineWidth(0.3);
      doc.roundedRect(m, y - 2, cw, 12, 2, 2, 'FD');
      doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(100, 116, 139);
      doc.text('Note: Free-text declarations in this document were translated from the original Spanish provided by the declarant.', pw / 2, y + 4, { align: 'center' });
      y += 16;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
    }

    // === BUILD & RENDER DOCUMENT BODY ===
    const sections = buildDocument(docType, d, lang, executionDate);
    doc.__startY = y;
    y = renderSectionsToPDF(doc, sections, { m, cw, pw, ph, lang });

    // === DISCLOSURE PAGE ===
    doc.addPage(); y = 18;
    // Branded header strip
    doc.setFillColor(30, 58, 138); doc.rect(0, 0, pw, 12, 'F');
    doc.setFillColor(245, 158, 11); doc.rect(0, 12, pw, 1.5, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
    doc.text('MULTI SERVICIOS 360', pw / 2, 7.5, { align: 'center' });
    doc.setFontSize(5.5); doc.setFont('helvetica', 'normal');
    doc.text('DOCUMENT PREPARATION PLATFORM', pw / 2, 10.5, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y = 24;
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 58, 138);
    doc.text(lang === 'es' ? 'DIVULGACION DE PLATAFORMA DE SOFTWARE Y' : 'SOFTWARE PLATFORM DISCLOSURE &', pw / 2, y, { align: 'center' }); y += 6;
    doc.text(lang === 'es' ? 'RECONOCIMIENTO DEL USUARIO' : 'USER ACKNOWLEDGMENT', pw / 2, y, { align: 'center' }); y += 4;
    doc.setFontSize(10); doc.setFont('helvetica', 'italic'); doc.setTextColor(0, 0, 0);
    doc.text('(California)', pw / 2, y, { align: 'center' }); y += 3;
    doc.setDrawColor(245, 158, 11); doc.setLineWidth(0.8);
    doc.line(pw / 2 - 40, y, pw / 2 + 40, y); y += 10;

    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
    const dWrap = (text, startY) => {
      const lines = doc.splitTextToSize(text, cw);
      lines.forEach(line => {
        if (startY > ph - 28) {
          doc.addPage(); 
          doc.setFillColor(30, 58, 138); doc.rect(0, 0, pw, 12, 'F');
          doc.setFillColor(245, 158, 11); doc.rect(0, 12, pw, 1.5, 'F');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
          doc.text('MULTI SERVICIOS 360', pw / 2, 7.5, { align: 'center' });
          doc.setFontSize(5.5); doc.setFont('helvetica', 'normal');
          doc.text('DOCUMENT PREPARATION PLATFORM', pw / 2, 10.5, { align: 'center' });
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
          startY = 22;
        }
        doc.text(line, m, startY); startY += 5.2;
      });
      return startY;
    };

    y = dWrap(lang === 'es'
      ? 'Este documento fue creado por el usuario a traves de un sistema automatizado de generacion de documentos de autoayuda proporcionado por Multiservicios 360.'
      : 'This document was created by the user through an automated self-help document generation system provided by Multiservicios 360.', y);
    y += 8;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(30, 58, 138);
    doc.text(lang === 'es' ? 'SIN ASESORIA LEGAL / SIN PREPARACION DE DOCUMENTOS' : 'NO LEGAL ADVICE / NO DOCUMENT PREPARATION', m, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
    y = dWrap(lang === 'es'
      ? 'Multiservicios 360 no es un bufete de abogados y no proporciona asesoria legal. Multiservicios 360 no prepara documentos legales en nombre de los usuarios. Multiservicios 360 proporciona acceso a herramientas de software que permiten a los usuarios crear sus propios documentos basandose unicamente en la informacion y selecciones proporcionadas por el usuario.'
      : 'Multiservicios 360 is not a law firm and does not provide legal advice. Multiservicios 360 does not prepare legal documents on behalf of users. Multiservicios 360 provides access to software tools that allow users to create their own documents based solely on information and selections provided by the user.', y);
    y += 8;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(30, 58, 138);
    doc.text(lang === 'es' ? 'RESPONSABILIDAD DEL USUARIO' : 'USER RESPONSIBILITY', m, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
    y = dWrap(lang === 'es'
      ? 'El usuario es el unico responsable de la precision, integridad y efecto legal de este documento.'
      : 'The user is solely responsible for the accuracy, completeness, and legal effect of this document.', y);
    y += 8;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(30, 58, 138);
    doc.text(lang === 'es' ? 'RECONOCIMIENTO DEL USUARIO' : 'USER ACKNOWLEDGMENT', m, y); y += 6;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);

    const ackItems = lang === 'es'
      ? ['Yo cree este documento por mi cuenta utilizando herramientas de software proporcionadas por Multiservicios 360;',
        'No se me proporciono asesoria legal ni servicios de preparacion de documentos;',
        'Soy responsable de toda la informacion contenida en este documento; y',
        'Entiendo que este documento puede tener consecuencias legales significativas.']
      : ['I created this document myself using software tools provided by Multiservicios 360;',
        'No legal advice or document preparation services were provided to me;',
        'I am responsible for all information contained in this document; and',
        'I understand that this document may have significant legal consequences.'];

    y = dWrap(lang === 'es' ? 'Al firmar electronicamente a continuacion, reconozco y acepto que:' : 'By signing electronically below, I acknowledge and agree that:', y);
    y += 4;
    for (const item of ackItems) { doc.text('\u2022', m + 4, y); y = dWrap(item, y); y += 2; }
    y += 12;

    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(30, 58, 138);
    doc.text(lang === 'es' ? 'FIRMA ELECTRONICA:' : 'ELECTRONIC SIGNATURE:', m, y); y += 8;
    doc.setFillColor(248, 250, 252); doc.setDrawColor(30, 58, 138); doc.setLineWidth(0.6);
    doc.roundedRect(m, y, 130, 18, 3, 3, 'FD');
    doc.setFont('helvetica', 'italic'); doc.setFontSize(16); doc.setTextColor(30, 58, 138);
    doc.text(electronicSignature, m + 6, y + 12); y += 24;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(0, 0, 0);
    doc.text((lang === 'es' ? 'Fecha: ' : 'Date: ') + executionDate, m, y);

    // === FOOTER (every page — premium branded) ===
    const pc = doc.internal.getNumberOfPages();
    const footer = 'Multi Servicios 360  |  www.multiservicios360.net  |  855.246.7274';
    for (let i = 1; i <= pc; i++) {
      doc.setPage(i);
      // Gold accent line
      doc.setDrawColor(245, 158, 11); doc.setLineWidth(0.5);
      doc.line(m, ph - 16, pw - m, ph - 16);
      // Navy bottom line
      doc.setDrawColor(30, 58, 138); doc.setLineWidth(0.3);
      doc.line(m, ph - 15.5, pw - m, ph - 15.5);
      // Footer text
      doc.setFontSize(7.5); doc.setTextColor(100, 116, 139); doc.setFont('helvetica', 'normal');
      doc.text(footer, pw / 2, ph - 11, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.text((lang === 'es' ? 'Página ' : 'Page ') + i + (lang === 'es' ? ' de ' : ' of ') + pc, pw - m, ph - 11, { align: 'right' });
      doc.setFontSize(6); doc.setTextColor(180, 180, 180); doc.setFont('helvetica', 'normal');
      doc.text(versionId, m, ph - 11);
      doc.setTextColor(0, 0, 0);
    }

    // === NOTARY FORM (appended AFTER page numbering — not counted in pages) ===
    const formData = matter?.form_data || {};
    const guardianshipTier = formData.tier || 'basic';
    const guardianshipNeedsNotary = docType === 'guardianship_designation' && (guardianshipTier === 'standard' || guardianshipTier === 'premium');
    const needsNotary = NOTARY_DOCS.includes(docType) || guardianshipNeedsNotary || docType === 'travel_authorization';
    let finalBlob;
    const fileSlug = docType.replace(/_/g, '-');
    const clientName = matter?.client_name || 'Document';
    const fileName = fileSlug + '_' + clientName.replace(/\s+/g, '_') + '_' + lang.toUpperCase() + '.pdf';

    if (needsNotary) {
      try {
        const notaryRes = await fetch('/api/notary-form');
        const notaryBytes = await notaryRes.arrayBuffer();
        const notaryPdf = await PDFDocument.load(notaryBytes);
        const mainPdf = await PDFDocument.load(doc.output('arraybuffer'));
        const [notaryPage] = await mainPdf.copyPages(notaryPdf, [0]);
        mainPdf.addPage(notaryPage);
        const pdfBytes = await mainPdf.save();
        const lockedBytes = await lockPdf(pdfBytes);
        finalBlob = new Blob([lockedBytes], { type: 'application/pdf' });
      } catch (notaryErr) {
        console.error('Notary form error:', notaryErr);
        const rawBytes = doc.output('arraybuffer');
        const lockedFallback = await lockPdf(new Uint8Array(rawBytes));
        finalBlob = new Blob([lockedFallback], { type: 'application/pdf' });
        alert(lang === 'es' ? 'Documento generado. El formulario notarial no se pudo adjuntar.' : 'Document generated. Notary form could not be attached.');
      }
    } else {
      const rawBytes = doc.output('arraybuffer');
      const lockedBytes = await lockPdf(new Uint8Array(rawBytes));
      finalBlob = new Blob([lockedBytes], { type: 'application/pdf' });
    }

    const url = URL.createObjectURL(finalBlob);
    if (returnOnly) return finalBlob;
    const link = document.createElement('a'); link.href = url; link.download = fileName; link.click();
    URL.revokeObjectURL(url);

    saveToVault({ blob: finalBlob, matterId, clientName: matter?.client_name, clientEmail: matter?.client_email, documentType: fileSlug, language: lang, fileName });

    if (!isFinalized) {
      setIsFinalized(true);
      try {
        await fetch('/api/simple-doc/matters/' + matterId + '/finalize', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ execution_date: executionDate, electronic_signature: electronicSignature, signed_at_utc: auditData.signedAtUtc, signed_at_local: auditData.signedAtLocal, document_version_id: auditData.documentVersionId }),
        });
      } catch (e) { console.log('Finalize save error:', e); }
    }
  };

  const handlePrint = () => { alert(language === 'es' ? 'Para imprimir:\n\n1. Descargue el PDF\n2. Abra el archivo PDF\n3. Use Ctrl+P o Archivo > Imprimir' : 'To print:\n\n1. Download the PDF\n2. Open the PDF file\n3. Use Ctrl+P or File > Print'); };
  const handleEmail = () => {
    const dn = DOC_TITLES[docType]?.[language] || docType;
    const s = encodeURIComponent(dn + ' - Multi Servicios 360');
    const b = encodeURIComponent(language === 'es' ? 'Adjunto encontrara su ' + dn + '.\n\nMulti Servicios 360\n855.246.7274' : 'Please find your ' + dn + ' attached.\n\nMulti Servicios 360\n855.246.7274');
    window.open('mailto:?subject=' + s + '&body=' + b);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #E5E7EB', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
        <p style={{ color: '#6B7280' }}>{language === 'es' ? 'Cargando...' : 'Loading...'}</p>
      </div>
      <style>{('@keyframes spin { to { transform: rotate(360deg); } }')}</style>
    </div>
  );

  const docTitleDisplay = DOC_TITLES[docType]?.[language] || docType;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
    <Navbar lang={language} />
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F9FF', padding: 'clamp(12px, 4vw, 24px)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '12px', padding: 'clamp(20px, 5vw, 48px) clamp(16px, 5vw, 32px)', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', background: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#374151' }}><GlobeIcon /> {t.langToggle}</button>
        </div>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#059669' }}><CheckIcon /></div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>{t.title}</h1>
        <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '8px' }}>{t.subtitle}</p>
        <p style={{ fontSize: '14px', color: '#1E3A8A', fontWeight: '600', marginBottom: '24px' }}>{docTitleDisplay}</p>
        {matterId && (<div style={{ backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '12px', marginBottom: '24px' }}><p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{t.orderNumber}</p><p style={{ fontSize: '12px', fontWeight: '600', color: '#1F2937', margin: '4px 0 0', wordBreak: 'break-all' }}>{matterId}</p></div>)}
        <p style={{ color: '#6B7280', marginBottom: '32px' }}>{t.thankYou}</p>

        <div style={{ backgroundColor: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: '12px', padding: '20px', marginBottom: '16px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><CalendarIcon /><label style={{ fontSize: '16px', fontWeight: '600', color: '#92400E' }}>{t.executionDateLabel} *</label></div>
          <p style={{ fontSize: '12px', color: '#B45309', marginBottom: '12px', margin: '0 0 12px 0' }}>{t.executionDateHelp}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="text" value={executionDate} onChange={(e) => { setExecutionDate(formatDateInput(e.target.value)); if (dateError) setDateError(''); }} placeholder={t.executionDatePlaceholder} maxLength={10} disabled={isFinalized} style={{ padding: '12px 16px', fontSize: '16px', border: dateError ? '2px solid #DC2626' : '2px solid #D1D5DB', borderRadius: '8px', width: '160px', fontFamily: 'monospace', backgroundColor: isFinalized ? '#F3F4F6' : 'white' }} />
            <button type="button" onClick={() => setExecutionDate(getLADate())} disabled={isFinalized} style={{ padding: '12px 16px', fontSize: '14px', backgroundColor: isFinalized ? '#9CA3AF' : '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: isFinalized ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>{t.useTodayDate}</button>
          </div>
          {dateError && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>⚠️ {dateError}</p>}
        </div>

        <div style={{ backgroundColor: '#EDE9FE', border: '2px solid #8B5CF6', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><PenIcon /><label style={{ fontSize: '16px', fontWeight: '600', color: '#5B21B6' }}>{t.signatureLabel} *</label></div>
          <p style={{ fontSize: '12px', color: '#6D28D9', marginBottom: '12px', margin: '0 0 12px 0' }}>{t.signatureHelp}</p>
          <input type="text" value={electronicSignature} onChange={(e) => { setElectronicSignature(e.target.value); if (signatureError) setSignatureError(''); }} placeholder={t.signaturePlaceholder} disabled={isFinalized} style={{ width: '100%', padding: '14px 16px', fontSize: '18px', fontFamily: 'cursive, serif', fontStyle: 'italic', border: signatureError ? '2px solid #DC2626' : '2px solid #D1D5DB', borderRadius: '8px', marginBottom: '12px', backgroundColor: isFinalized ? '#F3F4F6' : 'white', boxSizing: 'border-box' }} />
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: isFinalized ? 'not-allowed' : 'pointer' }}>
            <input type="checkbox" checked={signatureAccepted} onChange={(e) => { setSignatureAccepted(e.target.checked); if (signatureError) setSignatureError(''); }} disabled={isFinalized} style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: '#8B5CF6' }} />
            <span style={{ fontSize: '13px', color: '#5B21B6', lineHeight: '1.4' }}>{t.signatureAcceptLabel}</span>
          </label>
          {signatureError && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>⚠️ {signatureError}</p>}
          {isFinalized && <p style={{ color: '#059669', fontSize: '14px', marginTop: '12px', margin: '12px 0 0 0', fontWeight: '500' }}>✅ {t.finalized}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <button onClick={() => generatePDF(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}><DownloadIcon /> {t.downloadSpanish}</button>
          <button onClick={() => generatePDF(false)} disabled={translating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: translating ? '#9CA3AF' : '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: translating ? 'wait' : 'pointer' }}><DownloadIcon /> {translating ? (language === 'es' ? 'Traduciendo...' : 'Translating...') : t.downloadEnglish}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}><PrintIcon /> {t.print}</button>
          <button onClick={handleEmail} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}><EmailIcon /> {t.email}</button>
        </div>

        <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', padding: '12px', marginBottom: '24px' }}><p style={{ fontSize: '12px', color: '#92400E', margin: 0 }}>{t.legalNote}</p></div>

        {(NOTARY_DOCS.includes(docType) || docType === 'travel_authorization' || (docType === 'guardianship_designation' && matter?.form_data?.tier && matter.form_data.tier !== 'basic')) && (
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #F87171', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#991B1B', margin: 0, fontWeight: '600' }}>
              {language === 'es' ? '\u26A0\uFE0F IMPORTANTE: Este documento requiere notarizacion. El formulario de reconocimiento notarial de California esta incluido al final del PDF. Lleve este documento a un notario publico para completar la notarizacion.' : '\u26A0\uFE0F IMPORTANT: This document requires notarization. The California notary acknowledgment form is included at the end of the PDF. Take this document to a notary public to complete the notarization.'}
            </p>
          </div>
        )}

        {/* Required Documents Checklist - Quitclaim Deed */}
        {docType === 'quitclaim_deed' && (
          <div style={{ backgroundColor: '#EFF6FF', border: '2px solid #3B82F6', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '22px' }}>📋</span>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E40AF', margin: 0 }}>
                {language === 'es' ? 'Documentos que necesitas para completar este trámite' : 'Documents you need to complete this process'}
              </h3>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                language === 'es'
                  ? { icon: '🪪', title: 'Identificación con foto', desc: 'Licencia de conducir, pasaporte o ID estatal — para notarización' }
                  : { icon: '🪪', title: 'Photo ID', desc: "Driver's license, passport or state ID — required for notarization" },
                language === 'es'
                  ? { icon: '📄', title: 'Escritura actual de la propiedad', desc: 'La "Grant Deed" o escritura vigente que demuestra que eres el dueño actual' }
                  : { icon: '📄', title: 'Current property deed', desc: 'The current Grant Deed showing you are the current owner' },
                language === 'es'
                  ? { icon: '🏠', title: 'Número de Parcela del Assessor (APN)', desc: 'Aparece en tu estado de cuenta del impuesto predial o en el portal del condado' }
                  : { icon: '🏠', title: "Assessor's Parcel Number (APN)", desc: 'Found on your property tax bill or county assessor website' },
                language === 'es'
                  ? { icon: '📍', title: 'Descripción legal de la propiedad', desc: 'Copiada exactamente de tu escritura actual — inclúyela igual al presentarla' }
                  : { icon: '📍', title: 'Legal description of the property', desc: 'Copied exactly from your current deed — must match exactly when recorded' },
                language === 'es'
                  ? { icon: '💰', title: 'Formulario PCOR (Preliminary Change of Ownership)', desc: 'Requerido por el condado al presentar la escritura. Disponible gratis en la oficina del condado o en línea' }
                  : { icon: '💰', title: 'PCOR Form (Preliminary Change of Ownership)', desc: 'Required by the county when recording. Available free from the county recorder or online' },
                language === 'es'
                  ? { icon: '🏛️', title: 'Tarifa de presentación al condado', desc: 'Aprox. $15–$25 por página — pagada directamente en la oficina del registrador del condado' }
                  : { icon: '🏛️', title: 'County recording fee', desc: 'Approx. $15–$25 per page — paid directly at the county recorder\'s office' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'white', borderRadius: '8px', padding: '12px' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#1E3A8A' }}>{item.title}</div>
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px', padding: '10px 14px', background: '#DBEAFE', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#1E40AF', margin: 0, fontWeight: '600' }}>
                {language === 'es'
                  ? '📌 Paso final: Después de notarizar, lleva la escritura a la oficina del registrador de tu condado para presentarla oficialmente. Este paso es lo que hace que el traspaso sea legal y público.'
                  : '📌 Final step: After notarization, bring the deed to your county recorder\'s office to officially record it. This step is what makes the transfer legally effective and public record.'}
              </p>
            </div>
          </div>
        )}

        {/* Required Documents Checklist - Small Estate Affidavit */}
        {docType === 'small_estate_affidavit' && (
          <div style={{ backgroundColor: '#F0FDF4', border: '2px solid #10B981', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '22px' }}>📋</span>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46', margin: 0 }}>
                {language === 'es' ? 'Documentos que necesitas para completar este trámite' : 'Documents you need to complete this process'}
              </h3>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                language === 'es'
                  ? { icon: '🪪', title: 'Identificación con foto del solicitante', desc: 'Licencia, pasaporte o ID estatal — para notarización' }
                  : { icon: '🪪', title: 'Photo ID of the claimant', desc: "Driver's license, passport or state ID — required for notarization" },
                language === 'es'
                  ? { icon: '📜', title: 'Certificado de defunción del fallecido', desc: 'Copia certificada emitida por el condado o el estado' }
                  : { icon: '📜', title: 'Certified death certificate', desc: 'Certified copy issued by the county or state' },
                language === 'es'
                  ? { icon: '📋', title: 'Prueba de propiedad del bien', desc: 'Título del vehículo, estado de cuenta bancario, escritura u otro documento que muestre que el bien pertenecía al fallecido' }
                  : { icon: '📋', title: 'Proof of ownership of the asset', desc: "Vehicle title, bank statement, deed, or other document showing the asset belonged to the deceased" },
                language === 'es'
                  ? { icon: '👨‍👩‍👧', title: 'Documentos de parentesco (si aplica)', desc: 'Acta de matrimonio, acta de nacimiento u otro documento que demuestre la relación con el fallecido' }
                  : { icon: '👨‍👩‍👧', title: 'Proof of relationship (if applicable)', desc: 'Marriage certificate, birth certificate, or other document proving your relationship to the deceased' },
                language === 'es'
                  ? { icon: '📝', title: 'Testamento (si existe)', desc: 'Copia del testamento del fallecido, si lo tenía — aunque no es obligatorio para usar esta declaración' }
                  : { icon: '📝', title: 'Will (if one exists)', desc: "Copy of the deceased's will, if they had one — not required but helpful" },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'white', borderRadius: '8px', padding: '12px' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#065F46' }}>{item.title}</div>
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px', padding: '10px 14px', background: '#D1FAE5', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#065F46', margin: 0, fontWeight: '600' }}>
                {language === 'es'
                  ? '📌 Este proceso solo aplica si el valor total de los bienes del fallecido en California es menor a $184,500 (sin incluir bienes en fideicomiso o con beneficiario designado). Si el patrimonio es mayor, se requiere proceso de sucesión (probate) formal.'
                  : '📌 This process only applies if the total value of the deceased\'s California assets is less than $184,500 (excluding trust assets or assets with a designated beneficiary). If the estate is larger, formal probate is required.'}
              </p>
            </div>
          </div>
        )}

        {(NOTARY_DOCS.includes(docType) || docType === 'travel_authorization' || (docType === 'guardianship_designation' && matter?.form_data?.tier && matter.form_data.tier !== 'basic')) && (
          <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)', borderRadius: '12px', padding: '20px', marginBottom: '24px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>🔏</span>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
                {language === 'es' ? 'Notarización en Línea' : 'Online Notarization'}
              </h3>
            </div>
            <p style={{ fontSize: '13px', margin: '0 0 4px 0', opacity: 0.9 }}>
              {language === 'es'
                ? 'Notarice su documento desde casa con un notario certificado por video. Solo necesita su documento PDF, una identificación con foto y una computadora con cámara.'
                : 'Notarize your document from home with a certified notary by video. You just need your PDF document, a photo ID, and a computer with a camera.'}
            </p>
            <p style={{ fontSize: '12px', margin: '0 0 12px 0', opacity: 0.7 }}>
              {language === 'es'
                ? '24/7 • Válido en los 50 estados • $25 por documento • Proporcionado por OneNotary'
                : '24/7 • Valid in all 50 states • $25 per document • Powered by OneNotary'}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://onenotary.com/notarize-a-document/" target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'white', color: '#4F46E5', borderRadius: '8px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                🎥 {language === 'es' ? 'Notarizar Ahora — $25 →' : 'Notarize Now — $25 →'}
              </a>
            </div>
            <p style={{ fontSize: '11px', margin: '10px 0 0 0', opacity: 0.6 }}>
              {language === 'es'
                ? 'Instrucciones: 1) Descargue su PDF arriba  2) Haga clic en el botón  3) Suba su PDF en OneNotary  4) Verifique su identidad  5) Conéctese con el notario'
                : 'Instructions: 1) Download your PDF above  2) Click the button  3) Upload your PDF on OneNotary  4) Verify your identity  5) Connect with the notary'}
            </p>
          </div>
        )}

        {/* Vault Subscription Upsell */}
        <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)', borderRadius: '12px', padding: '20px', marginBottom: '24px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '22px' }}>🔒</span>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
              {language === 'es' ? 'Tu Bóveda Digital — 90 días GRATIS incluidos' : 'Your Digital Vault — 90 FREE days included'}
            </h3>
          </div>
          <p style={{ fontSize: '13px', margin: '0 0 12px 0', opacity: 0.9 }}>
            {language === 'es'
              ? 'Tu documento ya está guardado de forma segura en tu Bóveda Digital. Tienes acceso gratuito por 90 días. Después de eso, activa tu suscripción para mantener acceso ilimitado y guardar todos tus documentos futuros.'
              : 'Your document is already securely saved in your Digital Vault. You have free access for 90 days. After that, activate your subscription to keep unlimited access and save all your future documents.'}
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <a href="/boveda-premium?plan=monthly" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: 'white', color: '#1E3A8A', borderRadius: '8px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
              {language === 'es' ? '📅 Mensual — $4.99/mes' : '📅 Monthly — $4.99/mo'}
            </a>
            <a href="/boveda-premium?plan=annual" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#F59E0B', color: '#1F2937', borderRadius: '8px', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
              {language === 'es' ? '⭐ Anual — $49/año (ahorra 18%)' : '⭐ Annual — $49/yr (save 18%)'}
            </a>
          </div>
          <p style={{ fontSize: '11px', margin: 0, opacity: 0.65 }}>
            {language === 'es'
              ? '✓ Documentos ilimitados  ✓ Acceso 24/7  ✓ Cancela cuando quieras  ✓ Descuentos en futuros documentos'
              : '✓ Unlimited documents  ✓ 24/7 access  ✓ Cancel anytime  ✓ Discounts on future documents'}
          </p>
        </div>

        <div style={{ textAlign: 'left', backgroundColor: '#EFF6FF', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E40AF', marginBottom: '12px' }}>{t.nextSteps}</h3>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#1E40AF' }}>
            <li style={{ marginBottom: '8px' }}>{t.step1}</li><li style={{ marginBottom: '8px' }}>{t.step2}</li><li style={{ marginBottom: '8px' }}>{t.step3}</li><li style={{ marginBottom: '8px' }}>{t.step4}</li><li>{t.step5}</li>
          </ol>
        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}><p style={{ color: '#6B7280', marginBottom: '8px' }}>{t.questions}</p><p style={{ fontWeight: '600', color: '#1F2937' }}>{t.contact}</p></div>
        <a href="/" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 24px', color: '#2563EB', border: '2px solid #2563EB', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>{t.backHome}</a>
      </div>
      <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280', fontSize: '12px' }}>Multi Servicios 360 | www.multiservicios360.net | 855.246.7274</div>
    </div>
    </div>
  );
}

export default function SimpleDocSuccessPage() {
  return (<Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF' }}><p style={{ color: '#6B7280' }}>Loading...</p></div>}><SuccessContent /></Suspense>);
}
