import { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { Save, Plus, Clock, Trash2, Edit, Users, Calendar } from 'lucide-react';

interface DeliverySlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  capacity: number;
  isActive: boolean;
  days: string[];
}

export function DeliverySlotsPage() {
  const [slots, setSlots] = useState<DeliverySlot[]>([
    {
      id: '1',
      name: 'Morning Slot',
      startTime: '07:00',
      endTime: '09:00',
      capacity: 50,
      isActive: true,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    {
      id: '2',
      name: 'Afternoon Slot',
      startTime: '13:00',
      endTime: '15:00',
      capacity: 50,
      isActive: true,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    {
      id: '3',
      name: 'Evening Slot',
      startTime: '19:00',
      endTime: '21:00',
      capacity: 50,
      isActive: true,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }
  ]);

  const [cutoffTime, setCutoffTime] = useState('00:30');
  const [advanceBookingDays, setAdvanceBookingDays] = useState(7);

  const daysOfWeek = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  const addNewSlot = () => {
    const newSlot: DeliverySlot = {
      id: Date.now().toString(),
      name: `Slot ${slots.length + 1}`,
      startTime: '10:00',
      endTime: '12:00',
      capacity: 30,
      isActive: true,
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    };
    setSlots([...slots, newSlot]);
  };

  const updateSlot = (id: string, updates: Partial<DeliverySlot>) => {
    setSlots(slots.map(slot => slot.id === id ? { ...slot, ...updates } : slot));
  };

  const deleteSlot = (id: string) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  const toggleSlotDay = (slotId: string, day: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    const updatedDays = slot.days.includes(day)
      ? slot.days.filter(d => d !== day)
      : [...slot.days, day];

    updateSlot(slotId, { days: updatedDays });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Delivery Slots</h1>
          <p className="text-gray-600">Configure delivery time slots and capacity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={addNewSlot}>
            <Plus className="mr-2 h-4 w-4" />
            Add Slot
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Delivery Slots */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-blue-50 p-2">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Time Slots Configuration</h2>
            <p className="text-sm text-gray-600">Set up available delivery time slots</p>
          </div>
        </div>

        <div className="space-y-4">
          {slots.map((slot) => (
            <div key={slot.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={slot.isActive}
                      onChange={(e) => updateSlot(slot.id, { isActive: e.target.checked })}
                      className="rounded"
                    />
                    <span className="font-medium">{slot.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteSlot(slot.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <Input
                  label="Slot Name"
                  value={slot.name}
                  onChange={(e) => updateSlot(slot.id, { name: e.target.value })}
                />
                <Input
                  label="Start Time"
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateSlot(slot.id, { startTime: e.target.value })}
                />
                <Input
                  label="End Time"
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateSlot(slot.id, { endTime: e.target.value })}
                />
                <Input
                  label="Capacity"
                  type="number"
                  value={slot.capacity}
                  onChange={(e) => updateSlot(slot.id, { capacity: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                <div className="flex gap-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.key}
                      onClick={() => toggleSlotDay(slot.id, day.key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        slot.days.includes(day.key)
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Capacity: {slot.capacity} orders</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{slot.days.length} days active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Delivery Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-green-50 p-2">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Delivery Settings</h2>
            <p className="text-sm text-gray-600">Configure delivery rules and restrictions</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Day Delivery Cut-off Time
              </label>
              <Input
                type="time"
                value={cutoffTime}
                onChange={(e) => setCutoffTime(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Orders placed after this time will be scheduled for the next available day
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advance Booking Days
              </label>
              <Input
                type="number"
                value={advanceBookingDays}
                onChange={(e) => setAdvanceBookingDays(parseInt(e.target.value))}
                min="1"
                max="30"
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum days in advance customers can book delivery
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Delivery Restrictions</h3>
            <div className="space-y-3">
              {[
                { label: 'Allow same-day delivery', desc: 'Enable delivery on the same day if ordered before cut-off time' },
                { label: 'Block delivery on holidays', desc: 'Automatically disable delivery slots on public holidays' },
                { label: 'Enable express delivery', desc: 'Allow customers to pay extra for priority delivery' },
                { label: 'Weekend delivery', desc: 'Enable delivery slots on weekends' },
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-sm">{setting.label}</p>
                    <p className="text-xs text-gray-500">{setting.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Slot Analytics */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-purple-50 p-2">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Slot Performance</h2>
            <p className="text-sm text-gray-600">Current week's slot utilization</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {slots.filter(slot => slot.isActive).map((slot) => {
            const utilization = Math.floor(Math.random() * 80) + 20; // Mock data
            return (
              <div key={slot.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{slot.name}</h4>
                  <span className="text-xs text-gray-500">{slot.startTime} - {slot.endTime}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span className="font-medium">{utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${utilization}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{Math.floor(slot.capacity * utilization / 100)} / {slot.capacity}</span>
                    <span>orders</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}