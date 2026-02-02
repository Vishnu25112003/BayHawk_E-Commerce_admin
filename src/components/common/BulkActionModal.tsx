import { useState } from 'react';
import { Modal, Button, Input, Select } from '../ui';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface BulkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actionType: string;
  selectedCount: number;
  itemName: string;
  onConfirm: (data: any) => Promise<void>;
  fields?: BulkActionField[];
}

interface BulkActionField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'textarea' | 'number' | 'date';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: string;
}

export function BulkActionModal({
  isOpen,
  onClose,
  title,
  actionType,
  selectedCount,
  itemName,
  onConfirm,
  fields = []
}: BulkActionModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onConfirm(formData);
      onClose();
      setFormData({});
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: BulkActionField) => {
    const commonProps = {
      value: formData[field.id] || field.defaultValue || '',
      onChange: (e: any) => handleInputChange(field.id, e.target.value),
      error: errors[field.id],
      placeholder: field.placeholder
    };

    switch (field.type) {
      case 'select':
        return (
          <Select
            key={field.id}
            label={field.label}
            {...commonProps}
            options={field.options || []}
          />
        );
      case 'textarea':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...commonProps}
            />
            {errors[field.id] && (
              <p className="text-sm text-red-600 mt-1">{errors[field.id]}</p>
            )}
          </div>
        );
      case 'number':
        return (
          <Input
            key={field.id}
            label={field.label}
            type="number"
            {...commonProps}
          />
        );
      case 'date':
        return (
          <Input
            key={field.id}
            label={field.label}
            type="date"
            {...commonProps}
          />
        );
      default:
        return (
          <Input
            key={field.id}
            label={field.label}
            {...commonProps}
          />
        );
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'delete':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'archive':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getActionColor = () => {
    switch (actionType) {
      case 'delete':
        return 'red';
      case 'archive':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const actionColor = getActionColor();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-6">
        {/* Action Summary */}
        <div className={`flex items-center gap-3 p-4 bg-${actionColor}-50 border border-${actionColor}-200 rounded-lg`}>
          {getActionIcon()}
          <div>
            <h4 className={`font-medium text-${actionColor}-900`}>
              {title}
            </h4>
            <p className={`text-sm text-${actionColor}-700`}>
              This action will affect {selectedCount} selected {itemName}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        {fields.length > 0 && (
          <div className="space-y-4">
            {fields.map(renderField)}
          </div>
        )}

        {/* Confirmation Message for Destructive Actions */}
        {(actionType === 'delete' || actionType === 'archive') && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-gray-900">
                  {actionType === 'delete' ? 'Permanent Action' : 'Important Notice'}
                </h5>
                <p className="text-sm text-gray-600 mt-1">
                  {actionType === 'delete'
                    ? 'This action cannot be undone. The selected items will be permanently removed from the system.'
                    : 'Archived items can be restored later, but they will not be visible in the main list.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 ${
              actionType === 'delete'
                ? 'bg-red-600 hover:bg-red-700'
                : actionType === 'archive'
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Processing...' : `Confirm ${title}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Predefined bulk action configurations
export const bulkActionConfigs = {
  'update-status': {
    title: 'Update Status',
    fields: [
      {
        id: 'status',
        label: 'New Status',
        type: 'select' as const,
        required: true,
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' }
        ]
      },
      {
        id: 'reason',
        label: 'Reason (Optional)',
        type: 'textarea' as const,
        placeholder: 'Enter reason for status change...'
      }
    ]
  },
  'bulk-edit': {
    title: 'Bulk Edit',
    fields: [
      {
        id: 'category',
        label: 'Category',
        type: 'select' as const,
        options: [
          { value: '', label: 'Keep current' },
          { value: 'electronics', label: 'Electronics' },
          { value: 'clothing', label: 'Clothing' },
          { value: 'books', label: 'Books' }
        ]
      },
      {
        id: 'discount',
        label: 'Discount (%)',
        type: 'number' as const,
        placeholder: '0'
      },
      {
        id: 'notes',
        label: 'Notes',
        type: 'textarea' as const,
        placeholder: 'Add notes for this bulk edit...'
      }
    ]
  },
  'send-notification': {
    title: 'Send Notification',
    fields: [
      {
        id: 'subject',
        label: 'Subject',
        type: 'text' as const,
        required: true,
        placeholder: 'Enter notification subject...'
      },
      {
        id: 'message',
        label: 'Message',
        type: 'textarea' as const,
        required: true,
        placeholder: 'Enter your message...'
      },
      {
        id: 'type',
        label: 'Notification Type',
        type: 'select' as const,
        required: true,
        options: [
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
          { value: 'push', label: 'Push Notification' },
          { value: 'all', label: 'All Methods' }
        ]
      }
    ]
  },
  'archive': {
    title: 'Archive Items',
    fields: [
      {
        id: 'reason',
        label: 'Archive Reason',
        type: 'select' as const,
        required: true,
        options: [
          { value: 'outdated', label: 'Outdated' },
          { value: 'discontinued', label: 'Discontinued' },
          { value: 'seasonal', label: 'Seasonal' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'notes',
        label: 'Additional Notes',
        type: 'textarea' as const,
        placeholder: 'Add any additional notes...'
      }
    ]
  },
  'delete': {
    title: 'Delete Items',
    fields: [
      {
        id: 'confirmation',
        label: 'Type "DELETE" to confirm',
        type: 'text' as const,
        required: true,
        placeholder: 'DELETE'
      }
    ]
  }
};