import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Badge,
} from '@mui/material';
import { X, Bell, AlertTriangle, FileText, CheckCircle, Info } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { apiService } from '../../services/apiService';
import { Notificacion } from '../../types';

export const NotificacionesModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, setActiveModule } = useAppStore();
  const { user } = useAuthStore();
  const [notifs, setNotifs] = useState<Notificacion[]>([]);

  useEffect(() => {
    if (user) {
      loadNotifs();
    }
  }, [user, isNotificationsOpen]);

  const loadNotifs = async () => {
    if (user) {
      const list = await apiService.getNotifications(user.id);
      setNotifs(list);
    }
  };

  const handleMarkRead = async (id: string) => {
    await apiService.markNotificationRead(id);
    loadNotifs();
  };

  const handleSelectNotif = (n: Notificacion) => {
    handleMarkRead(n.id);
    if (n.tipo === 'incidencia') {
      setActiveModule('incidencias');
    } else if (n.tipo === 'tramite') {
      setActiveModule('tramites');
    }
    setIsNotificationsOpen(false);
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'incidencia':
        return <AlertTriangle size={20} color="#F9A825" />;
      case 'tramite':
        return <FileText size={20} color="#0057B8" />;
      default:
        return <Info size={20} color="#2E7D32" />;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      slotProps={{
        paper: {
          sx: { width: { xs: '100%', sm: 380 }, p: 0 },
        },
      }}
    >
      {/* Drawer Header */}
      <Box sx={{ p: 2, bgcolor: '#0057B8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Bell size={22} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            Notificaciones Municipales
          </Typography>
        </Box>
        <IconButton onClick={() => setIsNotificationsOpen(false)} sx={{ color: '#FFFFFF' }}>
          <X size={20} />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {notifs.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircle size={48} color="#2E7D32" style={{ marginBottom: 12 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Sin notificaciones pendientes
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Se le notificará cuando cambie el estado de sus trámites o reportes.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifs.map((n) => (
              <React.Fragment key={n.id}>
                <ListItemButton
                  onClick={() => handleSelectNotif(n)}
                  sx={{
                    bgcolor: n.leida ? 'transparent' : 'rgba(0, 87, 184, 0.05)',
                    py: 1.8,
                    px: 2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{getIcon(n.tipo)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: n.leida ? 600 : 800, fontSize: '0.88rem' }}>
                          {n.titulo}
                        </Typography>
                        {!n.leida && <Badge color="error" variant="dot" />}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
                          {n.mensaje}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                          {new Date(n.createdAt).toLocaleString('es-EC')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};
