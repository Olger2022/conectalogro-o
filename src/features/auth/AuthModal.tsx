import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  MenuItem,
  Alert,
  IconButton,
} from '@mui/material';
import { X, Building2, User, Lock, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { PARROQUIAS_LOGRONO } from '../../constants';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useAppStore();
  const { login, register } = useAuthStore();
  const [tabIndex, setTabIndex] = useState(0);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cedula, setCedula] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [parroquia, setParroquia] = useState(PARROQUIAS_LOGRONO[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Validate Ecuadorian Cedula
  const validateEcuadorianCedula = (ced: string): boolean => {
    if (!/^\d{10}$/.test(ced)) return false;
    const prov = parseInt(ced.substring(0, 2), 10);
    if (prov < 1 || (prov > 24 && prov !== 30)) return false;

    const coef = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let val = parseInt(ced[i], 10) * coef[i];
      if (val >= 10) val -= 9;
      suma += val;
    }
    const digitoVerificador = (Math.ceil(suma / 10) * 10) - suma;
    return digitoVerificador === parseInt(ced[9], 10);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Por favor ingrese su correo y contraseña.');
      return;
    }
    const res = await login(email, password);
    if (res.success) {
      setIsAuthModalOpen(false);
    } else {
      setErrorMsg(res.message || 'Error al iniciar sesión.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!cedula || !nombres || !apellidos || !email || !password) {
      setErrorMsg('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (!validateEcuadorianCedula(cedula)) {
      setErrorMsg('La Cédula de Identidad ingresada no es válida para Ecuador.');
      return;
    }

    const res = await register({
      cedula,
      nombres,
      apellidos,
      email,
      telefono,
      direccion,
      parroquia,
      role: 'ciudadano',
    });

    if (res.success) {
      setSuccessMsg('¡Registro completado! Bienvenido a LOGROÑO CONECTA.');
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 1200);
    } else {
      setErrorMsg(res.message || 'Error al registrar usuario.');
    }
  };

  return (
    <Dialog
      open={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <Box sx={{ p: 2.5, bgcolor: '#0057B8', color: '#FFFFFF', position: 'relative' }}>
        <IconButton
          onClick={() => setIsAuthModalOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}
        >
          <X size={20} />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Building2 size={32} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              LOGROÑO CONECTA
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Acceso a Servicios del GAD Municipal
            </Typography>
          </Box>
        </Box>
      </Box>

      <Tabs
        value={tabIndex}
        onChange={(_, val) => setTabIndex(val)}
        variant="fullWidth"
        color="primary"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Iniciar Sesión" sx={{ fontWeight: 700 }} />
        <Tab label="Registrarme" sx={{ fontWeight: 700 }} />
      </Tabs>

      <DialogContent sx={{ pt: 2.5 }}>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

        {tabIndex === 0 ? (
          <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Correo Electrónico"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              InputProps={{
                startAdornment: <Mail size={18} color="#64748B" style={{ marginRight: 8 }} />,
              }}
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: <Lock size={18} color="#64748B" style={{ marginRight: 8 }} />,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 1, height: 48, fontWeight: 700 }}
            >
              Ingresar al Sistema
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="Cédula de Identidad (Ecuador)"
              fullWidth
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="1400892341"
              required
              helperText="Validación matemática oficial de cédula ecuatoriana"
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Nombres"
                fullWidth
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required
              />
              <TextField
                label="Apellidos"
                fullWidth
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
              />
            </Box>
            <TextField
              label="Correo Electrónico"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Teléfono Celular"
              fullWidth
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="0987654321"
            />
            <TextField
              select
              label="Parroquia de Residencia"
              fullWidth
              value={parroquia}
              onChange={(e) => setParroquia(e.target.value as any)}
            >
              {PARROQUIAS_LOGRONO.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 1, height: 48, fontWeight: 700 }}
            >
              Crear Mi Cuenta Ciudadana
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
