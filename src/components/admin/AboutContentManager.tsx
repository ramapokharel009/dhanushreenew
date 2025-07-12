import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from './ImageUpload';

interface AboutContent {
  id: string;
  section: string;
  title: string | null;
  content: string;
  image: string | null;
  order_index: number | null;
}

export const AboutContentManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<AboutContent | null>(null);
  const [formData, setFormData] = useState<Partial<AboutContent>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contents, isLoading } = useQuery({
    queryKey: ['admin-about-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('order_index')
        .order('section');
      
      if (error) throw error;
      return data as AboutContent[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (content: Omit<AboutContent, 'id'>) => {
      const { error } = await supabase
        .from('about_content')
        .insert([content]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-about-content'] });
      setIsDialogOpen(false);
      setEditingContent(null);
      setFormData({});
      toast({ title: "About content created successfully" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AboutContent> & { id: string }) => {
      const { error } = await supabase
        .from('about_content')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-about-content'] });
      setIsDialogOpen(false);
      setEditingContent(null);
      setFormData({});
      toast({ title: "About content updated successfully" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('about_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-about-content'] });
      toast({ title: "About content deleted successfully" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const contentData = {
      section: formData.section || '',
      title: formData.title || null,
      content: formData.content || '',
      image: formData.image || null,
      order_index: formData.order_index || null,
    };

    if (editingContent) {
      updateMutation.mutate({ id: editingContent.id, ...contentData });
    } else {
      createMutation.mutate(contentData);
    }
  };

  const openDialog = (content?: AboutContent) => {
    setEditingContent(content || null);
    setFormData(content || {});
    setIsDialogOpen(true);
  };

  const updateFormData = (field: keyof AboutContent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderContentPreview = (content: string) => {
    // Handle both string content and object content
    if (typeof content === 'object') {
      return (
        <div className="space-y-2">
          {Object.entries(content).map(([key, value]) => (
            <div key={key} className="flex justify-between items-start">
              <span className="font-medium text-sm capitalize">
                {key.replace(/_/g, ' ')}:
              </span>
              <span className="text-sm text-theme-text-muted max-w-xs text-right">
                {typeof value === 'string' ? (
                  value.length > 50 ? value.substring(0, 50) + '...' : value
                ) : (
                  JSON.stringify(value)
                )}
              </span>
            </div>
          ))}
        </div>
      );
    }
    
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-theme-text-primary">About Content</h1>
          <p className="text-theme-text-muted">Manage content sections for the about page</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Content Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? 'Edit Content Section' : 'Add New Content Section'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="section">Section *</Label>
                  <Input
                    id="section"
                    value={formData.section || ''}
                    onChange={(e) => updateFormData('section', e.target.value)}
                    placeholder="e.g., hero, mission, team"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order_index">Order</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index || ''}
                    onChange={(e) => updateFormData('order_index', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => updateFormData('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content || ''}
                  onChange={(e) => updateFormData('content', e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <ImageUpload
                  currentUrl={formData.image || ''}
                  onUrlChange={(url) => updateFormData('image', url)}
                  section={formData.section}
                  label={formData.title || formData.section}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editingContent ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-theme-hero-bg rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          contents?.map((content) => (
            <Card key={content.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-theme-text-primary">
                        {content.section}
                      </h3>
                      {content.title && (
                        <span className="text-theme-text-muted">• {content.title}</span>
                      )}
                    </div>
                    <div className="text-theme-text-muted mb-2">
                      {renderContentPreview(content.content)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-theme-text-muted">
                      {content.order_index && (
                        <span>Order: {content.order_index}</span>
                      )}
                      {content.image && (
                        <span>Has Image</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDialog(content)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(content.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
