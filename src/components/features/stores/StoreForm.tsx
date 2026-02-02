import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, Button, Checkbox } from '../../ui';
import { storeSchema, type StoreInput } from '../../../utils/validations';
import type { Store } from '../../../types';

interface StoreFormProps {
  onSubmit: (data: StoreInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<Store>;
}

const workingDaysOptions = [
  { value: 'Monday', label: 'Mon' },
  { value: 'Tuesday', label: 'Tue' },
  { value: 'Wednesday', label: 'Wed' },
  { value: 'Thursday', label: 'Thu' },
  { value: 'Friday', label: 'Fri' },
  { value: 'Saturday', label: 'Sat' },
  { value: 'Sunday', label: 'Sun' },
];

export function StoreForm({ onSubmit, onCancel, isSubmitting = false, initialData }: StoreFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      ...initialData,
      isActive: initialData?.isActive ?? true,
      address: initialData?.address || {},
      location: initialData?.location || { latitude: 0, longitude: 0 },
      contactInfo: initialData?.contactInfo || {},
      operatingHours: initialData?.operatingHours || { workingDays: [] },
      capacity: initialData?.capacity || {},
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Store Name" {...register('name')} error={errors.name?.message} />
        <Input label="Store Code" {...register('code')} error={errors.code?.message} />
      </div>

      <Input label="Description" {...register('description')} error={errors.description?.message} />

      <Select 
        label="Store Type" 
        {...register('storeType')} 
        error={errors.storeType?.message}
        options={[{ value: 'retail', label: 'Retail' }, { value: 'warehouse', label: 'Warehouse' }, { value: 'pickup_point', label: 'Pickup Point' }]}
      />

      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="text-sm font-medium px-2">Address</legend>
        <Input label="Street" {...register('address.street')} error={errors.address?.street?.message} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="City" {...register('address.city')} error={errors.address?.city?.message} />
          <Input label="State" {...register('address.state')} error={errors.address?.state?.message} />
          <Input label="Pincode" {...register('address.pincode')} error={errors.address?.pincode?.message} />
        </div>
        <Input label="Country" {...register('address.country')} error={errors.address?.country?.message} />
      </fieldset>

      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="text-sm font-medium px-2">Location</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Latitude" type="number" step="any" {...register('location.latitude', { valueAsNumber: true })} error={errors.location?.latitude?.message} />
            <Input label="Longitude" type="number" step="any" {...register('location.longitude', { valueAsNumber: true })} error={errors.location?.longitude?.message} />
        </div>
      </fieldset>

      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="text-sm font-medium px-2">Contact Info</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Phone" {...register('contactInfo.phone')} error={errors.contactInfo?.phone?.message} />
          <Input label="Email" type="email" {...register('contactInfo.email')} error={errors.contactInfo?.email?.message} />
          <Input label="Manager" {...register('contactInfo.manager')} error={errors.contactInfo?.manager?.message} />
        </div>
      </fieldset>

      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="text-sm font-medium px-2">Operating Hours</legend>
        <p className="text-sm text-gray-600 mb-4">
          Need to assign delivery slots while creating a new store. Partially select or All slots
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Opening Time" type="time" {...register('operatingHours.open')} error={errors.operatingHours?.open?.message} />
          <Input label="Closing Time" type="time" {...register('operatingHours.close')} error={errors.operatingHours?.close?.message} />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
            <Controller
                name="operatingHours.workingDays"
                control={control}
                render={({ field }) => (
                    <div className="grid grid-cols-4 lg:grid-cols-7 gap-2">
                        {workingDaysOptions.map(day => (
                            <label key={day.value} className={`flex items-center justify-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${field.value?.includes(day.value) ? 'bg-blue-50 border-blue-300' : ''}`}>
                                <input type="checkbox" className="hidden" value={day.value} checked={field.value?.includes(day.value)} onChange={e => {
                                    const newDays = e.target.checked ? [...(field.value || []), day.value] : field.value?.filter(d => d !== day.value);
                                    field.onChange(newDays);
                                }} />
                                <span>{day.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            />
            {errors.operatingHours?.workingDays && <p className="text-sm text-red-600 mt-1">{errors.operatingHours.workingDays.message}</p>}
        </div>
      </fieldset>

      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="text-sm font-medium px-2">Capacity</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Storage (units)" type="number" {...register('capacity.storage', { valueAsNumber: true })} error={errors.capacity?.storage?.message} />
            <Input label="Daily Orders" type="number" {...register('capacity.dailyOrders', { valueAsNumber: true })} error={errors.capacity?.dailyOrders?.message} />
            <Input label="Staff Count" type="number" {...register('capacity.staff', { valueAsNumber: true })} error={errors.capacity?.staff?.message} />
        </div>
      </fieldset>

      <fieldset className="border p-4 rounded-lg space-y-4">
        <legend className="text-sm font-medium px-2">Configuration</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Connected Hub ID" {...register('hubId')} error={errors.hubId?.message} />
            <Input label="Delivery Radius (km)" type="number" {...register('deliveryRadius', { valueAsNumber: true })} error={errors.deliveryRadius?.message} />
        </div>
        <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
                <Checkbox label="Store is active" checked={field.value} onChange={field.onChange} />
            )}
        />
      </fieldset>
      
      <div className="flex gap-4 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1" disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (initialData?.id ? 'Save Changes' : 'Create Store')}
        </Button>
      </div>
    </form>
  );
}