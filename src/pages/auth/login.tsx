import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate and authenticate with Firebase here
    // For now, we'll just redirect to the dashboard
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>{t("login")} - {t("handyman")}</title>
        <meta name="description" content={t("loginToAccess")} />
      </Head>
      
      <Header />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t("welcomeBack")}</CardTitle>
            <CardDescription>
              {t("loginToAccess")}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={t("enterEmail")} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder={t("enterPassword")} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  {t("forgotPassword")}
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">{t("login")}</Button>
              <div className="text-center text-sm">
                {t("dontHaveAccount")}{" "}
                <Link href="/auth/register" className="text-blue-600 hover:underline">
                  {t("register")}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}