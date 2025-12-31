import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ShipmentsTable from '../components/shipments/ShipmentsTable';
import { useShipments } from '../hooks/useShipments';

export default function Shipments() {
  const {
    shipments,
    loading,
    error,
    setError,
    fetchShipments,
  } = useShipments();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Shipments</h1>
        <button className="btn-primary flex gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Shipment
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex justify-between">
          {error}
          <button onClick={() => setError('')}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="card">
        <ShipmentsTable
          shipments={shipments}
          onEdit={() => {}}
          onDelete={() => {}}
          onAssign={() => {}}
          onStatus={() => {}}
        />
      </div>
    </div>
  );
}
