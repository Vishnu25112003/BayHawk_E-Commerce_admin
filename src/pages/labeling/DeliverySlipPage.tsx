import { useState } from "react";
import { Card, Button, Input, Select, Checkbox } from "../../components/ui";
import { Truck, Save, Settings, FileText } from "lucide-react";
import { TemplateManager } from "../../components/labeling/TemplateManager";
import { SlipPreview } from "../../components/labeling/SlipPreview";

interface SlipField {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "phone" | "address" | "qr" | "image" | "barcode";
  required: boolean;
  enabled: boolean;
  position: { x: number; y: number };
  fontSize: number;
  fontWeight: "normal" | "bold";
}

interface SlipTemplate {
  id: string;
  name: string;
  type: "delivery" | "packing";
  fields: SlipField[];
  createdAt: string;
  updatedAt: string;
}

const defaultDeliveryFields: SlipField[] = [
  { id: "customer_name", label: "Customer Name", type: "text", required: true, enabled: true, position: { x: 20, y: 20 }, fontSize: 14, fontWeight: "bold" },
  { id: "customer_address", label: "Delivery Address", type: "address", required: true, enabled: true, position: { x: 20, y: 45 }, fontSize: 12, fontWeight: "normal" },
  { id: "phone_number", label: "Phone Number", type: "phone", required: true, enabled: true, position: { x: 20, y: 85 }, fontSize: 12, fontWeight: "normal" },
  { id: "alternate_phone", label: "Alternate Phone", type: "phone", required: false, enabled: true, position: { x: 150, y: 85 }, fontSize: 12, fontWeight: "normal" },
  { id: "invoice_number", label: "Invoice Number", type: "text", required: true, enabled: true, position: { x: 20, y: 110 }, fontSize: 12, fontWeight: "bold" },
  { id: "net_amount", label: "Net Amount", type: "number", required: true, enabled: true, position: { x: 150, y: 110 }, fontSize: 12, fontWeight: "bold" },
  { id: "payment_mode", label: "Payment Mode", type: "text", required: true, enabled: true, position: { x: 20, y: 135 }, fontSize: 12, fontWeight: "normal" },
  { id: "delivery_date", label: "Delivery Date", type: "date", required: true, enabled: true, position: { x: 20, y: 160 }, fontSize: 12, fontWeight: "normal" },
  { id: "delivery_slot", label: "Delivery Slot", type: "text", required: false, enabled: true, position: { x: 150, y: 160 }, fontSize: 12, fontWeight: "normal" },
  { id: "delivery_instructions", label: "Delivery Instructions", type: "text", required: false, enabled: true, position: { x: 20, y: 185 }, fontSize: 10, fontWeight: "normal" },
  { id: "support_phone", label: "Support Phone", type: "phone", required: true, enabled: true, position: { x: 20, y: 210 }, fontSize: 10, fontWeight: "normal" },
  { id: "qr_code", label: "QR Code", type: "qr", required: false, enabled: true, position: { x: 200, y: 20 }, fontSize: 10, fontWeight: "normal" },
  { id: "brand_logo", label: "Brand Logo", type: "image", required: false, enabled: true, position: { x: 200, y: 60 }, fontSize: 10, fontWeight: "normal" },
];

