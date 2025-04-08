'use client'

import { useState } from 'react'
import { Dialog } from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { createProfessional } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'

interface NewProfessionalModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewProfessionalModal({ isOpen, onClose }: NewProfessionalModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    specialty: '',
    registrationNumber: '',
    registrationState: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createProfessional({
        name: formData.name,
        cpf: formData.cpf,
        phone: formData.phone,
        email: formData.email,
        birth_date: formData.birthDate,
        gender: formData.gender,
        specialty: formData.specialty,
        registration_number: formData.registrationNumber,
        registration_state: formData.registrationState,
        address_street: formData.address.street,
        address_number: formData.address.number,
        address_complement: formData.address.complement,
        address_neighborhood: formData.address.neighborhood,
        address_city: formData.address.city,
        address_state: formData.address.state,
        address_zip_code: formData.address.zipCode,
        clinic_id: 'your-clinic-id', // Replace with actual clinic ID
      })

      toast({
        title: 'Sucesso',
        description: 'Profissional cadastrado com sucesso!',
      })

      queryClient.invalidateQueries({ queryKey: ['professionals'] })
      onClose()
    } catch (error) {
      console.error('Erro ao cadastrar profissional:', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao cadastrar o profissional. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onClose}
              >
                <span className="sr-only">Fechar</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Novo Profissional
                </h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cpf"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CPF
                      </label>
                      <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={(e) =>
                          setFormData({ ...formData, cpf: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="birthDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={(e) =>
                          setFormData({ ...formData, birthDate: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gênero
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="O">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="specialty"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Especialidade
                      </label>
                      <input
                        type="text"
                        id="specialty"
                        name="specialty"
                        value={formData.specialty}
                        onChange={(e) =>
                          setFormData({ ...formData, specialty: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="registrationNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CRM/CRO
                      </label>
                      <input
                        type="text"
                        id="registrationNumber"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registrationNumber: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="registrationState"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Estado do CRM/CRO
                      </label>
                      <input
                        type="text"
                        id="registrationState"
                        name="registrationState"
                        value={formData.registrationState}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registrationState: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Endereço</h4>
                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="street"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Rua
                        </label>
                        <input
                          type="text"
                          id="street"
                          name="street"
                          value={formData.address.street}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                street: e.target.value,
                              },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="number"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Número
                        </label>
                        <input
                          type="text"
                          id="number"
                          name="number"
                          value={formData.address.number}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                number: e.target.value,
                              },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="complement"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Complemento
                        </label>
                        <input
                          type="text"
                          id="complement"
                          name="complement"
                          value={formData.address.complement}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                complement: e.target.value,
                              },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="neighborhood"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Bairro
                        </label>
                        <input
                          type="text"
                          id="neighborhood"
                          name="neighborhood"
                          value={formData.address.neighborhood}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                neighborhood: e.target.value,
                              },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Cidade
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.address.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                city: e.target.value,
                              },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Estado
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.address.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                state: e.target.value,
                              },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="zipCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          CEP
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.address.zipCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                zipCode: e.target.value,
                              },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    >
                      {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
} 