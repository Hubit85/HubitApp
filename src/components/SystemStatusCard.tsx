import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Loader2, Database, Users, Settings, Server } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SupabaseStatus from "@/components/SupabaseStatus";

interface SystemStatus {
  supabase: 'connected' | 'error' | 'checking';
  database: 'ready' | 'error' | 'checking';
  auth: 'working' | 'error' | 'checking';
}

export default function SystemStatusCard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    supabase: 'checking',
    database: 'checking', 
    auth: 'checking'
  });

  return (
    <Card className="w-full bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              overallStatus === 'success' ? 'bg-emerald-500' :
              overallStatus === 'warning' ? 'bg-amber-500' :
              overallStatus === 'error' ? 'bg-red-500' : 'bg-neutral-500'
            }`}>
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                Estado del Sistema
                {getStatusIcon(overallStatus)}
              </CardTitle>
              <p className="text-sm text-neutral-600">
                Verificación de componentes principales
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={performSystemChecks}
              disabled={loading}
              className="text-neutral-600 hover:text-neutral-900"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* System Checks */}
        <div className="space-y-3">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <p className="font-medium text-sm text-neutral-900">
                    {check.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {check.message || check.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(check.status)}
                {check.action && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    asChild={!!check.action.href}
                    onClick={check.action.onClick}
                  >
                    {check.action.href ? (
                      <a href={check.action.href} target={check.action.href.startsWith('http') ? '_blank' : undefined}>
                        {check.action.label}
                        {check.action.href.startsWith('http') && <ExternalLink className="h-3 w-3 ml-1" />}
                      </a>
                    ) : (
                      <span>{check.action.label}</span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Last checked info */}
        {lastChecked && (
          <div className="text-xs text-neutral-500 text-center pt-2 border-t border-neutral-200">
            Última verificación: {lastChecked.toLocaleTimeString('es-ES')}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            asChild
          >
            <a 
              href="https://supabase.com/dashboard/project/djkrzbmgzfwagmripozi" 
              target="_blank"
              className="flex items-center gap-2"
            >
              <Settings className="h-3 w-3" />
              Supabase Dashboard
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            asChild
          >
            <a href="/email-templates" className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              Email Templates
            </a>
          </Button>
        </div>

        {/* Resend API Diagnostics */}
        <div className="pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <Send className="h-4 w-4" />
            Diagnóstico de Resend API
          </h4>
          <ResendKeyTester />
        </div>
      </CardContent>
    </Card>
  );
}