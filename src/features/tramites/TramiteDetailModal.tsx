import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Alert,
} from '@mui/material';
import {
  X,
  FileText,
  FileCheck,
  FileDown,
  Building,
  CheckCircle,
  HardHat,
  ShieldCheck,
  Calendar,
  User,
} from 'lucide-react';
import { Tramite, TramiteStatus } from '../../types';
import { TramiteStatusChip } from '../../components/ui/StatusChips';
import { useAuthStore } from '../../stores/useAuthStore';
import { apiService } from '../../services/apiService';
import { pdfExcelService } from '../../services/pdfExcelService';

interface TramiteDetailModalProps {
  tramite: Tramite | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const TramiteDetailModal: React.FC<TramiteDetailModalProps> = ({
  tramite,
  open,
  onClose,
  onUpdate,
}) => {
  const { user } = useAuthStore();
  const [nuevoEstado, setNuevoEstado] = useState<TramiteStatus>('Aprobado');
  const [observacion, setObservacion] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!tramite) return null;

  const isOfficerOrAdmin = user?.role === 'funcionario' || user?.role === 'admin';

  const handleUpdateStatus = async () => {
    if (!observacion || !user) return;
    setUpdating(true);
    await apiService.updateTramiteStatus(
      tramite.id,
      nuevoEstado,
      observacion,
      { id: user.id, nombre: `${user.nombres} ${user.apellidos}`, role: user.role }
    );
    setUpdating(false);
    setObservacion('');
    setSuccessMsg(`Estado actualizado a "${nuevoEstado}" exitosamente.`);
    setTimeout(() => setSuccessMsg(''), 3000);
    onUpdate();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <Box sx={{ p: 2.5, bgcolor: '#2E7D32', color: '#FFFFFF', position: 'relative' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}>
          <X size={20} />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 5, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Chip label={tramite.numeroExpediente} color="secondary" size="small" sx={{ fontWeight: 800, mb: 0.5, bgcolor: '#FFFFFF', color: '#2E7D32' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {tramite.tituloTramite}
            </Typography>
          </Box>
          <TramiteStatusChip status={tramite.estado} />
        </Box>
      </Box>

      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

        <Grid container spacing={3}>
          {/* Main Info */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Approval Banner with QR / Digital Signature */}
            {tramite.estado === 'Aprobado' && (
              <Paper sx={{ p: 2.5, bgcolor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1, borderStyle: 'solid', borderRadius: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <ShieldCheck size={24} color="#166534" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#166534' }}>
                    ¡TRÁMITE APROBADO CON FIRMA ELECTRÓNICA!
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Se ha generado su certificado / resolución oficial con validez jurídica del GAD Municipal de Logroño.
                </Typography>
                <Box sx={{ p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid #DCFCE7' }}>
                  <Typography variant="caption" color="text.secondary" display="block">Código de Verificación QR / Hash:</Typography>
                  <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#0057B8' }}>
                    {tramite.codigoFirmaDigital || 'FIRMA-GAD-LOG-2026-X91A'}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<FileDown size={18} />}
                  onClick={() => pdfExcelService.generateTramitePDF(tramite)}
                  sx={{ mt: 2, fontWeight: 800 }}
                >
                  Descargar Certificado Oficial en PDF
                </Button>
              </Paper>
            )}

            {/* Observations */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                OBSERVACIONES DEL EXPEDIENTE
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                {tramite.observaciones || 'Expediente registrado en el portal municipal. En espera de dictamen técnico.'}
              </Typography>
            </Box>

            {/* Timeline */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5 }}>
                REVISIONES Y LÍNEA DE TIEMPO
              </Typography>
              <Box sx={{ borderLeft: '2px solid #2E7D32', pl: 2, ml: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tramite.timeline.map((event) => (
                  <Box key={event.id} sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -23,
                        top: 2,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#2E7D32',
                        border: '2px solid #FFF',
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {event.status}: {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {new Date(event.timestamp).toLocaleString('es-EC')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                      {event.description}
                    </Typography>
                    <Typography variant="caption" color="secondary" sx={{ fontWeight: 600 }}>
                      Por: {event.updatedBy}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Sidebar Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5 }}>
                INFORMACIÓN DEL SOLICITANTE
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <User size={18} color="#0057B8" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Ciudadano</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {tramite.ciudadanoNombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      C.I: {tramite.ciudadanoCedula}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Building size={18} color="#2E7D32" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Departamento Responsable</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {tramite.departamentoResponsable}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Calendar size={18} color="#F9A825" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Fecha de Apertura</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {new Date(tramite.createdAt).toLocaleString('es-EC')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<FileDown size={18} />}
                onClick={() => pdfExcelService.generateTramitePDF(tramite)}
                sx={{ mt: 2.5, fontWeight: 700 }}
              >
                Descargar Comprobante PDF
              </Button>
            </Paper>

            {/* Officer Resolver Section */}
            {isOfficerOrAdmin && (
              <Paper sx={{ p: 2, bgcolor: '#F1F5F9', borderRadius: 3, border: '1px solid #CBD5E1' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <HardHat size={20} color="#0057B8" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    DICTAMEN Y RESOLUCIÓN TÉCNICA
                  </Typography>
                </Box>

                <TextField
                  select
                  label="Nuevo Estado del Expediente"
                  fullWidth
                  size="small"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value as any)}
                  sx={{ mb: 1.5 }}
                >
                  <MenuItem value="En revisión">En revisión</MenuItem>
                  <MenuItem value="En inspección">En inspección de campo</MenuItem>
                  <MenuItem value="Aprobado">Aprobado (Emitir Certificado)</MenuItem>
                  <MenuItem value="Rechazado">Rechazado</MenuItem>
                </TextField>

                <TextField
                  label="Observaciones e Informe Legal"
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Escriba la justificación o dictamen técnico..."
                  sx={{ mb: 1.5 }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleUpdateStatus}
                  disabled={updating || !observacion}
                  sx={{ fontWeight: 700 }}
                >
                  Firmar y Notificar al Ciudadano
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
