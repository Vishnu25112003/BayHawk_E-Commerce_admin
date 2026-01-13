import { useState } from 'react';
import { Modal, Badge, Input, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { Scissors, Plus, Edit2, Trash2, Fish, ChefHat } from 'lucide-react';
import type { CuttingType } from '../types';

const mockCuttingTypes: CuttingType[] = [
  { 
    id: '1', 
    name: 'Whole Fish', 
    description: 'Complete fish without cutting - perfect for grilling', 
    category: 'fish', 
    moduleType: 'hub', 
    method: '1. Rinse fish under cold running water\n2. Remove scales using fish scaler\n3. Make incision from vent to gills\n4. Remove all internal organs\n5. Rinse cavity thoroughly\n6. Pat dry with paper towels',
    imageUrl: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '2', 
    name: 'Fish Fillet', 
    description: 'Boneless fish pieces - ideal for pan-frying', 
    category: 'fish', 
    moduleType: 'hub', 
    method: '1. Place cleaned fish on cutting board\n2. Insert knife behind gills\n3. Cut along backbone toward tail\n4. Remove fillet in one piece\n5. Remove pin bones with tweezers',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '6', 
    name: 'Whole Chicken', 
    description: 'Complete chicken ready for roasting', 
    category: 'chicken', 
    moduleType: 'store', 
    method: '1. Remove from packaging\n2. Remove giblets from cavity\n3. Rinse with cold water\n4. Pat dry thoroughly\n5. Trim excess fat\n6. Ready for seasoning',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
  { 
    id: '7', 
    name: 'Chicken Curry Cut', 
    description: 'Traditional bone-in pieces for curries', 
    category: 'chicken', 
    moduleType: 'store', 
    method: '1. Cut through skin between leg and body\n2. Remove legs and thighs\n3. Cut wings at joints\n4. Cut breast into pieces\n5. Wash all pieces thoroughly',
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
    isActive: true, 
    createdBy: 'admin', 
    createdAt: '2024-01-01' 
  },
];

export function CuttingTypePage() {
  const { user } = useAuth();
  const [cuttingTypes, setCuttingTypes] = useState<CuttingType[]>(mockCuttingTypes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<CuttingType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'fish' as 'fish' | 'chicken' | 'mutton' | 'other',
    method: '',
    imageFile: null as File | null,
    imageUrl: '',
  });

  // Filter cutting types based on user role
  const getFilteredTypes = () => {
    if (user?.loginType === 'super_admin') {
      return cuttingTypes;
    } else if (user?.loginType === 'hub') {
      return cuttingTypes.filter(type => type.moduleType === 'hub');
    } else if (user?.loginType === 'store') {
      return cuttingTypes.filter(type => type.moduleType === 'store');
    }
    return [];
  };

  const filteredCuttingTypes = getFilteredTypes();
  const hubTypes = filteredCuttingTypes.filter(type => type.moduleType === 'hub');
  const storeTypes = filteredCuttingTypes.filter(type => type.moduleType === 'store');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newType: CuttingType = {
      id: editingType?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      method: formData.method,
      imageUrl: formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.imageUrl,
      moduleType: user?.loginType === 'hub' ? 'hub' : user?.loginType === 'store' ? 'store' : (formData.category === 'fish' ? 'hub' : 'store'),
      isActive: true,
      createdBy: user?.name || 'admin',
      createdAt: new Date().toISOString(),
    };

    if (editingType) {
      setCuttingTypes(prev => prev.map(type => type.id === editingType.id ? newType : type));
    } else {
      setCuttingTypes(prev => [...prev, newType]);
    }

    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ 
      name: '', 
      description: '', 
      category: user?.loginType === 'hub' ? 'fish' : 'chicken', 
      method: '', 
      imageFile: null, 
      imageUrl: '' 
    });
  };

  const handleEdit = (type: CuttingType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description,
      category: type.category,
      method: type.method,
      imageFile: null,
      imageUrl: type.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCuttingTypes(prev => prev.filter(type => type.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file, imageUrl: '' }));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fish': return <Fish className="w-4 h-4" />;
      case 'chicken': return <ChefHat className="w-4 h-4" />;
      case 'mutton': return <ChefHat className="w-4 h-4" />;
      default: return <Scissors className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fish': return 'bg-blue-100 text-blue-800';
      case 'chicken': return 'bg-orange-100 text-orange-800';
      case 'mutton': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Cutting Types</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage available cutting types for products</p>
        </div>
        <Button onClick={() => {
          resetForm();
          setIsModalOpen(true);
        }} className="w-full sm:w-auto flex-shrink-0 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Cutting Type</span>
          <span className="sm:hidden">Add Type</span>
        </Button>
      </div>

      <div className={user?.loginType === 'super_admin' ? "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" : "grid grid-cols-1 gap-4 sm:gap-6"}>
        {/* Hub Section - Left Side for Super Admin */}
        {(user?.loginType === 'super_admin' || user?.loginType === 'hub') && hubTypes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Fish className="w-4 w-4 sm:w-5 sm:h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Hub - Fish Cutting Types</h2>
                <Badge variant="secondary" className="text-xs">{hubTypes.length}</Badge>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {hubTypes.map((type) => (
                <div key={type.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    {type.imageUrl && (
                      <div className="w-20 h-20 flex-shrink-0">
                        <img 
                          src={type.imageUrl} 
                          alt={type.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getCategoryIcon(type.category)}
                            <h3 className="font-medium text-gray-900 text-sm">{type.name}</h3>
                            <Badge className={getCategoryColor(type.category)}>
                              {type.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{type.description}</p>
                          {type.method && (
                            <details className="text-xs text-gray-500">
                              <summary className="cursor-pointer hover:text-gray-700 font-medium">
                                View Method
                              </summary>
                              <div className="mt-2 p-2 bg-gray-50 rounded border">
                                <pre className="whitespace-pre-wrap font-sans text-xs">{type.method}</pre>
                              </div>
                            </details>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(type)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(type.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store Section - Right Side for Super Admin */}
        {(user?.loginType === 'super_admin' || user?.loginType === 'store') && storeTypes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Store - Chicken & Other Cutting Types</h2>
                <Badge variant="secondary">{storeTypes.length}</Badge>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {storeTypes.map((type) => (
                <div key={type.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex">
                    {type.imageUrl && (
                      <div className="w-20 h-20 flex-shrink-0">
                        <img 
                          src={type.imageUrl} 
                          alt={type.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getCategoryIcon(type.category)}
                            <h3 className="font-medium text-gray-900 text-sm">{type.name}</h3>
                            <Badge className={getCategoryColor(type.category)}>
                              {type.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{type.description}</p>
                          {type.method && (
                            <details className="text-xs text-gray-500">
                              <summary className="cursor-pointer hover:text-gray-700 font-medium">
                                View Method
                              </summary>
                              <div className="mt-2 p-2 bg-gray-50 rounded border">
                                <pre className="whitespace-pre-wrap font-sans text-xs">{type.method}</pre>
                              </div>
                            </details>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(type)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(type.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Show only if no types available */}
        {filteredCuttingTypes.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center col-span-full">
            <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Cutting Types Available</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first cutting type</p>
            <Button onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Add Cutting Type
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={resetForm} 
        title={editingType ? 'Edit Cutting Type' : 'Add Cutting Type'} 
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter cutting type name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {user?.loginType === 'super_admin' ? (
                  <>
                    <option value="fish">Fish (Hub)</option>
                    <option value="chicken">Chicken (Store)</option>
                    <option value="mutton">Mutton (Store)</option>
                    <option value="other">Other (Store)</option>
                  </>
                ) : user?.loginType === 'hub' ? (
                  <option value="fish">Fish</option>
                ) : (
                  <>
                    <option value="chicken">Chicken</option>
                    <option value="mutton">Mutton</option>
                    <option value="other">Other</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-center text-gray-500 text-sm">OR</div>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value, imageFile: null }))}
                placeholder="Enter image URL"
              />
            </div>
            {(formData.imageFile || formData.imageUrl) && (
              <div className="mt-3">
                <img 
                  src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : formData.imageUrl} 
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cutting Method</label>
            <textarea
              value={formData.method}
              onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
              placeholder="Enter detailed cutting method steps..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter each step on a new line for better formatting
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit">
              {editingType ? 'Update' : 'Add'} Cutting Type
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
