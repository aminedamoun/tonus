import Icon from '@/components/ui/AppIcon';

interface Action {
  id: string
  icon: string
  label: string
  href: string
  color: string
}

export default function QuickActions() {
  const actions: Action[] = [
    {
      id: 'action_call',
      icon: 'PhoneIcon',
      label: 'Call Now',
      href: 'tel:+971581391113',
      color: 'bg-primary',
    },
    {
      id: 'action_whatsapp',
      icon: 'ChatBubbleLeftRightIcon',
      label: 'WhatsApp',
      href: 'https://wa.me/971581391113',
      color: 'bg-success',
    },
    {
      id: 'action_directions',
      icon: 'MapIcon',
      label: 'Get Directions',
      href: 'https://maps.app.goo.gl/93QcuKCwUEwK57uy9',
      color: 'bg-secondary',
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {actions.map((action) => (
        <a
          key={action.id}
          href={action.href}
          target={action.href.startsWith('http') ? '_blank' : undefined}
          rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={`${action.color} text-white p-8 rounded-[32px] flex flex-col items-center justify-center text-center space-y-4 border-2 border-white/20 transition-all duration-450 hover:scale-105 hover:border-white/40 hover:shadow-blue-glow-lg`}
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/20 transition-all duration-500 hover:border-white/40 hover:shadow-blue-glow">
            <Icon name={action.icon as any} size={32} className="text-white" />
          </div>
          <span className="text-lg font-bold uppercase tracking-wider">{action.label}</span>
        </a>
      ))}
    </div>
  )
}