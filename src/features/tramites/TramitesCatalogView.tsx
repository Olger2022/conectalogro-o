import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  FileText,
  Search,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Building,
  FileCheck,
  PlusCircle,
} from 'lucide-react';
import { TramiteCatalogoItem, Tramite } from '../../types';
import { CATALOGO_TRAMITES_INITIAL } from '../../constants';
import { TramiteStatusChip } from '../../components/ui/StatusChips';
import { apiService } from '../../services/apiService';

interface TramitesCatalogViewProps {
  onSelectCatalogItem: (item: TramiteCatalogoItem) => void;
  onSelectTramite: (tramite: Tramite) => void;
}

export const TramitesCatalogView: React.FC<TramitesCatalogViewProps> = ({
  onSelectCatalogItem,
  onSelectTramite,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [misTramites, setMisTramites] = useState<Tramite[]>([]);

  useEffect(() => {
    loadTramites();
  }, []);

  const loadTramites = async () => {
    const list = await apiService.getTramites();
    setMisTramites(list);
  };

  const filteredCatalog = CATALOGO_TRAMITES_INITIAL.filter(
    (item) =>
      item.titulo.toLowerCase().includes(search.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      item.departamento.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ pb: 4 }}>
      {/* Title Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FileText size={28} color="#2E7D32" />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Trámites Municipales en Línea
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Catálogo de servicios digitales del GAD Municipal del Cantón Logroño con expedientes automáticos y firma electrónica.
        </Typography>
      </Box>

      {/* Tabs: Catalog vs My Procedures */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          <Tab label="Catálogo de Trámites Disponibles" sx={{ fontWeight: 700 }} />
          <Tab
            label={`Mis Trámites / Expedientes (${misTramites.length})`}
            sx={{ fontWeight: 700 }}
          />
        </Tabs>
      </Paper>

      {tabIndex === 0 ? (
        /* CATALOG TAB */
        <Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por certificado, permiso, departamento o palabra clave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3 }}
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

          <Grid container spacing={3}>
            {filteredCatalog.map((item) => (
              <Grid key={item.id} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    borderLeft: '5px solid #2E7D32',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip label={item.codigo} color="secondary" size="small" sx={{ fontWeight: 800, fontSize: '0.72rem' }} />
                      <Chip
                        icon={<Clock size={12} />}
                        label={`Respuesta en ~${item.tiempoEstimadoDias} día(s)`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.72rem' }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                      {item.titulo}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.88rem', lineHeight: 1.5 }}>
                      {item.descripcion}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                        REQUISITOS OBLIGATORIOS:
                      </Typography>
                      {item.requisitos.map((req, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                          <CheckCircle size={14} color="#2E7D32" />
                          <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>{req}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Tasa Municipal</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                          ${item.costoUSD.toFixed(2)} USD
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => onSelectCatalogItem(item)}
                        startIcon={<PlusCircle size={18} />}
                        sx={{ fontWeight: 700 }}
                      >
                        Iniciar Solicatitud
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        /* MY EXPEDIENTES TAB */
        <Box>
          <Grid container spacing={2.5}>
            {misTramites.map((trm) => (
              <Grid key={trm.id} size={{ xs: 12, md: 6 }}>
                <Paper
                  variant="outlined"
                  onClick={() => onSelectTramite(trm)}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'secondary.main', bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Chip label={trm.numeroExpediente} color="secondary" size="small" sx={{ fontWeight: 800 }} />
                    <TramiteStatusChip status={trm.estado} />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 800, my: 0.5 }}>
                    {trm.tituloTramite}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {trm.departamentoResponsable}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                      Ingresado: {new Date(trm.createdAt).toLocaleDateString('es-EC')}
                    </Typography>
                    <Button size="small" color="secondary" sx={{ fontWeight: 700 }}>
                      Ver Expediente →
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};
