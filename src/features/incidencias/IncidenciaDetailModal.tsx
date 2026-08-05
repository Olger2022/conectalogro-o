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
  Avatar,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import {
  X,
  MapPin,
  Calendar,
  User,
  Phone,
  FileDown,
  MessageSquare,
  Send,
  HardHat,
  CheckCircle,
  Clock,
  Building,
} from 'lucide-react';
import { Incidencia, IncidenciaStatus } from '../../types';
import { IncidenciaStatusChip, PriorityChip } from '../../components/ui/StatusChips';
import { useAuthStore } from '../../stores/useAuthStore';
import { apiService } from '../../services/apiService';
import { pdfExcelService } from '../../services/pdfExcelService';

interface IncidenciaDetailModalProps {
  incidencia: Incidencia | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const IncidenciaDetailModal: React.FC<IncidenciaDetailModalProps> = ({
  incidencia,
  open,
  onClose,
  onUpdate,
}) => {
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState<IncidenciaStatus>('En proceso');
  const [statusObservacion, setStatusObservacion] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!incidencia) return null;

  const isOfficerOrAdmin = user?.role === 'funcionario' || user?.role === 'admin';

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    await apiService.addIncidenciaComment(incidencia.id, {
      authorName: `${user.nombres} ${user.apellidos}`,
      authorRole: user.role,
      content: newComment,
    });
    setNewComment('');
    onUpdate();
  };

  const handleUpdateStatus = async () => {
    if (!statusObservacion || !user) return;
    setStatusUpdating(true);
    await apiService.updateIncidenciaStatus(
      incidencia.id,
      newStatus,
      statusObservacion,
      { id: user.id, nombre: `${user.nombres} ${user.apellidos}`, role: user.role },
      newStatus === 'Resuelto'
        ? 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=800&q=80'
        : undefined
    );
    setStatusUpdating(false);
    setStatusObservacion('');
    setSuccessMsg(`Estado actualizado a "${newStatus}" correctamente.`);
    setTimeout(() => setSuccessMsg(''), 3000);
    onUpdate();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      {/* Header */}
      <Box sx={{ p: 2.5, bgcolor: '#0057B8', color: '#FFFFFF', position: 'relative' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}>
          <X size={20} />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 5, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Chip label={incidencia.codigoTracking} color="secondary" size="small" sx={{ fontWeight: 800, mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {incidencia.titulo}
            </Typography>
          </Box>
          <IncidenciaStatusChip status={incidencia.estado} />
        </Box>
      </Box>

      <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

        <Grid container spacing={3}>
          {/* Main Info Column */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                DESCRIPCIÓN DE LA INCIDENCIA
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                {incidencia.descripcion}
              </Typography>
            </Box>

            {/* Photos gallery */}
            {incidencia.fotosUrl && incidencia.fotosUrl.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
                  FOTOGRAFÍAS REGISTRADAS
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {incidencia.fotosUrl.map((url, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={url}
                      alt="Evidencia"
                      sx={{ width: 110, height: 90, borderRadius: 2, objectFit: 'cover', border: '1px solid #E2E8F0' }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Resolution Photo if resuelto */}
            {incidencia.fotografiaResolucionUrl && (
              <Paper sx={{ p: 2, bgcolor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1, borderStyle: 'solid', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: '#166534', fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle size={18} /> EVIDENCIA DE RESOLUCIÓN TÉCNICA
                </Typography>
                <Box
                  component="img"
                  src={incidencia.fotografiaResolucionUrl}
                  alt="Resolucion"
                  sx={{ width: '100%', height: 160, borderRadius: 2, objectFit: 'cover' }}
                />
              </Paper>
            )}

            {/* Timeline View */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5 }}>
                TIMELINE / LÍNEA DE TIEMPO
              </Typography>
              <Box sx={{ borderLeft: '2px solid #0057B8', pl: 2, ml: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {incidencia.timeline.map((event) => (
                  <Box key={event.id} sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -23,
                        top: 2,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: '#0057B8',
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
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                      Por: {event.updatedBy}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Comments Feed */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5 }}>
                COMENTARIOS Y SEGUIMIENTO ({incidencia.comentarios.length})
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                {incidencia.comentarios.map((c) => (
                  <Paper key={c.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        {c.authorName} ({c.authorRole})
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {new Date(c.timestamp).toLocaleTimeString('es-EC')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '0.88rem' }}>
                      {c.content}
                    </Typography>
                  </Paper>
                ))}
              </Box>

              {user && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Escriba un comentario o consulta..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button variant="contained" onClick={handleAddComment} startIcon={<Send size={16} />}>
                    Enviar
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Sidebar Info Column */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5 }}>
                DATOS DE LA INCIDENCIA
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MapPin size={18} color="#0057B8" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Ubicación</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {incidencia.ubicacion.parroquia} • {incidencia.ubicacion.direccionAproximada}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Building size={18} color="#2E7D32" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Departamento Responsable</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {incidencia.departamentoResponsable}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <User size={18} color="#7C3AED" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Funcionario Asignado</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {incidencia.funcionarioAsignadoNombre || 'Mesa Técnica GAD'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Calendar size={18} color="#F9A825" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Fecha de Registro</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {new Date(incidencia.createdAt).toLocaleString('es-EC')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<FileDown size={18} />}
                onClick={() => pdfExcelService.generateIncidenciaPDF(incidencia)}
                sx={{ mt: 2.5, fontWeight: 700 }}
              >
                Descargar Comprobante PDF
              </Button>
            </Paper>

            {/* Officer Action Box */}
            {isOfficerOrAdmin && (
              <Paper sx={{ p: 2, bgcolor: '#F1F5F9', borderRadius: 3, border: '1px solid #CBD5E1' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <HardHat size={20} color="#2E7D32" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    GESTIÓN DE FUNCIONARIO MUNICIPAL
                  </Typography>
                </Box>

                <TextField
                  select
                  label="Nuevo Estado"
                  fullWidth
                  size="small"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  sx={{ mb: 1.5 }}
                >
                  <MenuItem value="En proceso">En proceso</MenuItem>
                  <MenuItem value="Resuelto">Resuelto</MenuItem>
                  <MenuItem value="Cerrado">Cerrado</MenuItem>
                </TextField>

                <TextField
                  label="Observación / Informe Técnico"
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
                  value={statusObservacion}
                  onChange={(e) => setStatusObservacion(e.target.value)}
                  placeholder="Detalle los trabajos realizados..."
                  sx={{ mb: 1.5 }}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleUpdateStatus}
                  disabled={statusUpdating || !statusObservacion}
                  sx={{ fontWeight: 700 }}
                >
                  Actualizar Estado e Notificar
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
