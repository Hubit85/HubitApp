
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { SupabaseUserRoleService, UserRole } from "@/services/SupabaseUserRoleService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight, User } from "lucide-react";

export default function VerifyRolePage() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("");
  const [verifiedRole, setVerifiedRole] = useState<UserRole | null>(null);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token && typeof token === 'string') {
      verifyRoleToken(token);
    }
  }, [token]);

  const verifyRoleToken = async (verificationToken: string) => {
    try {
      setVerificationStatus('loading');
      
      const result = await SupabaseUserRoleService.verifyRole(verificationToken);
      
      if (result.success) {
        setVerificationStatus('success');
        setMessage(result.message);
        setVerifiedRole(result.role || null);
      } else {
        setVerificationStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Error verifying role:", error);
      setVerificationStatus('error');
      setMessage("Error al verificar el rol. Por favor inténtalo de nuevo.");
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Verificar Rol - HuBiT</title>
        <meta name="description" content="Verifica tu nuevo rol en HuBiT" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 tracking-tight">
              HuBiT
            </h1>
            <p className="text-lg text-neutral-600 font-light mt-2">
              Verificación de Rol
            </p>
          </div>

          <Card className="w-full max-w-md bg-white/70 backdrop-blur-lg border-white/20 shadow-2xl shadow-neutral-900/10">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                verificationStatus === 'loading' 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                  : verificationStatus === 'success' 
                  ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                {verificationStatus === 'loading' ? (
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                ) : verificationStatus === 'success' ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : (
                  <XCircle className="h-8 w-8 text-white" />
                )}
              </div>
              
              <div>
                <CardTitle className="text-2xl font-bold text-neutral-900">
                  {verificationStatus === 'loading' 
                    ? 'Verificando Rol...' 
                    : verificationStatus === 'success' 
                    ? '¡Rol Verificado!' 
                    : 'Error de Verificación'}
                </CardTitle>
                <CardDescription className="text-neutral-600">
                  {verificationStatus === 'loading' 
                    ? 'Procesando tu verificación' 
                    : verificationStatus === 'success' 
                    ? 'Tu nuevo rol ha sido activado' 
                    : 'No pudimos verificar tu rol'}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status Message */}
              {message && (
                <Alert className={verificationStatus === 'success' ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}>
                  <AlertDescription className={verificationStatus === 'success' ? "text-emerald-800" : "text-red-800"}>
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Verified Role Info */}
              {verificationStatus === 'success' && verifiedRole && (
                <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      {getRoleIcon(verifiedRole.role_type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-emerald-900">
                        {SupabaseUserRoleService.getRoleDisplayName(verifiedRole.role_type)}
                      </h4>
                      <p className="text-sm text-emerald-700">
                        Verificado el {new Date(verifiedRole.verification_confirmed_at!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {verificationStatus === 'success' ? (
                  <Button
                    onClick={handleGoToDashboard}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Ir al Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : verificationStatus === 'error' ? (
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push('/dashboard')}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
                    >
                      Ir al Dashboard
                    </Button>
                    <Link 
                      href="/auth/login"
                      className="block text-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Volver al inicio de sesión
                    </Link>
                  </div>
                ) : null}
              </div>

              {/* Loading State */}
              {verificationStatus === 'loading' && (
                <div className="text-center text-sm text-neutral-600">
                  <p>Verificando tu token de confirmación...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              ¿Necesitas ayuda?{" "}
              <Link href="/help" className="text-emerald-600 hover:underline">
                Contacta soporte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );

  function getRoleIcon(roleType: UserRole['role_type']) {
    switch (roleType) {
      case 'particular': return <User className="h-4 w-4" />;
      case 'community_member': return <Users className="h-4 w-4" />;
      case 'service_provider': return <Building className="h-4 w-4" />;
      case 'property_administrator': return <Settings className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  }
}
