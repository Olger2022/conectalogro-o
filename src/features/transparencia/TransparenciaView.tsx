import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Award,
  BookOpen,
} from 'lucide-react';
import { INSTITUCION_INFO } from '../../constants';

export const TransparenciaView: React.FC = () => {
  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Building2 size={28} color="#0057B8" />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Transparencia e Información Institucional
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Gobierno Autónomo Descentralizado Municipal del Cantón Logroño - Ley Orgánica de Transparencia y Acceso a la Información Pública (LOTAIP).
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Alcaldía Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#0057B8', width: 56, height: 56, fontSize: '1.4rem', fontWeight: 'bold' }}>
                LOG
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {INSTITUCION_INFO.nombre}
                </Typography>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>
                  Cantón Logroño • Morona Santiago • Ecuador
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                El Cantón Logroño se caracteriza por su riqueza biocultural, sus comunidades Shuar y mestizas, sus atractivos turísticos naturales como las Cuevas de los Tayos en la jurisdicción cantonal y el majestuoso Río Upano.
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                La administración municipal trabaja bajo el compromiso de la eficiencia administrativa, la pavimentación y mantenimiento vial, el agua potable segura para todas las parroquias y la inclusión digital.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Directory Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone size={20} color="#2E7D32" />
              Directorio de Atención por Direcciones
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Dirección de Agua Potable y Alcantarillado (EMAPAL-L)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Atención de fugas, cortes programados y nuevas acometidas en Logroño Centro, Yaupi y Shimpis.
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Dirección de Planificación y Obras Públicas
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Permisos de construcción, líneas de fábrica, pavimentación y uso de suelo.
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Dirección Financiera y Tesorería
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Emisión de patentes municipales, certificados de no adeudar y pagos de impuestos prediales.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
