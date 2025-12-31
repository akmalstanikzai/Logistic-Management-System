import {
  PencilIcon,
  TrashIcon,
  UserIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

export default function ShipmentsTable({
  shipments,
  onEdit,
  onDelete,
  onAssign,
  onStatus,
}) {
  if (!shipments.length) {
    return (
      <div className="text-center py-12">
        <TruckIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-500">No shipments found</p>
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <tbody className="bg-white divide-y divide-gray-200">
        {shipments.map((s) => (
          <tr key={s._id}>
            <td className="px-6 py-4">{s.shipmentId}</td>
            <td className="px-6 py-4">{s.shipmentName}</td>
            <td className="px-6 py-4">{s.origin}</td>
            <td className="px-6 py-4">{s.destination}</td>

            <td className="px-6 py-4">
              {s.driver ? (
                <span className="flex items-center gap-1">
                  <UserIcon className="h-4 w-4" />
                  {s.driver.name}
                </span>
              ) : (
                <span className="text-gray-400">Unassigned</span>
              )}
            </td>

            <td className="px-6 py-4">
              <button onClick={() => onStatus(s)} className="badge">
                {s.status}
              </button>
            </td>

            <td className="px-6 py-4 flex gap-2">
              <button onClick={() => onAssign(s)}>
                <UserIcon className="h-5 w-5 text-blue-600" />
              </button>
              <button onClick={() => onEdit(s)}>
                <PencilIcon className="h-5 w-5 text-green-600" />
              </button>
              <button onClick={() => onDelete(s._id)}>
                <TrashIcon className="h-5 w-5 text-red-600" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
