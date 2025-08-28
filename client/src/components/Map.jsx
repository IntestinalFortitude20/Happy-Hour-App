import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Map.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Map({ events, onMapClick, center = [39.8283, -98.5795], zoom = 4 }) {
  const MapClickHandler = () => {
    const map = L.map; // Will be implemented with useMapEvents in a future update
    return null;
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {events.map((event) => {
          // Only show events that have location coordinates
          if (event.location && event.location.latitude && event.location.longitude) {
            return (
              <Marker 
                key={event._id} 
                position={[event.location.latitude, event.location.longitude]}
              >
                <Popup>
                  <div className="map-popup">
                    <h4>{event.name}</h4>
                    <p><strong>Type:</strong> {event.eventType}</p>
                    <p><strong>Address:</strong> {event.address}</p>
                    <p><strong>Days:</strong> {event.daysOfWeek && event.daysOfWeek.join(', ')}</p>
                    <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
                    {event.specials && (
                      <p><strong>Specials:</strong> {event.specials}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
        
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}

export default Map;