import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { FaTrash, FaSun, FaMoon } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ReactPaginate from 'react-paginate';
import './App.css';

// Registrar un plugin para mostrar porcentajes en el gráfico
const percentagePlugin = {
  id: 'percentagePlugin',
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart;
    ctx.save();
    const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);

    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((element, index) => {
        const value = dataset.data[index];
        const percentage = ((value / total) * 100).toFixed(1);
        const { x, y } = element.tooltipPosition();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Roboto';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, x, y);
      });
    });
    ctx.restore();
  },
};

Chart.register(percentagePlugin);

function App() {
  const [transacciones, setTransacciones] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    tipo: 'ingreso',
    categoria: 'Alimentación',
    monto: '',
    descripcion: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transaccionToDelete, setTransaccionToDelete] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTransacciones();
  }, []);

  const fetchTransacciones = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/transacciones');
      setTransacciones(response.data.transacciones);
      setSaldo(response.data.saldo);
      setTotalIngresos(response.data.total_ingresos);
      setTotalGastos(response.data.total_gastos);
      setCategorias(response.data.categorias);
    } catch (error) {
      toast.error('Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/transacciones', formData);
      setFormData({ ...formData, monto: '', descripcion: '' });
      fetchTransacciones();
      toast.success('Transacción agregada con éxito');
    } catch (error) {
      toast.error('Error al agregar la transacción');
    }
  };

  const confirmDelete = (transaccion) => {
    setTransaccionToDelete(transaccion);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!transaccionToDelete) return;
    try {
      await axios.delete(`http://localhost:5000/transacciones/${transaccionToDelete.id}`);
      fetchTransacciones();
      toast.success('Transacción eliminada');
    } catch (error) {
      toast.error('Error al eliminar la transacción');
    } finally {
      setShowModal(false);
      setTransaccionToDelete(null);
    }
  };

  const sortTable = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sortedTransacciones = [...transacciones].sort((a, b) => {
      if (key === 'monto') {
        return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
      }
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setTransacciones(sortedTransacciones);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const pageCount = Math.ceil(transacciones.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentTransacciones = transacciones.slice(offset, offset + itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Calcular porcentajes para el gráfico
  const total = totalIngresos + totalGastos;
  const ingresoPercentage = total > 0 ? ((totalIngresos / total) * 100).toFixed(1) : 0;
  const gastoPercentage = total > 0 ? ((totalGastos / total) * 100).toFixed(1) : 0;

  const chartData = {
    labels: [`Ingresos (${ingresoPercentage}%)`, `Gastos (${gastoPercentage}%)`],
    datasets: [
      {
        data: [totalIngresos, totalGastos],
        backgroundColor: ['#28a745', '#dc3545'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: darkMode ? '#ffffff' : '#343a40',
        },
      },
    },
  };

  return (
    <div className={`container mt-5 ${darkMode ? 'dark-mode' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Calculadora de Finanzas Personales</h2>
        <button className="btn btn-outline-secondary" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body text-center">
          <h4 className="card-title">Saldo: {formatCurrency(saldo)}</h4>
          <p className="card-text">
            <span className="text-success">Ingresos: {formatCurrency(totalIngresos)}</span> | 
            <span className="text-danger"> Gastos: {formatCurrency(totalGastos)}</span>
          </p>
          <div style={{ height: '200px', maxWidth: '300px', margin: '0 auto' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-3">
          <div className="col-md-2">
            <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="form-select" required>
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </select>
          </div>
          <div className="col-md-3">
            <select name="categoria" value={formData.categoria} onChange={handleInputChange} className="form-select" required>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              step="0.01"
              name="monto"
              value={formData.monto}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Monto"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Descripción"
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Agregar</button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th onClick={() => sortTable('tipo')} style={{ cursor: 'pointer' }}>
                    Tipo {getSortIcon('tipo')}
                  </th>
                  <th onClick={() => sortTable('categoria')} style={{ cursor: 'pointer' }}>
                    Categoría {getSortIcon('categoria')}
                  </th>
                  <th onClick={() => sortTable('monto')} style={{ cursor: 'pointer' }}>
                    Monto {getSortIcon('monto')}
                  </th>
                  <th onClick={() => sortTable('descripcion')} style={{ cursor: 'pointer' }}>
                    Descripción {getSortIcon('descripcion')}
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentTransacciones.map((transaccion) => (
                  <tr key={transaccion.id}>
                    <td>{transaccion.tipo}</td>
                    <td>{transaccion.categoria}</td>
                    <td>{formatCurrency(transaccion.monto)}</td>
                    <td>{transaccion.descripcion}</td>
                    <td>
                      <button
                        onClick={() => confirmDelete(transaccion)}
                        className="btn btn-danger btn-sm"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transacciones.length > itemsPerPage && (
              <ReactPaginate
                previousLabel={'Anterior'}
                nextLabel={'Siguiente'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
              />
            )}
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName={darkMode ? 'dark-modal' : ''}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta transacción?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme={darkMode ? 'dark' : 'light'} />
    </div>
  );
}

export default App;

