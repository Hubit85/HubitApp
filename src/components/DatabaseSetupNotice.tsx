
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Database, ExternalLink, Copy } from "lucide-react";
import { useState } from "react";

export default function DatabaseSetupNotice() {
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- Run this in your Supabase SQL Editor
-- Go to: https://djkrzbmgzfwagmripozi.supabase.co

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    user_type TEXT NOT NULL CHECK (user_type IN ('particular', 'community_member', 'service_provider', 'property_administrator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              Base de datos no configurada
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Configuración requerida
              </Badge>
            </CardTitle>
            <CardDescription className="text-amber-700">
              Para usar todas las funcionalidades, configura las tablas en Supabase
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-white/70 p-4 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Pasos para configurar:
          </h3>
          
          <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside">
            <li>Ve a tu proyecto de Supabase</li>
            <li>Abre el <strong>SQL Editor</strong></li>
            <li>Copia y pega el script SQL</li>
            <li>Haz clic en <strong>Run</strong> para ejecutar</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => window.open('https://djkrzbmgzfwagmripozi.supabase.co', '_blank')}
            className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir Supabase
          </Button>
          
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {copied ? "¡Copiado!" : "Copiar Script SQL"}
          </Button>
        </div>

        <details className="bg-neutral-50 border border-neutral-200 rounded-lg">
          <summary className="p-3 cursor-pointer font-medium text-neutral-700 hover:bg-neutral-100">
            Ver script SQL completo
          </summary>
          <pre className="p-4 text-xs bg-neutral-900 text-neutral-100 overflow-x-auto rounded-b-lg">
            <code>{sqlScript}</code>
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}