export function DeliverySlipPage() {
  const [templates, setTemplates] = useState<SlipTemplate[]>([
    {
      id: "default-delivery",
      name: "Standard Delivery Slip",
      type: "delivery",
      fields: defaultDeliveryFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);

  const [activeTemplateId, setActiveTemplateId] = useState("default-delivery");
  const [currentFields, setCurrentFields] = useState<SlipField[]>(defaultDeliveryFields);
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setActiveTemplateId(templateId);
      setCurrentFields(template.fields);
    }
  };

  const handleTemplateCreate = (templateData: Omit<SlipTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: SlipTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates(prev => [...prev, newTemplate]);
    setActiveTemplateId(newTemplate.id);
    setCurrentFields(newTemplate.fields);
  };

  const handleTemplateUpdate = (templateId: string, updates: Partial<SlipTemplate>) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId 
        ? { ...t, ...updates, updatedAt: new Date().toISOString() }
        : t
    ));
  };

  const handleTemplateDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    if (activeTemplateId === templateId) {
      const remainingTemplate = templates.find(t => t.id !== templateId);
      if (remainingTemplate) {
        handleTemplateChange(remainingTemplate.id);
      }
    }
  };

  const updateField = (fieldId: string, updates: Partial<SlipField>) => {
    setCurrentFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const saveTemplate = () => {
    handleTemplateUpdate(activeTemplateId, { fields: currentFields });
    alert("Template saved successfully!");
  };

  const FieldRow = ({ field }: { field: SlipField }) => (
    <div className="grid grid-cols-12 gap-3 items-center p-3 border rounded-lg">
      <div className="col-span-3">
        <Checkbox
          checked={field.enabled}
          onChange={(e) => updateField(field.id, { enabled: e.target.checked })}
          label={field.label}
        />
      </div>
      <div className="col-span-2">
        <Select
          value={field.fontSize.toString()}
          onChange={(e) => updateField(field.id, { fontSize: parseInt(e.target.value) })}
          options={[
            { value: "8", label: "8px" },
            { value: "10", label: "10px" },
            { value: "12", label: "12px" },
            { value: "14", label: "14px" },
            { value: "16", label: "16px" },
          ]}
        />
      </div>
      <div className="col-span-2">
        <Select
          value={field.fontWeight}
          onChange={(e) => updateField(field.id, { fontWeight: e.target.value as "normal" | "bold" })}
          options={[
            { value: "normal", label: "Normal" },
            { value: "bold", label: "Bold" },
          ]}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          value={field.position.x}
          onChange={(e) => updateField(field.id, { 
            position: { ...field.position, x: parseInt(e.target.value) || 0 }
          })}
          placeholder="X"
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          value={field.position.y}
          onChange={(e) => updateField(field.id, { 
            position: { ...field.position, y: parseInt(e.target.value) || 0 }
          })}
          placeholder="Y"
        />
      </div>
      <div className="col-span-1 text-center">
        {field.required && <span className="text-red-500 text-sm">*</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-3">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Delivery Slip Templates</h1>
            <p className="text-gray-600">Create and manage delivery slip templates</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowTemplateManager(!showTemplateManager)}>
            <FileText className="mr-2 h-4 w-4" />
            {showTemplateManager ? 'Hide' : 'Manage'} Templates
          </Button>
          <Button onClick={saveTemplate}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
      </div>

      {/* Active Template Info */}
      {activeTemplate && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-medium">Active Template: {activeTemplate.name}</h3>
                <p className="text-sm text-gray-600">
                  {currentFields.filter(f => f.enabled).length} of {currentFields.length} fields enabled
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Template Manager */}
      {showTemplateManager && (
        <TemplateManager
          templates={templates.filter(t => t.type === 'delivery')}
          activeTemplateId={activeTemplateId}
          onTemplateChange={handleTemplateChange}
          onTemplateCreate={handleTemplateCreate}
          onTemplateUpdate={handleTemplateUpdate}
          onTemplateDelete={handleTemplateDelete}
        />
      )}

      {/* Field Configuration */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-green-50 p-2">
              <Settings className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Field Configuration</h2>
              <p className="text-sm text-gray-600">Configure delivery slip fields</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-700 px-3">
              <div className="col-span-3">Field Name</div>
              <div className="col-span-2">Font Size</div>
              <div className="col-span-2">Font Weight</div>
              <div className="col-span-2">X Position</div>
              <div className="col-span-2">Y Position</div>
              <div className="col-span-1">Required</div>
            </div>

            <div className="space-y-2">
              {currentFields.map(field => (
                <FieldRow key={field.id} field={field} />
              ))}
            </div>
          </div>
        </Card>

        {/* Preview */}
        <SlipPreview
          fields={currentFields}
          type="delivery"
        />
      </div>
    </div>
  );
}
