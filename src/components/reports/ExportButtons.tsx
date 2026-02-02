import { FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '../ui';

interface ExportData {
  headers: string[];
  data: any[];
  filename: string;
}

interface ExportButtonsProps {
  data: ExportData;
  className?: string;
}

export const ExportButtons = ({ data, className = "" }: ExportButtonsProps) => {
  const exportToCSV = () => {
    const csvContent = [
      data.headers.join(','),
      ...data.data.map(row => data.headers.map(header => row[header] || '').join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Mock PDF export - would integrate with jsPDF in real implementation
    console.log('Exporting to PDF:', data.filename);
    alert('PDF export functionality would be implemented with jsPDF library');
  };

  const exportToExcel = () => {
    // Mock Excel export - would integrate with xlsx library in real implementation
    console.log('Exporting to Excel:', data.filename);
    alert('Excel export functionality would be implemented with xlsx library');
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button size="sm" variant="secondary" onClick={exportToCSV}>
        <FileText className="h-4 w-4 mr-1" />
        CSV
      </Button>
      <Button size="sm" variant="secondary" onClick={exportToPDF}>
        <FileText className="h-4 w-4 mr-1" />
        PDF
      </Button>
      <Button size="sm" variant="secondary" onClick={exportToExcel}>
        <FileSpreadsheet className="h-4 w-4 mr-1" />
        Excel
      </Button>
    </div>
  );
};
