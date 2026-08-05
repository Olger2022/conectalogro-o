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
  CircularProgress,
  Chip,
  Paper,
} from '@mui/material';
import {
  X,
  Camera,
  MapPin,
  Bot,
  AlertTriangle,
  UploadCloud,
  Trash2,
  Navigation,
} from 'lucide-react';
import { CATEGORIAS_INCIDENCIA, PARROQUIAS_LOGRONO, INSTITUCION_INFO } from '../../constants';
import { IncidenciaCategory, IncidenciaPriority, ParroquiaLogrono } from '../../types';
import { apiService } from '../../services/apiService';
import { useAuthStore } from '../../stores/useAuthStore';

interface NuevaIncidenciaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NuevaIncidenciaModal: React.FC<NuevaIncidenciaModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuthStore();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<IncidenciaCategory>('Agua Potable');
  const [prioridad, setPrioridad] = useState<IncidenciaPriority>('Media');
  const [parroquia, setParroquia] = useState<ParroquiaLogrono>('Logroño (Centro)');
  const [direccionAproximada, setDireccionAproximada] = useState('');
  const [lat, setLat] = useState<number>(INSTITUCION_INFO.coordenadasLogrono.lat);
  const [lng, setLng] = useState<number>(INSTITUCION_INFO.coordenadasLogrono.lng);
  const [fotosUrl, setFotosUrl] = useState<string[]>([]);

  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample default uploaded photo pool
  const samplePhotosPool = [
    'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80',
  ];

  const handleAddSamplePhoto = () => {
    if (fotosUrl.length >= 5) {
      setErrorMsg('Máximo 5 fotografías permitidas por reporte.');
      return;
    }
    const nextPhoto = samplePhotosPool[fotosUrl.length % samplePhotosPool.length];
    setFotosUrl([...fotosUrl, nextPhoto]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      if (fotosUrl.length >= 5) break;
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFotosUrl((prev) => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFotosUrl(fotosUrl.filter((_, i) => i !== index));
  };

  const handleGetLocationGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setDireccionAproximada(`Ubicación GPS capturada (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          setLat(INSTITUCION_INFO.coordenadasLogrono.lat);
          setLng(INSTITUCION_INFO.coordenadasLogrono.lng);
          setDireccionAproximada('Centro Cantonal Logroño - Av. Miguel Tinoco');
        }
      );
    }
  };

  const handleAICatClassify = async () => {
    if (!descripcion) {
      setErrorMsg('Escriba una breve descripción antes de clasificar con IA.');
      return;
    }
    setLoadingAI(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/classify-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: descripcion }),
      });
      const data = await res.json();
      if (data.category) setCategoria(data.category);
      if (data.priority) setPrioridad(data.priority);
      if (data.suggestedTitle) setTitulo(data.suggestedTitle);
    } catch (err) {
      console.warn('AI classification fallback:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descripcion || !direccionAproximada) {
      setErrorMsg('Por favor complete el título, la descripción y la dirección.');
      return;
    }

    setSubmitting(true);
    await apiService.createIncidencia({
      titulo,
      descripcion,
      categoria,
      prioridad,
      lat,
      lng,
      direccionAproximada,
      parroquia,
      fotosUrl,
      ciudadano: {
        id: user ? user.id : 'usr-anon',
        nombre: user ? `${user.nombres} ${user.apellidos}` : 'Ciudadano Anónimo',
        cedula: user ? user.cedula : '1400000000',
        telefono: user ? user.telefono : '0990000000',
      },
    });

    setSubmitting(false);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <Box sx={{ p: 2.5, bgcolor: '#0057B8', color: '#FFFFFF', position: 'relative' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}>
          <X size={20} />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AlertTriangle size={28} color="#FFD700" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Nuevo Reporte Ciudadano
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Ingreso de incidencia urbana / rural - GAD Logroño
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ pt: 2.5 }}>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* AI Helper Button Banner */}
          <Paper
            variant="outlined"
            sx={{ p: 1.5, bgcolor: '#F0F7FF', borderColor: '#BEE3F8', borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Bot size={20} color="#0057B8" />
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#0057B8' }}>
                ¿Duda en la categoría? Escriba la descripción y use la IA municipal.
              </Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              onClick={handleAICatClassify}
              disabled={loadingAI}
              startIcon={loadingAI ? <CircularProgress size={14} /> : <Bot size={14} />}
              sx={{ fontWeight: 700, fontSize: '0.75rem' }}
            >
              Autoclasificar con IA
            </Button>
          </Paper>

          {/* Description */}
          <TextField
            label="Descripción detallada de la incidencia"
            multiline
            rows={3}
            fullWidth
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describa qué sucede, la magnitud del problema y referencias cercanas..."
          />

          {/* Title */}
          <TextField
            label="Título de la incidencia"
            fullWidth
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Fuga de agua potable en esquina del parque"
          />

          {/* Category & Priority */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              select
              label="Categoría"
              fullWidth
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as any)}
            >
              {CATEGORIAS_INCIDENCIA.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Prioridad Estimada"
              fullWidth
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value as any)}
            >
              <MenuItem value="Baja">Baja</MenuItem>
              <MenuItem value="Media">Media</MenuItem>
              <MenuItem value="Alta">Alta</MenuItem>
              <MenuItem value="Urgente">Urgente</MenuItem>
            </TextField>
          </Box>

          {/* Location details */}
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

            <Button
              variant="outlined"
              onClick={handleGetLocationGPS}
              startIcon={<Navigation size={18} />}
              sx={{ fontWeight: 700, whiteSpace: 'nowrap', px: 2 }}
            >
              Capturar GPS
            </Button>
          </Box>

          <TextField
            label="Dirección o punto de referencia"
            fullWidth
            required
            value={direccionAproximada}
            onChange={(e) => setDireccionAproximada(e.target.value)}
            placeholder="Ej: Av. Miguel Tinoco frente a la escuela"
            slotProps={{
              input: {
                startAdornment: <MapPin size={18} color="#0057B8" style={{ marginRight: 8 }} />,
              },
            }}
          />

          {/* Photos Upload (up to 5) */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <span>Fotografías y Evidencias (hasta 5 fotos)</span>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{fotosUrl.length}/5 adjuntas</span>
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
              {fotosUrl.map((url, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid #CBD5E1',
                  }}
                >
                  <img src={url} alt="Evidencia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <IconButton
                    size="small"
                    onClick={() => handleRemovePhoto(i)}
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: '#FFF',
                      p: 0.3,
                      '&:hover': { bgcolor: '#B3261E' },
                    }}
                  >
                    <Trash2 size={12} />
                  </IconButton>
                </Box>
              ))}

              {fotosUrl.length < 5 && (
                <Button
                  component="label"
                  variant="outlined"
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 2,
                    borderStyle: 'dashed',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0,
                  }}
                >
                  <UploadCloud size={20} color="#0057B8" />
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.5 }}>Adjuntar</Typography>
                  <input type="file" accept="image/*" multiple hidden onChange={handleFileUpload} />
                </Button>
              )}
            </Box>

            <Button
              size="small"
              onClick={handleAddSamplePhoto}
              startIcon={<Camera size={14} />}
              sx={{ textTransform: 'none', color: '#0057B8' }}
            >
              + Añadir foto de demostración
            </Button>
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
          disabled={submitting}
          sx={{ fontWeight: 700, px: 3 }}
        >
          {submitting ? 'Enviando...' : 'Enviar Reporte a GAD Logroño'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
