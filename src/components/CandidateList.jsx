import { useState, useEffect } from 'react';
import { candidatesRef, positionsRef, configRef } from '../firebase/config';
import { getDocs, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../App.css';

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [processStatuses, setProcessStatuses] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesSnap, positionsSnap, configSnap] = await Promise.all([
          getDocs(candidatesRef),
          getDocs(positionsRef),
          getDocs(configRef)
        ]);
        
        setCandidates(candidatesSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fechaRegistro: data.fechaRegistro?.toDate() || new Date()
          };
        }));
        
        setPositions(positionsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));

        const configData = configSnap.docs[0]?.data();
        setProcessStatuses(configData?.processStatuses || []);
        
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPositionName = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    return position?.nombre || 'Posición no disponible';
  };

  const getCurrencySymbol = (currency) => {
    if (currency === 'PEN') return 'S/. ';
    if (currency === 'USD') return '$ ';
    return '$';
  };

  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesPosition = selectedPosition ? 
        candidate.positionId === selectedPosition : true;
      
      const matchesSearch = candidate.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.pais.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesPosition && matchesSearch;
    })
    .sort((a, b) => b.fechaRegistro - a.fechaRegistro);

  const handleStatusChange = async (candidateId, newStatus) => {
    setUpdating(true);
    try {
      const candidateRef = doc(candidatesRef, candidateId);
      await updateDoc(candidateRef, {
        estadoProceso: newStatus
      });
      
      setCandidates(prev => prev.map(c => 
        c.id === candidateId ? {...c, estadoProceso: newStatus} : c
      ));
      
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar el estado");
    } finally {
      setEditingStatus(null);
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Loading candidates...</div>;

  const statusColors = {
    'aplication': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    'phone-screen': { bg: 'bg-sky-100', text: 'text-sky-800' },
    'assesment-sent': { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    'assesment-complete': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    'tech-interview': { bg: 'bg-amber-100', text: 'text-amber-800' },
    'client-interview': { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800' },
    'hired': { bg: 'bg-green-100', text: 'text-green-800' },
    'offered': { bg: 'bg-lime-100', text: 'text-lime-800' },
    'onboarding': { bg: 'bg-violet-100', text: 'text-violet-800' },
    'rejected': { bg: 'bg-rose-100', text: 'text-rose-800' }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage and track all candidates
            </p>
          </div>
          <Link
            to="/new-candidate"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            + New Candidate
          </Link>
        </div>
      </div>
  
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, last name or country..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          <option value="">All Positions</option>
          {positions.map(position => (
            <option key={position.id} value={position.id}>
              {position.nombre}
            </option>
          ))}
        </select>
      </div>
  
      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div>
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gradient-to-r from-purple-50 to-blue-50">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate, index) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {candidate.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {candidate.apellido}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {getPositionName(candidate.positionId)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {candidate.pais}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {getCurrencySymbol(candidate.moneda)}{candidate.salario}
                  </td>
                  <td 
                    onClick={() => !updating && setEditingStatus(candidate.id)}
                    className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer"
                  >
                    {editingStatus === candidate.id ? (
                      <select
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value={candidate.estadoProceso}
                        onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                        autoFocus
                        disabled={updating}
                      >
                        {processStatuses.map((status, index) => (
                          <option key={index} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${statusColors[candidate.estadoProceso?.toLowerCase().replace(/ /g, '-')]?.bg || 'bg-gray-100'} 
                          ${statusColors[candidate.estadoProceso?.toLowerCase().replace(/ /g, '-')]?.text || 'text-gray-800'}`}>
                          {candidate.estadoProceso}
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.disponibilidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/candidate/${candidate.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Update
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {filteredCandidates.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No candidates found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}