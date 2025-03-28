import { useState, useEffect } from 'react';
import { positionsRef } from '../firebase/config';
import { getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { PlusIcon, UserPlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import '../App.css';


export default function PositionList() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
    // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

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
  // Lógica de paginación
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPositions.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredPositions.length / recordsPerPage);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-900 hover:to-indigo-900 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Position
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search positions..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Resetear a la primera página al buscar
          }}
        />
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1); // Resetear a la primera página al cambiar estado
          }}
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
              {currentRecords.map((position, index) => (
                <tr key={position.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-500">
                    {indexOfFirstRecord + index + 1}
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
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/new-candidate?positionId=${position.id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-inner"
                      >
                        <UserPlusIcon className="w-4 h-4 mr-1.5" />
                        <span>Candidate</span>
                      </Link>
                      
                      <Link
                        to={`/position/${position.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700 rounded-md text-sm font-medium transition-all bg-white hover:bg-gray-50"
                      >
                        <PencilSquareIcon className="w-4 h-4 mr-1.5" />
                        <span>Edit</span>
                      </Link>
                    </div>
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

        {/* Paginación */}
        {filteredPositions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastRecord, filteredPositions.length)}
              </span>{' '}
              of <span className="font-medium">{filteredPositions.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === number
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}