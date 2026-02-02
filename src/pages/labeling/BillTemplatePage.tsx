import { useState } from "react";
import { Card, Button } from "../../components/ui";
import { Receipt, Plus, FileText } from "lucide-react";
import { BillEntryForm } from "../../components/labeling/BillEntryForm";

interface BillTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export function BillTemplatePage() {
  const [templates, setTemplates] = useState<BillTemplate[]>([
    {
      id: "standard-bill",
      name: "Standard Invoice",
      description: "Standard invoice template with all essential fields",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);

  const [activeTemplateId, setActiveTemplateId] = useState("standard-bill");
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  const handleSaveBill = (billData: any) => {
    console.log("Saving bill:", billData);
    // Here you would typically save to your backend
    alert("Bill saved successfully!");
  };

  const createNewTemplate = () => {
    const newTemplate: BillTemplate = {
      id: `template-${Date.now()}`,
      name: `Invoice Template ${templates.length + 1}`,
      description: "Custom invoice template",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates(prev => [...prev, newTemplate]);
    setActiveTemplateId(newTemplate.id);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-50 p-3">
            <Receipt className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Bill & Invoice Templates</h1>
            <p className="text-gray-600">Create comprehensive bills and invoices</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowTemplateManager(!showTemplateManager)}>
            <FileText className="mr-2 h-4 w-4" />
            {showTemplateManager ? 'Hide' : 'Manage'} Templates
          </Button>
          <Button variant="secondary" onClick={createNewTemplate}>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Active Template Info */}
      {activeTemplate && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5 text-purple-600" />
              <div>
                <h3 className="font-medium">Active Template: {activeTemplate.name}</h3>
                <p className="text-sm text-gray-600">{activeTemplate.description}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Template Manager */}
      {showTemplateManager && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Bill Templates</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <div 
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  template.id === activeTemplateId 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setActiveTemplateId(template.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-sm">{template.name}</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                <Button
                  variant={template.id === activeTemplateId ? "primary" : "secondary"}
                  size="sm"
                  className="w-full"
                >
                  {template.id === activeTemplateId ? "Active" : "Use Template"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Bill Entry Form */}
      <BillEntryForm onSave={handleSaveBill} />
    </div>
  );
}
