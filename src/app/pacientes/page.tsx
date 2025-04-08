'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Plus, Search, Filter } from 'lucide-react'
import { NewPatientModal } from '@/components/patients/new-patient-modal'
import { useAuth } from '@/contexts/auth-context'

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)
  const { accountId, isLoading } = useAuth()

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div>Carregando...</div>
        </div>
      </MainLayout>
    )
  }

  if (!accountId) {
    return (
      <MainLayout>
        <div className="p-6">
          <div>Você precisa estar logado para acessar esta página.</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <button
            onClick={() => setIsNewPatientModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Paciente
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Buscar pacientes..."
              />
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filtros
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nome
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CPF
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Telefone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Última Consulta
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhum paciente encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        accountId={accountId}
      />
    </MainLayout>
  )
} 