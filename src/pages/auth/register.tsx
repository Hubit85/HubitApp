import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";

export default function Register() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const { t } = useLanguage();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate and register with Firebase here
    // For now, we'll just redirect to the dashboard
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>{t("register")} - {t("handyman")}</title>
        <meta name="description" content={t("registerToStart")} />
      </Head>
      
      <Header />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t("createAccount")}</CardTitle>
            <CardDescription>
              {t("registerToStart")}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("fullName")}</Label>
                <Input 
                  id="name" 
                  placeholder={t("enterFullName")} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
                  placeholder={t("createPassword")} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder={t("confirmYourPassword")} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">{t("register")}</Button>
              <div className="text-center text-sm">
                {t("alreadyHaveAccount")}{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                  {t("login")}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}