import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Loader2, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from './ImageUpload';

interface SiteSetting {
  id: string;
  key: string;  
  value: any;
  description: string | null;
}

export const SiteSettingsManager = () => {
  const [editingSettings, setEditingSettings] = useState<Record<string, any>>({});
  const [editingStates, setEditingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data as SiteSetting[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: any }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: "Settings Updated",
        description: "Site settings have been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update site settings: " + error.message,
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (settings) {
      const initialSettings: Record<string, any> = {};
      settings.forEach(setting => {
        initialSettings[setting.id] = setting.value;
      });
      setEditingSettings(initialSettings);
    }
  }, [settings]);

  const handleSave = (settingId: string) => {
    updateMutation.mutate({
      id: settingId,
      value: editingSettings[settingId]
    });
    setEditingStates(prev => ({ ...prev, [settingId]: false }));
  };

  const handleEdit = (settingId: string) => {
    setEditingStates(prev => ({ ...prev, [settingId]: true }));
  };

  const handleCancel = (settingId: string, originalValue: any) => {
    setEditingSettings(prev => ({
      ...prev,
      [settingId]: originalValue
    }));
    setEditingStates(prev => ({ ...prev, [settingId]: false }));
  };

  const handleInputChange = (settingId: string, value: any) => {
    setEditingSettings(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  const getFieldLabel = (key: string) => {
    const labels: Record<string, string> = {
      'header': 'Header Configuration',
      'footer': 'Footer Configuration', 
      'company_branding': 'Company Branding',
      'social_media': 'Social Media Links',
      'logo_width': 'Logo Width (px)',
      'hero_section_height_percentage': 'Hero Section Height',
      'products_page': 'Products Page Content',
      'theme_colors': 'Theme Colors',
      'hero_content': 'Hero Section Content',
      'price_toggle': 'Price Display Toggle'
    };
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const updateNestedValue = (obj: any, path: string[], value: any) => {
    const newObj = JSON.parse(JSON.stringify(obj));
    let current = newObj;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    return newObj;
  };

  const renderNestedFields = (obj: any, settingId: string, path: string[] = []): JSX.Element[] => {
    if (!obj || typeof obj !== 'object') return [];

    const fields: JSX.Element[] = [];

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          fields.push(
            <div key={`${path.join('.')}-${index}`} className="border rounded p-4 space-y-4">
              <h4 className="font-medium text-sm text-gray-700">Item {index + 1}</h4>
              {renderNestedFields(item, settingId, [...path, index.toString()])}
            </div>
          );
        }
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = [...path, key];
        const fieldKey = currentPath.join('.');
        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Handle nested objects
          fields.push(
            <div key={fieldKey} className="border rounded p-4 space-y-4">
              <h4 className="font-medium text-sm text-gray-700">{displayKey}</h4>
              {renderNestedFields(value, settingId, currentPath)}
            </div>
          );
        } else if (Array.isArray(value)) {
          // Handle arrays
          fields.push(
            <div key={fieldKey} className="space-y-2">
              <Label className="font-medium">{displayKey}</Label>
              {renderNestedFields(value, settingId, currentPath)}
            </div>
          );
        } else {
          // Handle primitive values
          fields.push(
            <div key={fieldKey} className="space-y-2">
              <Label className="font-medium">{displayKey}</Label>
              {key.includes('image') || key.includes('logo') || key.includes('icon') ? (
                <ImageUpload
                  currentUrl={value as string || ''}
                  onUrlChange={(url) => {
                    const updatedValue = updateNestedValue(editingSettings[settingId], currentPath, url);
                    handleInputChange(settingId, updatedValue);
                  }}
                  section={`${settingId}_${fieldKey}`}
                  label={displayKey}
                />
              ) : typeof value === 'string' && (value as string).length > 100 ? (
                <Textarea
                  value={value as string || ''}
                  onChange={(e) => {
                    const updatedValue = updateNestedValue(editingSettings[settingId], currentPath, e.target.value);
                    handleInputChange(settingId, updatedValue);
                  }}
                  rows={4}
                  placeholder={`Enter ${displayKey.toLowerCase()}`}
                />
              ) : (
                <Input
                  value={value as string || ''}
                  onChange={(e) => {
                    const updatedValue = updateNestedValue(editingSettings[settingId], currentPath, e.target.value);
                    handleInputChange(settingId, updatedValue);
                  }}
                  placeholder={`Enter ${displayKey.toLowerCase()}`}
                />
              )}
            </div>
          );
        }
      });
    }

    return fields;
  };

  const renderValueInput = (setting: SiteSetting, isEditing: boolean) => {
    const value = editingSettings[setting.id];
    
    if (!isEditing) {
      if (typeof value === 'object') {
        return (
          <div className="bg-gray-50 p-4 rounded border space-y-3">
            {renderReadOnlyObject(value)}
          </div>
        );
      }
      return (
        <div className="bg-gray-50 p-3 rounded border">
          {value || 'No value set'}
        </div>
      );
    }

    // Handle image fields
    if (setting.key.includes('image') || setting.key.includes('logo')) {
      return (
        <div className="space-y-2">
          <Label>Image URL</Label>
          <ImageUpload
            currentUrl={value || ''}
            onUrlChange={(url) => handleInputChange(setting.id, url)}
            section={setting.key}
            label={getFieldLabel(setting.key)}
          />
        </div>
      );
    }

    // Handle object values
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-4">
          {renderNestedFields(value, setting.id)}
        </div>
      );
    }

    // Handle string values
    if (typeof value === 'string' && value.length > 100) {
      return (
        <Textarea
          value={value}
          onChange={(e) => handleInputChange(setting.id, e.target.value)}
          rows={4}
          placeholder={`Enter ${getFieldLabel(setting.key).toLowerCase()}`}
        />
      );
    }

    return (
      <Input
        value={value || ''}
        onChange={(e) => handleInputChange(setting.id, e.target.value)}
        placeholder={`Enter ${getFieldLabel(setting.key).toLowerCase()}`}
      />
    );
  };

  const renderReadOnlyObject = (obj: any, level: number = 0): JSX.Element[] => {
    if (!obj || typeof obj !== 'object') return [];

    const elements: JSX.Element[] = [];

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          elements.push(
            <div key={index} className={`${level > 0 ? 'ml-4 border-l pl-4' : ''} space-y-2`}>
              <span className="font-medium text-sm text-gray-600">Item {index + 1}:</span>
              {renderReadOnlyObject(item, level + 1)}
            </div>
          );
        } else {
          elements.push(
            <div key={index} className="flex justify-between items-center">
              <span className="font-medium text-sm">Item {index + 1}:</span>
              <span className="text-sm text-gray-600 max-w-xs truncate">{String(item)}</span>
            </div>
          );
        }
      });
    } else {
      Object.entries(obj).forEach(([key, val]) => {
        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        if (typeof val === 'object' && val !== null) {
          elements.push(
            <div key={key} className={`${level > 0 ? 'ml-4 border-l pl-4' : ''} space-y-2`}>
              <span className="font-medium text-sm text-gray-600">{displayKey}:</span>
              {renderReadOnlyObject(val, level + 1)}
            </div>
          );
        } else {
          elements.push(
            <div key={key} className="flex justify-between items-center">
              <span className="font-medium text-sm text-gray-700">{displayKey}:</span>
              <span className="text-sm text-gray-600 max-w-xs truncate">
                {typeof val === 'string' ? val : JSON.stringify(val)}
              </span>
            </div>
          );
        }
      });
    }

    return elements;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-theme-text-primary">Site Settings</h1>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-theme-hero-bg rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-theme-text-primary">Site Settings</h1>
        <p className="text-theme-text-muted">Configure global site settings and appearance</p>
      </div>

      <Alert>
        <AlertDescription>
          These settings control various aspects of your website. Changes will be applied immediately to your live site.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {settings?.map((setting) => {
          const isEditing = editingStates[setting.id] || false;
          
          return (
            <Card key={setting.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{getFieldLabel(setting.key)}</CardTitle>
                    {setting.description && (
                      <p className="text-sm text-theme-text-muted mt-1">{setting.description}</p>
                    )}
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(setting.id)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`setting-${setting.id}`}>Value</Label>
                  {renderValueInput(setting, isEditing)}
                </div>
                
                {isEditing && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleSave(setting.id)}
                      disabled={updateMutation.isPending}
                      className="flex-1 sm:flex-none"
                    >
                      {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCancel(setting.id, setting.value)}
                      disabled={updateMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
