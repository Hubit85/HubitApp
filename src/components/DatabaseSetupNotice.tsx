
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Database, ExternalLink, Copy, CheckCircle, Shield, Zap } from "lucide-react";
import { useState } from "react";

export default function DatabaseSetupNotice() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      const response = await fetch('/docs/database-setup.sql');
      const sqlScript = await response.text();
      await navigator.clipboard.writeText(sqlScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback - copy a basic version
      const basicScript = `-- HuBiT Database Setup Script
-- Go to your Supabase project: https://djkrzbmgzfwagmripozi.supabase.co
-- Open SQL Editor and run this complete script

-- Please visit /docs/database-setup.sql for the complete setup script`;
      
      try {
        await navigator.clipboard.writeText(basicScript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr);
      }
    }
  };

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-amber-900 flex items-center gap-3 text-xl">
              🚧 Base de datos no configurada
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
                Configuración requerida
              </Badge>
            </CardTitle>
            <CardDescription className="text-amber-700 text-base mt-1">
              Para usar todas las funcionalidades de HuBiT, necesitas configurar las tablas en Supabase
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* What will be created */}
        <div className="bg-white/80 p-5 rounded-xl border border-amber-200 shadow-sm">
          <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            ¿Qué se va a crear?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-amber-800 flex items-center gap-2">
                📊 8 Tablas principales
              </h4>
              <ul className="text-sm text-amber-700 space-y-1 ml-6">
                <li>• profiles (perfiles de usuario)</li>
                <li>• properties (propiedades)</li>
                <li>• budget_requests (solicitudes)</li>
                <li>• service_providers (proveedores)</li>
                <li>• quotes (presupuestos)</li>
                <li>• ratings (valoraciones)</li>
                <li>• contracts (contratos)</li>
                <li>• notifications (notificaciones)</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-amber-800 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Seguridad y rendimiento
              </h4>
              <ul className="text-sm text-amber-700 space-y-1 ml-6">
                <li>• Row Level Security (RLS)</li>
                <li>• Políticas de seguridad</li>
                <li>• Índices de rendimiento</li>
                <li>• Triggers automáticos</li>
                <li>• Funciones auxiliares</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div className="bg-white/80 p-5 rounded-xl border border-amber-200 shadow-sm">
          <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            Pasos para configurar (5 minutos):
          </h3>
          
          <ol className="space-y-3">
            {[
              {
                step: 1,
                title: "Abre tu proyecto Supabase",
                description: "Ve a tu dashboard de Supabase",
                icon: "🌐"
              },
              {
                step: 2,
                title: "Accede al SQL Editor",
                description: "En la barra lateral izquierda, busca 'SQL Editor'",
                icon: "📝"
              },
              {
                step: 3,
                title: "Copia el script completo",
                description: "Haz clic en 'Copiar Script SQL Completo' abajo",
                icon: "📋"
              },
              {
                step: 4,
                title: "Pega y ejecuta",
                description: "Pega el script en el editor y haz clic en 'Run'",
                icon: "▶️"
              },
              {
                step: 5,
                title: "¡Listo! 🎉",
                description: "Recarga esta página para usar todas las funciones",
                icon: "✅"
              }
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-sm">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-amber-900 mb-1">
                    {step.icon} {step.title}
                  </div>
                  <div className="text-amber-700">
                    {step.description}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => window.open('https://djkrzbmgzfwagmripozi.supabase.co', '_blank')}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 flex-1"
          >
            <ExternalLink className="h-4 w-4" />
            🚀 Abrir Supabase Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 flex-1"
          >
            <Copy className="h-4 w-4" />
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                ¡Copiado! ✨
              </>
            ) : (
              "📋 Copiar Script SQL Completo"
            )}
          </Button>
        </div>

        {/* Additional help */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            💡 Ayuda adicional
          </h4>
          <p className="text-blue-800 text-sm leading-relaxed">
            Si tienes problemas con la configuración, puedes encontrar el archivo completo del script en{" "}
            <code className="bg-blue-100 px-2 py-1 rounded text-xs font-mono">docs/database-setup.sql</code>{" "}
            en tu proyecto, o contacta con soporte técnico de HuBiT.
          </p>
        </div>

        {/* Preview of benefits */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
          <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
            🌟 Después de la configuración podrás:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "✅ Gestionar propiedades",
              "✅ Crear solicitudes de presupuesto",
              "✅ Recibir y evaluar ofertas",
              "✅ Sistema de valoraciones",
              "✅ Gestión completa de contratos",
              "✅ Notificaciones en tiempo real"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-emerald-800 text-sm">
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
