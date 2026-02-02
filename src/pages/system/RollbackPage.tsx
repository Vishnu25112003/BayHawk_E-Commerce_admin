import { RollbackProvider } from '../../context/RollbackContext';
import { RollbackDashboard } from '../../components/rollback/RollbackDashboard';

export function RollbackPage() {
  return (
    <RollbackProvider>
      <RollbackDashboard />
    </RollbackProvider>
  );
}
