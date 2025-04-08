'use client'

import { useState } from 'react'
import { Dialog } from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { createClinic, createClinicUnit } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface NewClinicModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewClinicModal({ isOpen, onClose }: NewClinicModalProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    units: [
      {
        name: '',
        address: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
        },
      },
    ],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Você precisa estar logado para criar uma clínica')
      return
    }

    setIsSubmitting(true)
    try {
      // Criar a clínica
      const clinic = await createClinic({
        owner_id: user.id,
        name: formData.name,
        cnpj: formData.cnpj,
        email: formData.email,
        phone: formData.phone,
        address_street: formData.address.street,
        address_number: formData.address.number,
        address_complement: formData.address.complement,
        address_neighborhood: formData.address.neighborhood,
        address_city: formData.address.city,
        address_state: formData.address.state,
        address_zip_code: formData.address.zipCode,
      })

      // Criar as unidades
      for (const unit of formData.units) {
        await createClinicUnit({
          clinic_id: clinic.id,
          owner_id: user.id,
          name: unit.name,
          address_street: unit.address.street,
          address_number: unit.address.number,
          address_complement: unit.address.complement,
          address_neighborhood: unit.address.neighborhood,
          address_city: unit.address.city,
          address_state: unit.address.state,
          address_zip_code: unit.address.zipCode,
        })
      }

      toast.success('Clínica cadastrada com sucesso!')
      onClose()
    } catch (error) {
      console.error('Erro ao cadastrar clínica:', error)
      toast.error('Erro ao cadastrar clínica. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addUnit = () => {
    setFormData({
      ...formData,
      units: [
        ...formData.units,
        {
          name: '',
          address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
          },
        },
      ],
    })
  }

  const removeUnit = (index: number) => {
    setFormData({
      ...formData,
      units: formData.units.filter((_, i) => i !== index),
    })
  }

  const updateUnit = (index: number, field: string, value: string) => {
    const updatedUnits = [...formData.units]
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      updatedUnits[index] = {
        ...updatedUnits[index],
        [parent]: {
          ...updatedUnits[index][parent as keyof typeof updatedUnits[0]],
          [child]: value,
        },
      }
    } else {
      updatedUnits[index] = {
        ...updatedUnits[index],
        [field]: value,
      }
    }
    setFormData({ ...formData, units: updatedUnits })
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
                  Nova Clínica
                </h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nome da Clínica
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
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cnpj"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CNPJ
                      </label>
                      <input
                        type="text"
                        id="cnpj"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={(e) =>
                          setFormData({ ...formData, cnpj: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Endereço da Matriz
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
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
                              address: { ...formData.address, street: e.target.value },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                          disabled={isSubmitting}
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
                              address: { ...formData.address, number: e.target.value },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                          disabled={isSubmitting}
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
                              address: { ...formData.address, complement: e.target.value },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          disabled={isSubmitting}
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
                              address: { ...formData.address, neighborhood: e.target.value },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                          disabled={isSubmitting}
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
                              address: { ...formData.address, city: e.target.value },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                          disabled={isSubmitting}
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
                              address: { ...formData.address, state: e.target.value },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                          disabled={isSubmitting}
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
                              address: { ...formData.address, zipCode: e.target.value },
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Unidades
                      </h4>
                      <button
                        type="button"
                        onClick={addUnit}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={isSubmitting}
                      >
                        Adicionar Unidade
                      </button>
                    </div>
                    {formData.units.map((unit, index) => (
                      <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-sm font-medium text-gray-700">
                            Unidade {index + 1}
                          </h5>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeUnit(index)}
                              className="text-red-600 hover:text-red-800"
                              disabled={isSubmitting}
                            >
                              Remover
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor={`unit-name-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Nome da Unidade
                            </label>
                            <input
                              type="text"
                              id={`unit-name-${index}`}
                              value={unit.name}
                              onChange={(e) =>
                                updateUnit(index, 'name', e.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor={`unit-street-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Rua
                            </label>
                            <input
                              type="text"
                              id={`unit-street-${index}`}
                              value={unit.address.street}
                              onChange={(e) =>
                                updateUnit(index, 'address.street', e.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`unit-number-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Número
                            </label>
                            <input
                              type="text"
                              id={`unit-number-${index}`}
                              value={unit.address.number}
                              onChange={(e) =>
                                updateUnit(index, 'address.number', e.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`unit-complement-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Complemento
                            </label>
                            <input
                              type="text"
                              id={`unit-complement-${index}`}
                              value={unit.address.complement}
                              onChange={(e) =>
                                updateUnit(index, 'address.complement', e.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`unit-neighborhood-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Bairro
                            </label>
                            <input
                              type="text"
                              id={`unit-neighborhood-${index}`}
                              value={unit.address.neighborhood}
                              onChange={(e) =>
                                updateUnit(index, 'address.neighborhood', e.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`unit-city-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Cidade
                            </label>
                            <input
                              type="text"
                              id={`unit-city-${index}`}
                              value={unit.address.city}
                              onChange={(e) =>
                                updateUnit(index, 'address.city', e.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`unit-state-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              Estado
                            </label>
                            <input
                              type="text"
                              id={`unit-state-${index}`}
                              value={unit.address.state}
                              onChange={(e) =>
                                updateUnit(index, 'address.state', e.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`unit-zipCode-${index}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              CEP
                            </label>
                            <input
                              type="text"
                              id={`unit-zipCode-${index}`}
                              value={unit.address.zipCode}
                              onChange={(e) =>
                                updateUnit(index, 'address.zipCode', e.target.value)
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Salvando...' : 'Cadastrar'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={onClose}
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