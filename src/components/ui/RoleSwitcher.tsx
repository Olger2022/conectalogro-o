import React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  User,
  Shield,
  HardHat,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserRole } from '../../types';

export const RoleSwitcher: React.FC = () => {
  const { user, switchUserRole } = useAuthStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectRole = (role: UserRole) => {
    switchUserRole(role);
    handleClose();
  };

  if (!user) return null;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Chip label="Administrador GAD" color="error" size="small" icon={<Shield size={14} />} />;
      case 'funcionario':
        return <Chip label="Funcionario Municipal" color="primary" size="small" icon={<HardHat size={14} />} />;
      default:
        return <Chip label="Ciudadano" color="success" size="small" icon={<User size={14} />} />;
    }
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        variant="outlined"
        size="small"
        sx={{
          borderColor: 'rgba(255, 255, 255, 0.4)',
          color: '#FFFFFF',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          px: 1.5,
          py: 0.5,
          textTransform: 'none',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            borderColor: '#FFFFFF',
          },
        }}
        endIcon={<ChevronDown size={16} />}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 26,
              height: 26,
              bgcolor: user.role === 'admin' ? '#B3261E' : user.role === 'funcionario' ? '#2E7D32' : '#0057B8',
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            {user.nombres.charAt(0)}
          </Avatar>
          <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.1, color: '#FFFFFF' }}>
              {user.nombres.split(' ')[0]} {user.apellidos.split(' ')[0]}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem' }}>
              {user.role === 'admin' ? 'Admin GAD' : user.role === 'funcionario' ? 'Funcionario' : 'Ciudadano'}
            </Typography>
          </Box>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1,
            width: 280,
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            MODO DE PRUEBA / ROL ACTIVO
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 0.5 }}>
            {user.nombres} {user.apellidos}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            C.I: {user.cedula}
          </Typography>
          <Box sx={{ mt: 1 }}>{getRoleBadge(user.role)}</Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, py: 0.5, fontWeight: 700, display: 'block' }}>
          CAMBIAR DE ROL PARA PRUEBAS:
        </Typography>

        <MenuItem
          onClick={() => handleSelectRole('ciudadano')}
          selected={user.role === 'ciudadano'}
          sx={{ borderRadius: 2, my: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <User size={18} color="#0057B8" />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Ciudadano</Typography>
                <Typography variant="caption" color="text.secondary">María Belén Espinoza</Typography>
              </Box>
            </Box>
            {user.role === 'ciudadano' && <CheckCircle size={16} color="#0057B8" />}
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() => handleSelectRole('funcionario')}
          selected={user.role === 'funcionario'}
          sx={{ borderRadius: 2, my: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <HardHat size={18} color="#2E7D32" />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Funcionario Municipal</Typography>
                <Typography variant="caption" color="text.secondary">Ing. Carlos Vargas (Agua/Obras)</Typography>
              </Box>
            </Box>
            {user.role === 'funcionario' && <CheckCircle size={16} color="#2E7D32" />}
          </Box>
        </MenuItem>

        <MenuItem
          onClick={() => handleSelectRole('admin')}
          selected={user.role === 'admin'}
          sx={{ borderRadius: 2, my: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Shield size={18} color="#B3261E" />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Administrador GAD</Typography>
                <Typography variant="caption" color="text.secondary">Lcdo. Franklin Chinkias</Typography>
              </Box>
            </Box>
            {user.role === 'admin' && <CheckCircle size={16} color="#B3261E" />}
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};
