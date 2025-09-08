import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Database, User, Settings, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

export default function SupabaseStatus() {
  const { user, profile, session, loading } = useSupabaseAuth();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'placeholder'>('checking');
  const [dbStatus, setDbStatus] = useState<'checking' | 'ready' | 'error' | 'placeholder'>('checking');

  // Check if we're using placeholder configuration
  const isPlaceholderConfig = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project') || 
                             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('placeholder') ||
                             !isSupabaseConfigured();

  useEffect(() => {
    let mounted = true;
    let checkInterval: NodeJS.Timeout;

    const performConnectionCheck = async () => {
      if (!mounted) return;
      
      // Skip network calls if using placeholder configuration
      if (isPlaceholderConfig) {
        if (mounted) {
          setConnectionStatus('placeholder');
        }
        return;
      }
      
      try {
        setConnectionStatus('checking');
        
        const isConnected = await checkConnection();
        
        if (mounted) {
          setConnectionStatus(isConnected ? 'connected' : 'error');
          
          // Only show errors in console if not placeholder
          if (!isConnected) {
            console.warn('⚠️ Supabase connection appears to be down');
          } else if (connectionStatus === 'error' && isConnected) {
            console.log('✅ Supabase connection restored');
          }
        }
      } catch (error) {
        console.warn('🔍 Connection check error:', error);
        if (mounted) {
          setConnectionStatus('error');
        }
      }
    };

    const performDatabaseCheck = async () => {
      if (!mounted) return;
      
      // Skip network calls if using placeholder configuration
      if (isPlaceholderConfig) {
        if (mounted) {
          setDbStatus('placeholder');
        }
        return;
      }
      
      try {
        setDbStatus('checking');
        await checkDatabaseTables();
      } catch (error) {
        console.warn('🔍 Database check error:', error);
        if (mounted) {
          setDbStatus('error');
        }
      }
    };

    // Initial checks
    performConnectionCheck();
    performDatabaseCheck();

    // Set up periodic checks only if not using placeholder config
    if (!isPlaceholderConfig) {
      checkInterval = setInterval(() => {
        performConnectionCheck();
        performDatabaseCheck();
      }, 30000);
    }

    return () => {
      mounted = false;
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [isPlaceholderConfig]);

  const checkConnection = async (): Promise<boolean> => {
    // Don't make network calls to placeholder URLs
    if (isPlaceholderConfig) {
      return false;
    }

    try {
      // Create a simple timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 5000);
      });

      // Try a very lightweight query that doesn't depend on RLS
      const connectionPromise = supabase
        .from('profiles')
        .select('id')
        .limit(0);

      const result = await Promise.race([connectionPromise, timeoutPromise]) as any;
      const { error } = result;

      // Connection is OK if no error or if it's just "no rows found" 
      const connected = !error || error.code === 'PGRST116';
      
      console.log('🔗 Connection check result:', {
        connected,
        error: error?.message || 'none',
        code: error?.code || 'none'
      });

      return connected;

    } catch (error) {
      console.warn('🚨 Connection check failed:', error);
      return false;
    }
  };

  const checkDatabaseTables = async () => {
    // Don't make network calls to placeholder URLs
    if (isPlaceholderConfig) {
      setDbStatus('placeholder');
      return;
    }

    try {
      console.log('🔍 Checking database tables...');
      
      // Create timeout for database checks
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database check timeout')), 8000);
      });

      // Check if main tables exist by testing specific queries with better error handling
      const checksPromise = Promise.allSettled([
        supabase.from('profiles').select('count').limit(1),
        supabase.from('properties').select('count').limit(1),
        supabase.from('budget_requests').select('count').limit(1)
      ]);
      
      const checks = await Promise.race([checksPromise, timeoutPromise]) as any;
      
      const hasFailures = checks.some((result: any) => {
        if (result.status === 'rejected') return true;
        if (result.status === 'fulfilled' && result.value.error) {
          // Allow certain "acceptable" errors that indicate the table exists but query failed due to RLS
          const acceptableErrors = ['PGRST116', 'PGRST103', '42501'];
          return !acceptableErrors.includes(result.value.error.code);
        }
        return false;
      });
      
      console.log('✅ Database tables check completed:', { hasFailures });
      setDbStatus(hasFailures ? 'error' : 'ready');
      
    } catch (error) {
      console.warn('⚠️ Database tables check exception:', error);
      setDbStatus('error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'connected': 
      case 'ready': return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'placeholder': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string, label: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    
    if (status === 'connected' || status === 'ready') {
      variant = 'default';
    } else if (status === 'error') {
      variant = 'destructive';
    } else if (status === 'placeholder') {
      variant = 'outline';
    }
    
    return (
      <Badge variant={variant} className="flex items-center gap-2">
        {getStatusIcon(status)}
        {label}
      </Badge>
    );
  };

  // Show configuration notice if using placeholder config
  if (isPlaceholderConfig) {
    return (
      <Card className="w-full max-w-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60 shadow-lg shadow-amber-900/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <div>
              <CardTitle className="text-xl font-semibold text-amber-900">Supabase Configuration Needed</CardTitle>
              <CardDescription className="text-amber-700">Currently using placeholder configuration</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-100/50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800 mb-3">
              To enable full HuBiT functionality, you need to connect Supabase:
            </p>
            <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc">
              <li>Click the "Supabase" button in the Softgen navigation bar</li>
              <li>Follow the instructions to connect your project</li>
              <li>Environment variables will be configured automatically</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-100/50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Current Status:</strong>
            </p>
            <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
              <li>✅ Application compiles and runs successfully</li>
              <li>📱 UI components work with local mock data</li>
              <li>🔗 Database features require real Supabase connection</li>
            </ul>
          </div>
          <div className="text-center">
            <p className="text-xs text-amber-600">
              Meanwhile, the application works with simulated local data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl bg-gradient-to-br from-white to-neutral-50 border-neutral-200/60 shadow-lg shadow-neutral-900/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-emerald-600" />
          <div>
            <CardTitle className="text-xl font-semibold">Supabase Status</CardTitle>
            <CardDescription>Database connection and configuration</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Connection
          </h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50">
            <span className="text-sm text-neutral-700">Supabase connection status</span>
            {getStatusBadge(connectionStatus, connectionStatus === 'connected' ? 'Connected' : 
                           connectionStatus === 'error' ? 'Error' : 
                           connectionStatus === 'placeholder' ? 'Placeholder' : 'Checking...')}
          </div>
        </div>

        {/* Database Schema */}
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database Schema
          </h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50">
            <span className="text-sm text-neutral-700">Main tables configured</span>
            {getStatusBadge(dbStatus, dbStatus === 'ready' ? 'Ready' : 
                           dbStatus === 'error' ? 'Error' : 
                           dbStatus === 'placeholder' ? 'Placeholder' : 'Checking...')}
          </div>
        </div>

        {/* Authentication Status */}
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900 flex items-center gap-2">
            <User className="h-4 w-4" />
            Authentication
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/50">
              <span className="text-sm text-neutral-700">Authenticated user</span>
              {loading ? (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </Badge>
              ) : user ? (
                <Badge variant="default" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-gray-400" />
                  Not authenticated
                </Badge>
              )}
            </div>
            
            {user && profile && (
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/60">
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Name:</span> {profile.full_name || 'Not specified'}</p>
                  <p><span className="font-medium">User type:</span> {profile.user_type}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Configuration Info */}
        <div className="space-y-3">
          <h3 className="font-medium text-neutral-900">Configuration</h3>
          <div className="text-xs text-neutral-600 space-y-1 bg-neutral-50/50 p-3 rounded-lg font-mono">
            <p><span className="font-semibold">URL:</span> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p><span className="font-semibold">Key:</span> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              if (!isPlaceholderConfig) {
                checkConnection();
                checkDatabaseTables();
              }
            }}
            disabled={isPlaceholderConfig}
            className="bg-transparent hover:bg-neutral-50"
          >
            Check connection
          </Button>
          {!user && (
            <Button 
              size="sm"
              onClick={() => window.location.href = '/auth/login'}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Sign in
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
