import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import {
  X,
  FileText,
  UploadCloud,
  CheckCircle,
  Building,
  DollarSign,
  FileCheck,
} from 'lucide-react';
import { TramiteCatalogoItem, ParroquiaLogrono } from '../../types';
import { PARROQUIAS_LOGRONO } from '../../constants';
import { apiService } from '../../services/apiService';
import { useAuthStore } from '../../stores/useAuthStore';

interface NuevoTramiteModalProps {
  catalogItem: TramiteCatalogoItem | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NuevoTramiteModal: React.FC<NuevoTramiteModalProps> = ({
  catalogItem,
  open,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuthStore();

  const [parroquia, setParroquia] = useState<ParroquiaLogrono>('Logroño (Centro)');
  const [barrioSector, setBarrioSector] = useState('');
  const [formFields, setFormFields] = useState<Record<string, any>>({});
  const [docUploaded, setDocUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!catalogItem) return null;

  const handleFieldChange = (fieldId: string, val: any) => {
    setFormFields((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barrioSector) {
      setErrorMsg('Por favor ingrese el barrio o sector.');
      return;
    }

    setSubmitting(true);
    await apiService.submitTramite({
      tituloTramite: catalogItem.titulo,
      codigoCatalogo: catalogItem.codigo,
      departamentoResponsable: catalogItem.departamento,
      montoPagoUSD: catalogItem.costoUSD,
      parroquia,
      barrioSector,
      camposDinamicos: formFields,
      documentos: [
        {
          id: `doc-${Date.now()}`,
          nombre: `Requisitos_${catalogItem.codigo}.pdf`,
          tipo: 'pdf',
          tamanoBytes: 512000,
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fechaSubida: new Date().toISOString(),
          verificado: true,
        },
      ],
      ciudadano: {
        id: user ? user.id : 'usr-anon',
        nombre: user ? `${user.nombres} ${user.apellidos}` : 'Ciudadano Registrado',
        cedula: user ? user.cedula : '1400892341',
        email: user ? user.email : 'ciudadano@logrono.gob.ec',
        telefono: user ? user.telefono : '0987654321',
      },
    });

    setSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <Box sx={{ p: 2.5, bgcolor: '#2E7D32', color: '#FFFFFF', position: 'relative' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}>
          <X size={20} />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FileText size={28} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Formulario de Trámite Municipal
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {catalogItem.titulo}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ pt: 2.5 }}>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F0FDF4', borderColor: '#BBF7D0', mb: 2.5, borderRadius: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Departamento Emisor</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#166534' }}>
                {catalogItem.departamento}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2E7D32' }}>
              ${catalogItem.costoUSD.toFixed(2)} USD
            </Typography>
          </Box>
        </Paper>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Location */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              select
              label="Parroquia"
              fullWidth
              value={parroquia}
              onChange={(e) => setParroquia(e.target.value as any)}
            >
              {PARROQUIAS_LOGRONO.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Barrio / Sector"
              fullWidth
              required
              value={barrioSector}
              onChange={(e) => setBarrioSector(e.target.value)}
              placeholder="Ej: Barrio San José"
            />
          </Box>

          {/* Dynamic Form Fields */}
          {catalogItem.camposRequeridos.map((field) => (
            <React.Fragment key={field.id}>
              {field.tipo === 'select' ? (
                <TextField
                  select
                  label={field.label}
                  fullWidth
                  required={field.required}
                  value={formFields[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                >
                  {(field.opciones || []).map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </TextField>
              ) : field.tipo === 'textarea' ? (
                <TextField
                  label={field.label}
                  multiline
                  rows={2}
                  fullWidth
                  required={field.required}
                  value={formFields[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                />
              ) : (
                <TextField
                  label={field.label}
                  type={field.tipo === 'numero' ? 'number' : 'text'}
                  fullWidth
                  required={field.required}
                  value={formFields[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                />
              )}
            </React.Fragment>
          ))}

          {/* Document Upload Simulation */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Documentación Requerida (PDF / Imagen)
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderStyle: 'dashed',
                borderColor: docUploaded ? '#2E7D32' : '#CBD5E1',
                bgcolor: docUploaded ? '#F0FDF4' : 'transparent',
                textAlign: 'center',
                borderRadius: 2.5,
              }}
            >
              {!docUploaded ? (
                <Box>
                  <UploadCloud size={32} color="#0057B8" style={{ marginBottom: 6 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Haga clic o arrastre los documentos solicitados
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    Formatos soportados: PDF, JPG, PNG (hasta 10MB)
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setDocUploaded(true)}
                  >
                    Simular Carga de Requisitos
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#166534' }}>
                  <CheckCircle size={20} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Documentos digitales cargados y validados correctamente
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={submitting}
          sx={{ fontWeight: 700, px: 3 }}
        >
          {submitting ? 'Generando Expediente...' : 'Generar Expediente Digital'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
