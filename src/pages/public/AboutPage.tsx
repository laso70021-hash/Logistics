import React from 'react';
import { Package, Shield, Globe, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            About CargoFlow
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            We are redefining global logistics through transparency, real-time tracking, and unmatched reliability. Our mission is to seamlessly connect your business to the world.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex justify-center">
                <Globe className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">Global Reach</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Operating across 150+ countries with a network of trusted partners.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Package className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">Secure Handling</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                End-to-end security protocols ensure your cargo arrives safely.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">Verified Delivery</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Digital proof of delivery with instant notification systems.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">Expert Team</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                24/7 support from logistics professionals dedicated to your success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
