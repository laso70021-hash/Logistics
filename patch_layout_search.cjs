const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Add import
const targetImport = "import { cn } from '../lib/utils';";
const replacementImport = "import { cn } from '../lib/utils';\nimport GlobalSearch from '../components/GlobalSearch';";
content = content.replace(targetImport, replacementImport);

// Add the top bar
const targetMain = `<main className="flex-1 flex flex-col min-w-0 md:pt-0 pt-16 h-screen overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">`;
const replacementMain = `<main className="flex-1 flex flex-col min-w-0 md:pt-0 pt-16 h-screen overflow-y-auto">
        {(isAdmin || profile?.role === 'agent') && (
          <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-end">
            <GlobalSearch />
          </div>
        )}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">`;
content = content.replace(targetMain, replacementMain);

fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
