import { useState, useEffect } from 'react';
import { shipmentAPI, driverAPI } from '../services/api';

export function useShipments() {
  const [shipments, setShipments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const res = await shipmentAPI.getAll();
      setShipments(res.data.data);
      setError('');
    } catch {
      setError('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await driverAPI.getAvailable();
      setDrivers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShipments();
    fetchDrivers();
  }, []);

  return {
    shipments,
    drivers,
    loading,
    error,
    setError,
    fetchShipments,
    fetchDrivers,
  };
}
