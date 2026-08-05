import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  MenuItem,
  Chip,
  InputAdornment,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AlertTriangle,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  User,
  Image as ImageIcon,
  MessageSquare,
  FileDown,
} from 'lucide-react';
import { Incidencia, IncidenciaCategory, ParroquiaLogrono } from '../../types';
import { CATEGORIAS_INCIDENCIA, PARROQUIAS_LOGRONO } from '../../constants';
import { IncidenciaStatusChip, PriorityChip } from '../../components/ui/StatusChips';
import { apiService } from '../../services/apiService';
import { pdfExcelService } from '../../services/pdfExcelService';

interface IncidenciasViewProps {
  onOpenNuevaModal: () => void;
  onSelectIncidencia: (inc: Incidencia) => void;
}

export const IncidenciasView: React.FC<IncidenciasViewProps> = ({
  onOpenNuevaModal,
  onSelectIncidencia,
}) => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('TODAS');
  const [selectedParroquia, setSelectedParroquia] = useState<string>('TODAS');
  const [selectedEstado, setSelectedEstado] = useState<string>('TODOS');

  useEffect(() => {
    loadIncidencias();
  }, []);

  const loadIncidencias = async () => {
    const list = await apiService.getIncidencias();
    setIncidencias(list);
  };

  const filteredIncidencias = incidencias.filter((inc) => {
    const matchSearch =
      inc.titulo.toLowerCase().includes(search.toLowerCase()) ||
      inc.codigoTracking.toLowerCase().includes(search.toLowerCase()) ||
      inc.descripcion.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategoria === 'TODAS' || inc.categoria === selectedCategoria;
    const matchParroquia = selectedParroquia === 'TODAS' || inc.ubicacion.parroquia === selectedParroquia;
    const matchEstado = selectedEstado === 'TODOS' || inc.estado === selectedEstado;

    return matchSearch && matchCat && matchParroquia && matchEstado;
  });

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header & Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AlertTriangle size={28} color="#0057B8" />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Reportes de Incidencias Urbanas y Rurales
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Plataforma de participación ciudadana para reporte y seguimiento georreferenciado en Logroño.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => pdfExcelService.exportIncidenciasExcel(filteredIncidencias)}
            startIcon={<FileDown size={18} />}
            sx={{ fontWeight: 700 }}
          >
            Exportar Excel
          </Button>
          <Button
            variant="contained"
            onClick={onOpenNuevaModal}
            startIcon={<PlusCircle size={18} />}
            sx={{ fontWeight: 700, px: 2.5 }}
          >
            Nuevo Reporte
          </Button>
        </Box>
      </Box>

      {/* Filter Toolbar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por código, título o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#64748B" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Categoría"
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
            >
              <MenuItem value="TODAS">Todas las categorías</MenuItem>
              {CATEGORIAS_INCIDENCIA.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Parroquia"
              value={selectedParroquia}
              onChange={(e) => setSelectedParroquia(e.target.value)}
            >
              <MenuItem value="TODAS">Todas las parroquias</MenuItem>
              {PARROQUIAS_LOGRONO.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Estado"
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
            >
              <MenuItem value="TODOS">Todos los estados</MenuItem>
              <MenuItem value="Registrado">Registrado</MenuItem>
              <MenuItem value="En proceso">En proceso</MenuItem>
              <MenuItem value="Resuelto">Resuelto</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Cards Grid */}
      {filteredIncidencias.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
          <AlertTriangle size={48} color="#94A3B8" style={{ marginBottom: 12 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
            No se encontraron incidencias con los filtros aplicados.
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            Intente cambiando los criterios de búsqueda o cree un nuevo reporte ciudadano.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredIncidencias.map((inc) => (
            <Grid key={inc.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 12px 28px rgba(0, 87, 184, 0.12)',
                    borderColor: 'primary.main',
                  },
                }}
                onClick={() => onSelectIncidencia(inc)}
              >
                {/* Image Cover */}
                {inc.fotosUrl && inc.fotosUrl.length > 0 ? (
                  <CardMedia
                    component="img"
                    height="160"
                    image={inc.fotosUrl[0]}
                    alt={inc.titulo}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 140,
                      bgcolor: '#E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748B',
                    }}
                  >
                    <ImageIcon size={36} />
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip label={inc.codigoTracking} size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.72rem' }} />
                    <IncidenciaStatusChip status={inc.estado} />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', mb: 1, lineHeight: 1.3 }}>
                    {inc.titulo}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                      fontSize: '0.85rem',
                    }}
                  >
                    {inc.descripcion}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
                    <MapPin size={14} color="#0057B8" />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {inc.ubicacion.parroquia} • {inc.ubicacion.direccionAproximada}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                    <PriorityChip priority={inc.prioridad} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        <MessageSquare size={14} />
                        <Typography variant="caption">{inc.comentarios.length}</Typography>
                      </Box>
                      <Tooltip title="Descargar comprobante PDF">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            pdfExcelService.generateIncidenciaPDF(inc);
                          }}
                        >
                          <FileDown size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
