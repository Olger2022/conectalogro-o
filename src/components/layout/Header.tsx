import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Badge,
  Tooltip,
  Container,
} from '@mui/material';
import {
  Menu,
  Bell,
  Eye,
  Bot,
  MapPin,
  Building2,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { RoleSwitcher } from '../ui/RoleSwitcher';
import { AccessibilityPanel } from '../ui/AccessibilityPanel';
import { INSTITUCION_INFO } from '../../constants';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    activeModule,
    setActiveModule,
    isNotificationsOpen,
    setIsNotificationsOpen,
    setIsAuthModalOpen,
  } = useAppStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [accessModalOpen, setAccessModalOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#0057B8', // Azul Institucional
          color: '#FFFFFF',
          borderBottom: '3px solid #2E7D32', // Accent Green
        }}
      >
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1.5, md: 3 } }}>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 60, md: 70 }, px: '0 !important' }}>
            {/* Left Brand Area */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                onClick={onToggleSidebar}
                edge="start"
                sx={{ color: '#FFFFFF', display: { xs: 'flex', md: 'none' } }}
                aria-label="Menú principal de navegación"
              >
                <Menu size={24} />
              </IconButton>

              <Box
                onClick={() => setActiveModule('dashboard')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '10px',
                    bgcolor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <Building2 size={26} color="#0057B8" />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      letterSpacing: 0.5,
                      lineHeight: 1.1,
                      color: '#FFFFFF',
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                    }}
                  >
                    LOGROÑO CONECTA
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 600,
                      fontSize: '0.68rem',
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    {INSTITUCION_INFO.siglas} • Morona Santiago
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Center Quick Navigation (Desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Tooltip title="Ir al Mapa de Incidencias">
                <Box
                  onClick={() => setActiveModule('mapa')}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    bgcolor: activeModule === 'mapa' ? 'rgba(255,255,255,0.2)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                  }}
                >
                  <MapPin size={18} color="#FFFFFF" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
                    Mapa Cantonal
                  </Typography>
                </Box>
              </Tooltip>

              <Tooltip title="Asistente Virtual Municipal con Inteligencia Artificial">
                <Box
                  onClick={() => setActiveModule('asistente')}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    bgcolor: activeModule === 'asistente' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                  }}
                >
                  <Bot size={18} color="#FFD700" />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFD700' }}>
                    LogroñoBot IA
                  </Typography>
                </Box>
              </Tooltip>
            </Box>

            {/* Right Action Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
              {/* Accessibility Button */}
              <Tooltip title="Ajustes de Accesibilidad (WCAG 2.2 AA)">
                <IconButton
                  onClick={() => setAccessModalOpen(true)}
                  sx={{ color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' }}
                  aria-label="Ajustes de accesibilidad"
                >
                  <Eye size={20} />
                </IconButton>
              </Tooltip>

              {/* Notification Bell */}
              <Tooltip title="Centro de Notificaciones Municipales">
                <IconButton
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  sx={{ color: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.1)' }}
                  aria-label="Notificaciones del sistema"
                >
                  <Badge badgeContent={2} color="error">
                    <Bell size={20} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Quick Role Switcher for Testing */}
              {isAuthenticated && <RoleSwitcher />}

              {!isAuthenticated ? (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  variant="contained"
                  startIcon={<LogIn size={18} />}
                  sx={{
                    bgcolor: '#2E7D32',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                    '&:hover': { bgcolor: '#1B5E20' },
                  }}
                >
                  Acceder / Registro
                </Button>
              ) : (
                <Tooltip title={`Cerrar Sesión (${user?.nombres || 'Usuario'})`}>
                  <IconButton onClick={logout} sx={{ color: 'rgba(255,255,255,0.9)', bgcolor: 'rgba(255,255,255,0.1)' }}>
                    <LogOut size={18} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <AccessibilityPanel open={accessModalOpen} onClose={() => setAccessModalOpen(false)} />
    </>
  );
};
