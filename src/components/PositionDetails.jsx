import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { positionsRef, configRef } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../App.css';

export default function PositionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [error, setError] = useState(null);

  // Función para convertir Firestore Timestamp a string de fecha
  // Función mejorada para manejar diferentes formatos de fecha
  const convertFirebaseDate = (dateValue) => {
    try {
      if (!dateValue) return '';
      
      // Si ya es un string en formato ISO (de un input type="date")
      if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateValue;
      }
      
      // Si es un Timestamp de Firestore
      if (typeof dateValue.toDate === 'function') {
        const jsDate = dateValue.toDate();
        return jsDate.toISOString().split('T')[0];
      }
      
      // Si es un objeto Date de JavaScript
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split('T')[0];
      }
      
      return '';
    } catch (error) {
      console.error('Error converting date:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const positionDoc = doc(positionsRef, id);
        const configDoc = doc(configRef, 'options');
        
        const [positionSnap, configSnap] = await Promise.all([
          getDoc(positionDoc),
          getDoc(configDoc)
        ]);

        if (!positionSnap.exists()) {
          throw new Error('La posición no existe');
        }

        const positionData = positionSnap.data();
        
        // Manejo seguro de fechas
        setFormData({
          ...positionData,
          fechaApertura: convertFirebaseDate(positionData.fechaApertura),
          fechaCierre: convertFirebaseDate(positionData.fechaCierre),
          // Valores predeterminados para campos nuevos si no existen
          prioridad: positionData.prioridad || 'Normal',
          tipoSolicitud: positionData.tipoSolicitud || '',
          escalado: positionData.escalado || 'No'
        });

        if (configSnap.exists()) {
          setRecruiters(configSnap.data().recruiters || []);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const positionDoc = doc(positionsRef, id);
      await updateDoc(positionDoc, formData);
      alert('Cambios guardados exitosamente!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando posición...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="form-container">
      <div className="form-header">
      <h2 className="form-title">Edit Position: {formData.nombre}</h2>
       
        <div className="header-actions">
          
        </div>
      </div>

      <form onSubmit={handleSubmit} className="details-form">
        <div className="form-section">
          <h3 className="section-title">Basic Information</h3>
          <div className="form-grid">
            {/* Columna 1 */}
            <div className="form-column">
              <div className="form-group">
                <label>Position Name</label>
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
                  rows="5"
                />
              </div>
            </div>
          </div>
        </div>

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

            {/* Columna 2 - Nuevos campos */}
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

        <div className="form-footer">
          <button type="submit" className="save-button">
          Save
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}