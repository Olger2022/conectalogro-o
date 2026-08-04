import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Incidencia, Tramite, INSTITUCION_INFO } from '../types';

export const pdfExcelService = {
  // Generate Official PDF Document for Incident Report or Procedure Certificate
  generateIncidenciaPDF(incidencia: Incidencia) {
    const doc = new jsPDF();

    // Header Background Accent
    doc.setFillColor(0, 87, 184); // #0057B8
    doc.rect(0, 0, 210, 30, 'F');

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('GOBIERNO AUTÓNOMO DESCENTRALIZADO MUNICIPAL DEL CANTÓN LOGROÑO', 105, 14, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('LOGROÑO CONECTA - COMPROBANTE OFICIAL DE REPORTE CIUDADANO', 105, 22, { align: 'center' });

    // Document Details
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`CÓDIGO DE SEGUIMIENTO: ${incidencia.codigoTracking}`, 14, 42);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-EC')} ${new Date().toLocaleTimeString('es-EC')}`, 14, 48);

    // Box Frame
    doc.setDrawColor(200, 210, 225);
    doc.setLineWidth(0.5);
    doc.rect(14, 55, 182, 100);

    // Form fields inside box
    let y = 65;
    const addLine = (label: string, val: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(val || 'N/A', 75, y);
      y += 8;
    };

    addLine('Título del Reporte', incidencia.titulo);
    addLine('Categoría', incidencia.categoria);
    addLine('Prioridad', incidencia.prioridad);
    addLine('Estado Actual', incidencia.estado);
    addLine('Parroquia / Sector', `${incidencia.ubicacion.parroquia} - ${incidencia.ubicacion.direccionAproximada}`);
    addLine('Ciudadano Solicitante', `${incidencia.ciudadanoNombre} (C.I.: ${incidencia.ciudadanoCedula})`);
    addLine('Teléfono de Contacto', incidencia.ciudadanoTelefono);
    addLine('Departamento Responsable', incidencia.departamentoResponsable);
    addLine('Funcionario Asignado', incidencia.funcionarioAsignadoNombre || 'Mesa Técnica de Asignación');

    // Description Block
    doc.setFont('helvetica', 'bold');
    doc.text('Descripción de la Incidencia:', 20, y + 2);
    doc.setFont('helvetica', 'normal');
    const splitDesc = doc.splitTextToSize(incidencia.descripcion, 170);
    doc.text(splitDesc, 20, y + 9);

    // Timeline Summary
    let timelineY = y + 25;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Historial de Atención / Timeline:', 14, timelineY);

    timelineY += 8;
    doc.setFontSize(9);
    incidencia.timeline.forEach((tl) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`• [${new Date(tl.timestamp).toLocaleDateString()}] ${tl.status}:`, 18, timelineY);
      doc.setFont('helvetica', 'normal');
      doc.text(`${tl.title} - ${tl.updatedBy}`, 70, timelineY);
      timelineY += 6;
    });

    // Verification Footer / Digital Stamp Box
    doc.setFillColor(244, 246, 248);
    doc.rect(14, 250, 182, 30, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Documento generado electrónicamente por la Plataforma LOGROÑO CONECTA.`, 20, 258);
    doc.text(`GAD Municipal del Cantón Logroño - Av. Miguel Tinoco y Calle Amazonas. Tel: (07) 271-0120`, 20, 264);
    doc.text(`Firma Digital Hash: VERIF-LOG-${incidencia.id.substring(0, 8)}-${Date.now()}`, 20, 270);

    // Save PDF
    doc.save(`Reporte_LogronoConecta_${incidencia.codigoTracking}.pdf`);
  },

  generateTramitePDF(tramite: Tramite) {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(0, 87, 184);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('GOBIERNO AUTÓNOMO DESCENTRALIZADO MUNICIPAL DEL CANTÓN LOGROÑO', 105, 14, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('CERTIFICADO / COMPROBANTE OFICIAL DE TRÁMITE MUNICIPAL', 105, 22, { align: 'center' });

    // Expediente Number
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`NÚMERO DE EXPEDIENTE: ${tramite.numeroExpediente}`, 14, 44);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-EC')}`, 14, 51);

    // Box
    doc.setDrawColor(200, 210, 225);
    doc.rect(14, 58, 182, 110);

    let y = 68;
    const addLine = (label: string, val: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(val || 'N/A', 80, y);
      y += 8;
    };

    addLine('Trámite Solicatado', tramite.tituloTramite);
    addLine('Estado del Expediente', tramite.estado);
    addLine('Solicitante', tramite.ciudadanoNombre);
    addLine('Cédula de Identidad', tramite.ciudadanoCedula);
    addLine('Correo Electrónico', tramite.ciudadanoEmail);
    addLine('Parroquia / Barrio', `${tramite.parroquia} - ${tramite.barrioSector}`);
    addLine('Departamento Emisor', tramite.departamentoResponsable);
    addLine('Código de Validación QR/Hash', tramite.codigoFirmaDigital || 'PENDIENTE_FIRMA');
    addLine('Tasa Municipal USD', `$${(tramite.montoPagoUSD || 0).toFixed(2)} (Pagado)`);

    // Observations
    doc.setFont('helvetica', 'bold');
    doc.text('Observaciones Oficiales:', 20, y + 4);
    doc.setFont('helvetica', 'normal');
    const splitObs = doc.splitTextToSize(tramite.observaciones || 'Expediente procesado conforme a la ordenanza municipal vigente del Cantón Logroño.', 170);
    doc.text(splitObs, 20, y + 11);

    // Stamp and Seal box
    doc.setDrawColor(0, 87, 184);
    doc.setFillColor(240, 246, 255);
    doc.roundedRect(120, 180, 70, 50, 4, 4, 'FD');
    doc.setFontSize(9);
    doc.setTextColor(0, 87, 184);
    doc.setFont('helvetica', 'bold');
    doc.text('VALIDEZ INSTITUCIONAL', 125, 190);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('GAD Municipal de Logroño', 125, 198);
    doc.text(`Firma Electrónica Autorizada`, 125, 204);
    doc.text(`Hash: ${tramite.codigoFirmaDigital || 'LOGROÑO-CERT-2026'}`, 125, 212);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Conserve este documento. Puede verificar la autenticidad ingresando el número de expediente en el portal www.logrono.gob.ec', 14, 275);

    doc.save(`Expediente_Logrono_${tramite.numeroExpediente}.pdf`);
  },

  // Export List to Excel XLSX
  exportIncidenciasExcel(incidencias: Incidencia[]) {
    const data = incidencias.map((inc) => ({
      'Código Tracking': inc.codigoTracking,
      'Título': inc.titulo,
      'Categoría': inc.categoria,
      'Prioridad': inc.prioridad,
      'Estado': inc.estado,
      'Parroquia': inc.ubicacion.parroquia,
      'Dirección': inc.ubicacion.direccionAproximada,
      'Ciudadano': inc.ciudadanoNombre,
      'Cédula': inc.ciudadanoCedula,
      'Teléfono': inc.ciudadanoTelefono,
      'Departamento Responsable': inc.departamentoResponsable,
      'Funcionario Asignado': inc.funcionarioAsignadoNombre || 'No asignado',
      'Fecha Creación': new Date(inc.createdAt).toLocaleString('es-EC'),
      'Fecha Resolución': inc.resolucionFecha ? new Date(inc.resolucionFecha).toLocaleString('es-EC') : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Incidencias Logroño');

    XLSX.writeFile(workbook, `Reporte_Incidencias_GAD_Logrono_${new Date().toISOString().slice(0, 10)}.xlsx`);
  },

  exportTramitesExcel(tramites: Tramite[]) {
    const data = tramites.map((trm) => ({
      'Expediente': trm.numeroExpediente,
      'Trámite': trm.tituloTramite,
      'Estado': trm.estado,
      'Ciudadano': trm.ciudadanoNombre,
      'Cédula': trm.ciudadanoCedula,
      'Email': trm.ciudadanoEmail,
      'Teléfono': trm.ciudadanoTelefono,
      'Parroquia': trm.parroquia,
      'Departamento': trm.departamentoResponsable,
      'Tasa USD': trm.montoPagoUSD || 0,
      'Firma Digital': trm.codigoFirmaDigital || 'N/A',
      'Fecha Ingreso': new Date(trm.createdAt).toLocaleString('es-EC'),
      'Fecha Actualización': new Date(trm.updatedAt).toLocaleString('es-EC'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trámites Logroño');

    XLSX.writeFile(workbook, `Reporte_Tramites_GAD_Logrono_${new Date().toISOString().slice(0, 10)}.xlsx`);
  },
};
