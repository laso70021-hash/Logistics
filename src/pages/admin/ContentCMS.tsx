import React, { useState } from 'react';
import { Save, Image as ImageIcon, Type, Globe, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContentCMS() {
  const [loading, setLoading] = useState(false);
  
  // Since we don't have a dedicated CMS table in the schema yet, we'll build the UI 
  // and simulate saving for this view. In a full implementation, you'd save to a 'site_settings' table.
  const [content, setContent] = useState({
    heroTitle: 'Global Logistics, Simplified.',
    heroSubtitle: 'Track, manage, and deliver with our advanced supply chain management system.',
    contactEmail: 'support@example.com',
    supportPhone: '+1 (555) 123-4567'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Content updated successfully');
    } catch (error) {
      toast.error('Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management (CMS)</h1>
          <p className="text-gray-500 mt-1">Manage public-facing website content and branding</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <a href="#" className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Homepage Content
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Contact Info
            </a>
            <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Legal Pages
            </a>
          </nav>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-8">
          <section>
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              Hero Section
            </h3>
            
            <div className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="heroTitle"
                    value={content.heroTitle}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                <textarea
                  name="heroSubtitle"
                  rows={3}
                  value={content.heroSubtitle}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Background Image</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-white">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex justify-center text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Global Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-lg border border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={content.contactEmail}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                <input
                  type="text"
                  name="supportPhone"
                  value={content.supportPhone}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : 'Publish Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
