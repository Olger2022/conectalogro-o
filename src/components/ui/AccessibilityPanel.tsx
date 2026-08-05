import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Eye, Sun, Moon, Type, ShieldCheck, ZapOff } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

interface AccessibilityPanelProps {
  open: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ open, onClose }) => {
  const {
    accessibility,
    toggleDarkMode,
    toggleHighContrast,
    toggleReducedMotion,
    setFontSizeMultiplier,
  } = useAppStore();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Eye color="#0057B8" size={24} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Ajustes de Accesibilidad (WCAG 2.2 AA)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Inclusión Digital - GAD Municipal de Logroño
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        {/* High Contrast */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldCheck size={20} color="#2E7D32" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Modo Alto Contraste
              </Typography>
            </Box>
            <Switch checked={accessibility.highContrast} onChange={toggleHighContrast} color="primary" />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Fondo negro absoluto con texto amarillo y bordes de alta visibilidad para personas con baja visión.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Dark / Light theme */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {accessibility.darkMode ? <Moon size={20} color="#9C27B0" /> : <Sun size={20} color="#F9A825" />}
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Modo Oscuro / Claro
              </Typography>
            </Box>
            <Switch checked={accessibility.darkMode} onChange={toggleDarkMode} />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Alterna entre diseño claro institucional y tema oscuro para descanso visual.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Reduced Motion */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ZapOff size={20} color="#D97706" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Reducción de Movimiento
              </Typography>
            </Box>
            <Switch
              checked={Boolean(accessibility.reducedMotion)}
              onChange={toggleReducedMotion}
              color="warning"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Desactiva o minimiza animaciones y transiciones complejas para prevenir mareos y distracciones.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Font size multiplier */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Type size={20} color="#0057B8" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Tamaño de Texto Escalable
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
            <ToggleButton value={1}>Normal (100%)</ToggleButton>
            <ToggleButton value={1.15}>Mediano (115%)</ToggleButton>
            <ToggleButton value={1.3}>Grande (130%)</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} variant="contained" fullWidth sx={{ fontWeight: 700 }}>
          Aplicar y Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
