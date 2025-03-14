import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { candidatesRef, positionsRef } from '../firebase/config';
import { getDocs } from 'firebase/firestore';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6EE7B7'];

export default function RecruitmentDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesSnap, positionsSnap] = await Promise.all([
          getDocs(candidatesRef),
          getDocs(positionsRef)
        ]);
        
        const candidatesData = candidatesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const positionsData = positionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setCandidates(candidatesData);
        setPositions(positionsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const positionsMap = positions.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {});

  // Métricas principales
  const metrics = {
    totalCandidates: candidates.length,
    openPositions: positions.filter(p => p.estado !== 'Closed').length,
    //avgSalary: candidates.length > 0 
    //  ? (candidates.reduce((acc, c) => acc + Number(c.salario), 0) / candidates.length).toFixed(2)
    //  : 0,
    hired: candidates.filter(p => p.estadoProceso === 'Hired').length,

    hireRate: candidates.length > 0
      ? ((candidates.filter(c => c.estadoProceso === 'Hired').length / candidates.length) * 100).toFixed(1)
      : 0
  };

  // Datos para gráficos
  const processData = {
    candidatesByStatus: Object.entries(candidates.reduce((acc, c) => {
      acc[c.estadoProceso] = (acc[c.estadoProceso] || 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value })),

    positionsByStatus: Object.entries(positions.reduce((acc, p) => {
      acc[p.estado] = (acc[p.estado] || 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value })),

    recruitmentSources: Object.entries(candidates.reduce((acc, c) => {
      acc[c.fuente] = (acc[c.fuente] || 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value })),

    positionsByPriority: Object.entries(positions.reduce((acc, p) => {
      acc[p.prioridad] = (acc[p.prioridad] || 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value })),

    candidatesByCountry: Object.entries(candidates.reduce((acc, c) => {
      acc[c.pais] = (acc[c.pais] || 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value })),

    hiresPerClient: Object.entries(
      candidates
        .filter(c => c.estadoProceso === 'Hired')
        .reduce((acc, c) => {
          const position = positionsMap[c.positionId];
          const client = position ? position.cliente : 'Unknown';
          acc[client] = (acc[client] || 0) + 1;
          return acc;
        }, {})
    ).map(([name, value]) => ({ name, value })),

    positionsByRecruiter: Object.entries(positions.reduce((acc, p) => {
      acc[p.reclutador] = (acc[p.reclutador] || 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value })),

    salaryByCurrency: Object.entries(candidates.reduce((acc, c) => {
      const currency = c.moneda || 'Unknown';
      if (!acc[currency]) acc[currency] = { total: 0, count: 0 };
      acc[currency].total += Number(c.salario);
      acc[currency].count++;
      return acc;
    }, {})).map(([currency, data]) => ({
      currency,
      //average: data.total / data.count,
      average: Number((data.total / data.count).toFixed(2)), // Añadir toFixed(2) aquí
      count: data.count
    }))
  };

  if (loading) return <div className="p-4 text-center">Cargando dashboard...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard de Reclutamiento</h1>
      
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Candidatos Totales</h3>
          <p className="text-2xl font-bold">{metrics.totalCandidates}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Posiciones Abiertas</h3>
          <p className="text-2xl font-bold">{metrics.openPositions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Hired</h3>
          <p className="text-2xl font-bold">{metrics.hired}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Tasa de Contratación</h3>
          <p className="text-2xl font-bold">{metrics.hireRate}%</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sección Candidatos */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Estados de Candidatos</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={processData.candidatesByStatus}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {processData.candidatesByStatus.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribución por País</h3>
          <BarChart width={300} height={250} data={processData.candidatesByCountry}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Fuentes de Reclutamiento</h3>
          <BarChart width={300} height={250} data={processData.recruitmentSources}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#10B981" />
          </BarChart>
        </div>

        {/* Sección Posiciones */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Estados de Posiciones</h3>
          <BarChart width={300} height={250} data={processData.positionsByStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#F59E0B" />
          </BarChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Prioridad de Posiciones</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={processData.positionsByPriority}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {processData.positionsByPriority.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Posiciones por Reclutador</h3>
          <BarChart width={300} height={250} data={processData.positionsByRecruiter}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8B5CF6" />
          </BarChart>
        </div>

        {/* Sección Análisis Adicional */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Contrataciones por Cliente</h3>
          <BarChart width={300} height={250} data={processData.hiresPerClient}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#EC4899" />
          </BarChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Salario Promedio por Moneda</h3>
          <BarChart width={300} height={250} data={processData.salaryByCurrency}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="currency" />
            <YAxis />
            <Tooltip 
            formatter={(value) => [`${value.toFixed(2)}`, "average"]}
            />
            <Bar dataKey="average" fill="#6EE7B7" />
          </BarChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Niveles de Experiencia</h3>
          <BarChart width={300} height={250} data={Object.entries(candidates.reduce((acc, c) => {
            acc[c.nivel] = (acc[c.nivel] || 0) + 1;
            return acc;
          }, {})).map(([name, value]) => ({ name, value }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}