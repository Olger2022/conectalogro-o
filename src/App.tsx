import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, useMediaQuery } from '@mui/material';
import { useAppStore } from './stores/useAppStore';
import { createLogronoTheme } from './theme/theme';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { OfflineSyncBanner } from './components/ui/OfflineSyncBanner';

import { DashboardView } from './features/dashboard/DashboardView';
import { IncidenciasView } from './features/incidencias/IncidenciasView';
import { NuevaIncidenciaModal } from './features/incidencias/NuevaIncidenciaModal';
import { IncidenciaDetailModal } from './features/incidencias/IncidenciaDetailModal';

import { TramitesCatalogView } from './features/tramites/TramitesCatalogView';
import { NuevoTramiteModal } from './features/tramites/NuevoTramiteModal';
import { TramiteDetailModal } from './features/tramites/TramiteDetailModal';

import { MapaLogronoView } from './features/mapas/MapaLogronoView';
import { AsistenteVirtualWidget } from './features/asistente/AsistenteVirtualWidget';
import { AdminPortalView } from './features/admin/AdminPortalView';
import { TransparenciaView } from './features/transparencia/TransparenciaView';

import { NotificacionesModal } from './features/notificaciones/NotificacionesModal';
import { AuthModal } from './features/auth/AuthModal';

import { Incidencia, Tramite, TramiteCatalogoItem } from './types';

export default function App() {
  const { activeModule, accessibility } = useAppStore();

  const theme = createLogronoTheme(
    accessibility.darkMode,
    accessibility.highContrast,
    accessibility.fontSizeMultiplier
  );

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [nuevaIncidenciaOpen, setNuevaIncidenciaOpen] = useState(false);
  const [selectedIncidencia, setSelectedIncidencia] = useState<Incidencia | null>(null);

  const [selectedCatalogItem, setSelectedCatalogItem] = useState<TramiteCatalogoItem | null>(null);
  const [nuevoTramiteOpen, setNuevoTramiteOpen] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenNuevaIncidencia={() => setNuevaIncidenciaOpen(true)}
            onOpenNuevoTramite={() => {
              setSelectedCatalogItem(null);
              setNuevoTramiteOpen(true);
            }}
            onSelectIncidencia={(inc) => setSelectedIncidencia(inc)}
            onSelectTramite={(trm) => setSelectedTramite(trm)}
          />
        );
      case 'incidencias':
        return (
          <IncidenciasView
            onOpenNuevaModal={() => setNuevaIncidenciaOpen(true)}
            onSelectIncidencia={(inc) => setSelectedIncidencia(inc)}
          />
        );
      case 'tramites':
        return (
          <TramitesCatalogView
            onSelectCatalogItem={(item) => {
              setSelectedCatalogItem(item);
              setNuevoTramiteOpen(true);
            }}
            onSelectTramite={(trm) => setSelectedTramite(trm)}
          />
        );
      case 'mapa':
        return (
          <MapaLogronoView
            onSelectIncidencia={(inc) => setSelectedIncidencia(inc)}
          />
        );
      case 'asistente':
        return <AsistenteVirtualWidget />;
      case 'admin':
        return <AdminPortalView />;
      case 'transparencia':
        return <TransparenciaView />;
      default:
        return (
          <DashboardView
            onOpenNuevaIncidencia={() => setNuevaIncidenciaOpen(true)}
            onOpenNuevoTramite={() => setNuevoTramiteOpen(true)}
            onSelectIncidencia={(inc) => setSelectedIncidencia(inc)}
            onSelectTramite={(trm) => setSelectedTramite(trm)}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Offline & Sync status alert */}
        <OfflineSyncBanner />

        {/* Top Institutional Header */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Layout Body with Sidebar + Content */}
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobile={isMobile}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3, md: 4 },
              width: { md: `calc(100% - 280px)` },
            }}
          >
            <Container maxWidth="xl" disableGutters>
              {renderActiveModule()}
            </Container>
          </Box>
        </Box>

        {/* Footer */}
        <Footer />

        {/* Global Modals & Drawers */}
        <NotificacionesModal />
        <AuthModal />

        <NuevaIncidenciaModal
          open={nuevaIncidenciaOpen}
          onClose={() => setNuevaIncidenciaOpen(false)}
          onSuccess={() => {}}
        />

        <IncidenciaDetailModal
          incidencia={selectedIncidencia}
          open={Boolean(selectedIncidencia)}
          onClose={() => setSelectedIncidencia(null)}
          onUpdate={() => {}}
        />

        {nuevoTramiteOpen && (
          <NuevoTramiteModal
            catalogItem={selectedCatalogItem}
            open={nuevoTramiteOpen}
            onClose={() => setNuevoTramiteOpen(false)}
            onSuccess={() => {}}
          />
        )}

        <TramiteDetailModal
          tramite={selectedTramite}
          open={Boolean(selectedTramite)}
          onClose={() => setSelectedTramite(null)}
          onUpdate={() => {}}
        />
      </Box>
    </ThemeProvider>
  );
}
