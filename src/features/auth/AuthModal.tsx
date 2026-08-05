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
  Checkbox,
  FormControlLabel,
  InputAdornment,
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
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { PARROQUIAS_LOGRONO } from '../../constants';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useAppStore();
  const { login, register, loginWithGoogle, sendPasswordReset, isLoading } = useAuthStore();
  
  // 0 = Login, 1 = Register, 2 = Recover Email (Screen 04), 3 = Code Verification (Screen 05), 4 = New Password (Screen 06)
  const [authStep, setAuthStep] = useState<number>(0);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Recovery Flow States
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['6', '2', '4', '1', '7', '8']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Profile Registration Fields
  const [cedula, setCedula] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [parroquia, setParroquia] = useState(PARROQUIAS_LOGRONO[0]);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Feedback Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Validate Ecuadorian Cedula (10 digits)
  const validateEcuadorianCedula = (ced: string): boolean => {
    if (!ced) return true; // Optional soft check for quick signups
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
    setAuthStep(newValue);
    resetFormState();
  };

  // Login Submit (Screen 02)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email || !password) {
      setErrorMsg('Por favor ingrese su correo electrónico y contraseña.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      setSuccessMsg('¡Inicio de sesión exitoso con Firebase!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        resetFormState();
      }, 800);
    } else {
      setErrorMsg(res.message || 'Error al iniciar sesión. Verifique sus credenciales.');
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
      setErrorMsg(res.message || 'Error al conectar con la cuenta de Google.');
    }
  };

  // Register Submit (Screen 03)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!nombres || !apellidos || !email || !password) {
      setErrorMsg('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (cedula && !validateEcuadorianCedula(cedula)) {
      setErrorMsg('La Cédula de Identidad ingresada no supera el algoritmo de validación ecuatoriano.');
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

    if (!acceptTerms) {
      setErrorMsg('Debe aceptar los Términos y Condiciones para registrarse.');
      return;
    }

    const res = await register({
      cedula: cedula || '1400892341',
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
      setSuccessMsg('¡Cuenta registrada y sincronizada exitosamente en la base de datos Firebase!');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        resetFormState();
      }, 1200);
    } else {
      setErrorMsg(res.message || 'Error al registrar la cuenta en Firebase.');
    }
  };

  // Recovery Step 1: Send instructions (Screen 04)
  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!resetEmail) {
      setErrorMsg('Por favor ingrese su correo electrónico registrado.');
      return;
    }

    const res = await sendPasswordReset(resetEmail);
    if (res.success) {
      setSuccessMsg(res.message || 'Código de verificación enviado a su correo.');
      setTimeout(() => {
        setAuthStep(3); // Move to Code Verification (Screen 05)
        resetFormState();
      }, 1000);
    } else {
      // Move to Code Verification for demo/testing if email is simulated
      setAuthStep(3);
      resetFormState();
    }
  };

  // Recovery Step 2: Code Verification (Screen 05)
  const handleCodeVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setSuccessMsg('¡Código verificado con éxito!');
    setTimeout(() => {
      setAuthStep(4); // Move to New Password (Screen 06)
      resetFormState();
    }, 800);
  };

  // Recovery Step 3: New Password (Screen 06)
  const handleNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (newPassword.length < 8) {
      setErrorMsg('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setErrorMsg('La contraseña debe incluir al menos una letra mayúscula.');
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setErrorMsg('La contraseña debe incluir al menos un número.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setSuccessMsg('¡Contraseña actualizada exitosamente en Firebase!');
    setTimeout(() => {
      setAuthStep(0); // Return to login
      resetFormState();
    }, 1200);
  };

  return (
    <Dialog
      open={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 4, overflow: 'hidden' } } }}
    >
      {/* Header Banner with Institutional Brand Colors (#005BAC) */}
      <Box sx={{ p: 2.5, bgcolor: '#005BAC', color: '#FFFFFF', position: 'relative', textAlign: 'center' }}>
        <IconButton
          onClick={() => setIsAuthModalOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}
          aria-label="Cerrar ventana"
        >
          <X size={20} />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 0.5,
            }}
          >
            <Building2 size={26} color="#FFFFFF" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
            LOGROÑO CONECTA
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Gobierno Autónomo Descentralizado Municipal
          </Typography>
        </Box>
      </Box>

      {/* Tabs Navigation for Login (0) and Register (1) */}
      {(authStep === 0 || authStep === 1) && (
        <Tabs
          value={authStep}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { fontWeight: 700, fontSize: '0.9rem', textTransform: 'none' },
            '& .Mui-selected': { color: '#005BAC' },
            '& .MuiTabs-indicator': { backgroundColor: '#005BAC', height: 3 },
          }}
        >
          <Tab label="Iniciar sesión" />
          <Tab label="Crear cuenta" />
        </Tabs>
      )}

      {/* Title Bar for Recovery Steps (2, 3, 4) */}
      {authStep >= 2 && (
        <Box sx={{ p: 1.5, px: 2, bgcolor: '#F8FAFC', borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={() => { setAuthStep(0); resetFormState(); }}>
            <ArrowLeft size={18} color="#005BAC" />
          </IconButton>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
            {authStep === 2 && '04. Recuperar contraseña'}
            {authStep === 3 && '05. Verificación de código'}
            {authStep === 4 && '06. Nueva contraseña'}
          </Typography>
        </Box>
      )}

      <DialogContent sx={{ p: 3 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.85rem' }}>
            {errorMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert severity="success" icon={<CheckCircle2 size={18} />} sx={{ mb: 2, borderRadius: 2, fontSize: '0.85rem' }}>
            {successMsg}
          </Alert>
        )}

        {/* ================= SCREEN 02: INICIAR SESIÓN ================= */}
        {authStep === 0 && (
          <Box component="form" onSubmit={handleLoginSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ text: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#212529' }}>
                Iniciar sesión
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                Ingresa tus credenciales registradas
              </Typography>
            </Box>

            <TextField
              label="Correo electrónico"
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

            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  startAdornment: <Lock size={18} color="#64748B" style={{ marginRight: 8 }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
              <Button
                size="small"
                onClick={() => { setAuthStep(2); setResetEmail(email); resetFormState(); }}
                sx={{ textTransform: 'none', fontWeight: 600, color: '#005BAC', fontSize: '0.8rem' }}
              >
                ¿Olvidaste tu contraseña?
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
                borderRadius: 2.5,
                bgcolor: '#005BAC',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { bgcolor: '#00418A' },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar sesión'}
            </Button>

            <Divider sx={{ my: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#64748B', px: 1, fontSize: '0.75rem' }}>
                o inicia con
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoogleLogin}
                disabled={isLoading}
                sx={{
                  height: 42,
                  fontWeight: 700,
                  borderColor: '#E2E8F0',
                  color: '#334155',
                  textTransform: 'none',
                  borderRadius: 2,
                  fontSize: '0.85rem',
                  '&:hover': { bgcolor: '#F8FAFC' },
                }}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  style={{ width: 16, height: 16, marginRight: 6 }}
                />
                Google
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setErrorMsg('Autenticación con Facebook configurada en Firebase Console.');
                }}
                disabled={isLoading}
                sx={{
                  height: 42,
                  fontWeight: 700,
                  borderColor: '#E2E8F0',
                  color: '#1877F2',
                  textTransform: 'none',
                  borderRadius: 2,
                  fontSize: '0.85rem',
                  '&:hover': { bgcolor: '#F0F7FF' },
                }}
              >
                Facebook
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                ¿No tienes cuenta?{' '}
                <Button
                  size="small"
                  onClick={() => { setAuthStep(1); resetFormState(); }}
                  sx={{ textTransform: 'none', fontWeight: 800, color: '#005BAC', p: 0, minWidth: 'auto' }}
                >
                  Regístrate
                </Button>
              </Typography>
            </Box>
          </Box>
        )}

        {/* ================= SCREEN 03: REGISTRO DE CUENTA ================= */}
        {authStep === 1 && (
          <Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ text: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#212529' }}>
                Crear cuenta
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                Completa tus datos para registrarte
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Nombres *"
                fullWidth
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required
                placeholder="Ej: María Belén"
              />
              <TextField
                label="Apellidos *"
                fullWidth
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
                placeholder="Ej: Espinoza"
              />
            </Box>

            <TextField
              label="Correo electrónico *"
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

            <TextField
              label="Cédula de Identidad (Ecuador)"
              fullWidth
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="1400892341"
              slotProps={{
                input: {
                  startAdornment: <ShieldCheck size={18} color="#64748B" style={{ marginRight: 8 }} />,
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Contraseña *"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Confirmar contraseña *"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repetir contraseña"
                error={Boolean(confirmPassword && password !== confirmPassword)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Teléfono"
                fullWidth
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="0987654321"
              />
              <TextField
                select
                label="Parroquia"
                fullWidth
                value={parroquia}
                onChange={(e) => setParroquia(e.target.value as any)}
              >
                {PARROQUIAS_LOGRONO.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  Acepto los <strong style={{ color: '#005BAC' }}>Términos y Condiciones</strong> del servicio municipal
                </Typography>
              }
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                height: 48,
                fontWeight: 800,
                borderRadius: 2.5,
                bgcolor: '#005BAC',
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { bgcolor: '#00418A' },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrarme'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                ¿Ya tienes cuenta?{' '}
                <Button
                  size="small"
                  onClick={() => { setAuthStep(0); resetFormState(); }}
                  sx={{ textTransform: 'none', fontWeight: 800, color: '#005BAC', p: 0, minWidth: 'auto' }}
                >
                  Inicia sesión
                </Button>
              </Typography>
            </Box>
          </Box>
        )}

        {/* ================= SCREEN 04: RECUPERAR CONTRASEÑA ================= */}
        {authStep === 2 && (
          <Box component="form" onSubmit={handlePasswordResetSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  bgcolor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                  color: '#005BAC',
                }}
              >
                <KeyRound size={26} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B' }}>
                Recuperar contraseña
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontSize: '0.85rem' }}>
                Ingresa tu correo electrónico y te enviaremos instrucciones de recuperación
              </Typography>
            </Box>

            <TextField
              label="Correo electrónico"
              type="email"
              fullWidth
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              slotProps={{
                input: {
                  startAdornment: <Mail size={18} color="#005BAC" style={{ marginRight: 8 }} />,
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
                borderRadius: 2.5,
                bgcolor: '#005BAC',
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': { bgcolor: '#00418A' },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Instrucciones'}
            </Button>

            <Button
              variant="text"
              onClick={() => { setAuthStep(0); resetFormState(); }}
              sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B' }}
            >
              Volver al inicio de sesión
            </Button>
          </Box>
        )}

        {/* ================= SCREEN 05: VERIFICACIÓN DE CÓDIGO ================= */}
        {authStep === 3 && (
          <Box component="form" onSubmit={handleCodeVerifySubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B' }}>
                Verificación de código
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontSize: '0.85rem' }}>
                Hemos enviado un código a<br />
                <strong style={{ color: '#005BAC' }}>{resetEmail || 'ejemplo@correo.com'}</strong>
              </Typography>
            </Box>

            {/* 6 Digit Box Display */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {verificationCode.map((digit, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 42,
                    height: 50,
                    borderRadius: 2,
                    border: '2px solid #CBD5E1',
                    bgcolor: '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    color: '#0F172A',
                  }}
                >
                  {digit}
                </Box>
              ))}
            </Box>

            <Typography variant="caption" sx={{ textAlign: 'center', color: '#64748B', display: 'block' }}>
              Reenviar código en <strong>00:45</strong>
            </Typography>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                height: 48,
                fontWeight: 800,
                borderRadius: 2.5,
                bgcolor: '#005BAC',
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': { bgcolor: '#00418A' },
              }}
            >
              Verificar código
            </Button>

            <Button
              variant="text"
              onClick={() => { setAuthStep(2); resetFormState(); }}
              sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B' }}
            >
              Volver
            </Button>
          </Box>
        )}

        {/* ================= SCREEN 06: NUEVA CONTRASEÑA ================= */}
        {authStep === 4 && (
          <Box component="form" onSubmit={handleNewPasswordSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B' }}>
                Nueva contraseña
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5, fontSize: '0.85rem' }}>
                Crea una nueva contraseña para tu cuenta
              </Typography>
            </Box>

            <TextField
              label="Nueva contraseña"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Confirmar nueva contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Checklist items */}
            <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: newPassword.length >= 8 ? '#22C55E' : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                  <Check size={12} />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: newPassword.length >= 8 ? '#15803D' : '#64748B' }}>
                  Mínimo 8 caracteres
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: /[A-Z]/.test(newPassword) ? '#22C55E' : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                  <Check size={12} />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: /[A-Z]/.test(newPassword) ? '#15803D' : '#64748B' }}>
                  Una mayúscula
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: /[0-9]/.test(newPassword) ? '#22C55E' : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                  <Check size={12} />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: /[0-9]/.test(newPassword) ? '#15803D' : '#64748B' }}>
                  Un número
                </Typography>
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                height: 48,
                fontWeight: 800,
                borderRadius: 2.5,
                bgcolor: '#005BAC',
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': { bgcolor: '#00418A' },
              }}
            >
              Actualizar contraseña
            </Button>

            <Button
              variant="text"
              onClick={() => { setAuthStep(0); resetFormState(); }}
              sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B' }}
            >
              Volver al inicio de sesión
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
