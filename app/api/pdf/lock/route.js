export const dynamic = 'force-dynamic';
// app/api/pdf/lock/route.js
// Server-side PDF locking using qpdf
// Receives a PDF (base64 or file upload), returns a locked PDF that can't be edited or copied
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile, readFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

// Owner password — users can open but not edit/copy/extract
const OWNER_PASSWORD = process.env.PDF_OWNER_PASSWORD || 'MS360Secure2026!';

export async function POST(request) {
  const id = randomUUID();
  const inPath = join(tmpdir(), `ms360_in_${id}.pdf`);
  const outPath = join(tmpdir(), `ms360_out_${id}.pdf`);

  try {
    const contentType = request.headers.get('content-type') || '';
    let pdfBuffer;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('pdf');
      if (!file) return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
      pdfBuffer = Buffer.from(await file.arrayBuffer());
    } else {
      const body = await request.json();
      if (!body.pdf_base64) return NextResponse.json({ error: 'No pdf_base64 provided' }, { status: 400 });
      pdfBuffer = Buffer.from(body.pdf_base64, 'base64');
    }

    // Write input PDF to temp file
    await writeFile(inPath, pdfBuffer);

    // Run qpdf to lock the PDF:
    // - No user password (anyone can open)
    // - Owner password (blocks editing in Acrobat etc.)
    // - Disable printing (set to low quality only), modify, copy, extract
    // - AES 256-bit encryption
    const cmd = `qpdf --encrypt "" "${OWNER_PASSWORD}" 256 --print=low --modify=none --extract=n --copy-content=n --use-aes=y -- "${inPath}" "${outPath}"`;

    await new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        // qpdf exits 0=success, 3=warning (still works), other=error
        if (error && error.code !== 3) reject(new Error(stderr || error.message));
        else resolve();
      });
    });

    const lockedBuffer = await readFile(outPath);

    // Cleanup temp files
    unlink(inPath).catch(() => {});
    unlink(outPath).catch(() => {});

    return new NextResponse(lockedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
        'Content-Length': String(lockedBuffer.length),
      },
    });
  } catch (err) {
    // Cleanup on error
    unlink(inPath).catch(() => {});
    unlink(outPath).catch(() => {});
    console.error('PDF lock error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
