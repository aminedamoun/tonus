/**
 * WhatsApp Integration Utility
 * Phone: +971581391113
 */

const WHATSAPP_PHONE = '971581391113';

export function createWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
}

export function createOrderMessage(dishName: string, price: string): string {
  return `I would like to order ${dishName} - ${price}`;
}

export function createReservationMessage(): string {
  return 'Hi! I would like to make a reservation at Tonos Greek Restaurant. Could you please help me with availability?';
}

export function createGeneralInquiryMessage(): string {
  return 'Hi! I have a question about Tonos Greek Restaurant.';
}

export function createContactMessage(): string {
  return 'Hi! I would like to get in touch with Tonos Greek Restaurant.';
}
