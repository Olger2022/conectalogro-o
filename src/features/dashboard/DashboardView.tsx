import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  AlertTriangle,
  FileText,
  CheckCircle2,
  Clock,
  PlusCircle,
  MapPin,
  Bot,
  TrendingUp,
  FileCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { apiService } from '../../services/apiService';
import { Incidencia, Tramite } from '../../types';
import { IncidenciaStatusChip, TramiteStatusChip } from '../../components/ui/StatusChips';

interface DashboardViewProps {
  onOpenNuevaIncidencia: () => void;
  onOpenNuevoTramite: () => void;
  onSelectIncidencia: (inc: Incidencia) => void;
  onSelectTramite: (trm: Tramite) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNuevaIncidencia,
  onOpenNuevoTramite,
  onSelectIncidencia,
  onSelectTramite,
}) => {
  const { setActiveModule } = useAppStore();
  const { user } = useAuthStore();
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [tramites, setTramites] = useState<Tramite[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const incList = await apiService.getIncidencias();
    const trmList = await apiService.getTramites();
    setIncidencias(incList);
    setTramites(trmList);
  };

  // Metrics
  const totalIncidencias = incidencias.length;
  const incidenciasPendientes = incidencias.filter((i) => i.estado !== 'Resuelto' && i.estado !== 'Cerrado').length;
  const incidenciasResueltas = incidencias.filter((i) => i.estado === 'Resuelto' || i.estado === 'Cerrado').length;
  const totalTramites = tramites.length;
  const tramitesAprobados = tramites.filter((t) => t.estado === 'Aprobado' || t.estado === 'Finalizado').length;

  return (
    <Box sx={{ pb: 4 }}>
      {/* Welcome Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mb: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0057B8 0%, #003D82 100%)',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Chip
            label="Plataforma Oficial GAD Municipal de Logroño"
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', fontWeight: 700, mb: 1.5 }}
            size="small"
          />
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            ¡Bienvenido, {user ? `${user.nombres.split(' ')[0]} ${user.apellidos.split(' ')[0]}` : 'Ciudadano'}!
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: 700, mb: 2.5 }}>
            Participe activamente reportando incidencias en su barrio o parroquia, solicite trámites municipales en línea con firma digital y consulte a nuestro Asistente con Inteligencia Artificial.
          </Typography>

          {/* Quick Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={onOpenNuevaIncidencia}
              startIcon={<PlusCircle size={18} />}
              sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#1B5E20' }, fontWeight: 700, px: 2.5 }}
            >
              Reportar Incidencia
            </Button>
            <Button
              variant="outlined"
              onClick={onOpenNuevoTramite}
              startIcon={<FileText size={18} />}
              sx={{
                color: '#FFFFFF',
                borderColor: 'rgba(255,255,255,0.5)',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.2)' },
                fontWeight: 700,
                px: 2.5,
              }}
            >
              Iniciar Trámite Municipal
            </Button>
            <Button
              variant="text"
              onClick={() => setActiveModule('asistente')}
              startIcon={<Bot size={18} color="#FFD700" />}
              sx={{ color: '#FFD700', fontWeight: 700 }}
            >
              Consultar LogroñoBot IA
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* KPI Cards Section */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderLeft: '5px solid #0057B8' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                    TOTAL INCIDENCIAS
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5 }}>
                    {totalIncidencias}
                  </Typography>
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                    Reportadas en el Cantón
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(0, 87, 184, 0.1)', borderRadius: 3, color: '#0057B8' }}>
                  <AlertTriangle size={28} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderLeft: '5px solid #F9A825' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                    EN ATENCIÓN / PENDIENTES
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color: '#D97706' }}>
                    {incidenciasPendientes}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Asignadas a cuadrillas
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#FEF3C7', borderRadius: 3, color: '#D97706' }}>
                  <Clock size={28} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderLeft: '5px solid #2E7D32' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                    INCIDENCIAS RESUELTAS
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color: '#2E7D32' }}>
                    {incidenciasResueltas}
                  </Typography>
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                    Efectividad del 82%
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#DCFCE7', borderRadius: 3, color: '#2E7D32' }}>
                  <CheckCircle2 size={28} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderLeft: '5px solid #7C3AED' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                    TRÁMITES APROBADOS
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, my: 0.5, color: '#7C3AED' }}>
                    {tramitesAprobados} / {totalTramites}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Firma digital autorizada
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#F3E8FF', borderRadius: 3, color: '#7C3AED' }}>
                  <FileCheck size={28} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Sections: Recent Incidences and Recent Tramites */}
      <Grid container spacing={3}>
        {/* Recent Incidences Column */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AlertTriangle size={20} color="#0057B8" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Últimos Reportes Ciudadanos
                </Typography>
              </Box>
              <Button
                size="small"
                onClick={() => setActiveModule('incidencias')}
                endIcon={<ChevronRight size={16} />}
                sx={{ fontWeight: 700 }}
              >
                Ver Todas
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {incidencias.slice(0, 3).map((inc) => (
                <Paper
                  key={inc.id}
                  variant="outlined"
                  onClick={() => onSelectIncidencia(inc)}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip label={inc.codigoTracking} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                    <IncidenciaStatusChip status={inc.estado} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {inc.titulo}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <MapPin size={14} />
                    <Typography variant="caption">
                      {inc.ubicacion.parroquia} • {inc.ubicacion.direccionAproximada}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Tramites Column */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileText size={20} color="#2E7D32" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Estado de Mis Trámites
                </Typography>
              </Box>
              <Button
                size="small"
                color="secondary"
                onClick={() => setActiveModule('tramites')}
                endIcon={<ChevronRight size={16} />}
                sx={{ fontWeight: 700 }}
              >
                Catálogo
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {tramites.map((trm) => (
                <Paper
                  key={trm.id}
                  variant="outlined"
                  onClick={() => onSelectTramite(trm)}
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'secondary.main', bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip label={trm.numeroExpediente} size="small" color="secondary" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                    <TramiteStatusChip status={trm.estado} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {trm.tituloTramite}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {trm.departamentoResponsable}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
