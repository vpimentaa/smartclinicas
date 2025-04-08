'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { NewProfessionalModal } from '@/components/professionals/new-professional-modal'
import { getProfessionals, deleteProfessional, type Professional } from '@/lib/supabase'
import { Building2, Plus, Trash2, Edit2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useParams } from 'next/navigation'

export default function CadastroProfissionaisPage() {
  const { clinicId } = useParams()
  const [isNewProfessionalModalOpen, setIsNewProfessionalModalOpen] = useState(false)
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const loadProfessionals = async () => {
    try {
      const data = await getProfessionals(clinicId as string)
      setProfessionals(data)
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error)
      toast.error('Erro ao carregar profissionais')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este profissional?')) {
      return
    }

    setIsDeleting(id)
    try {
      await deleteProfessional(id)
      toast.success('Profissional excluído com sucesso!')
      loadProfessionals()
    } catch (error) {
      console.error('Erro ao excluir profissional:', error)
      toast.error('Erro ao excluir profissional')
    } finally {
      setIsDeleting(null)
    }
  }

  useEffect(() => {
    loadProfessionals()
  }, [clinicId])

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Profissionais</h1>
          <button
            onClick={() => setIsNewProfessionalModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Profissional
          </button>
        </div>

        <div className="table-container">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              Carregando...
            </div>
          ) : professionals.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum profissional cadastrado
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">
                    Nome
                  </th>
                  <th className="table-header-cell">
                    Especialidade
                  </th>
                  <th className="table-header-cell">
                    Registro
                  </th>
                  <th className="table-header-cell">
                    Email
                  </th>
                  <th className="table-header-cell">
                    Telefone
                  </th>
                  <th className="table-header-cell text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="table-body">
                {professionals.map((professional) => (
                  <tr key={professional.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Building2 className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {professional.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {professional.specialty}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">{professional.specialty}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {professional.registration_number} - {professional.registration_state}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">{professional.email}</div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">{professional.phone}</div>
                    </td>
                    <td className="table-cell text-right text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        onClick={() => {
                          // TODO: Implementar edição
                        }}
                        disabled={isDeleting === professional.id}
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(professional.id)}
                        disabled={isDeleting === professional.id}
                      >
                        {isDeleting === professional.id ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <NewProfessionalModal
        isOpen={isNewProfessionalModalOpen}
        onClose={() => {
          setIsNewProfessionalModalOpen(false)
          loadProfessionals()
        }}
        clinicId={clinicId as string}
      />
    </MainLayout>
  )
} 