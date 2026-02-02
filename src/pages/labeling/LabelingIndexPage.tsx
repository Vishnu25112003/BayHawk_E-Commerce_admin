import { Card, Button } from "../../components/ui";
import { Truck, Package, Receipt, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LabelingIndexPage() {
  const navigate = useNavigate();

  const labelingOptions = [
    {
      id: "delivery-slips",
      title: "Delivery Slip Templates",
      description: "Create and manage delivery slip templates with customer details, delivery information, and tracking",
      icon: Truck,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      path: "/labeling/delivery-slips",
      features: ["Customer Information", "Delivery Address", "Payment Details", "QR Codes", "Support Contact"]
    },
    {
      id: "packing-slips",
      title: "Packing Slip Templates", 
      description: "Design packing slip templates with product details, quantities, and packing information",
      icon: Package,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      path: "/labeling/packing-slips",
      features: ["Product Details", "Weight & Cutting", "Quantities", "Barcodes", "Packing Date"]
    },
    {
      id: "bills",
      title: "Bill & Invoice Templates",
      description: "Create comprehensive bill and invoice templates with itemized details and calculations",
      icon: Receipt,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      path: "/labeling/bills",
      features: ["Itemized Billing", "Tax Calculations", "Payment Modes", "Customer Details", "Auto Totals"]
    },
    {
      id: "labels",
      title: "Product Label Designer",
      description: "Design custom product labels with barcodes, pricing, and product information",
      icon: FileText,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
      path: "/labeling/labels",
      features: ["Product Info", "Barcodes", "Pricing", "Expiry Dates", "Brand Logos"]
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Labeling & Templates</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create and manage templates for delivery slips, packing slips, bills, and product labels
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {labelingOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card 
              key={option.id} 
              className={`${option.bgColor} ${option.borderColor} border-2 hover:shadow-lg transition-all cursor-pointer`}
              onClick={() => navigate(option.path)}
            >
              <div className="flex items-start gap-4">
                <div className={`rounded-lg bg-white p-3 shadow-sm`}>
                  <IconComponent className={`h-8 w-8 ${option.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-700 mb-4">{option.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-800">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {option.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/50">
                <Button 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(option.path);
                  }}
                >
                  Open {option.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Template Management Features</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">∞</div>
              <p className="text-sm text-gray-600">Unlimited Templates</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">✓</div>
              <p className="text-sm text-gray-600">Real-time Preview</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">⚡</div>
              <p className="text-sm text-gray-600">Auto-save Changes</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">📱</div>
              <p className="text-sm text-gray-600">Responsive Design</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
