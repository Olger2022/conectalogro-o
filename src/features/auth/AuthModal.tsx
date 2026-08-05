import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  MenuItem,
  Alert,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  X,
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { PARROQUIAS_LOGRONO } from '../../constants';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useAppStore();
  const { login, register, loginWithGoogle, sendPasswordReset, isLoading } = useAuthStore();
  
  // 0 = Login, 1 = Register, 2 = Password Recovery
  const [tabIndex, setTabIndex] = useState<number>(0);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // Profile Registration Fields
  const [cedula, setCedula] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [parroquia, setParroquia] = useState(PARROQUIAS_LOGRONO[0]);

  // Feedback Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Validate Ecuadorian Cedula (10 digits)
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

  const resetFormState = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    resetFormState();
  };

  // Submit Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email || !password) {
      setErrorMsg('Por favor ingrese su correo electrónico y contraseña.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      setSuccessMsg('¡Inicio de sesión exitoso!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        resetFormState();
      }, 800);
    } else {
      setErrorMsg(res.message || 'Error al iniciar sesión en Firebase.');
    }
  };

  const handleGoogleLogin = async () => {
    resetFormState();
    const res = await loginWithGoogle();
    if (res.success) {
      setSuccessMsg('¡Sesión iniciada correctamente con Google!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        resetFormState();
      }, 800);
    } else {
      setErrorMsg(res.message || 'Error al conectar con Google.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!cedula || !nombres || !apellidos || !email || !password) {
      setErrorMsg('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    if (!validateEcuadorianCedula(cedula)) {
      setErrorMsg('La Cédula de Identidad ingresada no supera la validación ecuatoriana.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    const res = await register({
      cedula,
      nombres,
      apellidos,
      email,
      password,
      telefono,
      direccion,
      parroquia,
      role: 'ciudadano',
    });

    if (res.success) {
      setSuccessMsg('¡Cuenta creada y sincronizada exitosamente con la base de datos Firebase!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        resetFormState();
      }, 1400);
    } else {
      setErrorMsg(res.message || 'Error al registrar el usuario en Firebase.');
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!resetEmail) {
      setErrorMsg('Por favor ingrese su correo electrónico registrado.');
      return;
    }

    const res = await sendPasswordReset(resetEmail);
    if (res.success) {
      setSuccessMsg(res.message || 'Correo de recuperación enviado exitosamente.');
    } else {
      setErrorMsg(res.message || 'No se pudo enviar el correo de recuperación.');
    }
  };

  return (
    <Dialog
      open={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}
    >
      {/* Header Banner */}
      <Box sx={{ p: 2.5, bgcolor: '#0057B8', color: '#FFFFFF', position: 'relative' }}>
        <IconButton
          onClick={() => setIsAuthModalOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}
          aria-label="Cerrar ventana"
        >
          <X size={20} />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Building2 size={32} color="#FFFFFF" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              LOGROÑO CONECTA
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Servicio de Autenticación & Base de Datos Firebase
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Tabs (Login / Register) */}
      {tabIndex !== 2 && (
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          color="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Iniciar Sesión" sx={{ fontWeight: 700 }} />
          <Tab label="Registrar Cuenta" sx={{ fontWeight: 700 }} />
        </Tabs>
      )}

      {/* Recovery Title Bar when tabIndex === 2 */}
      {tabIndex === 2 && (
        <Box sx={{ p: 2, bgcolor: '#F1F5F9', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={() => { setTabIndex(0); resetFormState(); }}>
            <ArrowLeft size={18} color="#0057B8" />
          </IconButton>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
            Recuperación de Cuenta (Firebase Auth)
          </Typography>
        </Box>
      )}

      <DialogContent sx={{ pt: 2.5, pb: 3 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" icon={<CheckCircle2 size={20} />} sx={{ mb: 2, borderRadius: 2 }}>
            {successMsg}
          </Alert>
        )}

        {/* ================= TAB 0: LOGIN ================= */}
        {tabIndex === 0 && (
          <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Correo Electrónico"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@logrono.gob.ec"
              required
              slotProps={{
                input: {
                  startAdornment: <Mail size={18} color="#64748B" style={{ marginRight: 8 }} />,
                },
              }}
            />

            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: <Lock size={18} color="#64748B" style={{ marginRight: 8 }} />,
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
              <Button
                size="small"
                onClick={() => { setTabIndex(2); setResetEmail(email); resetFormState(); }}
                sx={{ textTransform: 'none', fontWeight: 600, color: '#0057B8' }}
              >
                ¿Olvidó su contraseña? Recuperar cuenta
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                height: 48,
                fontWeight: 800,
                bgcolor: '#0057B8',
                '&:hover': { bgcolor: '#00418A' },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar al Sistema'}
            </Button>

            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
                O acceda con
              </Typography>
            </Divider>

            <Button
              variant="outlined"
              size="large"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              sx={{
                height: 44,
                fontWeight: 700,
                borderColor: '#CBD5E1',
                color: '#334155',
                '&:hover': { bgcolor: '#F8FAFC' },
              }}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
              Continuar con Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                ¿No tiene cuenta aún?{' '}
                <Button
                  size="small"
                  onClick={() => { setTabIndex(1); resetFormState(); }}
                  sx={{ textTransform: 'none', fontWeight: 700, p: 0, minWidth: 'auto' }}
                >
                  Regístrese aquí
                </Button>
              </Typography>
            </Box>
          </Box>
        )}

        {/* ================= TAB 1: REGISTRO DE CUENTA ================= */}
        {tabIndex === 1 && (
          <Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              label="Cédula de Identidad (Ecuador) *"
              fullWidth
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="1400892341"
              required
              slotProps={{
                input: {
                  startAdornment: <ShieldCheck size={18} color="#64748B" style={{ marginRight: 8 }} />,
                },
              }}
              helperText="Verificación matemática oficial de la República del Ecuador"
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Nombres *"
                fullWidth
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required
              />
              <TextField
                label="Apellidos *"
                fullWidth
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
              />
            </Box>

            <TextField
              label="Correo Electrónico *"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              slotProps={{
                input: {
                  startAdornment: <Mail size={18} color="#64748B" style={{ marginRight: 8 }} />,
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Contraseña *"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                helperText="Mínimo 6 caracteres"
              />
              <TextField
                label="Confirmar *"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={Boolean(confirmPassword && password !== confirmPassword)}
                helperText={confirmPassword && password !== confirmPassword ? 'No coinciden' : ''}
              />
            </Box>

            <TextField
              label="Teléfono Celular"
              fullWidth
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="0987654321"
              slotProps={{
                input: {
                  startAdornment: <Phone size={18} color="#64748B" style={{ marginRight: 8 }} />,
                },
              }}
            />

            <TextField
              select
              label="Parroquia de Residencia *"
              fullWidth
              value={parroquia}
              onChange={(e) => setParroquia(e.target.value as any)}
            >
              {PARROQUIAS_LOGRONO.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Dirección de Domicilio"
              fullWidth
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle Central y Av. Morona"
              slotProps={{
                input: {
                  startAdornment: <MapPin size={18} color="#64748B" style={{ marginRight: 8 }} />,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 1,
                height: 48,
                fontWeight: 800,
                bgcolor: '#2E7D32',
                '&:hover': { bgcolor: '#1B5E20' },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Crear Mi Cuenta Ciudadana'}
            </Button>
          </Box>
        )}

        {/* ================= TAB 2: RECUPERACIÓN DE CUENTA ================= */}
        {tabIndex === 2 && (
          <Box component="form" onSubmit={handlePasswordResetSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                  color: '#0057B8',
                }}
              >
                <KeyRound size={28} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                ¿Olvidó su contraseña?
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                Ingrese el correo electrónico registrado en su cuenta de LOGROÑO CONECTA. Le enviaremos un enlace seguro de restablecimiento por medio de Firebase.
              </Typography>
            </Box>

            <TextField
              label="Correo Electrónico Registrado *"
              type="email"
              fullWidth
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="ejemplo@logrono.gob.ec"
              required
              slotProps={{
                input: {
                  startAdornment: <Mail size={18} color="#0057B8" style={{ marginRight: 8 }} />,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                height: 48,
                fontWeight: 800,
                bgcolor: '#0057B8',
                '&:hover': { bgcolor: '#00418A' },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Enlace de Recuperación'}
            </Button>

            <Button
              variant="text"
              onClick={() => { setTabIndex(0); resetFormState(); }}
              sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B' }}
            >
              Volver al Inicio de Sesión
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
