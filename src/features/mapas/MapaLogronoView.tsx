import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  TextField,
} from '@mui/material';
import { MapPin, Filter, AlertTriangle, Building2, Eye } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Incidencia, IncidenciaCategory } from '../../types';
import { CATEGORIAS_INCIDENCIA, INSTITUCION_INFO } from '../../constants';
import { apiService } from '../../services/apiService';
import { IncidenciaStatusChip } from '../../components/ui/StatusChips';

interface MapaLogronoViewProps {
  onSelectIncidencia: (inc: Incidencia) => void;
}

export const MapaLogronoView: React.FC<MapaLogronoViewProps> = ({ onSelectIncidencia }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>('TODAS');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const list = await apiService.getIncidencias();
    setIncidencias(list);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [INSTITUCION_INFO.coordenadasLogrono.lat, INSTITUCION_INFO.coordenadasLogrono.lng],
        14
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | GAD Logroño',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    renderMarkers();
  }, [incidencias, selectedCategoria]);

  const renderMarkers = () => {
    if (!mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = incidencias.filter(
      (inc) => selectedCategoria === 'TODAS' || inc.categoria === selectedCategoria
    );

    filtered.forEach((inc) => {
      // Color icon
      const iconHtml = `
        <div style="
          background-color: ${getCategoryColor(inc.categoria)};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid #FFFFFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 11px;
        ">
          !
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([inc.ubicacion.lat, inc.ubicacion.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #0057B8;">${inc.codigoTracking}</strong><br/>
            <strong style="font-size: 13px;">${inc.titulo}</strong><br/>
            <small style="color: #64748B;">${inc.ubicacion.parroquia} - ${inc.ubicacion.direccionAproximada}</small><br/>
            <span style="font-size: 11px; font-weight: bold; color: ${getCategoryColor(inc.categoria)};">
              ${inc.categoria} (${inc.estado})
            </span>
          </div>
        `);

      marker.on('click', () => {
        onSelectIncidencia(inc);
      });

      markersRef.current.push(marker);
    });
  };

  const getCategoryColor = (cat: IncidenciaCategory) => {
    switch (cat) {
      case 'Agua Potable':
      case 'Alcantarillado':
        return '#0057B8';
      case 'Alumbrado Público':
        return '#D97706';
      case 'Vialidad':
        return '#B3261E';
      case 'Parques':
      case 'Ambiente':
        return '#2E7D32';
      default:
        return '#7C3AED';
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <MapPin size={28} color="#0057B8" />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Mapa Georreferenciado del Cantón Logroño
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ubicación en tiempo real de incidencias reportadas en Logroño Centro, Yaupi y Shimpis.
            </Typography>
          </Box>
        </Box>

        <TextField
          select
          size="small"
          label="Filtrar Categoría en Mapa"
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          sx={{ width: 240 }}
        >
          <MenuItem value="TODAS">Todas las categorías</MenuItem>
          {CATEGORIAS_INCIDENCIA.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Map Canvas Frame */}
      <Paper elevation={2} sx={{ p: 0.5, borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box
          ref={mapContainerRef}
          sx={{
            width: '100%',
            height: 480,
            borderRadius: 2.5,
            zIndex: 1,
          }}
        />
      </Paper>

      {/* Incidents Legend and List underneath map */}
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
        Puntos de Incidencias en la Zona ({incidencias.length})
      </Typography>

      <Grid container spacing={2}>
        {incidencias.map((inc) => (
          <Grid key={inc.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              variant="outlined"
              onClick={() => onSelectIncidencia(inc)}
              sx={{
                p: 2,
                borderRadius: 2.5,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Chip
                  label={inc.categoria}
                  size="small"
                  sx={{ bgcolor: getCategoryColor(inc.categoria), color: '#FFF', fontWeight: 700, fontSize: '0.7rem' }}
                />
                <IncidenciaStatusChip status={inc.estado} />
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                {inc.titulo}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <MapPin size={14} color="#0057B8" />
                <Typography variant="caption">
                  {inc.ubicacion.parroquia} • {inc.ubicacion.direccionAproximada}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
