import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Have a question about a shipment or want to discuss a logistics partnership? Our team is here to help.
          </p>
        </div>

        <div className="mt-20 max-w-lg mx-auto grid grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl">
            <Phone className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
            <p className="mt-2 text-gray-600">+1 (555) 123-4567</p>
            <p className="mt-1 text-sm text-gray-500">Mon-Fri 8am to 6pm EST</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl">
            <Mail className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Email</h3>
            <p className="mt-2 text-gray-600">support@cargoflow.com</p>
            <p className="mt-1 text-sm text-gray-500">We respond within 24 hours</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-2xl">
            <MapPin className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Headquarters</h3>
            <p className="mt-2 text-gray-600">100 Logistics Way<br/>New York, NY 10001</p>
          </div>
        </div>
      </div>
    </div>
  );
}
