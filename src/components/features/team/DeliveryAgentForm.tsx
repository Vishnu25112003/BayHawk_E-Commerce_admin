import { useState } from 'react';
import { Card, Button } from '../../ui';
import { Upload, X } from 'lucide-react';

interface DeliveryAgentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function DeliveryAgentForm({ onSubmit, onCancel, initialData }: DeliveryAgentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    vehicleNo: initialData?.vehicleNo || '',
    vehicleType: initialData?.vehicleType || 'bike',
    drivingLicenseNo: initialData?.drivingLicenseNo || '',
    ...initialData
  });
  const [licenseDoc, setLicenseDoc] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, licenseDoc });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLicenseDoc(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
            <input
              type="text"
              required
              value={formData.vehicleNo}
              onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
            <select
              required
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
              <option value="van">Van</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number *</label>
            <input
              type="text"
              required
              value={formData.drivingLicenseNo}
              onChange={(e) => setFormData({ ...formData, drivingLicenseNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter license number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Proof Document *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {licenseDoc ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{licenseDoc.name}</span>
                  <button
                    type="button"
                    onClick={() => setLicenseDoc(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload document</span>
                  <input
                    type="file"
                    required
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button type="submit" className="flex-1">
            {initialData ? 'Update' : 'Create'} Agent
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </Card>
    </form>
  );
}
