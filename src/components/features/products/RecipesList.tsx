import { useState } from 'react';
import { Card, Badge, Input } from '../../ui';
import { Search, Eye, Edit, Trash2, Clock, Users, ChefHat, MoreVertical } from 'lucide-react';
import type { Recipe } from '../../../types';

interface RecipesListProps {
  recipes: Recipe[];
  onView: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onBulkAction: (actionId: string, selectedIds: string[], data?: any) => Promise<void>;
  title: string;
  categories?: string[];
}

export function RecipesList({ 
  recipes, 
  onView, 
  onEdit, 
  onDelete, 
  onBulkAction, 
  title,
  categories = ['All', 'Fish', 'Chicken', 'Mutton', 'Prawn', 'Quick & Easy', 'Traditional', 'Healthy', 'Festive Specials']
}: RecipesListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showBulkActions, setShowBulkActions] = useState(false);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.description.toLowerCase().includes(search.toLowerCase()) ||
      recipe.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || recipe.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && recipe.isPublished) ||
      (statusFilter === 'draft' && !recipe.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredRecipes.map(recipe => recipe.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleBulkAction = async (actionId: string, data?: any) => {
    if (selectedIds.length === 0) return;
    
    try {
      await onBulkAction(actionId, selectedIds, data);
      setSelectedIds([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const bulkActions = [
    { id: 'publish', label: 'Publish Selected', icon: Eye, color: 'text-green-600' },
    { id: 'unpublish', label: 'Unpublish Selected', icon: Eye, color: 'text-yellow-600' },
    { id: 'delete', label: 'Delete Selected', icon: Trash2, color: 'text-red-600' },
  ];

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
              {selectedIds.length > 0 && ` • ${selectedIds.length} selected`}
            </p>
          </div>
          
          {selectedIds.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
                Bulk Actions ({selectedIds.length})
              </button>
              
              {showBulkActions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {bulkActions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleBulkAction(action.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${action.color}`}
                    >
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 sm:p-6 border-b bg-white space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search recipes..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                categoryFilter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Select Header */}
      {filteredRecipes.length > 0 && (
        <div className="p-4 border-b bg-gray-50">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredRecipes.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">
              Select All ({filteredRecipes.length})
            </span>
          </label>
        </div>
      )}

      {/* Recipes List */}
      <div className="divide-y">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <div key={recipe.id} className="p-4 sm:p-6">
              <div className="flex gap-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(recipe.id)}
                    onChange={(e) => handleSelectItem(recipe.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                {/* Recipe Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <ChefHat className="h-8 w-8 text-orange-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">{recipe.name}</h3>
                        <Badge variant={recipe.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {recipe.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant={getDifficultyColor(recipe.difficulty)}>
                          {recipe.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">{recipe.description}</p>
                      <p className="text-sm text-blue-600 font-medium">{recipe.category}</p>
                    </div>
                  </div>

                  {/* Recipe Info */}
                  <div className="flex items-center gap-6 mb-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.serves} servings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChefHat className="h-4 w-4" />
                      <span>{recipe.ingredients?.length || 0} ingredients</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => onView(recipe)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button 
                      onClick={() => onEdit(recipe)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(recipe)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-500">
              {search || categoryFilter !== 'All' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'No recipes available'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
