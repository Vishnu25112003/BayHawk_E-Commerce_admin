// Main product form components
export { CompleteProductForm } from './CompleteProductForm';
export { ProductFormWithCuttingType } from './ProductFormWithCuttingType';

// Reusable product form sections
export { ProductInformationForm } from './ProductInformationForm';
export { ProductImageUpload } from './ProductImageUpload';
export { ProductDescriptionEditor } from './ProductDescriptionEditor';
export { ProductVariantForm } from './ProductVariantForm';
export { DayBasedPricing } from './DayBasedPricing';
export { ProductTags } from './ProductTags';

// Other product components
export { NutritionCustomization } from './NutritionCustomization';
export { NutritionDisplay } from './NutritionDisplay';
export { ProductList } from './ProductList';
export { ProductFormWithNutrition } from './ProductFormWithNutrition';

// Type exports
export type { ProductInformationData } from './ProductInformationForm';
export type { CompleteProductFormData } from './CompleteProductForm';
export type { DayBasedPricingData } from './DayBasedPricing';
export type { ProductTagsData } from './ProductTags';

// Nutrition types
export interface SelectedNutrition {
  [key: string]: boolean;
}