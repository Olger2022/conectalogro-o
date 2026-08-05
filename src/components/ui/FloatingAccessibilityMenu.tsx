import React, { useState, useEffect } from 'react';
import {
  Fab,
  Tooltip,
  Popover,
  Paper,
  Box,
  Typography,
  Switch,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  Button,
} from '@mui/material';
import {
  Eye,
  X,
  ShieldCheck,
  Sun,
  Moon,
  Type,
  ZapOff,
  RotateCcw,
  Keyboard,
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

export const FloatingAccessibilityMenu: React.FC = () => {
  const {
    accessibility,
    toggleDarkMode,
    toggleHighContrast,
    toggleReducedMotion,
    setFontSizeMultiplier,
  } = useAppStore();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isOpen = Boolean(anchorEl);

  // Global Keyboard Listener for Alt + A (or Option + A on Mac)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Trigger on Alt + A or Alt + Shift + A
      if (
        (event.altKey && (event.key === 'a' || event.key === 'A' || event.code === 'KeyA')) ||
        (event.ctrlKey && event.shiftKey && (event.key === 'A' || event.key === 'a'))
      ) {
        event.preventDefault();
        setAnchorEl((prev) => {
          const nextState = prev ? null : (document.getElementById('floating-access-fab') as HTMLButtonElement);
          const isOpening = !prev;
          setToastMessage(
            isOpening
              ? 'Menú de accesibilidad activado (Alt + A)'
              : 'Menú de accesibilidad cerrado'
          );
          setToastOpen(true);
          return nextState;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Effect to apply reduced motion globally to the document
  useEffect(() => {
    const styleId = 'accessibility-reduced-motion-override';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (accessibility.reducedMotion) {
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.innerHTML = `
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        `;
        document.head.appendChild(styleElement);
      }
    } else {
      if (styleElement) {
        styleElement.remove();
      }
    }
  }, [accessibility.reducedMotion]);

  const handleFabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReset = () => {
    if (accessibility.darkMode) toggleDarkMode();
    if (accessibility.highContrast) toggleHighContrast();
    if (accessibility.reducedMotion) toggleReducedMotion();
    setFontSizeMultiplier(1);
    setToastMessage('Ajustes de accesibilidad restablecidos');
    setToastOpen(true);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Tooltip title="Accesibilidad e Inclusión (Atajo: Alt + A)" placement="left" arrow>
        <Fab
          id="floating-access-fab"
          color="primary"
          aria-label="Ajustes de Accesibilidad"
          onClick={handleFabClick}
          sx={{
            position: 'fixed',
            bottom: { xs: 20, sm: 28 },
            right: { xs: 20, sm: 28 },
            zIndex: 1300,
            boxShadow: '0 8px 24px rgba(0, 87, 184, 0.35)',
            border: accessibility.highContrast ? '2px solid #FFD700' : '2px solid #FFFFFF',
            bgcolor: accessibility.highContrast ? '#000000' : '#0057B8',
            color: accessibility.highContrast ? '#FFD700' : '#FFFFFF',
            '&:hover': {
              bgcolor: accessibility.highContrast ? '#121212' : '#003D82',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Eye size={22} />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.625rem',
                fontWeight: 800,
                lineHeight: 1,
                mt: 0.2,
                letterSpacing: 0.5,
              }}
            >
              Alt+A
            </Typography>
          </Box>
        </Fab>
      </Tooltip>

      {/* Popover Menu Panel */}
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            elevation: 12,
            sx: {
              width: 320,
              maxWidth: '92vw',
              borderRadius: 4,
              p: 2.5,
              bgcolor: accessibility.highContrast ? '#000000' : 'background.paper',
              color: accessibility.highContrast ? '#FFFFFF' : 'text.primary',
              border: accessibility.highContrast ? '2px solid #FFD700' : '1px solid rgba(226, 232, 240, 0.8)',
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Eye color={accessibility.highContrast ? '#FFD700' : '#0057B8'} size={22} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Accesibilidad
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Inclusión GAD Logroño
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip
              icon={<Keyboard size={12} />}
              label="Alt + A"
              size="small"
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }}
            />
            <IconButton size="small" onClick={handleClose} aria-label="Cerrar panel">
              <X size={18} />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 1. High Contrast */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldCheck size={18} color="#2E7D32" />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Alto Contraste
              </Typography>
            </Box>
            <Switch
              checked={accessibility.highContrast}
              onChange={toggleHighContrast}
              color="primary"
              size="small"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
            Fondo negro y texto amarillo de máxima visibilidad.
          </Typography>
        </Box>

        {/* 2. Motion Reduction */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ZapOff size={18} color="#D97706" />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Reducción de Movimiento
              </Typography>
            </Box>
            <Switch
              checked={Boolean(accessibility.reducedMotion)}
              onChange={toggleReducedMotion}
              color="warning"
              size="small"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
            Desactiva animaciones para evitar mareos o distracción.
          </Typography>
        </Box>

        {/* 3. Dark Mode */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {accessibility.darkMode ? <Moon size={18} color="#9C27B0" /> : <Sun size={18} color="#F9A825" />}
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Modo Oscuro
              </Typography>
            </Box>
            <Switch
              checked={accessibility.darkMode}
              onChange={toggleDarkMode}
              color="secondary"
              size="small"
            />
          </Box>
        </Box>

        {/* 4. Font Size Scale */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Type size={18} color="#0057B8" />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Tamaño de Texto
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={accessibility.fontSizeMultiplier}
            exclusive
            onChange={(_, val) => val && setFontSizeMultiplier(val)}
            fullWidth
            size="small"
            color="primary"
          >
            <ToggleButton value={1} sx={{ py: 0.5, fontWeight: 700, fontSize: '0.75rem' }}>
              100%
            </ToggleButton>
            <ToggleButton value={1.15} sx={{ py: 0.5, fontWeight: 700, fontSize: '0.75rem' }}>
              115%
            </ToggleButton>
            <ToggleButton value={1.3} sx={{ py: 0.5, fontWeight: 700, fontSize: '0.75rem' }}>
              130%
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<RotateCcw size={14} />}
            onClick={handleReset}
            fullWidth
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Restablecer
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleClose}
            fullWidth
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Listo
          </Button>
        </Box>
      </Popover>

      {/* Shortcut Toast Feedback */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="info"
          variant="filled"
          sx={{ width: '100%', fontWeight: 600, borderRadius: 3 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FloatingAccessibilityMenu;
