import { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/ui';
import { Plus, Search, Eye, Edit, Trash2, Clock, Users, ChefHat, Building2, Store, X, Upload, Video, Image } from 'lucide-react';
import { getStatusColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { filterDataByModule } from '../utils/rbac';
import type { Recipe } from '../types';

const mockHubRecipes: Recipe[] = [
  { id: 'h1', name: 'Fish Curry - Kerala Style', description: 'Traditional Kerala fish curry with coconut milk', category: 'Fish', difficulty: 'medium', prepTime: 15, cookTime: 30, serves: 4, ingredients: [], instructions: [], images: [], isPublished: true, moduleType: 'hub', hubId: 'hub_1' },
  { id: 'h2', name: 'Prawn Masala', description: 'Spicy prawn masala with aromatic spices', category: 'Prawn', difficulty: 'easy', prepTime: 10, cookTime: 20, serves: 3, ingredients: [], instructions: [], images: [], isPublished: true, moduleType: 'hub', hubId: 'hub_1' },
  { id: 'h3', name: 'Crab Roast', description: 'Chettinad style crab roast', category: 'Crab', difficulty: 'hard', prepTime: 20, cookTime: 45, serves: 4, ingredients: [], instructions: [], images: [], isPublished: false, moduleType: 'hub', hubId: 'hub_1' },
];

const mockStoreRecipes: Recipe[] = [
  { id: 's1', name: 'Grilled Fish Steak', description: 'Healthy grilled fish with herbs', category: 'Healthy', difficulty: 'easy', prepTime: 10, cookTime: 15, serves: 2, ingredients: [], instructions: [], images: [], isPublished: true, moduleType: 'store', storeId: 'store_1' },
  { id: 's2', name: 'Chicken Biryani', description: 'Aromatic chicken biryani with basmati rice', category: 'Chicken', difficulty: 'medium', prepTime: 30, cookTime: 60, serves: 6, ingredients: [], instructions: [], images: [], isPublished: true, moduleType: 'store', storeId: 'store_1' },
  { id: 's3', name: 'Mutton Curry', description: 'Tender mutton curry with traditional spices', category: 'Mutton', difficulty: 'hard', prepTime: 25, cookTime: 90, serves: 4, ingredients: [], instructions: [], images: [], isPublished: false, moduleType: 'store', storeId: 'store_1' },
];

const categories = ['All', 'Fish', 'Chicken', 'Mutton', 'Prawn', 'Quick & Easy', 'Traditional', 'Healthy', 'Festive Specials'];

export function RecipesPage() {
  const { user } = useAuth();
  const [hubRecipes, setHubRecipes] = useState<Recipe[]>(mockHubRecipes);
  const [storeRecipes, setStoreRecipes] = useState<Recipe[]>(mockStoreRecipes);
  const [activeSection, setActiveSection] = useState<'hub' | 'store'>('hub');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{type: 'image' | 'video', url: string, name: string}>>([]);
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: '',
    description: '',
    category: '',
    difficulty: 'easy',
    prepTime: 0,
    cookTime: 0,
    serves: 0,
    ingredients: [],
    instructions: [],
    images: [],
    isPublished: true
  });

  // Filter recipes based on user's module access
  const allRecipes = [...hubRecipes, ...storeRecipes];
  const filteredRecipesData = filterDataByModule(allRecipes, user);
  
  const filteredHubRecipes = filteredRecipesData.filter(recipe => recipe.moduleType === 'hub');
  const filteredStoreRecipes = filteredRecipesData.filter(recipe => recipe.moduleType === 'store');

  // Determine which sections to show based on user type
  const getAvailableSections = () => {
    if (user?.loginType === 'hub') {
      return ['hub'];
    } else if (user?.loginType === 'store') {
      return ['store'];
    } else {
      // Super admin sees all sections
      return ['hub', 'store'];
    }
  };

  const availableSections = getAvailableSections();

  // Set default active section based on user type
  useState(() => {
    const defaultSection = user?.loginType === 'hub' ? 'hub' : user?.loginType === 'store' ? 'store' : 'hub';
    setActiveSection(defaultSection as 'hub' | 'store');
  });

  const currentRecipes = activeSection === 'hub' ? filteredHubRecipes : filteredStoreRecipes;
  
  const filteredRecipes = currentRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || recipe.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowViewModal(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setNewRecipe(recipe);
    setShowEditModal(true);
  };

  const handleDeleteRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedRecipe) {
      if (activeSection === 'hub') {
        setHubRecipes(hubRecipes.filter(r => r.id !== selectedRecipe.id));
      } else {
        setStoreRecipes(storeRecipes.filter(r => r.id !== selectedRecipe.id));
      }
      setShowDeleteModal(false);
      setSelectedRecipe(null);
      alert(`Recipe "${selectedRecipe.name}" has been deleted successfully!`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderRecipeCard = (recipe: Recipe) => (
    <Card key={recipe.id} className="overflow-hidden p-0">
      <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
        <ChefHat className="h-16 w-16 text-orange-400" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold">{recipe.name}</h3>
          <Badge variant={getStatusColor(recipe.isPublished ? 'active' : 'inactive')}>
            {recipe.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {recipe.prepTime + recipe.cookTime} min</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {recipe.serves} servings</span>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant={recipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' : recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
            {recipe.difficulty}
          </Badge>
          <div className="flex gap-2">
            <button 
              onClick={() => handleViewRecipe(recipe)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleEditRecipe(recipe)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Edit Recipe"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDeleteRecipe(recipe)}
              className="p-1 hover:bg-gray-100 rounded text-red-600 transition-colors"
              title="Delete Recipe"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Recipe Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage recipes and cooking guides</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto flex-shrink-0">
          <Plus className="mr-2 h-4 w-4" /> 
          <span className="hidden sm:inline">Add Recipe</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Hub/Store Section Tabs - Only show if there are multiple sections */}
      {availableSections.length > 1 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 p-1 bg-gray-50 rounded-lg">
            <button
              onClick={() => setActiveSection('hub')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md font-medium transition-all text-sm ${
                activeSection === 'hub' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Hub Recipes ({filteredHubRecipes.length})
            </button>
            <button
              onClick={() => setActiveSection('store')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeSection === 'store' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Store className="h-4 w-4" />
              Store Recipes ({filteredStoreRecipes.length})
            </button>
          </div>
        </Card>
      )}

      {/* Section Header */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        {activeSection === 'hub' ? (
          <>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-blue-900">Hub Recipes</h2>
              <p className="text-sm text-blue-700">Recipes managed by hub operations</p>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 bg-green-100 rounded-lg">
              <Store className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-semibold text-green-900">Store Recipes</h2>
              <p className="text-sm text-green-700">Recipes managed by store operations</p>
            </div>
          </>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              categoryFilter === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search recipes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={[{ value: '', label: 'All Status' }, { value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]} />
          <Select value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)} options={[{ value: '', label: 'All Difficulty' }, { value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' }]} />
        </div>
      </Card>

      {/* Recipes Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map(renderRecipeCard)}
      </div>

      {filteredRecipes.length === 0 && (
        <Card className="text-center py-12">
          <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </Card>
      )}

      {/* Add Recipe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Add New Recipe</h2>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setUploadedFiles([]);
                    setNewRecipe({
                      name: '',
                      description: '',
                      category: '',
                      difficulty: 'easy',
                      prepTime: 0,
                      cookTime: 0,
                      serves: 0,
                      ingredients: [],
                      instructions: [],
                      images: [],
                      isPublished: true
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                    <Input 
                      placeholder="Fish Curry - Kerala Style" 
                      value={newRecipe.name || ''}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newRecipe.category || ''}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    rows={3} 
                    placeholder="Describe your recipe..."
                    value={newRecipe.description || ''}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Recipe Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                    <Input 
                      type="number" 
                      placeholder="15" 
                      value={newRecipe.prepTime || ''}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
                    <Input 
                      type="number" 
                      placeholder="30" 
                      value={newRecipe.cookTime || ''}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                    <Input 
                      type="number" 
                      placeholder="4" 
                      value={newRecipe.serves || ''}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, serves: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      value={newRecipe.difficulty || 'easy'}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Image/Video Upload */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Media Upload</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">Upload Images & Videos</p>
                    <p className="text-sm text-gray-500 mb-4">Drag and drop files here, or click to browse</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </label>
                  </div>
                </div>
                
                {/* Display Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Uploaded Files</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {file.type === 'image' ? (
                              <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="mt-1">
                            <p className="text-xs text-gray-600 truncate">{file.name}</p>
                            <div className="flex items-center gap-1">
                              {file.type === 'image' ? (
                                <Image className="h-3 w-3 text-blue-500" />
                              ) : (
                                <Video className="h-3 w-3 text-purple-500" />
                              )}
                              <span className="text-xs text-gray-500">{file.type}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeUploadedFile(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                <div className="space-y-2">
                  {newRecipe.ingredients?.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        placeholder="Ingredient name" 
                        value={ingredient.name}
                        onChange={(e) => {
                          const updated = [...(newRecipe.ingredients || [])];
                          updated[index] = { ...ingredient, name: e.target.value };
                          setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                        }}
                        className="flex-1" 
                      />
                      <Input 
                        placeholder="Quantity" 
                        value={ingredient.quantity}
                        onChange={(e) => {
                          const updated = [...(newRecipe.ingredients || [])];
                          updated[index] = { ...ingredient, quantity: e.target.value };
                          setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                        }}
                        className="w-24" 
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const updated = [...(newRecipe.ingredients || [])];
                          updated.splice(index, 1);
                          setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setNewRecipe(prev => ({ 
                      ...prev, 
                      ingredients: [...(prev.ingredients || []), { name: '', quantity: '' }] 
                    }))}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" /> Add Ingredient
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                <div className="space-y-2">
                  {newRecipe.instructions?.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="w-8 h-10 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-100 rounded">
                        {index + 1}.
                      </span>
                      <textarea
                        placeholder="Step instruction"
                        value={instruction}
                        onChange={(e) => {
                          const updated = [...(newRecipe.instructions || [])];
                          updated[index] = e.target.value;
                          setNewRecipe(prev => ({ ...prev, instructions: updated }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={2}
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const updated = [...(newRecipe.instructions || [])];
                          updated.splice(index, 1);
                          setNewRecipe(prev => ({ ...prev, instructions: updated }));
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setNewRecipe(prev => ({ 
                      ...prev, 
                      instructions: [...(prev.instructions || []), ''] 
                    }))}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" /> Add Step
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setUploadedFiles([]);
                    setNewRecipe({
                      name: '',
                      description: '',
                      category: '',
                      difficulty: 'easy',
                      prepTime: 0,
                      cookTime: 0,
                      serves: 0,
                      ingredients: [],
                      instructions: [],
                      images: [],
                      isPublished: true
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const recipeToSave: Recipe = {
                      id: `${activeSection[0]}${Date.now()}`,
                      name: newRecipe.name || '',
                      description: newRecipe.description || '',
                      category: newRecipe.category || '',
                      difficulty: newRecipe.difficulty || 'easy',
                      prepTime: newRecipe.prepTime || 0,
                      cookTime: newRecipe.cookTime || 0,
                      serves: newRecipe.serves || 0,
                      ingredients: newRecipe.ingredients || [],
                      instructions: newRecipe.instructions || [],
                      images: uploadedFiles.map(f => f.url),
                      isPublished: true
                    };
                    
                    if (activeSection === 'hub') {
                      setHubRecipes([...hubRecipes, recipeToSave]);
                    } else {
                      setStoreRecipes([...storeRecipes, recipeToSave]);
                    }
                    
                    setShowAddModal(false);
                    setUploadedFiles([]);
                    setNewRecipe({
                      name: '',
                      description: '',
                      category: '',
                      difficulty: 'easy',
                      prepTime: 0,
                      cookTime: 0,
                      serves: 0,
                      ingredients: [],
                      instructions: [],
                      images: [],
                      isPublished: true
                    });
                    alert(`Recipe "${recipeToSave.name}" has been added successfully!`);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Recipe Modal */}
      {showViewModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recipe Details</h2>
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedRecipe(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Recipe Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedRecipe.name}</h1>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant={getStatusColor(selectedRecipe.isPublished ? 'active' : 'inactive')}>
                        {selectedRecipe.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant={selectedRecipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' : selectedRecipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                        {selectedRecipe.difficulty}
                      </Badge>
                      <span className="text-gray-500">Category: {selectedRecipe.category}</span>
                    </div>
                    <p className="text-gray-700 text-lg">{selectedRecipe.description}</p>
                  </div>
                </div>
                
                {/* Recipe Stats */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{selectedRecipe.prepTime + selectedRecipe.cookTime}</span>
                    </div>
                    <p className="text-sm text-gray-600">Total Time (min)</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{selectedRecipe.prepTime}</span>
                    </div>
                    <p className="text-sm text-gray-600">Prep Time</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{selectedRecipe.cookTime}</span>
                    </div>
                    <p className="text-sm text-gray-600">Cook Time</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">{selectedRecipe.serves}</span>
                    </div>
                    <p className="text-sm text-gray-600">Servings</p>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              {selectedRecipe.images && selectedRecipe.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Recipe Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedRecipe.images.map((image, index) => (
                      <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img src={image} alt={`Recipe image ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients Section */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Ingredients</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="text-gray-600">- {ingredient.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructions Section */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Instructions</h3>
                <div className="space-y-4">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditRecipe(selectedRecipe);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Recipe
                </button>
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    handleDeleteRecipe(selectedRecipe);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Recipe Modal */}
      {showEditModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Recipe</h2>
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRecipe(null);
                    setUploadedFiles([]);
                    setNewRecipe({
                      name: '',
                      description: '',
                      category: '',
                      difficulty: 'easy',
                      prepTime: 0,
                      cookTime: 0,
                      serves: 0,
                      ingredients: [],
                      instructions: [],
                      images: [],
                      isPublished: true
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name</label>
                    <Input 
                      placeholder="Fish Curry - Kerala Style" 
                      value={newRecipe.name || selectedRecipe.name}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newRecipe.category || selectedRecipe.category}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    rows={3} 
                    placeholder="Describe your recipe..."
                    value={newRecipe.description || selectedRecipe.description}
                    onChange={(e) => setNewRecipe(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Recipe Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                    <Input 
                      type="number" 
                      placeholder="15" 
                      value={newRecipe.prepTime || selectedRecipe.prepTime}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
                    <Input 
                      type="number" 
                      placeholder="30" 
                      value={newRecipe.cookTime || selectedRecipe.cookTime}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serves</label>
                    <Input 
                      type="number" 
                      placeholder="4" 
                      value={newRecipe.serves || selectedRecipe.serves}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, serves: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      value={newRecipe.difficulty || selectedRecipe.difficulty}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                <div className="space-y-2">
                  {(newRecipe.ingredients || selectedRecipe.ingredients).map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        placeholder="Ingredient name" 
                        value={ingredient.name}
                        onChange={(e) => {
                          const updated = [...(newRecipe.ingredients || selectedRecipe.ingredients)];
                          updated[index] = { ...ingredient, name: e.target.value };
                          setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                        }}
                        className="flex-1" 
                      />
                      <Input 
                        placeholder="Quantity" 
                        value={ingredient.quantity}
                        onChange={(e) => {
                          const updated = [...(newRecipe.ingredients || selectedRecipe.ingredients)];
                          updated[index] = { ...ingredient, quantity: e.target.value };
                          setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                        }}
                        className="w-24" 
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const updated = [...(newRecipe.ingredients || selectedRecipe.ingredients)];
                          updated.splice(index, 1);
                          setNewRecipe(prev => ({ ...prev, ingredients: updated }));
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setNewRecipe(prev => ({ 
                      ...prev, 
                      ingredients: [...(prev.ingredients || selectedRecipe.ingredients), { name: '', quantity: '' }] 
                    }))}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" /> Add Ingredient
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                <div className="space-y-2">
                  {(newRecipe.instructions || selectedRecipe.instructions).map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="w-8 h-10 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-100 rounded">
                        {index + 1}.
                      </span>
                      <textarea
                        placeholder="Step instruction"
                        value={instruction}
                        onChange={(e) => {
                          const updated = [...(newRecipe.instructions || selectedRecipe.instructions)];
                          updated[index] = e.target.value;
                          setNewRecipe(prev => ({ ...prev, instructions: updated }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={2}
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const updated = [...(newRecipe.instructions || selectedRecipe.instructions)];
                          updated.splice(index, 1);
                          setNewRecipe(prev => ({ ...prev, instructions: updated }));
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setNewRecipe(prev => ({ 
                      ...prev, 
                      instructions: [...(prev.instructions || selectedRecipe.instructions), ''] 
                    }))}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" /> Add Step
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRecipe(null);
                    setUploadedFiles([]);
                    setNewRecipe({
                      name: '',
                      description: '',
                      category: '',
                      difficulty: 'easy',
                      prepTime: 0,
                      cookTime: 0,
                      serves: 0,
                      ingredients: [],
                      instructions: [],
                      images: [],
                      isPublished: true
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const updatedRecipe: Recipe = {
                      ...selectedRecipe,
                      name: newRecipe.name || selectedRecipe.name,
                      description: newRecipe.description || selectedRecipe.description,
                      category: newRecipe.category || selectedRecipe.category,
                      difficulty: newRecipe.difficulty || selectedRecipe.difficulty,
                      prepTime: newRecipe.prepTime || selectedRecipe.prepTime,
                      cookTime: newRecipe.cookTime || selectedRecipe.cookTime,
                      serves: newRecipe.serves || selectedRecipe.serves,
                      ingredients: newRecipe.ingredients || selectedRecipe.ingredients,
                      instructions: newRecipe.instructions || selectedRecipe.instructions,
                      images: uploadedFiles.length > 0 ? uploadedFiles.map(f => f.url) : selectedRecipe.images,
                      isPublished: selectedRecipe.isPublished
                    };
                    
                    if (activeSection === 'hub') {
                      setHubRecipes(hubRecipes.map(r => r.id === selectedRecipe.id ? updatedRecipe : r));
                    } else {
                      setStoreRecipes(storeRecipes.map(r => r.id === selectedRecipe.id ? updatedRecipe : r));
                    }
                    
                    setShowEditModal(false);
                    setSelectedRecipe(null);
                    setUploadedFiles([]);
                    setNewRecipe({
                      name: '',
                      description: '',
                      category: '',
                      difficulty: 'easy',
                      prepTime: 0,
                      cookTime: 0,
                      serves: 0,
                      ingredients: [],
                      instructions: [],
                      images: [],
                      isPublished: true
                    });
                    alert(`Recipe "${updatedRecipe.name}" has been updated successfully!`);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Delete Recipe</h2>
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedRecipe(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Are you sure?</h3>
                    <p className="text-gray-600">This action cannot be undone.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-900">{selectedRecipe.name}</p>
                  <p className="text-sm text-gray-600">{selectedRecipe.category}</p>
                  <p className="text-sm text-gray-500">ID: {selectedRecipe.id}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300" />
                  I understand that this action is permanent
                </label>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedRecipe(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
