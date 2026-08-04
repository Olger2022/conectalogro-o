import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Bot, Send, User, Sparkles, HelpCircle, Building2 } from 'lucide-react';
import { INSTITUCION_INFO } from '../../constants';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AsistenteVirtualWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'bot',
      text: `¡Saludos! Soy **LogroñoBot**, el Asistente Virtual Oficial con Inteligencia Artificial del GAD Municipal del Cantón Logroño.\n\n¿En qué puedo orientarle hoy sobre trámites, requisitos o reportes de la ciudad?`,
      timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    '¿Qué necesito para el Certificado de No Adeudar?',
    '¿Cómo reportar una fuga de agua potable?',
    'Requisitos para Permiso de Construcción Menor',
    'Horarios de atención del Palacio Municipal',
  ];

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Disculpe, ocurrió una interrupción al consultar al servidor.',
        timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'El servicio municipal está operando en modo local. Puede consultar los requisitos en la sección de Trámites.',
          timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 4, maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          bgcolor: '#0057B8',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '14px',
              bgcolor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <Bot size={32} color="#0057B8" />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF' }}>
                LogroñoBot IA
              </Typography>
              <Chip label="Inteligencia Artificial GAD" size="small" sx={{ bgcolor: '#FFD700', color: '#000', fontWeight: 800 }} />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Asistente Virtual Municipal 24/7 para Orientación de Trámites y Servicios
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Suggested Chips */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
          PREGUNTAS FRECUENTES RÁPIDAS:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {quickQuestions.map((q, i) => (
            <Chip
              key={i}
              label={q}
              onClick={() => handleSendMessage(q)}
              variant="outlined"
              color="primary"
              clickable
              sx={{ fontWeight: 600, bgcolor: 'background.paper' }}
            />
          ))}
        </Box>
      </Box>

      {/* Chat Window Container */}
      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: 520,
        }}
      >
        {/* Messages List */}
        <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'action.hover' }}>
          {messages.map((m) => (
            <Box
              key={m.id}
              sx={{
                display: 'flex',
                justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: 1.5,
              }}
            >
              {m.sender === 'bot' && (
                <Avatar sx={{ bgcolor: '#0057B8', width: 36, height: 36 }}>
                  <Bot size={20} />
                </Avatar>
              )}

              <Box sx={{ maxWidth: '80%' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: m.sender === 'user' ? '#0057B8' : '#FFFFFF',
                    color: m.sender === 'user' ? '#FFFFFF' : 'text.primary',
                    borderTopRightRadius: m.sender === 'user' ? 2 : 12,
                    borderTopLeftRadius: m.sender === 'bot' ? 2 : 12,
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.92rem' }}>
                    {m.text}
                  </Typography>
                </Paper>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ display: 'block', mt: 0.5, textAlign: m.sender === 'user' ? 'right' : 'left', px: 0.5 }}
                >
                  {m.timestamp}
                </Typography>
              </Box>

              {m.sender === 'user' && (
                <Avatar sx={{ bgcolor: '#2E7D32', width: 36, height: 36 }}>
                  <User size={20} />
                </Avatar>
              )}
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: '#0057B8', width: 36, height: 36 }}>
                <Bot size={20} />
              </Avatar>
              <Paper sx={{ p: 1.5, px: 2.5, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    LogroñoBot IA procesando su consulta...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>

        <Divider />

        {/* Input Bar */}
        <Box sx={{ p: 2, bgcolor: 'background.paper', display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Escriba su consulta o duda municipal..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            size="medium"
          />
          <Button
            variant="contained"
            disabled={loading || !input.trim()}
            onClick={() => handleSendMessage()}
            sx={{ height: 50, px: 3, fontWeight: 700 }}
            endIcon={<Send size={18} />}
          >
            Consultar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
