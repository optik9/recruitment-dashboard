import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidatesRef, positionsRef, configRef } from '../firebase/config';
//import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import {Helmet} from "react-helmet";
import '../App.css';

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    positionId: '',
    nombre: '',
    apellido: '',
    pais: '',
    salario: '',
    moneda: 'USD',
    comentarios: '',
    nivel: '',
    disponibilidad: '',
    fuente: '',
    estadoProceso: '',
    fechaEdicion: new Date(), // Agregar este campo
    fechaAplication:'', //new
    fechaPhoneScreen:'', //new
    fechaAssesmentSent:'', //new
    fechaAssesmentComplete:'', //new
    fechaOffered:'', //new
    fechaOnboarding:'', //new
    fechaTechInterview:'',
    fechaClientInterview: '',
    interviewer:'',
    fechaContratacion: '',
    estadoRechazo: '',
    razonRechazo: ''
  });
  
  const [positions, setPositions] = useState([]);
  const [options, setOptions] = useState({
    recruitmentSources: [],
    processStatuses: [],
    rejectionStatuses: [], // Añadir estos valores iniciales
    rejectionReasons: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidateDoc = doc(candidatesRef, id);
        const [candidateSnap, positionsSnap, configSnap] = await Promise.all([
          getDoc(candidateDoc),
          getDocs(positionsRef),
          getDoc(doc(configRef, 'options'))
        ]);

        if (!candidateSnap.exists()) {
          throw new Error('Candidato no encontrado');
        }

        const candidateData = candidateSnap.data();
        setFormData({
          ...candidateData,
          fechaContratacion: candidateData.fechaContratacion?.split('T')[0] || ''
        });

        setPositions(positionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        if (configSnap.exists()) {
          const configData = configSnap.data();
          setOptions({
            recruitmentSources: configData.recruitmentSources || [],
            processStatuses: configData.processStatuses || [],
            rejectionStatuses: configData.rejectionStatuses || [], // Añadir esto
            rejectionReasons: configData.rejectionReasons || [] // Añadir esto
          });
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
    try {
      const candidateRef = doc(candidatesRef, id);
      // Incluir la fecha de edición actual en los datos a guardar
      await updateDoc(candidateRef, {
        ...formData,
        fechaEdicion: new Date() // Esto sobrescribirá cualquier valor existente
      });
      alert('Update saved successfully!');
      navigate('/list-candidate');
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Error saving changes');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div className="loading">Loading candidate...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className="form-container">
         <Helmet>
      <title>Recruitment Outcode</title>
      <meta name="Edit Candidate" content="Edit Candidate" />
    </Helmet>
      <div className="form-header">
    

        <h2 className="form-title">Edit Candidate: {formData.nombre} {formData.apellido}</h2>
      </div>

      <div className="form-grid">
        {/* Sección Información Personal */}
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-column-group">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="nombre"
                required
                className="form-input"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="apellido"
                required
                className="form-input"
                value={formData.apellido}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="pais"
                required
                className="form-input"
                value={formData.pais}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Sección Detalles de Reclutamiento */}
        <div className="form-section">
          <h3 className="section-title">Recruitment Details</h3>
          <div className="form-column-group">
            <div className="form-group">
              <label>Open Position</label>
              <select
                name="positionId"
                required
                className="form-select"
                value={formData.positionId}
                onChange={handleChange}
              >
                <option value="">Select position</option>
                {positions.map(position => (
                  <option key={position.id} value={position.id}>
                    {position.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Recruitment Source</label>
              <select
                name="fuente"
                required
                className="form-select"
                value={formData.fuente}
                onChange={handleChange}
              >
                <option value="">Select source</option>
                {options.recruitmentSources?.map((source, index) => (
                  <option key={index} value={source}>{source}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Expected Salary</label>
              <div className="currency-container">
                <div className="currency-selector">
                  <label className="currency-option">
                    <input
                      type="radio"
                      name="moneda"
                      value="USD"
                      checked={formData.moneda === 'USD'}
                      onChange={handleChange}
                    />
                    <span className="currency-label">Dollars</span>
                  </label>
                  <label className="currency-option">
                    <input
                      type="radio"
                      name="moneda"
                      value="PEN"
                      checked={formData.moneda === 'PEN'}
                      onChange={handleChange}
                    />
                    <span className="currency-label">Soles</span>
                  </label>
                </div>
                <input
                  type="number"
                  name="salario"
                  
                  className="form-input"
                  value={formData.salario}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  placeholder="Monto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección Estado del Proceso */}
        <div className="form-section">
          <h3 className="section-title">Process Status</h3>
          <div className="form-column-group">
            <div className="form-group">
              <label>Current Stage</label>
              <select
                name="estadoProceso"
                required
                className="form-select"
                value={formData.estadoProceso}
                onChange={handleChange}
              >
                <option value="">Select stage</option>
                {options.processStatuses?.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {formData.estadoProceso === 'Onboarding' && (
              <div className="form-group">
                <label>Onboarding Date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.fechaOnboarding}
                  onChange={(e) => setFormData({...formData, fechaOnboarding: e.target.value})}
                />
              </div>
            )}

        {formData.estadoProceso === 'Offered' && (
              <div className="form-group">
                <label>Offered Date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.fechaOffered}
                  onChange={(e) => setFormData({...formData, fechaOffered: e.target.value})}
                />
              </div>
            )}

        {formData.estadoProceso === 'Assesment complete' && (
              <div className="form-group">
                <label>Assesment complete Date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.fechaAssesmentComplete}
                  onChange={(e) => setFormData({...formData, fechaAssesmentComplete: e.target.value})}
                />
              </div>
            )}

        {formData.estadoProceso === 'Assesment sent' && (
              <div className="form-group">
                <label>Assesment sent Date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.fechaAssesmentSent}
                  onChange={(e) => setFormData({...formData, fechaAssesmentSent: e.target.value})}
                />
              </div>
            )}

        {formData.estadoProceso === 'Phone screen' && (
              <div className="form-group">
                <label>Phone screen Date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.fechaPhoneScreen}
                  onChange={(e) => setFormData({...formData, fechaPhoneScreen: e.target.value})}
                />
              </div>
            )}

            {formData.estadoProceso === 'Aplication' && (
              <div className="form-group">
                <label>Aplication Date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.fechaAplication}
                  onChange={(e) => setFormData({...formData, fechaAplication: e.target.value})}
                />
              </div>
            )}

            {formData.estadoProceso === 'Tech interview' && (
              <>
              <div className="form-group">
                <label>Tech interview date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.fechaTechInterview}
                  onChange={(e) => setFormData({...formData, fechaTechInterview: e.target.value})}
                />
              </div>

              <div className="form-group">
              <label>Interviewer</label>
              <input
                type="text"
                className="form-input"
                value={formData.Interviewer}
                onChange={(e) => setFormData({...formData, Interviewer: e.target.value})}
              />
              </div>
              </>

              
            )}

            {formData.estadoProceso === 'Client interview' && (
              <div className="form-group">
                <label>Client interview date</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.fechaClientInterview}
                  onChange={(e) => setFormData({...formData, fechaClientInterview: e.target.value})}
                />
              </div>
            )}

            {formData.estadoProceso === 'Hired' && (
              <div className="form-group">
                <label>Hiring Date</label>
                <input
                  type="date"
                  name="fechaContratacion"
                  className="form-input"
                  required
                  value={formData.fechaContratacion}
                  onChange={handleChange}
                />
              </div>
            )}

{formData.estadoProceso === 'Rejected' && (
  <>
    <div className="form-group">
      <label>Rejection Type</label>
      <select
        name="estadoRechazo"
        className="form-select"
        value={formData.estadoRechazo}
        onChange={handleChange}
        required
      >
        <option value="">Select type</option>
        {(options.rejectionStatuses || []).map((status, index) => (
          <option key={index} value={status}>{status}</option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label>Reason Rejection</label>
      <select
        name="razonRechazo"
        className="form-select"
        value={formData.razonRechazo}
        onChange={handleChange}
        required
      >
        <option value="">Select reason</option>
        {(options.rejectionReasons || []).map((reason, index) => (
          <option key={index} value={reason}>{reason}</option>
        ))}
      </select>
    </div>
  </>
)}
          </div>
        </div>

        {/* Sección Adicional */}
        <div className="form-section">
          <div className="form-column-group">
            <div className="form-group">
              <label>Experience Level</label>
              <select
                name="nivel"
                
                className="form-select"
                value={formData.nivel}
                onChange={handleChange}
              >
                <option value="">Select level</option>
                <option value="Level 0 - Intern">Level 0 - Intern</option>
                <option value="Level 1 - Entry Level">Level 1 - Entry Level</option>
                <option value="Level 2 - Junior">Level 2 - Junior</option>
                <option value="Level 3 - Intermediate">Level 3 - Intermediate</option>
                <option value="Level 4 - Senior">Level 4 - Senior</option>
                <option value="Level 5 - Expert">Level 5 - Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label>Availability</label>
              <select
                name="disponibilidad"
                
                className="form-select"
                value={formData.disponibilidad}
                onChange={handleChange}
              >
              <option value="">Select availability</option>
                <option value="Inmediata">Immediate</option>
                <option value="15 días">15 days</option>
                <option value="1 mes">1 month</option>
                <option value="Más de 1 mes">More than 1 month</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Additional Comments</label>
              <textarea
                name="comentarios"
                className="form-textarea"
                value={formData.comentarios}
                onChange={handleChange}
                rows="4"
                placeholder="Add relevant observations..."
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-footer flex justify-center space-x-4 mt-8">
  <button 
    type="submit" 
    className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-900 hover:to-indigo-900 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
  >
    <CheckCircleIcon className="w-5 h-5 mr-2" />
    Save
  </button>
  
  <button
    type="button"
    className="inline-flex items-center px-6 py-2.5 border-2 border-indigo-900 text-indigo-900 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-all"
    onClick={() => navigate('/list-candidate')}
  >
    <XCircleIcon className="w-5 h-5 mr-2" />
    Cancel
  </button>
</div>
    </form>
  );
}