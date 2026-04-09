import Icon from '@/components/ui/AppIcon';
import { createWhatsAppLink, createContactMessage } from '@/lib/whatsapp';

interface ContactMethod {
  id: string;
  icon: string;
  label: string;
  value: string;
  href: string;
  color: string;
}

export default function ContactMethods() {
  const whatsappMessage = createContactMessage();
  const whatsappLink = createWhatsAppLink(whatsappMessage);

  const methods: ContactMethod[] = [
    {
      id: 'method_phone',
      icon: 'PhoneIcon',
      label: 'Phone',
      value: '+971 58 139 1113',
      href: 'tel:+971581391113',
      color: 'bg-primary',
    },
    {
      id: 'method_email',
      icon: 'EnvelopeIcon',
      label: 'Email',
      value: 'tonosdxb@gmail.com',
      href: 'mailto:tonosdxb@gmail.com',
      color: 'bg-secondary',
    },
    {
      id: 'method_whatsapp',
      icon: 'ChatBubbleLeftRightIcon',
      label: 'WhatsApp',
      value: '+971 58 139 1113',
      href: whatsappLink,
      color: 'bg-success',
    },
    {
      id: 'method_social',
      icon: 'CameraIcon',
      label: 'Instagram',
      value: '@tonosgreekrestaurant',
      href: 'https://www.instagram.com/tonosgreekrestaurant',
      color: 'bg-accent',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {methods.map((method) => (
        <a
          key={method.id}
          href={method.href}
          target={method.href.startsWith('http') ? '_blank' : undefined}
          rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="floating-card p-6 flex flex-col items-center text-center space-y-4"
        >
          <div
            className={`w-14 h-14 ${method.color} rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-blue-glow transition-all duration-500 hover:border-white/40 hover:shadow-blue-glow-lg`}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Icon name={method.icon as any} size={28} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              {method.label}
            </p>
            <p className="text-sm font-semibold text-foreground">{method.value}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
