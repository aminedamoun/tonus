'use client';
import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  seatingArea: 'non-smoking' | 'smoking';
  seatingType: 'indoor' | 'outdoor';
  specialRequests: string;
}

export default function BookingForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    seatingArea: 'non-smoking',
    seatingType: 'indoor',
    specialRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const timeSlots = [
    '12:00 PM',
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
    '9:30 PM',
    '10:00 PM',
  ];

  const guestOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-reservation-email`,
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
        throw new Error(data.error || 'Failed to send reservation');
      }

      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          date: '',
          time: '',
          guests: '2',
          seatingArea: 'non-smoking',
          seatingType: 'indoor',
          specialRequests: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error sending reservation:', error);
      setIsSubmitting(false);
      alert('Failed to send reservation. Please try again or contact us directly.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="floating-card max-w-2xl mx-auto p-8 md:p-12">
      {showSuccess ? (
        <div className="text-center space-y-6 py-12">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto border-2 border-success/40 shadow-blue-glow transition-all duration-500 hover:border-success/60 hover:shadow-blue-glow-lg">
            <Icon name="CheckCircleIcon" size={40} className="text-success" />
          </div>
          <h3 className="text-3xl font-serif text-foreground">Reservation Confirmed!</h3>
          <p className="text-muted-foreground">
            We&apos;ve sent a confirmation email to {formData.email}. <br />
            We look forward to welcoming you!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wider">
                Full Name *
              </span>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="John Doe"
              />
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wider">
                  Phone *
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="+971 XX XXX XXXX"
                />
              </label>

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
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wider">
                  Date *
                </span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wider">
                  Time *
                </span>
                <div className="relative">
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="form-input appearance-none pr-10"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon name="ChevronDownIcon" size={20} className="text-primary" />
                  </div>
                </div>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wider">
                Number of Guests *
              </span>
              <div className="relative">
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  className="form-input appearance-none pr-10"
                >
                  {guestOptions.map((option) => (
                    <option key={option} value={option}>
                      {option} {option === '1' ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon name="ChevronDownIcon" size={20} className="text-primary" />
                </div>
              </div>
            </label>

            {/* Seating Area Preference */}
            <div className="space-y-3">
              <span className="text-sm font-bold text-foreground block uppercase tracking-wider">
                Seating Area Preference *
              </span>
              <div className="grid grid-cols-2 gap-4">
                <label className="seating-option">
                  <input
                    type="radio"
                    name="seatingArea"
                    value="non-smoking"
                    checked={formData.seatingArea === 'non-smoking'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`seating-card ${
                      formData.seatingArea === 'non-smoking' ? 'seating-card-active' : ''
                    }`}
                  >
                    <Icon name="NoSymbolIcon" size={24} className="mb-2" />
                    <span className="font-semibold text-sm">Non-Smoking</span>
                  </div>
                </label>
                <label className="seating-option">
                  <input
                    type="radio"
                    name="seatingArea"
                    value="smoking"
                    checked={formData.seatingArea === 'smoking'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`seating-card ${
                      formData.seatingArea === 'smoking' ? 'seating-card-active' : ''
                    }`}
                  >
                    <Icon name="FireIcon" size={24} className="mb-2" />
                    <span className="font-semibold text-sm">Smoking Area</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Seating Type Preference */}
            <div className="space-y-3">
              <span className="text-sm font-bold text-foreground block uppercase tracking-wider">
                Seating Type Preference *
              </span>
              <div className="grid grid-cols-2 gap-4">
                <label className="seating-option">
                  <input
                    type="radio"
                    name="seatingType"
                    value="indoor"
                    checked={formData.seatingType === 'indoor'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`seating-card ${
                      formData.seatingType === 'indoor' ? 'seating-card-active' : ''
                    }`}
                  >
                    <Icon name="HomeIcon" size={24} className="mb-2" />
                    <span className="font-semibold text-sm">Indoor</span>
                  </div>
                </label>
                <label className="seating-option">
                  <input
                    type="radio"
                    name="seatingType"
                    value="outdoor"
                    checked={formData.seatingType === 'outdoor'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`seating-card ${
                      formData.seatingType === 'outdoor' ? 'seating-card-active' : ''
                    }`}
                  >
                    <Icon name="SunIcon" size={24} className="mb-2" />
                    <span className="font-semibold text-sm">Outdoor</span>
                  </div>
                </label>
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-foreground mb-2 block uppercase tracking-wider">
                Special Requests
              </span>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                className="form-input resize-none"
                placeholder="Any dietary restrictions or special occasions?"
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
                Processing...
              </>
            ) : (
              <>
                <Icon name="CalendarIcon" size={20} />
                Confirm Reservation
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to our reservation policies. Cancellations must be made 24
            hours in advance.
          </p>
        </form>
      )}
    </div>
  );
}
