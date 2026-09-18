const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Imports
content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';\nimport { Mail } from 'lucide-react';\nimport { connectGmail, getGmailToken } from '../lib/gmail';\nimport toast from 'react-hot-toast';");

const target = `<div className="flex items-center gap-3 mb-4 px-2">`;
const replacement = `
          <div className="mb-4">
            <button
              onClick={async () => {
                if (!getGmailToken()) {
                  try {
                    await connectGmail();
                    toast.success('Gmail Connected Successfully');
                  } catch (e: any) {
                    toast.error(e.message || 'Failed to connect Gmail');
                  }
                } else {
                  toast.success('Gmail is already connected');
                }
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400" />
                <span>Connect Gmail</span>
              </div>
            </button>
          </div>
          <div className="flex items-center gap-3 mb-4 px-2">`;

content = content.replace(target, replacement);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
