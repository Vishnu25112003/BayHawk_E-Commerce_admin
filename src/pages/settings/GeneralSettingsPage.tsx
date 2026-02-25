import { useState } from "react";
import { Card, Button, Input, Select } from "../../components/ui";
import { Save, Upload, Building, Mail, FileText, Calendar, ScrollText, Plus, Trash2, Eye } from "lucide-react";

export function GeneralSettingsPage() {
  const [businessInfo, setBusinessInfo] = useState({
    name: "BAYHAWK",
    email: "support@bayhawk.com",
    phone: "+91 9876543210",
    language: "en",
    currency: "INR",
    timezone: "IST",
  });

  const [fssaiInfo, setFssaiInfo] = useState({
    licenseNumber: "",
    validityDate: "",
  });

  const [termsAndConditions, setTermsAndConditions] = useState({
    enabled: true,
    version: "1.0",
    lastUpdated: new Date().toISOString().split('T')[0],
    sections: [
      {
        id: '1',
        title: 'Acceptance of Terms',
        content: 'By accessing and using BayHawk services, you accept and agree to be bound by the terms and provision of this agreement.',
        order: 1
      },
      {
        id: '2',
        title: 'Product Information',
        content: 'We strive to provide accurate product information. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.',
        order: 2
      },
      {
        id: '3',
        title: 'Pricing and Payment',
        content: 'All prices are in Indian Rupees (INR) and are subject to change without notice. Payment must be made at the time of order placement.',
        order: 3
      }
    ]
  });

  const [showPreview, setShowPreview] = useState(false);

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
      order: termsAndConditions.sections.length + 1
    };
    setTermsAndConditions(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (id: string) => {
    if (termsAndConditions.sections.length <= 1) {
      alert('At least one section is required');
      return;
    }
    setTermsAndConditions(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
  };

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setTermsAndConditions(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">General Settings</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Configure your business information and basic settings
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Save className="mr-2 h-5 w-5" />
          Save All Changes
        </Button>
      </div>

      {/* Business Information */}
      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-blue-50 p-2">
            <Building className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Business Information</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Basic details about your business
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Logo
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div className="w-full sm:w-auto">
                <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Logo
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 200x200px, PNG or JPG
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input
              label="Business Name"
              value={businessInfo.name}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, name: e.target.value })
              }
              placeholder="Enter business name"
            />
            <Input
              label="Support Email"
              type="email"
              value={businessInfo.email}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, email: e.target.value })
              }
              placeholder="support@example.com"
            />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input
              label="Support Phone"
              type="tel"
              value={businessInfo.phone}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, phone: e.target.value })
              }
              placeholder="+91 9876543210"
            />
            <Select
              label="Default Language"
              value={businessInfo.language}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, language: e.target.value })
              }
              options={[
                { value: "en", label: "English" },
                { value: "ta", label: "Tamil" },
                { value: "hi", label: "Hindi" },
                { value: "te", label: "Telugu" },
                { value: "kn", label: "Kannada" },
              ]}
            />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Select
              label="Currency"
              value={businessInfo.currency}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, currency: e.target.value })
              }
              options={[
                { value: "INR", label: "INR (₹)" },
                { value: "USD", label: "USD ($)" },
                { value: "EUR", label: "EUR (€)" },
              ]}
            />
            <Select
              label="Timezone"
              value={businessInfo.timezone}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, timezone: e.target.value })
              }
              options={[
                { value: "IST", label: "IST (UTC+5:30)" },
                { value: "UTC", label: "UTC (UTC+0:00)" },
                { value: "EST", label: "EST (UTC-5:00)" },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* FSSAI Certificate */}
      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-green-50 p-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">FSSAI Certificate</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Food Safety and Standards Authority of India certification
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input
              label="FSSAI License Number"
              value={fssaiInfo.licenseNumber}
              onChange={(e) =>
                setFssaiInfo({ ...fssaiInfo, licenseNumber: e.target.value })
              }
              placeholder="12345678901234"
              maxLength={14}
            />
            <Input
              label="Validity Date"
              type="date"
              value={fssaiInfo.validityDate}
              onChange={(e) =>
                setFssaiInfo({ ...fssaiInfo, validityDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Document
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Upload FSSAI Certificate
              </p>
              <Button variant="secondary" size="sm">
                Choose File
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                PDF, JPG, PNG up to 5MB
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Business Hours */}
      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-purple-50 p-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Business Hours</h2>
            <p className="text-xs sm:text-sm text-gray-600">Set your operational hours</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {[
            { day: "Monday", open: "09:00", close: "21:00", enabled: true },
            { day: "Tuesday", open: "09:00", close: "21:00", enabled: true },
            { day: "Wednesday", open: "09:00", close: "21:00", enabled: true },
            { day: "Thursday", open: "09:00", close: "21:00", enabled: true },
            { day: "Friday", open: "09:00", close: "21:00", enabled: true },
            { day: "Saturday", open: "09:00", close: "21:00", enabled: true },
            { day: "Sunday", open: "10:00", close: "20:00", enabled: true },
          ].map((schedule) => (
            <div
              key={schedule.day}
              className="flex flex-col gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{schedule.day}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={schedule.enabled}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Open</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={schedule.open}
                  className="flex-1"
                  disabled={!schedule.enabled}
                />
                <span className="text-gray-500 text-sm">to</span>
                <Input
                  type="time"
                  value={schedule.close}
                  className="flex-1"
                  disabled={!schedule.enabled}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="rounded-lg bg-orange-50 p-2">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold">Contact Information</h2>
            <p className="text-xs sm:text-sm text-gray-600">Additional contact details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Input
              label="WhatsApp Number"
              type="tel"
              placeholder="+91 9876543210"
            />
            <Input
              label="Customer Care Email"
              type="email"
              placeholder="care@bayhawk.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Address
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter complete business address"
            />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Input label="City" placeholder="Chennai" />
            <Input label="State" placeholder="Tamil Nadu" />
            <Input label="PIN Code" placeholder="600001" />
          </div>
        </div>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2">
              <ScrollText className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Terms and Conditions</h2>
              <p className="text-sm text-gray-600">Customize your terms and conditions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide' : 'Preview'}
            </Button>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAndConditions.enabled}
                onChange={(e) => setTermsAndConditions({ ...termsAndConditions, enabled: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium">Enabled</span>
            </label>
          </div>
        </div>

        {/* Version and Last Updated */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-6">
          <Input
            label="Version"
            value={termsAndConditions.version}
            onChange={(e) => setTermsAndConditions({ ...termsAndConditions, version: e.target.value })}
            placeholder="1.0"
          />
          <Input
            label="Last Updated"
            type="date"
            value={termsAndConditions.lastUpdated}
            onChange={(e) => setTermsAndConditions({ ...termsAndConditions, lastUpdated: e.target.value })}
          />
        </div>

        {/* Sections */}
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Content Sections</h3>
            <Button size="sm" onClick={addSection}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          {termsAndConditions.sections.map((section, index) => (
            <div key={section.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600">Section {index + 1}</span>
                <button
                  onClick={() => removeSection(section.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                  disabled={termsAndConditions.sections.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  label="Section Title"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  placeholder="e.g., Acceptance of Terms"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Content
                  </label>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter the content for this section..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="border-2 border-indigo-200 rounded-lg p-6 bg-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 max-h-96 overflow-y-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms and Conditions</h2>
                <p className="text-sm text-gray-600">Version {termsAndConditions.version} | Last Updated: {new Date(termsAndConditions.lastUpdated).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>

              <div className="space-y-6">
                {termsAndConditions.sections.map((section, index) => (
                  <div key={section.id}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {index + 1}. {section.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  © {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
