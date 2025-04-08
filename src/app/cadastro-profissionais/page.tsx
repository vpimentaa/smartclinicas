'use client'

import { useState, useEffect, useCallback } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { NewProfessionalModal } from '@/components/professionals/new-professional-modal'
import { getProfessionals, deleteProfessional, type Professional } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { useParams } from 'next/navigation'

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const params = useParams()
  const clinicId = params.clinicId
  const { toast } = useToast()

  const loadProfessionals = useCallback(async () => {
    try {
      const professionals = await getProfessionals(clinicId as string);
      setProfessionals(professionals);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao carregar os profissionais.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [clinicId, toast]);

  useEffect(() => {
    loadProfessionals();
  }, [loadProfessionals]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProfessional(id);
      toast({
        title: 'Sucesso',
        description: 'Profissional excluído com sucesso.',
      });
      loadProfessionals();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o profissional.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profissionais</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Novo Profissional
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {professionals.map((professional) => (
                <tr key={professional.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {professional.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {professional.specialty}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(professional.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewProfessionalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          loadProfessionals();
        }}
      />
    </MainLayout>
  );
} 