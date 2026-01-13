import { useState, useRef } from 'react';
import { Card, Button, Input, Select } from '../components/ui';
import { 
  Printer, 
  Download, 
  Eye, 
  Settings, 
  Plus, 
  Minus, 
  RotateCcw, 
  Save,
  FileText,
  Package,
  User,
  MapPin,
  Calendar,
  Barcode,
  QrCode
} from 'lucide-react';
import { LabelPreview } from '../components/labeling/LabelPreview';
import { LabelDesigner } from '../components/labeling/LabelDesigner';
import { DataSelector } from '../components/labeling/DataSelector';

interface LabelField {
  id: string;
  name: string;
  type: 'text' | 'barcode' | 'qrcode' | 'image' | 'date' | 'number';
  value: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  position: { x: number; y: number };
  width: number;
  height: number;
  isVisible: boolean;
}

interface LabelTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  fields: LabelField[];
  paperSize: string;
  orientation: 'portrait' | 'landscape';
}

const defaultFields: LabelField[] = [
  {
    id: 'product_name',
    name: 'Product Name',
    type: 'text',
    value: 'Fresh Salmon - 1kg',
    fontSize: 16,
    fontWeight: 'bold',
    position: { x: 10, y: 10 },
    width: 200,
    height: 25,
    isVisible: true
  },
  {
    id: 'product_code',
    name: 'Product Code',
    type: 'text',
    value: 'SAL001',
    fontSize: 12,
    fontWeight: 'normal',
    position: { x: 10, y: 40 },
    width: 100,
    height: 20,
    isVisible: true
  },
  {
    id: 'price',
    name: 'Price',
    type: 'text',
    value: '₹450.00',
    fontSize: 14,
    fontWeight: 'bold',
    position: { x: 120, y: 40 },
    width: 80,
    height: 20,
    isVisible: true
  },
  {
    id: 'barcode',
    name: 'Barcode',
    type: 'barcode',
    value: '1234567890123',
    fontSize: 10,
    fontWeight: 'normal',
    position: { x: 10, y: 70 },
    width: 150,
    height: 30,
    isVisible: true
  },
  {
    id: 'expiry_date',
    name: 'Expiry Date',
    type: 'date',
    value: '2024-02-15',
    fontSize: 10,
    fontWeight: 'normal',
    position: { x: 10, y: 110 },
    width: 100,
    height: 15,
    isVisible: true
  },
  {
    id: 'batch_number',
    name: 'Batch Number',
    type: 'text',
    value: 'B240115001',
    fontSize: 10,
    fontWeight: 'normal',
    position: { x: 120, y: 110 },
    width: 80,
    height: 15,
    isVisible: true
  }
];

const availableDataSources = [
  {
    category: 'Product Information',
    fields: [
      { id: 'product_name', label: 'Product Name', type: 'text' },
      { id: 'product_code', label: 'Product Code', type: 'text' },
      { id: 'product_description', label: 'Description', type: 'text' },
      { id: 'category', label: 'Category', type: 'text' },
      { id: 'brand', label: 'Brand', type: 'text' },
      { id: 'weight', label: 'Weight', type: 'text' },
      { id: 'unit', label: 'Unit', type: 'text' }
    ]
  },
  {
    category: 'Pricing',
    fields: [
      { id: 'price', label: 'Price', type: 'text' },
      { id: 'mrp', label: 'MRP', type: 'text' },
      { id: 'discount', label: 'Discount', type: 'text' },
      { id: 'tax_rate', label: 'Tax Rate', type: 'text' },
      { id: 'final_price', label: 'Final Price', type: 'text' }
    ]
  },
  {
    category: 'Inventory',
    fields: [
      { id: 'batch_number', label: 'Batch Number', type: 'text' },
      { id: 'lot_number', label: 'Lot Number', type: 'text' },
      { id: 'manufacturing_date', label: 'Manufacturing Date', type: 'date' },
      { id: 'expiry_date', label: 'Expiry Date', type: 'date' },
      { id: 'stock_quantity', label: 'Stock Quantity', type: 'number' }
    ]
  },
  {
    category: 'Barcodes & QR',
    fields: [
      { id: 'barcode', label: 'Barcode', type: 'barcode' },
      { id: 'qr_code', label: 'QR Code', type: 'qrcode' },
      { id: 'sku', label: 'SKU', type: 'text' }
    ]
  },
  {
    category: 'Business Info',
    fields: [
      { id: 'company_name', label: 'Company Name', type: 'text' },
      { id: 'company_logo', label: 'Company Logo', type: 'image' },
      { id: 'address', label: 'Address', type: 'text' },
      { id: 'phone', label: 'Phone', type: 'text' },
      { id: 'email', label: 'Email', type: 'text' }
    ]
  }
];

