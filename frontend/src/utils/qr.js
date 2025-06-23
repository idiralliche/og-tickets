import QRCode from 'qrcode';

/**
 * Generate a QR code DataUrl from object {id, hmac}
 * @param {Object} param0
 * @param {string} param0.ticket_id
 * @param {string} param0.hmac
 * @returns {Promise<string>} DataURL of the QR code
 * @throws {Error} If QR code generation fails
 */
export async function generateQrDataUrl({ ticket_id, hmac }) {
  const value = JSON.stringify({ id: ticket_id, hmac });
  try {
    return await QRCode.toDataURL(value, { width: 400, margin: 2 });
  } catch (error) {
    console.error('Erreur lors de la génération du QR code :', error);
    throw error;
  }
}
