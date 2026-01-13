import { LoadingSpinner } from './LoadingSpinner';
import { Fish } from 'lucide-react';

interface PageLoaderProps {
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'branded';
  showLogo?: boolean;
}

export function PageLoader({ 
  text = 'Loading...', 
  variant = 'branded',
  showLogo = true 
}: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        {showLogo && (
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Fish className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">BAYHAWK</span>
                <p className="text-sm text-gray-600">Admin Panel</p>
              </div>
            </div>
          </div>
        )}
        
        <LoadingSpinner 
          variant={variant} 
          size="xl" 
          text={text}
        />
      </div>
    </div>
  );
}