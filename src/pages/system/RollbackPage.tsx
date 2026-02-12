import { RollbackProvider } from '../../context/RollbackContext';
import { RollbackDashboard } from '../../components/rollback/RollbackDashboard';

export function RollbackPage() {
  return (
    <RollbackProvider>
      <div className="p-6">
        <RollbackDashboard />
      </div>
    </RollbackProvider>
  );
}
