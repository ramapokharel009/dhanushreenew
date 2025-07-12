
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  currentUrl: string;
  onUrlChange: (url: string) => void;
  section?: string;
  label?: string;
}

export const ImageUpload = ({ currentUrl, onUrlChange, section, label }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (section) {
        formData.append('section', section);
      }

      console.log('Uploading file:', file.name, 'for section:', section);

      const { data, error } = await supabase.functions.invoke('upload-image', {
        body: formData,
      });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      if (data?.success && data?.url) {
        onUrlChange(data.url);
        toast({
          title: "Upload successful",
          description: `Image uploaded and URL updated for ${label || section || 'field'}.`,
        });
      } else {
        throw new Error(data?.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          type="url"
          value={currentUrl || ''}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Image URL"
          className="flex-1"
        />
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            className="whitespace-nowrap"
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isUploading ? 'Uploading...' : `Upload${label ? ` for ${label}` : ''}`}
          </Button>
        </div>
      </div>
      {currentUrl && (
        <div className="text-xs text-theme-text-muted">
          Current: {currentUrl}
        </div>
      )}
    </div>
  );
};
