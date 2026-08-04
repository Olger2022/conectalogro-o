import React from 'react';
import { Chip } from '@mui/material';
import { IncidenciaStatus, IncidenciaPriority, TramiteStatus } from '../../types';

export const IncidenciaStatusChip: React.FC<{ status: IncidenciaStatus }> = ({ status }) => {
  let color: 'default' | 'info' | 'warning' | 'primary' | 'success' | 'secondary' | 'error' = 'default';
  
  switch (status) {
    case 'Registrado':
      color = 'info';
      break;
    case 'Recibido':
      color = 'primary';
      break;
    case 'En revisión':
      color = 'warning';
      break;
    case 'Asignado':
      color = 'secondary';
      break;
    case 'En proceso':
      color = 'warning';
      break;
    case 'Resuelto':
      color = 'success';
      break;
    case 'Cerrado':
      color = 'default';
      break;
  }

  return (
    <Chip
      label={status}
      color={color}
      size="small"
      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
    />
  );
};

export const TramiteStatusChip: React.FC<{ status: TramiteStatus }> = ({ status }) => {
  let color: 'default' | 'info' | 'warning' | 'primary' | 'success' | 'error' = 'default';

  switch (status) {
    case 'Registrado':
      color = 'info';
      break;
    case 'En revisión':
      color = 'warning';
      break;
    case 'En inspección':
      color = 'primary';
      break;
    case 'Requiere corrección':
      color = 'warning';
      break;
    case 'Aprobado':
      color = 'success';
      break;
    case 'Rechazado':
      color = 'error';
      break;
    case 'Finalizado':
      color = 'default';
      break;
  }

  return (
    <Chip
      label={status}
      color={color}
      size="small"
      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
    />
  );
};

export const PriorityChip: React.FC<{ priority: IncidenciaPriority }> = ({ priority }) => {
  let color: 'default' | 'info' | 'warning' | 'error' = 'info';

  switch (priority) {
    case 'Baja':
      color = 'info';
      break;
    case 'Media':
      color = 'info';
      break;
    case 'Alta':
      color = 'warning';
      break;
    case 'Urgente':
      color = 'error';
      break;
  }

  return (
    <Chip
      label={priority}
      color={color}
      size="small"
      variant={priority === 'Urgente' ? 'filled' : 'outlined'}
      sx={{ fontWeight: 700, fontSize: '0.7rem' }}
    />
  );
};
