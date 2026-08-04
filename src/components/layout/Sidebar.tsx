import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  MapPin,
  Bot,
  ShieldAlert,
  Info,
  Building,
  User,
  HardHat,
  Shield,
} from 'lucide-react';
import { useAppStore, ActiveModule } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { INSTITUCION_INFO } from '../../constants';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, isMobile }) => {
  const { activeModule, setActiveModule } = useAppStore();
  const { user } = useAuthStore();

  const handleNavClick = (mod: ActiveModule) => {
    setActiveModule(mod);
    if (isMobile) onClose();
  };

  const navItems = [
    {
      id: 'dashboard' as ActiveModule,
      label: 'Panel Principal',
      icon: <LayoutDashboard size={20} />,
      roles: ['ciudadano', 'funcionario', 'admin'],
    },
    {
      id: 'incidencias' as ActiveModule,
      label: 'Reportes de Incidencias',
      icon: <AlertTriangle size={20} />,
      badge: '3 Activas',
      roles: ['ciudadano', 'funcionario', 'admin'],
    },
    {
      id: 'tramites' as ActiveModule,
      label: 'Trámites Municipales',
      icon: <FileText size={20} />,
      roles: ['ciudadano', 'funcionario', 'admin'],
    },
    {
      id: 'mapa' as ActiveModule,
      label: 'Mapa Georreferenciado',
      icon: <MapPin size={20} />,
      roles: ['ciudadano', 'funcionario', 'admin'],
    },
    {
      id: 'asistente' as ActiveModule,
      label: 'LogroñoBot (Asistente IA)',
      icon: <Bot size={20} color="#0057B8" />,
      badge: 'IA',
      roles: ['ciudadano', 'funcionario', 'admin'],
    },
    {
      id: 'transparencia' as ActiveModule,
      label: 'Transparencia & GAD',
      icon: <Info size={20} />,
      roles: ['ciudadano', 'funcionario', 'admin'],
    },
    {
      id: 'admin' as ActiveModule,
      label: 'Panel Administrativo & Auditoría',
      icon: <ShieldAlert size={20} color="#B3261E" />,
      roles: ['admin', 'funcionario'],
    },
  ];

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Drawer Header */}
      <Box sx={{ p: 2.5, bgcolor: '#0057B8', color: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Building size={28} color="#FFFFFF" />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              GAD LOGROÑO
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Cantón Logroño - Morona Santiago
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User Role Card in Sidebar */}
      {user && (
        <Box sx={{ p: 2, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
            USUARIOS Y PERMISOS
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            {user.role === 'admin' ? (
              <Shield size={16} color="#B3261E" />
            ) : user.role === 'funcionario' ? (
              <HardHat size={16} color="#2E7D32" />
            ) : (
              <User size={16} color="#0057B8" />
            )}
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {user.nombres.split(' ')[0]} {user.apellidos.split(' ')[0]}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" display="block">
            {user.role === 'admin'
              ? 'Administrador General'
              : user.role === 'funcionario'
              ? `${user.departamento || 'Funcionario Municipal'}`
              : 'Ciudadano Registrado'}
          </Typography>
        </Box>
      )}

      {/* Nav List */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {navItems
          .filter((item) => !user || item.roles.includes(user.role))
          .map((item) => {
            const isSelected = activeModule === item.id;
            return (
              <ListItemButton
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                selected={isSelected}
                sx={{
                  borderRadius: 2.5,
                  mb: 0.8,
                  py: 1.2,
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontWeight: 700,
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: isSelected ? 'inherit' : 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 700 : 500,
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color={item.id === 'asistente' ? 'warning' : 'primary'}
                    sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                  />
                )}
              </ListItemButton>
            );
          })}
      </List>

      <Divider />

      {/* Footer Info */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {INSTITUCION_INFO.nombre}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          Sistema Oficial de Gobierno Electrónico v2.5
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
