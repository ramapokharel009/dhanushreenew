
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContactInfo {
  type: string;
  value: string;
  label?: string;
}

interface BusinessHours {
  [key: string]: string;
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data } = await supabase
        .from('contact_info')
        .select('type, value, label')
        .eq('is_primary', true);
      
      if (data) {
        setContactInfo(data);
      }
    };

    const fetchBusinessHours = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'business_hours')
        .single();
      
      if (data?.value) {
        setBusinessHours(data.value as unknown as BusinessHours);
      }
    };

    fetchContactInfo();
    fetchBusinessHours();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        });

      if (error) throw error;

      toast({
        title: 'Message sent successfully!',
        description: 'We will get back to you soon.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'Error sending message',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContactByType = (type: string) => {
    return contactInfo.find(info => info.type === type)?.value || '';
  };

  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-theme-text-primary mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-theme-text-secondary max-w-3xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-theme-text-primary mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    {getContactByType('address') && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-theme-primary mt-1" />
                        <div>
                          <p className="font-medium text-theme-text-primary">Address</p>
                          <p className="text-theme-text-secondary">{getContactByType('address')}</p>
                        </div>
                      </div>
                    )}
                    {getContactByType('phone') && (
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-theme-primary mt-1" />
                        <div>
                          <p className="font-medium text-theme-text-primary">Phone</p>
                          <p className="text-theme-text-secondary">{getContactByType('phone')}</p>
                        </div>
                      </div>
                    )}
                    {getContactByType('email') && (
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-theme-primary mt-1" />
                        <div>
                          <p className="font-medium text-theme-text-primary">Email</p>
                          <p className="text-theme-text-secondary">{getContactByType('email')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              {Object.keys(businessHours).length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-theme-text-primary mb-4 flex items-center">
                      <Clock className="h-5 w-5 text-theme-primary mr-2" />
                      Business Hours
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(businessHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium text-theme-text-primary">
                            {formatDayName(day)}:
                          </span>
                          <span className="text-theme-text-secondary">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-theme-text-primary mb-6">
                  Send us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={6}
                      required
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-theme-button-primary hover:bg-theme-button-primary-hover text-white"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
