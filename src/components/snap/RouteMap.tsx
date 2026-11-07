import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import type { LatLng } from "@/lib/planner";

export type MapPoint = { pos: LatLng; label: string; kind: "home" | "store" | "extra"; n?: number };

function pin(text: string, cls: string) {
  return L.divIcon({
    className: "",
    html: `<div class="${cls}" style="width:32px;height:32px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-weight:700;border:3px solid white;box-shadow:0 2px 6px rgb(0 0 0 / .3)">${text}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function RouteMap({ points }: { points: MapPoint[] }) {
  const bounds = L.latLngBounds(points.map((p) => p.pos)).pad(0.25);
  const route = points.filter((p) => p.kind !== "extra").map((p) => p.pos);
  const home = points.find((p) => p.kind === "home");
  if (home) route.push(home.pos);
  return (
    <MapContainer bounds={bounds} scrollWheelZoom={false} className="h-72 w-full rounded-2xl" style={{ zIndex: 0 }}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={route} pathOptions={{ color: "var(--primary)", weight: 4, dashArray: "6 8" }} />
      {points.map((p, i) =>
        p.kind === "extra" ? (
          <CircleMarker key={i} center={p.pos} radius={8} pathOptions={{ color: "var(--deal)", fillColor: "var(--gold-accent)", fillOpacity: 0.9 }}>
            <Popup>{p.label}</Popup>
          </CircleMarker>
        ) : (
          <Marker key={i} position={p.pos} icon={pin(p.kind === "home" ? "&#8962;" : String(p.n), p.kind === "home" ? "bg-ink text-ink-foreground" : "bg-primary text-primary-foreground")}>
            <Popup>{p.label}</Popup>
          </Marker>
        ),
      )}
    </MapContainer>
  );
}
