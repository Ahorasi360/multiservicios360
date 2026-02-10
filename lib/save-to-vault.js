export async function saveToVault({ blob, matterId, clientName, clientEmail, documentType, language, fileName }) {
  if (!blob || !matterId) {
    console.log('Vault save skipped: missing blob or matterId');
    return null;
  }
  try {
    const formData = new FormData();
    formData.append('file', blob, fileName || 'document.pdf');
    formData.append('matter_id', matterId);
    if (clientName) formData.append('client_name', clientName);
    if (clientEmail) formData.append('client_email', clientEmail);
    formData.append('document_type', documentType || 'other');
    formData.append('language', language || 'en');
    formData.append('file_name', fileName || 'document.pdf');
    const res = await fetch('/api/vault/auto-save', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      console.log('Document saved to vault:', data.vault_url);
      return data;
    } else {
      console.error('Vault save error:', data.error);
      return null;
    }
  } catch (err) {
    console.error('Vault save failed:', err);
    return null;
  }
}
