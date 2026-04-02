'use client';
import { useState } from 'react';
 import Icon from'@/components/ui/AppIcon';

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSubmitting(false)
      setShowSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        setFormData({ name: '', email: '', phone: '', message: '' })
      }, 3000)
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSubmitting(false);
      alert('Failed to send message. Please try again or contact us directly.');
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="floating-card max-w-2xl mx-auto p-8 md:p-12">
      {showSuccess ? (
        <div className="text-center space-y-6 py-12">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto border-2 border-success/40 shadow-blue-glow transition-all duration-500 hover:border-success/60 hover:shadow-blue-glow-lg">
            <Icon name="CheckCircleIcon" size={40} className="text-success" />
          </div>
          <h3 className="text-3xl font-serif text-foreground">Message Sent!</h3>
          <p className="text-muted-foreground">
            Thank you for reaching out. We'll respond to your inquiry within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wider">
                Your Name *
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="John Doe"
              />
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wider">
                  Email *
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="john@example.com"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wider">
                  Phone
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+971 XX XXX XXXX"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wider">
                Message *
              </span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="form-input resize-none"
                placeholder="How can we help you?"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Sending...
              </>
            ) : (
              <>
                <Icon name="PaperAirplaneIcon" size={20} />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}