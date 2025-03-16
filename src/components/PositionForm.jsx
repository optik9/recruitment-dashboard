import { useState, useEffect } from 'react';
import { positionsRef, configRef } from '../firebase/config';
import { addDoc, getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Añadir este import
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PositionForm() {
  const navigate = useNavigate(); // Añadir este hook
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cliente: '',
    requerimiento: '',
    fechaApertura: '',
    fechaCierre: '',
    estado: 'Active',
    reclutador: '',
    pais: '',
    // Nuevos campos
    prioridad: 'Normal',
    tipoSolicitud: '',
    escalado: 'No'
  });
  
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const docRef = doc(configRef, 'options');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setRecruiters(docSnap.data().recruiters || []);
        }
      } catch (error) {
        console.error("Error loading recruiters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(positionsRef, formData);
      alert('Posición creada exitosamente!');
      navigate('/'); // Añadir esta línea
      setFormData({
        nombre: '',
        descripcion: '',
        cliente: '',
        requerimiento: '',
        fechaApertura: '',
        fechaCierre: '',
        estado: 'Active',
        reclutador: '',
        pais: '',
        prioridad: 'Normal',
        tipoSolicitud: '',
        escalado: 'No'
      });
    } catch (error) {
      console.error('Error creating position:', error);
      alert('Error al crear la posición');
    }
  };

  if (loading) return <div className="loading">Cargando formulario...</div>;

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">New Open Position</h2>
      
      {/* Sección información básica */}
      <div className="form-section">
        <h3 className="section-title">Basic Information</h3>
        <div className="form-grid">
          {/* Columna 1 */}
          <div className="form-column">
            <div className="form-group">
              <label>Position name</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Client/Project</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.cliente}
                onChange={(e) => setFormData({...formData, cliente: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <select
                required
                className="form-select"
                value={formData.pais}
                onChange={(e) => setFormData({...formData, pais: e.target.value})}
              >
              <option value="">Select Country</option>
                  <option value="Peru">Peru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="USA">USA</option>
                </select>
            </div>

          </div>

          {/* Columna 2 */}
          <div className="form-column">
            <div className="form-group">
              <label>Job Description</label>
              <textarea
                required
                className="form-textarea"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                rows="4"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección detalles y requisitos */}
      <div className="form-section">
        <h3 className="section-title">Details and Requirements</h3>
        <div className="form-grid">
          {/* Columna 1 */}
          <div className="form-column">
            <div className="form-group">
              <label>Key Requirements</label>
              <textarea
                required
                className="form-textarea"
                value={formData.requerimiento}
                onChange={(e) => setFormData({...formData, requerimiento: e.target.value})}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Open Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.fechaApertura}
                onChange={(e) => setFormData({...formData, fechaApertura: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Close Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.fechaCierre}
                onChange={(e) => setFormData({...formData, fechaCierre: e.target.value})}
              />
            </div>
          </div>

          {/* Columna 2 */}
          <div className="form-column">
            <div className="form-group">
              <label>Request type</label>
              <select
                required
                className="form-select"
                value={formData.tipoSolicitud}
                onChange={(e) => setFormData({...formData, tipoSolicitud: e.target.value})}
              >
                <option value="">Select Type</option>
                <option value="Hiring Plan">Hiring Plan</option>
                <option value="Growth">Growth</option>
                <option value="Sales Need">Sales Need</option>
                <option value="Transition">Transition</option>
                <option value="Perpetual Position">Perpetual Position</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                className="form-select"
                value={formData.prioridad}
                onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <label>Escalated</label>
              <select
                className="form-select"
                value={formData.escalado}
                onChange={(e) => setFormData({...formData, escalado: e.target.value})}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sección estado y asignación */}
      <div className="form-section">
        <h3 className="section-title">Status and Assignment</h3>
        <div className="form-grid">
          {/* Columna 1 */}
          <div className="form-column">
            <div className="form-group">
              <label>Status</label>
              <select
                className="form-select"
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
              >
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
          </div>

          {/* Columna 2 */}
          <div className="form-column">
            <div className="form-group">
              <label>Assigned Recruiter</label>
              <select
                required
                className="form-select"
                value={formData.reclutador}
                onChange={(e) => setFormData({...formData, reclutador: e.target.value})}
              >
                <option value="">Select Recruiter</option>
                {recruiters.map((recruiter, index) => (
                  <option key={index} value={recruiter}>{recruiter}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
  <button 
    type="submit" 
    className="inline-flex items-center px-8 py-2.5 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-900 hover:to-indigo-900 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
  >
    <CheckCircleIcon className="w-5 h-5 mr-2" />
    Save
  </button>
</div>
    </form>
  );
}