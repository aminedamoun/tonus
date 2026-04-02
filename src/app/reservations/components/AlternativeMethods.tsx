import Icon from '@/components/ui/AppIcon';
import { createWhatsAppLink, createReservationMessage } from '@/lib/whatsapp';

export default function AlternativeMethods() {
  const reservationMessage = createReservationMessage();
  const whatsappLink = createWhatsAppLink(reservationMessage);

  const methods = [
    {
      id: 'method_whatsapp',
      icon: 'ChatBubbleLeftRightIcon',
      title: 'WhatsApp Booking',
      description: 'Quick reservation via WhatsApp',
      href: whatsappLink,
      color: 'bg-success',
    },
    {
      id: 'method_phone',
      icon: 'PhoneIcon',
      title: 'Call Us',
      description: 'Speak directly with our team',
      href: 'tel:+971581391113',
      color: 'bg-primary',
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {methods.map((method) => (
        <a
          key={method.id}
          href={method.href}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-card p-8 flex flex-col items-center text-center space-y-4 hover:scale-105 transition-transform"
        >
          <div className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center`}>
            <Icon name={method.icon as any} size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">{method.title}</h3>
            <p className="text-sm text-muted-foreground">{method.description}</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Book Now →
          </span>
        </a>
      ))}
    </div>
  )
}