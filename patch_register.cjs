const fs = require('fs');
let content = fs.readFileSync('src/pages/agent/RegisterPackage.tsx', 'utf8');

content = content.replace(
  "import { Copy } from 'lucide-react';",
  "import { Copy, Printer, X } from 'lucide-react';\nimport { QRCodeSVG } from 'qrcode.react';"
);

content = content.replace(
  "const [createdTracking, setCreatedTracking] = useState('');",
  "const [createdTracking, setCreatedTracking] = useState('');\n  const [createdShipment, setCreatedShipment] = useState<any>(null);\n  const [showLabelModal, setShowLabelModal] = useState(false);"
);

// update handleSubmit to save the shipment
content = content.replace(
  "setCreatedTracking(trackingNumber);",
  "setCreatedTracking(trackingNumber);\n      setCreatedShipment({\n        trackingNumber,\n        origin: formData.origin,\n        destination: formData.destination,\n        weight: formData.weight,\n        senderName: formData.senderName,\n        receiverName: formData.receiverName,\n        date: new Date().toLocaleDateString()\n      });\n      setShowLabelModal(true);"
);

// update the success banner
const successTarget = `          <button 
            onClick={copyTracking}
            className="p-3 bg-white hover:bg-green-100 rounded-lg text-green-700 transition-colors flex flex-col items-center gap-1 shadow-sm border border-green-200"
          >
            <Copy className="w-5 h-5" />
            <span className="text-xs font-medium">Copy</span>
          </button>`;

const successReplacement = `          <div className="flex gap-2">
            <button 
              onClick={() => setShowLabelModal(true)}
              className="p-3 bg-white hover:bg-green-100 rounded-lg text-green-700 transition-colors flex flex-col items-center gap-1 shadow-sm border border-green-200"
            >
              <Printer className="w-5 h-5" />
              <span className="text-xs font-medium">Label</span>
            </button>
            <button 
              onClick={copyTracking}
              className="p-3 bg-white hover:bg-green-100 rounded-lg text-green-700 transition-colors flex flex-col items-center gap-1 shadow-sm border border-green-200"
            >
              <Copy className="w-5 h-5" />
              <span className="text-xs font-medium">Copy</span>
            </button>
          </div>`;

content = content.replace(successTarget, successReplacement);

// Add the modal component at the end of the return statement
const returnTarget = `    </div>
  );
}`;

const labelModalCode = `
      {showLabelModal && createdShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:p-0 print:bg-white print:block">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col print:shadow-none print:max-w-none print:w-full print:border-0 print:rounded-none">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 print:hidden bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Shipping Label Preview
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Print
                </button>
                <button onClick={() => setShowLabelModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Label Content (Printable area) */}
            <div className="p-8 bg-white" id="printable-label">
              <div className="border-4 border-black p-6 rounded-xl relative">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-black tracking-tighter">CARGOFLOW</h1>
                    <p className="text-sm font-bold mt-1">PRIORITY SHIPPING</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-500">DATE</p>
                    <p className="font-bold">{createdShipment.date}</p>
                    <p className="text-xs font-bold text-gray-500 mt-2">WEIGHT</p>
                    <p className="font-bold">{createdShipment.weight || 'N/A'} kg</p>
                  </div>
                </div>

                {/* Addresses */}
                <div className="flex justify-between gap-8 mb-6">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 mb-1">FROM</p>
                    <p className="font-bold text-lg uppercase">{createdShipment.senderName}</p>
                    <p className="text-gray-700">{createdShipment.origin}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 mb-1">TO</p>
                    <p className="font-bold text-xl uppercase">{createdShipment.receiverName}</p>
                    <p className="text-gray-900 font-medium">{createdShipment.destination}</p>
                  </div>
                </div>

                {/* Tracking & Barcode */}
                <div className="border-t-2 border-black pt-6 flex flex-col items-center">
                  <QRCodeSVG value={createdShipment.trackingNumber} size={120} />
                  <p className="text-2xl font-mono tracking-widest font-bold mt-4">
                    {createdShipment.trackingNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

content = content.replace(returnTarget, labelModalCode);
fs.writeFileSync('src/pages/agent/RegisterPackage.tsx', content);
