import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { INSTITUCION_INFO } from '../../constants';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1E293B',
        color: '#F8FAFC',
        pt: 5,
        pb: 3,
        mt: 'auto',
        borderTop: '4px solid #0057B8',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Building2 size={30} color="#0057B8" />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  {INSTITUCION_INFO.siglas}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Cantón Logroño - Provincia de Morona Santiago - Ecuador
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 2, fontSize: '0.88rem' }}>
              Plataforma digital oficial del Gobierno Autónomo Descentralizado Municipal del Cantón Logroño para el reporte de incidencias urbanas/rurales, gestión de trámites y atención ciudadana transparente.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4ADE80' }}>
              <ShieldCheck size={18} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Certificación de Gobierno Electrónico & Transparencia Activa
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1.5, letterSpacing: 0.5 }}>
              CONTACTO INSTITUCIONAL
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <MapPin size={18} color="#0057B8" style={{ marginTop: 2, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
                  {INSTITUCION_INFO.direccion}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone size={18} color="#2E7D32" style={{ flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
                  {INSTITUCION_INFO.telefono}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Mail size={18} color="#F9A825" style={{ flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
                  {INSTITUCION_INFO.email}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 1.5, letterSpacing: 0.5 }}>
              EMERGENCIAS Y HORARIOS
            </Typography>
            <Typography variant="caption" sx={{ color: '#CBD5E1', mb: 1, display: 'block' }}>
              Horario de Atención Presencial en Palacio Municipal:
              <br />
              <strong>{INSTITUCION_INFO.horario}</strong>
            </Typography>
            <Typography variant="caption" sx={{ color: '#F87171', fontWeight: 700, display: 'block' }}>
              Teléfono de Emergencias 24/7:
              <br />
              {INSTITUCION_INFO.emergenciasPhone}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: '#334155' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            © {new Date().getFullYear()} GAD Municipal del Cantón Logroño. Todos los derechos reservados.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94A3B8' }}>
            <Typography variant="caption">Desarrollado para el Cantón Logroño con</Typography>
            <Heart size={14} color="#EF4444" fill="#EF4444" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
