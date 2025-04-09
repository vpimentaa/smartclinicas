'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { TopMenu } from '@/components/layout/TopMenu';

export default function DashboardPage() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopMenu />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
              <CardDescription>Controle o status do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="system-status"
                  checked={isOnline}
                  onCheckedChange={setIsOnline}
                />
                <Label htmlFor="system-status">
                  {isOnline ? 'Sistema Online' : 'Sistema Offline'}
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Configure as preferências do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinic-name">Nome da Clínica</Label>
                  <Input id="clinic-name" placeholder="Digite o nome da clínica" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="working-hours">Horário de Funcionamento</Label>
                  <Input id="working-hours" placeholder="Ex: 08:00 - 18:00" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>Visão geral do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Pacientes Atendidos</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Consultas Hoje</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 