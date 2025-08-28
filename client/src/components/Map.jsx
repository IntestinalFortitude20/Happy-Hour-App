import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
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

// Create a custom red marker for search location
const searchLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMyMC4xNjQgMCAyNS41IDUuMzM2IDI1LjUgMTJDMjUuNSAxOC42NjQgMjAuMTY0IDI0IDEyLjUgMjRDNC44MzYgMjQgLTAuNSAxOC42NjQgLTAuNSAxMkMtMC41IDUuMzM2IDQuODM2IDAgMTIuNSAwWiIgZmlsbD0iI0ZGMDAwMCIvPgo8cGF0aCBkPSJNMTIuNSA0MUwxOC41IDI0SDYuNUwxMi41IDQxWiIgZmlsbD0iI0ZGMDAwMCIvPgo8Y2lyY2xlIGN4PSIxMi41IiBjeT0iMTIiIHI9IjYiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

function Map({ events, onMapClick, center = [39.8283, -98.5795], zoom = 4, searchLocation = null }) {
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (onMapClick) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      },
    });
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
        
        {/* Show search location marker if provided */}
        {searchLocation && (
          <Marker position={[searchLocation.lat, searchLocation.lng]} icon={searchLocationIcon}>
            <Popup>
              <div className="map-popup">
                <h4>Search Location</h4>
                <p>Events within 25 miles of this location</p>
                <p><strong>Lat:</strong> {searchLocation.lat.toFixed(4)}</p>
                <p><strong>Lng:</strong> {searchLocation.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        <MapClickHandler />
      </MapContainer>
    </div>
  );
}

export default Map;