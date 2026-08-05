import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ShieldAlert,
  FileSpreadsheet,
  FileText,
  Users,
  Activity,
  CheckCircle2,
  HardHat,
  Shield,
  Download,
} from 'lucide-react';
import { AuditoriaLog, Usuario } from '../../types';
import { USUARIOS_SEED } from '../../constants';
import { apiService } from '../../services/apiService';
import { pdfExcelService } from '../../services/pdfExcelService';

export const AdminPortalView: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [auditLogs, setAuditLogs] = useState<AuditoriaLog[]>([]);
  const [usuarios] = useState<Usuario[]>(USUARIOS_SEED);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    const logs = await apiService.getAuditLogs();
    setAuditLogs(logs);
  };

  const handleExportIncidencias = async () => {
    const incs = await apiService.getIncidencias();
    pdfExcelService.exportIncidenciasExcel(incs);
  };

  const handleExportTramites = async () => {
    const trms = await apiService.getTramites();
    pdfExcelService.exportTramitesExcel(trms);
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShieldAlert size={28} color="#B3261E" />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Panel Administrativo y Auditoría Municipal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Control de gestión, seguridad de la información, usuarios y reporte institucional GAD Logroño.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExportIncidencias}
            startIcon={<FileSpreadsheet size={18} />}
            sx={{ fontWeight: 700 }}
          >
            Exportar Incidencias (XLSX)
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleExportTramites}
            startIcon={<FileSpreadsheet size={18} />}
            sx={{ fontWeight: 700 }}
          >
            Exportar Trámites (XLSX)
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab label="Registro de Auditoría y Trazabilidad" sx={{ fontWeight: 700 }} />
          <Tab label="Gestión de Funcionarios y Usuarios" sx={{ fontWeight: 700 }} />
          <Tab label="Configuración e Integridad de Datos" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Paper>

      {tabIndex === 0 && (
        /* AUDIT TAB */
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>USUARIO</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>ROL</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>ACCIÓN REALIZADA</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>ENTIDAD / EXPEDIENTE</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>DETALLES</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>IP / FECHA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{log.usuarioNombre}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.usuarioRole}
                      size="small"
                      color={log.usuarioRole === 'admin' ? 'error' : log.usuarioRole === 'funcionario' ? 'primary' : 'default'}
                      sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={log.accion} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#0057B8' }}>{log.entidadId}</TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>{log.detalles}</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ display: 'block' }}>{log.ipAddress}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(log.timestamp).toLocaleString('es-EC')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabIndex === 1 && (
        /* USERS TAB */
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>NOMBRE Y APELLIDOS</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>CÉDULA ECUADOR</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>ROL</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>DEPARTAMENTO / CARGO</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>CORREO INSTITUCIONAL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usr) => (
                <TableRow key={usr.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {usr.nombres} {usr.apellidos}
                  </TableCell>
                  <TableCell>{usr.cedula}</TableCell>
                  <TableCell>
                    <Chip
                      label={usr.role}
                      color={usr.role === 'admin' ? 'error' : usr.role === 'funcionario' ? 'primary' : 'success'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem' }}>
                    {usr.departamento || 'Ciudadano en General'} ({usr.cargo || 'N/A'})
                  </TableCell>
                  <TableCell>{usr.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabIndex === 2 && (
        /* SYSTEM INTEGRITY TAB */
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <CheckCircle2 size={24} color="#2E7D32" />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Estado del Servidor y Base de Datos
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Servicio activo en Cloud Run / Firebase. Sincronización bidireccional IndexedDB + Firestore configurada.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Cifrado AES-256 en reposo y SSL/TLS 1.3 en tránsito.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
