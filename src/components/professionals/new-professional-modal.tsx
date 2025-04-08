'use client'

import { useState } from 'react'
import { Dialog } from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { createProfessional, type Professional } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface NewProfessionalModalProps {
  isOpen: boolean
  onClose: () => void
  clinicId: string
}

export function NewProfessionalModal({ isOpen, onClose, clinicId }: NewProfessionalModalProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    birth_date: '',
    gender: '',
    specialty: '',
    registration_number: '',
    registration_state: '',
    address_street: '',
    address_number: '',
    address_complement: '',
    address_neighborhood: '',
    address_city: '',
    address_state: '',
    address_zip_code: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Você precisa estar logado para cadastrar um profissional')
      return
    }

    setIsSubmitting(true)
    try {
      await createProfessional({
        clinic_id: clinicId,
        ...formData,
      })

      toast.success('Profissional cadastrado com sucesso!')
      onClose()
    } catch (error) {
      console.error('Erro ao cadastrar profissional:', error)
      toast.error('Erro ao cadastrar profissional. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <div className="modal-overlay" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="modal-content">
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleClose}
                disabled={isSubmitting}
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
                        className="mt-1 block w-full"
                        required
                        disabled={isSubmitting}
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
                        className="mt-1 block w-full"
                        required
                        disabled={isSubmitting}
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
                        className="mt-1 block w-full"
                        required
                        disabled={isSubmitting}
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
                        className="mt-1 block w-full"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="birth_date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        id="birth_date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={(e) =>
                          setFormData({ ...formData, birth_date: e.target.value })
                        }
                        className="mt-1 block w-full"
                        required
                        disabled={isSubmitting}
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
                        className="mt-1 block w-full"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Selecione</option>
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
                        className="mt-1 block w-full"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="registration_number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Número do Registro
                      </label>
                      <input
                        type="text"
                        id="registration_number"
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={(e) =>
                          setFormData({ ...formData, registration_number: e.target.value })
                        }
                        className="mt-1 block w-full"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="registration_state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Estado do Registro
                      </label>
                      <input
                        type="text"
                        id="registration_state"
                        name="registration_state"
                        value={formData.registration_state}
                        onChange={(e) =>
                          setFormData({ ...formData, registration_state: e.target.value })
                        }
                        className="mt-1 block w-full"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Endereço
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="address_street"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Rua
                        </label>
                        <input
                          type="text"
                          id="address_street"
                          name="address_street"
                          value={formData.address_street}
                          onChange={(e) =>
                            setFormData({ ...formData, address_street: e.target.value })
                          }
                          className="mt-1 block w-full"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address_number"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Número
                        </label>
                        <input
                          type="text"
                          id="address_number"
                          name="address_number"
                          value={formData.address_number}
                          onChange={(e) =>
                            setFormData({ ...formData, address_number: e.target.value })
                          }
                          className="mt-1 block w-full"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address_complement"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Complemento
                        </label>
                        <input
                          type="text"
                          id="address_complement"
                          name="address_complement"
                          value={formData.address_complement}
                          onChange={(e) =>
                            setFormData({ ...formData, address_complement: e.target.value })
                          }
                          className="mt-1 block w-full"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address_neighborhood"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Bairro
                        </label>
                        <input
                          type="text"
                          id="address_neighborhood"
                          name="address_neighborhood"
                          value={formData.address_neighborhood}
                          onChange={(e) =>
                            setFormData({ ...formData, address_neighborhood: e.target.value })
                          }
                          className="mt-1 block w-full"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address_city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Cidade
                        </label>
                        <input
                          type="text"
                          id="address_city"
                          name="address_city"
                          value={formData.address_city}
                          onChange={(e) =>
                            setFormData({ ...formData, address_city: e.target.value })
                          }
                          className="mt-1 block w-full"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address_state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Estado
                        </label>
                        <input
                          type="text"
                          id="address_state"
                          name="address_state"
                          value={formData.address_state}
                          onChange={(e) =>
                            setFormData({ ...formData, address_state: e.target.value })
                          }
                          className="mt-1 block w-full"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address_zip_code"
                          className="block text-sm font-medium text-gray-700"
                        >
                          CEP
                        </label>
                        <input
                          type="text"
                          id="address_zip_code"
                          name="address_zip_code"
                          value={formData.address_zip_code}
                          onChange={(e) =>
                            setFormData({ ...formData, address_zip_code: e.target.value })
                          }
                          className="mt-1 block w-full"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Salvando...' : 'Cadastrar'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto"
                      onClick={handleClose}
                      disabled={isSubmitting}
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