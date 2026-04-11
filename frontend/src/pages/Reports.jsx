import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Form, Table, Badge, Collapse, Modal, Button } from 'react-bootstrap';
import { 
  Calendar3, 
  FileEarmarkPdf, 
  FileEarmarkExcel, 
  ArrowRight,
  Clock,
  People,
  BarChart,
  FilterCircle,
  ListTask,
  PencilSquare,
  Trash,
  CaretUpFill,
  CaretDownFill
} from 'react-bootstrap-icons';
import axios from 'axios';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '../App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const Reports = () => {
  const { t } = useTranslation();
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatDate(firstDay));
  const [endDate, setEndDate] = useState(formatDate(today));

  const formatDateTime = (isoString) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString; // Fallback
    return d.toLocaleString([], { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
    });
  };

  const toLocalISOString = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };
  const [loading, setLoading] = useState(false);
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [peopleList, setPeopleList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);

  // View Mode: 'agrupada' (breakdown) or 'detalhada' (raw_logs)
  const [viewMode, setViewMode] = useState('agrupada');

  const [reportData, setReportData] = useState({
    total_hours: 0,
    collaborators_count: 0,
    average_hours: 0,
    breakdown: [],
    raw_logs: []
  });

  // Edit Log State
  const [showEditLogModal, setShowEditLogModal] = useState(false);
  const [logFormData, setLogFormData] = useState({
    id: null,
    person: '',
    location: '',
    clock_in: '',
    clock_out: ''
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: 'clock_in', direction: 'desc' });
  const [groupedSortConfig, setGroupedSortConfig] = useState({ key: 'horas', direction: 'desc' });



  useEffect(() => {
    fetchOptions();
    fetchReport();
    // eslint-disable-next-line
  }, []);

  const fetchOptions = async () => {
    try {
      const [peopleRes, locRes] = await Promise.all([
        axios.get(`${API_BASE}/people/`),
        axios.get(`${API_BASE}/locations/`)
      ]);
      setPeopleList(peopleRes.data);
      setLocationsList(locRes.data);
    } catch (error) {
      console.error("Erro ao puxar opções:", error);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
      };
      if (selectedPerson) params.person_id = selectedPerson;
      if (selectedLocation) params.location_id = selectedLocation;

      const res = await axios.get(`${API_BASE}/logs/report/`, { params: params });
      setReportData(res.data);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Houve um erro ao buscar os dados do relatório.");
    } finally {
      setLoading(false);
    }
  };

  // ----- LOG EDITING -----
  const openEditLogModal = (log) => {
    setLogFormData({
      id: log.id,
      person: log.person_id,
      location: log.location_id,
      clock_in: toLocalISOString(log.clock_in),
      clock_out: toLocalISOString(log.clock_out)
    });
    setShowEditLogModal(true);
  };

  const handleLogFormChange = (e) => {
    setLogFormData({
      ...logFormData,
      [e.target.name]: e.target.value
    });
  };

  const submitLogUpdate = async () => {
    try {
      // Create clone and format properly
      const payload = {
        person: logFormData.person,
        location: logFormData.location,
        clock_in: new Date(logFormData.clock_in).toISOString(),
        clock_out: logFormData.clock_out ? new Date(logFormData.clock_out).toISOString() : null,
        is_completed: !!logFormData.clock_out
      };
      await axios.put(`${API_BASE}/logs/${logFormData.id}/`, payload);
      setShowEditLogModal(false);
      fetchReport(); // reload report
    } catch (error) {
      console.error("Erro ao atualizar o registro de tempo:", error);
      alert("Falha ao salvar. Verifique se os dados estão corretos.");
    }
  };

  const deleteLog = async () => {
    if (window.confirm("Atenção! Você está prestes a excluir este bloco de horas. Deseja continuar?")) {
      try {
        await axios.delete(`${API_BASE}/logs/${logFormData.id}/`);
        setShowEditLogModal(false);
        fetchReport();
      } catch (error) {
        console.error("Erro ao excluir registro:", error);
      }
    }
  };

  // ----- EXPORTS -----
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Relatorio de Horas (TEA) - ${startDate} a ${endDate}`, 14, 15);
    
    let yPos = 22;
    doc.setFontSize(10);
    if (selectedPerson) {
       const p = peopleList.find(x => x.id.toString() === selectedPerson);
       if (p) { doc.text(`Filtro Pessoa: ${p.name}`, 14, yPos); yPos+=6; }
    }
    if (selectedLocation) {
       const l = locationsList.find(x => x.id.toString() === selectedLocation);
       if (l) { doc.text(`Filtro Local: ${l.name}`, 14, yPos); yPos+=6; }
    }
    
    if (viewMode === 'agrupada') {
      if (!reportData.breakdown || reportData.breakdown.length === 0) return alert("Não há dados.");
      const tableColumn = ["Colaborador", "Posicao", "Locais Trabalhados", "Total Horas"];
      const tableRows = reportData.breakdown.map(row => [row.nome, row.posicao, row.locais, row.horas.toFixed(1) + 'h']);
      autoTable(doc, { head: [tableColumn], body: tableRows, startY: yPos });
      doc.save(`relatorio_${startDate}_${endDate}.pdf`);
    } else {
      if (!reportData.raw_logs || reportData.raw_logs.length === 0) return alert("Não há dados.");
      const tableColumn = ["Data Entrada", "Data Saida", "Colaborador", "Local"];
      const tableRows = reportData.raw_logs.map(log => [
        formatDateTime(log.clock_in), 
        log.clock_out ? formatDateTime(log.clock_out) : 'Ativo', 
        log.person_name, 
        log.location_name
      ]);
      autoTable(doc, { head: [tableColumn], body: tableRows, startY: yPos });
      doc.save(`extrato_detalhado_${startDate}_${endDate}.pdf`);
    }
  };

  const exportToExcel = () => {
    let exportData = [];
    if (viewMode === 'agrupada') {
      if (!reportData.breakdown || reportData.breakdown.length === 0) return alert("Não há dados.");
      exportData = reportData.breakdown.map(row => ({
        "Colaborador": row.nome,
        "Posição": row.posicao,
        "Locais Trabalhados": row.locais,
        "Total Horas": parseFloat(row.horas.toFixed(1))
      }));
    } else {
      if (!reportData.raw_logs || reportData.raw_logs.length === 0) return alert("Não há dados.");
      exportData = reportData.raw_logs.map(log => ({
        "Entrada": formatDateTime(log.clock_in),
        "Saída": log.clock_out ? formatDateTime(log.clock_out) : 'Ativo',
        "Colaborador": log.person_name,
        "Local": log.location_name
      }));
    }
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, viewMode === 'agrupada' ? "Relatório" : "Extrato");
    XLSX.writeFile(workbook, `relatorio_${viewMode}_${startDate}_${endDate}.xlsx`);
  };

  // ----- SORTING LOGIC -----
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedLogs = () => {
    let sortableLogs = [...(reportData.raw_logs || [])];
    if (sortConfig.key !== null) {
      sortableLogs.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nulls for clock_out
        if (aValue === null) aValue = '';
        if (bValue === null) bValue = '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLogs;
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <CaretUpFill className="ms-1 text-muted opacity-25" style={{ fontSize: '0.7rem' }} />;
    }
    return sortConfig.direction === 'asc' 
      ? <CaretUpFill className="ms-1 text-primary" style={{ fontSize: '0.7rem' }} /> 
      : <CaretDownFill className="ms-1 text-primary" style={{ fontSize: '0.7rem' }} />;
  };

  // ----- GROUPED SORTING LOGIC -----
  const requestGroupedSort = (key) => {
    let direction = 'asc';
    if (groupedSortConfig.key === key && groupedSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setGroupedSortConfig({ key, direction });
  };

  const getSortedBreakdown = () => {
    let sortableData = [...(reportData.breakdown || [])];
    if (groupedSortConfig.key !== null) {
      sortableData.sort((a, b) => {
        let aValue = a[groupedSortConfig.key];
        let bValue = b[groupedSortConfig.key];

        if (aValue < bValue) {
          return groupedSortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return groupedSortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  const GroupedSortIcon = ({ columnKey }) => {
    if (groupedSortConfig.key !== columnKey) {
      return <CaretUpFill className="ms-1 text-muted opacity-25" style={{ fontSize: '0.7rem' }} />;
    }
    return groupedSortConfig.direction === 'asc' 
      ? <CaretUpFill className="ms-1 text-primary" style={{ fontSize: '0.7rem' }} /> 
      : <CaretDownFill className="ms-1 text-primary" style={{ fontSize: '0.7rem' }} />;
  };



  return (
    <div className="relatorios-container px-4 py-3">
      
      {/* 🚀 HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold" style={{ color: 'var(--text-h)' }}>{t('reports.title')}</h2>
          <p className="text-muted mb-0">{t('reports.subtitle')}</p>
        </div>
      </div>

      {/* 📅 FILTER SECTION */}
      <div className="card-premium p-4 mb-4 border shadow-sm bg-white rounded-4">
        <Row className="align-items-end g-3 mb-2">
          <Col xs={12} md={5} lg={3}>
            <Form.Group>
              <Form.Label className="small fw-bold text-muted uppercase mb-2">{t('reports.startDate')}</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><Calendar3 className="text-primary" /></span>
                <Form.Control 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-light border-0 p-2"
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={1} className="d-none d-md-flex justify-content-center align-items-center mb-2">
            <ArrowRight className="text-muted" size={20} />
          </Col>
          <Col xs={12} md={5} lg={3}>
            <Form.Group>
              <Form.Label className="small fw-bold text-muted uppercase mb-2">{t('reports.endDate')}</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><Calendar3 className="text-primary" /></span>
                <Form.Control 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-light border-0 p-2"
                />
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} lg={5} className="mt-2 mt-lg-0 d-flex flex-column flex-sm-row justify-content-lg-end align-items-stretch align-items-lg-end gap-2">
            <button 
              className="btn btn-light px-3 py-2 border text-muted fw-bold d-flex align-items-center justify-content-center gap-2" 
              style={{ borderRadius: '10px', height: '46px' }}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <FilterCircle size={18} /> {t('reports.filters')} {showAdvanced ? '(-)' : '(+)'}
            </button>
            <button 
              className="tea-button-primary px-4 py-2" 
              style={{ borderRadius: '10px', height: '46px' }}
              onClick={fetchReport}
              disabled={loading}
            >
              {loading ? t('reports.generating') : t('reports.generate')}
            </button>
          </Col>
        </Row>
        
        {/* ADVANCED FILTERS DROPDOWN */}
        <Collapse in={showAdvanced}>
          <div className="mt-3 pt-3 border-top mt-md-4 pt-md-4">
             <Row className="g-3">
               <Col md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted uppercase mb-2">{t('reports.filterByPerson')}</Form.Label>
                    <Form.Select 
                      className="bg-light border-0 p-3" 
                      style={{ borderRadius: '10px' }}
                      value={selectedPerson}
                      onChange={(e) => setSelectedPerson(e.target.value)}
                    >
                      <option value="">{t('reports.allPeople')}</option>
                      {peopleList.map(p => (
                         <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
               </Col>
               <Col md={6} lg={4}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted uppercase mb-2">{t('reports.filterByVenue')}</Form.Label>
                    <Form.Select 
                      className="bg-light border-0 p-3" 
                      style={{ borderRadius: '10px' }}
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="">{t('reports.allVenues')}</option>
                      {locationsList.map(l => (
                         <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
               </Col>
             </Row>
          </div>
        </Collapse>
      </div>

      {/* 📊 SUMMARY CARDS */}
      <Row className="mb-4 g-3">
        <Col xs={12} sm={6} md={4}>
          <div className="card-premium p-4 border shadow-sm bg-white text-center rounded-4 h-100">
            <div className="bg-primary-subtle rounded-circle d-inline-flex p-3 mb-3">
              <Clock className="text-primary fs-3" />
            </div>
            <h3 className="fw-bold mb-1">{reportData.total_hours.toFixed(1)}h</h3>
            <span className="text-muted small uppercase fw-bold letter-spacing-1">{t('reports.totalHoursPeriod')}</span>
          </div>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <div className="card-premium p-4 border shadow-sm bg-white text-center rounded-4 h-100">
            <div className="bg-success-subtle rounded-circle d-inline-flex p-3 mb-3">
              <People className="text-success fs-3" />
            </div>
            <h3 className="fw-bold mb-1">{reportData.collaborators_count}</h3>
            <span className="text-muted small uppercase fw-bold letter-spacing-1">{t('reports.collaboratorsMonitored')}</span>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="card-premium p-4 border shadow-sm bg-white text-center rounded-4 h-100">
            <div className="bg-warning-subtle rounded-circle d-inline-flex p-3 mb-3">
              <BarChart className="text-warning fs-3" />
            </div>
            <h3 className="fw-bold mb-1">{reportData.average_hours.toFixed(1)}h</h3>
            <span className="text-muted small uppercase fw-bold letter-spacing-1">{t('reports.averagePerCollaborator')}</span>
          </div>
        </Col>
      </Row>

      {/* 📃 RESULTS VIEW SWITCHER */}
      <div className="card-premium bg-white border shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          
          <div className="bg-light p-1 rounded-3 d-inline-flex border">
            <button 
              className={`btn btn-sm px-4 fw-bold rounded-2 ${viewMode === 'agrupada' ? 'bg-white shadow-sm text-primary' : 'text-muted border-0'}`}
              onClick={() => setViewMode('agrupada')}
            >
               {t('reports.groupedView')}
            </button>
            <button 
              className={`btn btn-sm px-4 fw-bold rounded-2 ${viewMode === 'detalhada' ? 'bg-white shadow-sm text-primary' : 'text-muted border-0'}`}
              onClick={() => setViewMode('detalhada')}
            >
               <ListTask className="me-2" /> {t('reports.detailedLog')}
            </button>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 px-3 py-2" onClick={exportToPDF} style={{ borderRadius: '8px' }}>
              <FileEarmarkPdf size={18} /> {t('reports.export')}
            </button>
            <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-2 px-3 py-2" onClick={exportToExcel} style={{ borderRadius: '8px' }}>
              <FileEarmarkExcel size={18} /> {t('reports.export')}
            </button>
          </div>
        </div>
        
        {/* VIEW 1: AGRUPADA */}
        {viewMode === 'agrupada' && (
          <Table hover responsive className="mb-0 overflow-hidden">
            <thead className="bg-light">
              <tr>
                <th 
                  className="px-5 py-3 text-muted uppercase small fw-bold cursor-pointer" 
                  onClick={() => requestGroupedSort('nome')}
                  style={{ cursor: 'pointer' }}
                >
                  {t('people.collaborator')} <GroupedSortIcon columnKey="nome" />
                </th>
                <th 
                  className="py-3 text-muted uppercase small fw-bold text-center cursor-pointer" 
                  onClick={() => requestGroupedSort('locais')}
                  style={{ cursor: 'pointer' }}
                >
                  {t('reports.locationsWorked')} <GroupedSortIcon columnKey="locais" />
                </th>
                <th 
                  className="py-3 text-muted uppercase small fw-bold text-end pe-5 cursor-pointer" 
                  onClick={() => requestGroupedSort('horas')}
                  style={{ cursor: 'pointer' }}
                >
                  {t('reports.totalHoursPeriod')} <GroupedSortIcon columnKey="horas" />
                </th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {getSortedBreakdown().length > 0 ? getSortedBreakdown().map((row) => (
                <tr key={row.id}>
                  <td className="px-5 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={row.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.nome)}&background=6366f1&color=fff`} 
                        alt={row.nome} 
                        className="rounded-circle shadow-sm" 
                        style={{ width: '40px', height: '40px' }} 
                      />
                      <div>
                        <div className="fw-bold text-dark">{row.nome}</div>
                        <div className="text-muted x-small uppercase">{row.posicao}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <Badge bg="light" text="dark" className="border px-2 py-1 text-wrap" style={{ borderRadius: '6px', maxWidth: '220px', fontWeight: '500', fontSize: '0.75rem' }}>
                      {row.locais}
                    </Badge>
                  </td>
                  <td className="py-3 text-end pe-5">
                    <div className="fw-bold text-primary fs-5">{row.horas.toFixed(1)}h</div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="text-center py-5 text-muted">
                    {t('reports.noRecords')}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* VIEW 2: DETALHADA */}
        {viewMode === 'detalhada' && (
          <Table hover responsive className="mb-0 overflow-hidden" size="sm">
            <thead className="bg-light">
              <tr>
                <th 
                  className="px-4 py-3 text-muted uppercase small fw-bold cursor-pointer" 
                  onClick={() => requestSort('clock_in')}
                  style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {t('reports.dateTimeIn')} <SortIcon columnKey="clock_in" />
                </th>
                <th 
                  className="py-3 text-muted uppercase small fw-bold cursor-pointer" 
                  onClick={() => requestSort('clock_out')}
                  style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {t('reports.dateTimeOut')} <SortIcon columnKey="clock_out" />
                </th>
                <th 
                  className="py-3 text-muted uppercase small fw-bold cursor-pointer" 
                  onClick={() => requestSort('person_name')}
                  style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {t('people.collaborator')} <SortIcon columnKey="person_name" />
                </th>
                <th 
                  className="py-3 text-muted uppercase small fw-bold cursor-pointer" 
                  onClick={() => requestSort('location_name')}
                  style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {t('sidebar.venues')} <SortIcon columnKey="location_name" />
                </th>
                <th className="py-3 text-muted uppercase small fw-bold text-end pe-4">{t('reports.action')}</th>
              </tr>
            </thead>
            <tbody className="align-middle small">
              {getSortedLogs().length > 0 ? getSortedLogs().map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3 fw-bold text-secondary">
                    {formatDateTime(log.clock_in)}
                  </td>
                  <td className="py-3 fw-bold text-secondary">
                    {log.clock_out ? formatDateTime(log.clock_out) : <span className="text-primary italic">{t('reports.working')}</span>}
                  </td>
                  <td className="py-3 fw-600">{log.person_name}</td>
                  <td className="py-3 text-muted">{log.location_name}</td>
                  <td className="py-3 text-end pe-4">
                     <button className="btn btn-sm btn-light border py-1 px-2 text-primary" onClick={() => openEditLogModal(log)}>
                       <PencilSquare /> {t('reports.edit')}
                     </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    {t('reports.noLogs')}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
        
        <div className="p-3 bg-light small text-center text-muted border-top">
          {viewMode === 'agrupada' ? 'Mostrando o consolidado das horas validadas (apenas finalizadas).' : 'Extrato completo de lançamentos em banco de dados.'}
        </div>
      </div>

      {/* ✏️ EDIT LOG MODAL */}
      <Modal show={showEditLogModal} onHide={() => setShowEditLogModal(false)} centered size="md">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title style={{ fontWeight: '700' }}>
            {t('reports.modalEditTitle')} (ID: {logFormData.id})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">{t('people.collaborator')}</Form.Label>
              <Form.Select name="person" value={logFormData.person} onChange={handleLogFormChange} className="bg-light border-0 p-2 rounded-3">
                 {peopleList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">{t('sidebar.venues')}</Form.Label>
              <Form.Select name="location" value={logFormData.location} onChange={handleLogFormChange} className="bg-light border-0 p-2 rounded-3">
                 {locationsList.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">{t('reports.clockIn')}</Form.Label>
                  <Form.Control type="datetime-local" name="clock_in" value={logFormData.clock_in} onChange={handleLogFormChange} className="bg-light border-0 p-2 rounded-3" />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">{t('reports.clockOut')}</Form.Label>
                  <Form.Control type="datetime-local" name="clock_out" value={logFormData.clock_out || ''} onChange={handleLogFormChange} className="bg-light border-0 p-2 rounded-3" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 pb-4 px-4 d-flex justify-content-between">
          <div>
            <Button variant="outline-danger" onClick={deleteLog} className="fw-bold px-3 d-flex align-items-center gap-2">
              <Trash size={16} /> {t('reports.delete')}
            </Button>
          </div>
          <div>
            <Button variant="light" onClick={() => setShowEditLogModal(false)} className="fw-bold px-3 me-2">{t('people.cancel')}</Button>
            <button className="tea-button-primary px-4 py-2" onClick={submitLogUpdate} style={{ borderRadius: '8px' }}>
              {t('people.update')}
            </button>
          </div>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Reports;