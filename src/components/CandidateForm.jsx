import { useState, useEffect } from 'react';
import { candidatesRef, positionsRef, configRef } from '../firebase/config';
import { addDoc, getDocs, getDoc, doc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import {Helmet} from "react-helmet";

export default function CandidateForm() {
  const navigate = useNavigate(); // Añadir este hook
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const positionIdParam = queryParams.get('positionId');

  const [formData, setFormData] = useState({
    positionId: '',
    nombre: '',
    apellido: '',
    pais: '',
    salario: '',
    comentarios: '',
    nivel: '',
    disponibilidad: '',
    fuente: '',
    estadoProceso: '',
    fechaRegistro: new Date(), // Agregar esta línea

    fechaAplication:'', //new
    fechaPhoneScreen:'', //new
    fechaAssesmentSent:'', //new
    fechaAssesmentComplete:'', //new
    fechaOffered:'', //new
    fechaOnboarding:'', //new

    fechaContratacion: '',
    fechaTechInterview:'',
    fechaClientInterview: '',
    interviewer:'',
    estadoRechazo: '',
    razonRechazo: '',
    moneda: 'USD', // Nuevo campo
  });

  const [positions, setPositions] = useState([]);
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [positionsSnap, configDoc] = await Promise.all([
          getDocs(positionsRef),
          getDoc(doc(configRef, 'options'))
        ]);
        
        const positionsData = positionsSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        setPositions(positionsData);

        // Si hay positionId en URL y existe en las posiciones cargadas
        if (positionIdParam && positionsData.some(p => p.id === positionIdParam)) {
          setFormData(prev => ({
            ...prev,
            positionId: positionIdParam
          }));
        }
        
        if (configDoc.exists()) {
          setOptions(configDoc.data());
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [positionIdParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const candidateData = {
        ...formData,
        fechaRegistro: new Date() // Esto sobrescribirá cualquier valor existente con la fecha actual
      };
      await addDoc(candidatesRef, candidateData);
      alert('Candidate successfully registered!');
      navigate('/list-candidate'); // Añadir esta línea
      setFormData({
        positionId: '',
        nombre: '',
        apellido: '',
        pais: '',
        salario: '',
        comentarios: '',
        nivel: '',
        disponibilidad: '',
        fuente: '',
        estadoProceso: '',
        fechaRegistro: new Date(), // Mantener esto en el reset
        fechaAplication:'',

        fechaPhoneScreen:'', //new
        fechaAssesmentSent:'', //new
        fechaAssesmentComplete:'', //new
        fechaOffered:'', //new
        fechaOnboarding:'', //new

        fechaContratacion: '',
        fechaTechInterview:'',
        fechaClientInterview: '',
        interviewer:'',
        estadoRechazo: '',
        razonRechazo: ''
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error al registrar el candidato');
    }
  };

  if (loading) return <div className="loading">Cargando formulario...</div>;

  return (
    <form onSubmit={handleSubmit} className="form-container">
       <Helmet>
      <title>Recruitment Outcode</title>
      <meta name="New Candidate" content="New Candidate" />
    </Helmet>
      <h2 className="form-title">New Candidate</h2>
      
      <div className="form-grid">
        {/* Sección Información Personal */}
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-column-group">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.apellido}
                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.pais}
                onChange={(e) => setFormData({...formData, pais: e.target.value})}
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
                required
                className="form-select"
                value={formData.positionId}
                onChange={(e) => setFormData({...formData, positionId: e.target.value})}
              >
                <option value="">Select Position</option>
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
                required
                className="form-select"
                value={formData.fuente}
                onChange={(e) => setFormData({...formData, fuente: e.target.value})}
              >
                <option value="">Select Source</option>
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
          name="currency"
          value="USD"
          checked={formData.moneda === 'USD'}
          onChange={() => setFormData({...formData, moneda: 'USD'})}
        />
        <span className="currency-label">Dollars</span>
      </label>
      <label className="currency-option">
        <input
          type="radio"
          name="currency"
          value="PEN"
          checked={formData.moneda === 'PEN'}
          onChange={() => setFormData({...formData, moneda: 'PEN'})}
        />
        <span className="currency-label">Soles</span>
      </label>
    </div>
    <input
      type="number"
      
      className="form-input"
      value={formData.salario}
      onChange={(e) => setFormData({...formData, salario: e.target.value})}
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
                required
                className="form-select"
                value={formData.estadoProceso}
                onChange={(e) => setFormData({...formData, estadoProceso: e.target.value})}
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
                required
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
                  className="form-input"
                  required
                  value={formData.fechaContratacion}
                  onChange={(e) => setFormData({...formData, fechaContratacion: e.target.value})}
                />
              </div>
            )}

            {(formData.estadoProceso.includes('Rejected') || 
             formData.estadoProceso === 'Rejected') && (
              <>
                <div className="form-group">
                  <label>Rejection Type</label>
                  <select
                    className="form-select"
                    value={formData.estadoRechazo}
                    onChange={(e) => setFormData({...formData, estadoRechazo: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    {options.rejectionStatuses?.map((status, index) => (
                      <option key={index} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Reason Rejection</label>
                  <select
                    className="form-select"
                    value={formData.razonRechazo}
                    onChange={(e) => setFormData({...formData, razonRechazo: e.target.value})}
                  >
                    <option value="">Select reason</option>
                    {options.rejectionReasons?.map((reason, index) => (
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
                
                className="form-select"
                value={formData.nivel}
                onChange={(e) => setFormData({...formData, nivel: e.target.value})}
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
                
                className="form-select"
                value={formData.disponibilidad}
                onChange={(e) => setFormData({...formData, disponibilidad: e.target.value})}
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
                className="form-textarea"
                value={formData.comentarios}
                onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
                rows="4"
                placeholder="Add relevant comments..."
              />
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