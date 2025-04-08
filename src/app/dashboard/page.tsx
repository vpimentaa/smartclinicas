'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Calendar, Users, DollarSign, Clock } from 'lucide-react'

const stats = [
  { name: 'Consultas Hoje', value: '12', icon: Calendar },
  { name: 'Pacientes Ativos', value: '156', icon: Users },
  { name: 'Faturamento Mensal', value: 'R$ 25.000', icon: DollarSign },
  { name: 'Taxa de Ocupação', value: '85%', icon: Clock },
]

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Próximas Consultas
            </h2>
            <div className="space-y-4">
              {/* Aqui virá o componente de lista de consultas */}
              <p className="text-gray-500">Nenhuma consulta agendada para hoje.</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Atividades Recentes
            </h2>
            <div className="space-y-4">
              {/* Aqui virá o componente de atividades recentes */}
              <p className="text-gray-500">Nenhuma atividade recente.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 