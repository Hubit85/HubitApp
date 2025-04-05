import React, { useState } from "react";
import Head from "next/head";
import { useLanguage } from "@/contexts/LanguageContext";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar as CalendarIcon, ClipboardList, Building, Wrench } from "lucide-react";

// Coordenadas de Vizcaya, España
const center = {
  lat: 43.2603,
  lng: -2.9334
};

// Coordenadas de Urbide 25, Mungia
const urbideMungia = {
  lat: 43.3553,
  lng: -2.8469
};

// Comunidades ficticias en Bilbao
const comunidades = [
  { id: 1, nombre: "Comunidad Abando", direccion: "Calle Ercilla 24, Bilbao", lat: 43.2610, lng: -2.9350 },
  { id: 2, nombre: "Comunidad Indautxu", direccion: "Alameda Urquijo 58, Bilbao", lat: 43.2630, lng: -2.9410 },
  { id: 3, nombre: "Comunidad Deusto", direccion: "Avenida Lehendakari Aguirre 33, Bilbao", lat: 43.2710, lng: -2.9390 },
  { id: 4, nombre: "Comunidad Santutxu", direccion: "Calle Santutxu 74, Bilbao", lat: 43.2580, lng: -2.9220 },
  { id: 5, nombre: "Comunidad Basurto", direccion: "Calle Autonomía 12, Bilbao", lat: 43.2550, lng: -2.9450 },
  { id: 6, nombre: "Comunidad Casco Viejo", direccion: "Calle Correo 8, Bilbao", lat: 43.2590, lng: -2.9240 },
  { id: 7, nombre: "Comunidad Rekalde", direccion: "Avenida Rekalde 61, Bilbao", lat: 43.2520, lng: -2.9380 },
  { id: 8, nombre: "Comunidad Miribilla", direccion: "Calle Miribilla 12, Bilbao", lat: 43.2540, lng: -2.9280 },
  { id: 9, nombre: "Comunidad Zorroza", direccion: "Carretera Zorroza-Castrejana 42, Bilbao", lat: 43.2720, lng: -2.9620 },
  { id: 10, nombre: "Urbide 25", direccion: "Urbide Kalea 25, Mungia", lat: 43.3553, lng: -2.8469 }
];

// Juntas de comunidades ficticias
const juntas = [
  { id: 1, comunidad: "Comunidad Abando", fecha: new Date(2025, 4, 15), hora: "19:00", asunto: "Junta Ordinaria Anual" },
  { id: 2, comunidad: "Comunidad Indautxu", fecha: new Date(2025, 4, 22), hora: "18:30", asunto: "Renovación Junta Directiva" },
  { id: 3, comunidad: "Comunidad Deusto", fecha: new Date(2025, 5, 5), hora: "20:00", asunto: "Obras Fachada" },
  { id: 4, comunidad: "Urbide 25", fecha: new Date(2025, 5, 12), hora: "19:30", asunto: "Presupuesto Anual" },
  { id: 5, comunidad: "Comunidad Santutxu", fecha: new Date(2025, 6, 3), hora: "18:00", asunto: "Instalación Ascensor" },
  { id: 6, comunidad: "Comunidad Basurto", fecha: new Date(2025, 6, 18), hora: "19:00", asunto: "Renovación Contrato Limpieza" }
];

// Temas pendientes ficticios
const temasPendientes = [
  { id: 1, comunidad: "Comunidad Abando", tipo: "Derrama", descripcion: "Derrama extraordinaria para reparación de tejado", importe: "5.000€", fecha: "15/05/2025" },
  { id: 2, comunidad: "Comunidad Indautxu", tipo: "Deuda", descripcion: "Deuda pendiente del 3ºB - 3 meses", importe: "450€", fecha: "Acumulada" },
  { id: 3, comunidad: "Comunidad Deusto", tipo: "Alzamiento", descripcion: "Alzamiento vivienda 5ºA por impago", estado: "En proceso", fecha: "10/06/2025" },
  { id: 4, comunidad: "Urbide 25", tipo: "Obra", descripcion: "Pendiente aprobación presupuesto pintura", importe: "12.500€", fecha: "Pendiente" },
  { id: 5, comunidad: "Comunidad Santutxu", tipo: "Inspección", descripcion: "Inspección técnica del edificio", estado: "Programada", fecha: "22/05/2025" },
  { id: 6, comunidad: "Comunidad Basurto", tipo: "Deuda", descripcion: "Deuda pendiente del 1ºC - 5 meses", importe: "750€", fecha: "Acumulada" },
  { id: 7, comunidad: "Comunidad Casco Viejo", tipo: "Avería", descripcion: "Reparación urgente de tuberías comunitarias", importe: "2.300€", fecha: "Inmediata" },
  { id: 8, comunidad: "Comunidad Rekalde", tipo: "Derrama", descripcion: "Derrama para instalación de placas solares", importe: "15.000€", fecha: "01/07/2025" }
];

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)"
};

