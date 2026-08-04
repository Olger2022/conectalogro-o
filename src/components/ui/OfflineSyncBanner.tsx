import React, { useEffect } from 'react';
import { Box, Alert, Button, Typography, Chip } from '@mui/material';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Database } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { apiService } from '../../services/apiService';

export const OfflineSyncBanner: React.FC = () => {
  const { isOnline, setIsOnline, pendingSyncCount, setPendingSyncCount } = useAppStore();
  const [syncing, setSyncing] = React.useState(false);
  const [lastSyncSuccess, setLastSyncSuccess] = React.useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleManualSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    const count = await apiService.processSyncQueue();
    setSyncing(false);
    if (count > 0) {
      setLastSyncSuccess(true);
      setPendingSyncCount(0);
      setTimeout(() => setLastSyncSuccess(false), 4000);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {!isOnline && (
        <Alert
          severity="warning"
          icon={<WifiOff size={20} />}
          sx={{
            borderRadius: 0,
            bgcolor: '#FFF8E1',
            color: '#7A4F01',
            borderBottom: '1px solid #FFE082',
            py: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Modo Offline Activado (Sin Conexión a Internet).
              </Typography>
              <Typography variant="caption">
                Sus reportes y trámites se guardarán localmente en el dispositivo (IndexedDB) y se sincronizarán al recuperar señal.
              </Typography>
            </Box>
            <Chip
              label={`${pendingSyncCount} pendientes de sincronización`}
              size="small"
              color="warning"
              sx={{ fontWeight: 700 }}
            />
          </Box>
        </Alert>
      )}

      {isOnline && pendingSyncCount > 0 && (
        <Alert
          severity="info"
          icon={<Wifi size={20} />}
          sx={{
            borderRadius: 0,
            bgcolor: '#E3F2FD',
            color: '#0D47A1',
            py: 0.5,
          }}
          action={
            <Button
              color="primary"
              size="small"
              onClick={handleManualSync}
              disabled={syncing}
              startIcon={<RefreshCw size={14} className={syncing ? 'spin-animation' : ''} />}
            >
              Sincronizar Ahora
            </Button>
          }
        >
          Conexión restablecida. Hay {pendingSyncCount} registro(s) local(es) listo(s) para subir al servidor.
        </Alert>
      )}

      {lastSyncSuccess && (
        <Alert
          severity="success"
          icon={<CheckCircle2 size={20} />}
          sx={{ borderRadius: 0, py: 0.5 }}
        >
          ¡Sincronización completada exitosamente con la base de datos municipal Firebase (proyectoveterinario2026)!
        </Alert>
      )}
    </Box>
  );
};