export function LabelingPage() {
  const [currentTemplate, setCurrentTemplate] = useState<LabelTemplate>({
    id: '1',
    name: 'Product Label',
    width: 220,
    height: 140,
    fields: defaultFields,
    paperSize: 'A4',
    orientation: 'portrait'
  });

  const [activeTab, setActiveTab] = useState<'design' | 'data' | 'preview'>('design');
  const [selectedFields, setSelectedFields] = useState<string[]>(defaultFields.map(f => f.id));
  const [labelQuantity, setLabelQuantity] = useState(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const paperSizes = [
    { value: 'A4', label: 'A4 (210 × 297 mm)' },
    { value: 'A5', label: 'A5 (148 × 210 mm)' },
    { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
    { value: 'Custom', label: 'Custom Size' }
  ];

  const labelTemplates = [
    { value: 'product', label: 'Product Label' },
    { value: 'shipping', label: 'Shipping Label' },
    { value: 'barcode', label: 'Barcode Label' },
    { value: 'price', label: 'Price Tag' },
    { value: 'custom', label: 'Custom Template' }
  ];

  const updateField = (fieldId: string, updates: Partial<LabelField>) => {
    setCurrentTemplate(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const addField = (dataField: any) => {
    const newField: LabelField = {
      id: dataField.id,
      name: dataField.label,
      type: dataField.type,
      value: `Sample ${dataField.label}`,
      fontSize: 12,
      fontWeight: 'normal',
      position: { x: 10, y: 10 },
      width: 150,
      height: 20,
      isVisible: true
    };

    setCurrentTemplate(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedFields(prev => [...prev, dataField.id]);
  };

  const removeField = (fieldId: string) => {
    setCurrentTemplate(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    setSelectedFields(prev => prev.filter(id => id !== fieldId));
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Labels</title>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .label-container { display: flex; flex-wrap: wrap; gap: 10px; }
                .label { border: 1px solid #ccc; page-break-inside: avoid; }
                @media print {
                  body { margin: 0; padding: 0; }
                  .label-container { gap: 0; }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    // Implementation for downloading labels as PDF
    console.log('Downloading labels...');
  };

  const resetTemplate = () => {
    setCurrentTemplate({
      id: '1',
      name: 'Product Label',
      width: 220,
      height: 140,
      fields: defaultFields,
      paperSize: 'A4',
      orientation: 'portrait'
    });
    setSelectedFields(defaultFields.map(f => f.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Label Generator</h1>
          <p className="text-gray-600">Create and customize labels for your products</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={resetTemplate}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="secondary" onClick={() => setIsPreviewMode(!isPreviewMode)}>
            <Eye className="mr-2 h-4 w-4" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
      </div>

      {/* Template Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-blue-50 p-2">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Template Settings</h2>
            <p className="text-sm text-gray-600">Configure label dimensions and layout</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Template Name"
            value={currentTemplate.name}
            onChange={(e) => setCurrentTemplate(prev => ({ ...prev, name: e.target.value }))}
          />
          <Select
            label="Paper Size"
            value={currentTemplate.paperSize}
            onChange={(e) => setCurrentTemplate(prev => ({ ...prev, paperSize: e.target.value }))}
            options={paperSizes}
          />
          <Input
            label="Width (mm)"
            type="number"
            value={currentTemplate.width}
            onChange={(e) => setCurrentTemplate(prev => ({ ...prev, width: parseInt(e.target.value) }))}
          />
          <Input
            label="Height (mm)"
            type="number"
            value={currentTemplate.height}
            onChange={(e) => setCurrentTemplate(prev => ({ ...prev, height: parseInt(e.target.value) }))}
          />
        </div>
      </Card>

      {!isPreviewMode ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Design Panel */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-50 p-2">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Label Designer</h2>
                    <p className="text-sm text-gray-600">Design your label layout</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === 'design' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setActiveTab('design')}
                  >
                    Design
                  </Button>
                  <Button
                    variant={activeTab === 'data' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setActiveTab('data')}
                  >
                    Data
                  </Button>
                </div>
              </div>

              {activeTab === 'design' && (
                <LabelDesigner
                  template={currentTemplate}
                  onUpdateField={updateField}
                  onRemoveField={removeField}
                />
              )}

              {activeTab === 'data' && (
                <DataSelector
                  availableFields={availableDataSources}
                  selectedFields={selectedFields}
                  onAddField={addField}
                  onRemoveField={removeField}
                />
              )}
            </Card>
          </div>

          {/* Field Properties */}
          <div>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg bg-purple-50 p-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Field Properties</h2>
                  <p className="text-sm text-gray-600">Customize selected field</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-500 text-center py-8">
                  Select a field to edit its properties
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-orange-50 p-2">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Actions</h3>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Text Field
                </Button>
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <Barcode className="mr-2 h-4 w-4" />
                  Add Barcode
                </Button>
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <QrCode className="mr-2 h-4 w-4" />
                  Add QR Code
                </Button>
                <Button variant="secondary" className="w-full justify-start" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Add Date Field
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2">
                    <Eye className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Label Preview</h2>
                    <p className="text-sm text-gray-600">Preview your labels before printing</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
              </div>

              <div ref={printRef}>
                <LabelPreview
                  template={currentTemplate}
                  quantity={labelQuantity}
                />
              </div>
            </Card>
          </div>

          {/* Print Settings */}
          <div>
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg bg-red-50 p-2">
                  <Printer className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Print Settings</h2>
                  <p className="text-sm text-gray-600">Configure printing options</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Labels
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setLabelQuantity(Math.max(1, labelQuantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={labelQuantity}
                      onChange={(e) => setLabelQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center"
                      min="1"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setLabelQuantity(labelQuantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Select
                  label="Print Quality"
                  options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'High Quality' }
                  ]}
                />

                <Select
                  label="Printer"
                  options={[
                    { value: 'default', label: 'Default Printer' },
                    { value: 'thermal', label: 'Thermal Printer' },
                    { value: 'laser', label: 'Laser Printer' }
                  ]}
                />

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Print borders</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Print in grayscale</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Fit to page</span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Template Library */}
            <Card className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-yellow-50 p-2">
                  <FileText className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Templates</h3>
                </div>
              </div>

              <div className="space-y-2">
                {labelTemplates.map(template => (
                  <button
                    key={template.value}
                    className="w-full text-left p-2 rounded hover:bg-gray-50 text-sm"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}