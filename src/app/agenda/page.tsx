'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { useState } from 'react'
import { Calendar, Plus, Filter } from 'lucide-react'
import { NewAppointmentModal } from '@/components/appointments/new-appointment-modal'

export default function AgendaPage() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day')
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Agenda</h1>
          <div className="flex space-x-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsNewAppointmentModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Consulta
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setView('day')}
                className={`${
                  view === 'day'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Dia
              </button>
              <button
                onClick={() => setView('week')}
                className={`${
                  view === 'week'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8`}
              >
                Semana
              </button>
              <button
                onClick={() => setView('month')}
                className={`${
                  view === 'month'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8`}
              >
                Mês
              </button>
            </nav>
          </div>

          <div className="p-6">
            {view === 'day' && (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-2 text-sm text-gray-500">
                    <div className="space-y-12">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="h-12">
                          {`${i.toString().padStart(2, '0')}:00`}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-10 border-l border-gray-200">
                    {/* Aqui virá o componente de eventos do dia */}
                    <div className="h-[calc(24*3rem)] relative">
                      <p className="text-gray-500 text-center mt-48">
                        Nenhuma consulta agendada para hoje.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'week' && (
              <div className="space-y-4">
                {/* Aqui virá o componente de visualização semanal */}
                <p className="text-gray-500 text-center">
                  Visualização semanal em desenvolvimento.
                </p>
              </div>
            )}

            {view === 'month' && (
              <div className="space-y-4">
                {/* Aqui virá o componente de visualização mensal */}
                <p className="text-gray-500 text-center">
                  Visualização mensal em desenvolvimento.
                </p>
              </div>
            )}
          </div>
        </div>

        <NewAppointmentModal
          isOpen={isNewAppointmentModalOpen}
          onClose={() => setIsNewAppointmentModalOpen(false)}
        />
      </div>
    </MainLayout>
  )
} 