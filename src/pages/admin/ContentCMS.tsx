import React, { useState, useEffect } from 'react';
import { Save, Globe, Database, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

export default function ContentCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schemaError, setSchemaError] = useState(false);
  
  const [content, setContent] = useState({
    heroTitle: 'Global Logistics, Simplified.',
    heroSubtitle: 'Track, manage, and deliver with our advanced supply chain management system.',
    contactEmail: 'support@example.com',
    supportPhone: '+1 (555) 123-4567'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        if (error.code === '42P01') {
          // Table does not exist
          setSchemaError(true);
        }
        throw error;
      }

      if (data) {
        setContent({
          heroTitle: data.hero_title || content.heroTitle,
          heroSubtitle: data.hero_subtitle || content.heroSubtitle,
          contactEmail: data.contact_email || content.contactEmail,
          supportPhone: data.support_phone || content.supportPhone
        });
      }
    } catch (error: any) {
      console.log('Using default CMS settings (Table might not exist yet)');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (schemaError) {
      toast.error('Database table missing. Please run the SQL migration first.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 1,
          hero_title: content.heroTitle,
          hero_subtitle: content.heroSubtitle,
          contact_email: content.contactEmail,
          support_phone: content.supportPhone,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Content updated successfully and is now live!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Homepage Content & CMS</h1>
        <p className="text-gray-500 mt-1">Manage the content that appears on the public-facing landing page.</p>
      </div>

      {schemaError && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Database className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-2">Database Setup Required</h3>
              <p className="text-sm text-red-700 mb-4">
                The <code className="bg-red-100 px-1 py-0.5 rounded">site_settings</code> table is missing from your database. 
                Please run the following SQL command in your Supabase SQL Editor to enable this feature:
              </p>
              <pre className="bg-white p-4 rounded-lg text-sm border border-red-100 overflow-x-auto text-gray-800 font-mono">
{`CREATE TABLE site_settings (
  id integer PRIMARY KEY,
  hero_title text,
  hero_subtitle text,
  contact_email text,
  support_phone text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON site_settings FOR ALL USING (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role in ('admin', 'super_admin'))
);

INSERT INTO site_settings (id, hero_title, hero_subtitle) VALUES (1, 'Global Logistics, Simplified.', 'Track, manage, and deliver with our advanced supply chain management system.');`}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Hero Section (Landing Page)
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Headline</label>
              <input
                type="text"
                name="heroTitle"
                value={content.heroTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none text-gray-900"
                placeholder="Enter main heading"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle / Description</label>
              <textarea
                name="heroSubtitle"
                value={content.heroSubtitle}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none text-gray-900 resize-none"
                placeholder="Enter subtitle text"
              />
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-4">Global Contact Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={content.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                <input
                  type="text"
                  name="supportPhone"
                  value={content.supportPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving || schemaError}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Publishing...' : 'Publish Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
