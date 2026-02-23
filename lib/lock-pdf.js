// lib/lock-pdf.js
// Call this after generating a PDF to lock it before downloading/saving
// Usage: const lockedBytes = await lockPdf(pdfBytes);

export async function lockPdf(pdfBytes) {
  try {
    // Convert Uint8Array to base64
    const base64 = btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));

    const res = await fetch('/api/pdf/lock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdf_base64: base64 }),
    });

    if (!res.ok) {
      console.warn('PDF lock failed, using unlocked version:', await res.text());
      return pdfBytes; // Fallback to unlocked
    }

    const lockedBuffer = await res.arrayBuffer();
    return new Uint8Array(lockedBuffer);
  } catch (err) {
    console.warn('PDF lock error, using unlocked version:', err);
    return pdfBytes; // Fallback gracefully
  }
}

// Trigger a browser download of a locked PDF
export async function downloadLockedPdf(pdfBytes, filename = 'document.pdf') {
  const locked = await lockPdf(pdfBytes);
  const blob = new Blob([locked], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
