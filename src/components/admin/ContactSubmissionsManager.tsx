
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

export const ContactSubmissionsManager = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin-contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactSubmission[];
    }
  });

  const filteredSubmissions = submissions?.filter(submission =>
    submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    if (!submissions || submissions.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Date'];
    const csvContent = [
      headers.join(','),
      ...submissions.map(sub => [
        `"${sub.name}"`,
        `"${sub.email}"`,
        `"${sub.phone || ''}"`,
        `"${sub.subject || ''}"`,
        `"${sub.message.replace(/"/g, '""')}"`,
        `"${new Date(sub.created_at).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-theme-text-primary">Contact Submissions</h1>
          <p className="text-theme-text-muted">View messages from your contact form</p>
        </div>
        <Button onClick={exportToCSV} disabled={!submissions || submissions.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

        <div className="grid gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-theme-hero-bg rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredSubmissions && filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{submission.name}</CardTitle>
                      <p className="text-theme-text-muted">{submission.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </Badge>
                      {submission.phone && (
                        <p className="text-sm text-theme-text-muted mt-1">
                          {submission.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {submission.subject && (
                    <div className="mb-3">
                      <strong className="text-theme-text-primary">Subject:</strong>
                      <p className="text-theme-text-muted">{submission.subject}</p>
                    </div>
                  )}
                  <div>
                    <strong className="text-theme-text-primary">Message:</strong>
                    <p className="text-theme-text-muted mt-1 whitespace-pre-wrap">
                      {submission.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-theme-text-muted">No contact submissions found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