export default function AdministradorFincas() {
  const { t } = useLanguage();
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("mapa");

  const handleMarkerClick = (id: number) => {
    setSelectedMarker(id);
  };

  const closeInfoWindow = () => {
    setSelectedMarker(null);
  };

  const filteredJuntas = juntas.filter(junta => {
    if (!date) return false;
    return junta.fecha.getMonth() === date.getMonth() && 
           junta.fecha.getFullYear() === date.getFullYear();
  });

  return (
    <>
      <Head>
        <title>Administrador de Fincas - Dashboard</title>
        <meta name="description" content="Dashboard para administradores de fincas" />
      </Head>

      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white shadow-lg">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <nav className="space-y-2">
              <Button 
                variant={activeTab === "mapa" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("mapa")}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Mapa
              </Button>
              <Button 
                variant={activeTab === "activos" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("activos")}
              >
                <Building className="mr-2 h-5 w-5" />
                Activos
              </Button>
              <Button 
                variant={activeTab === "servicios" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("servicios")}
              >
                <Wrench className="mr-2 h-5 w-5" />
                Servicios Actuales
              </Button>
              <Button 
                variant={activeTab === "juntas" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("juntas")}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                Juntas
              </Button>
              <Button 
                variant={activeTab === "pendientes" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("pendientes")}
              >
                <ClipboardList className="mr-2 h-5 w-5" />
                Temas Pendientes
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Administrador de Fincas</h1>

            {/* Mapa */}
            {activeTab === "mapa" && (
              <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='p-6'>
                  <h2 className='text-xl font-semibold mb-4'>Mapa de Comunidades</h2>
                  <div className='bg-gray-100 rounded-lg p-4 text-center'>
                    <p className='text-gray-600 mb-4'>Visualización del mapa de comunidades</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {comunidades.map((comunidad) => (
                        <Card key={comunidad.id} className='hover:bg-gray-50 transition-colors'>
                          <CardContent className='p-4'>
                            <div>
                              <h3 className='font-bold text-lg'>{comunidad.nombre}</h3>
                              <p className='text-gray-600'>{comunidad.direccion}</p>
                              <p className='text-sm text-gray-500 mt-2'>
                                Coordenadas: {comunidad.lat.toFixed(4)}, {comunidad.lng.toFixed(4)}
                              </p>
                            </div>
                            <Button variant='outline' size='sm' className='mt-2'>
                              Ver en mapa
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className='mt-6'>
                      <p className='text-sm text-gray-500'>
                        Nota: Para visualizar el mapa interactivo, es necesario configurar una clave de API de Google Maps válida.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activos */}
            {activeTab === "activos" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Comunidades Gestionadas</h2>
                <div className="grid gap-4">
                  {comunidades.map((comunidad) => (
                    <Card key={comunidad.id} className="hover:bg-gray-50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-lg">{comunidad.nombre}</h3>
                            <p className="text-gray-600">{comunidad.direccion}</p>
                          </div>
                          <Button variant="outline" size="sm">Ver detalles</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Servicios Actuales */}
            {activeTab === "servicios" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Servicios Actuales</h2>
                <p className="text-gray-600 mb-4">Redirigiendo al dashboard de proveedores de servicios...</p>
                <Button>Ir al Dashboard de Servicios</Button>
              </div>
            )}

            {/* Juntas */}
            {activeTab === "juntas" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Juntas de Comunidades</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="border rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      Juntas programadas: {date?.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </h3>
                    {filteredJuntas.length > 0 ? (
                      <div className="space-y-3">
                        {filteredJuntas.map((junta) => (
                          <Card key={junta.id}>
                            <CardContent className="p-4">
                              <p className="font-bold">{junta.comunidad}</p>
                              <p className="text-sm text-gray-600">
                                {junta.fecha.toLocaleDateString('es-ES')} - {junta.hora}
                              </p>
                              <p>{junta.asunto}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No hay juntas programadas para este mes.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Temas Pendientes */}
            {activeTab === "pendientes" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Temas Pendientes</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comunidad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importe/Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {temasPendientes.map((tema) => (
                        <tr key={tema.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{tema.comunidad}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tema.tipo === "Derrama" ? "bg-blue-100 text-blue-800" :
                              tema.tipo === "Deuda" ? "bg-red-100 text-red-800" :
                              tema.tipo === "Alzamiento" ? "bg-purple-100 text-purple-800" :
                              tema.tipo === "Obra" ? "bg-yellow-100 text-yellow-800" :
                              tema.tipo === "Inspección" ? "bg-green-100 text-green-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {tema.tipo}
                            </span>
                          </td>
                          <td className="px-6 py-4">{tema.descripcion}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{tema.importe || tema.estado}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{tema.fecha}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button variant="outline" size="sm">Gestionar</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}