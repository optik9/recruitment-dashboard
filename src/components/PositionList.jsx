import { useState, useEffect } from 'react';
import { positionsRef } from '../firebase/config';
import { getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../App.css';

export default function PositionList() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const snapshot = await getDocs(positionsRef);
        const positionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Ordenar por fecha de apertura ascendente
        const sortedPositions = positionsData.sort((a, b) => {
          const dateA = new Date(a.fechaApertura).getTime();
          const dateB = new Date(b.fechaApertura).getTime();
          return dateB - dateA; // Cambio aquí para orden descendente
        });
        
        setPositions(sortedPositions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const formatDate = (dateValue) => {
    try {
      if (!dateValue) return '';
      
      if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateValue;
      }
      
      if (typeof dateValue.toDate === 'function') {
        const jsDate = dateValue.toDate();
        return jsDate.toISOString().split('T')[0];
      }
      
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split('T')[0];
      }
      
      return '';
    } catch (error) {
      console.error('Error converting date:', error);
      return '';
    }
  };

  const filteredPositions = positions.filter(position => {
    const matchesSearch = position.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.pais.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? 
      position.estado.toLowerCase() === selectedStatus.toLowerCase() : true;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="loading">Loading positions...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Open Positions</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage and track all open positions
            </p>
          </div>
          <Link
            to="/new-position"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            + New Position
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search positions..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All states</option>
          <option value="Active">Active</option>
          <option value="Sourcing">Sourcing</option>
          <option value="Screening">Screening</option>
          <option value="Technical Assessment">Technical Assessment</option>
          <option value="Technical Interviews">Technical Interviews</option>
          <option value="Client Interviews">Client Interviews</option>
          <option value="Offer Stage">Offer Stage</option>
          <option value="Offer Accepted">Offer Accepted</option>
          <option value="Onboarding">Onboarding</option>
          <option value="Closed">Closed</option>
          <option value="On Hold">On Hold</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Client/Project
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recruiter
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPositions.map((position, index) => (
                <tr key={position.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium max-w-[180px] truncate">
                    {position.nombre}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${position.estado === 'Active' ? 'bg-green-100 text-green-800' :
                        position.estado === 'Closed' ? 'bg-red-100 text-red-800' :
                        position.estado === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'} max-w-[140px] truncate`}>
                      {position.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-[150px] truncate">
                    {position.cliente}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate">
                    {position.reclutador}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate">
                    {position.pais}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(position.fechaApertura)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium space-x-2">
                    <Link
                      to={`/new-candidate?positionId=${position.id}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      + Candidate
                    </Link>
                    <Link
                      to={`/position/${position.id}`}
                      className="text-gray-600 hover:text-gray-900 text-sm"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPositions.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No positions found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}