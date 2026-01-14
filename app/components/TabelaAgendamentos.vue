<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header da Tabela -->
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">
        Agendamentos 
        <span v-if="agendamentos.length > 0" class="text-sm font-normal text-gray-500">
          ({{ agendamentos.length }} agendamentos)
        </span>
      </h3>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center space-x-2 text-gray-500">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Carregando agendamentos...</span>
      </div>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center mx-6 my-4">
      <div class="text-red-600">{{ error }}</div>
    </div>

    <!-- Lista de Agendamentos -->
    <div v-else-if="agendamentos.length > 0" class="divide-y divide-gray-200">
      <div
        v-for="agendamento in agendamentos"
        :key="agendamento.agendamento_id"
        class="px-4 py-5 hover:bg-gray-50 transition-colors duration-150"
      >
        <div class="grid grid-cols-12 gap-3 items-center">
          <!-- ID -->
          <div class="col-span-1 text-center">
            <div class="text-sm font-bold text-gray-700">
              #{{ agendamento.agendamento_id }}
            </div>
          </div>

          <!-- Barra + Status -->
          <div class="col-span-1 flex items-center space-x-2">
            <div 
              class="w-1 h-8 rounded-full"
              :style="{ backgroundColor: agendamento.cor || '#DBE9FE' }"
            ></div>
            <div v-if="agendamento.cancelado" class="inline-flex items-center px-1 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
              Cancelado
            </div>
            <div v-else class="inline-flex items-center px-1 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
              Ativo
            </div>
          </div>

          <!-- Data e Horário -->
          <div class="col-span-2">
            <div class="flex items-center space-x-1 text-sm font-medium text-gray-900">
              <CalendarIcon class="h-4 w-4 text-gray-500" />
              <span>{{ formatarDataSegura(agendamento.data) }}</span>
            </div>
            <div class="text-xs text-gray-500">
              {{ formatarHorarioSeguro(agendamento.hora_inicio) }} - {{ formatarHorarioSeguro(agendamento.hora_fim) }}
            </div>
          </div>

          <!-- Título -->
          <div class="col-span-2">
            <div class="text-sm font-medium text-gray-900 truncate">
              {{ agendamento.titulo || 'Sem título' }}
            </div>
            <div class="text-xs text-gray-500 truncate">
              {{ agendamento.descricao || 'Sem descrição' }}
            </div>
          </div>

          <!-- Cliente -->
          <div class="col-span-2 flex items-center space-x-2">
            <UserIcon class="h-4 w-4 text-gray-500" />
            <div class="min-w-0">
              <div class="text-xs font-medium text-gray-900 truncate">
                {{ agendamento.nome_cliente || 'Cliente não informado' }}
              </div>
              <div class="text-xs text-gray-500 truncate">
                {{ agendamento.cpf_cliente || agendamento.telefone_cliente || '--' }}
              </div>
            </div>
          </div>

          <!-- Profissional -->
          <div class="col-span-2 flex items-center space-x-2">
            <div 
              class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
              :style="{ backgroundColor: getCorProfissional(agendamento.nome_profissional) }"
            >
              {{ agendamento.nome_profissional?.charAt(0).toUpperCase() || 'P' }}
            </div>
            <div class="min-w-0">
              <div class="text-xs font-medium text-gray-900 truncate">
                {{ agendamento.nome_profissional || 'Profissional não informado' }}
              </div>
              <div class="text-xs text-gray-500 truncate">
                {{ agendamento.especialidade_profissional || '--' }}
              </div>
            </div>
          </div>

          <!-- Criação -->
          <div class="col-span-1 text-right">
            <div class="text-xs text-gray-500">
              {{ formatarDataCriacao(agendamento.created_at) }}
            </div>
          </div>

          <!-- Menu -->
          <div class="col-span-1 text-right">
            <button class="p-1 text-gray-400 hover:text-gray-600">
              <EllipsisVerticalIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else class="text-center py-12">
      <CalendarIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
      <p class="text-gray-500">Não há agendamentos cadastrados no sistema.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon, ClockIcon, UserIcon, EllipsisVerticalIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import type { AgendamentoCompleto } from '../../shared/types/database'

// Props
interface Props {
  agendamentos: AgendamentoCompleto[]
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

// Função para formatar data abreviada
const formatarDataAbreviada = (data: string | null): string => {
  if (!data) {
    return 'Data não informada'
  }
  
  try {
    let dataObj: Date
    let dataString = String(data).trim()
    
    // Diferentes tentativas de parsing
    if (dataString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Formato YYYY-MM-DD
      dataObj = new Date(dataString + 'T12:00:00.000Z')
    } else if (dataString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      // Formato DD/MM/YYYY  
      const partes = dataString.split('/')
      if (partes.length === 3 && partes[0] && partes[1] && partes[2]) {
        const [dia, mes, ano] = partes
        dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
      } else {
        dataObj = new Date(dataString)
      }
    } else if (dataString.includes('T')) {
      // Formato ISO
      dataObj = new Date(dataString)
    } else {
      // Última tentativa
      dataObj = new Date(dataString)
    }
    
    // Verificar se a data é válida
    if (isNaN(dataObj.getTime())) {
      console.error('Data inválida:', dataString)
      return `Data inválida: ${dataString}`
    }
    
    return dataObj.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    
  } catch (error) {
    console.error('Erro ao formatar data:', data, error)
    return `Erro: ${String(data)}`
  }
}

// Função para formatar data de criação
const formatarDataCriacao = (dataHora: string | null): string => {
  if (!dataHora) return '--'
  
  try {
    const data = new Date(dataHora)
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  } catch {
    return '--'
  }
}

// Função mais simples e segura para formatar data
const formatarDataSegura = (data: string | null): string => {
  if (!data) return 'Data não informada'
  
  // Usar uma abordagem mais direta
  try {
    // Para YYYY-MM-DD, fazer parsing manual mais seguro
    const match = data.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (match) {
      const [, ano, mes, dia] = match
      const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia))
      
      if (!isNaN(dataObj.getTime())) {
        return dataObj.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      }
    }
    
    // Fallback para outros formatos
    const dataObj = new Date(data)
    if (!isNaN(dataObj.getTime())) {
      return dataObj.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
      })
    }
    
    return `Data: ${data}`
  } catch {
    return `Data: ${data}`
  }
}

// Função para gerar cor do profissional baseada no nome
const getCorProfissional = (nome: string | null | undefined): string => {
  const cores = [
    '#3B82F6', // blue-500
    '#EF4444', // red-500  
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#8B5CF6', // violet-500
    '#06B6D4', // cyan-500
    '#EC4899', // pink-500
    '#84CC16', // lime-500
  ]
  
  // Se nome for null, undefined ou vazio, retornar cor padrão
  if (!nome) return '#6B7280'
  
  // Calcular índice baseado no nome
  const index = nome.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return cores[index % cores.length] || '#6B7280'
}

const formatarHorario = (horario: string | null): string => {
  if (!horario) return '--:--'
  
  try {
    // Se já estiver no formato HH:MM, retornar diretamente
    if (horario.match(/^\d{2}:\d{2}$/)) {
      return horario
    }
    
    // Se estiver no formato ISO com timezone, extrair apenas a hora
    if (horario.includes('T') || horario.includes('-')) {
      const data = new Date(horario)
      return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // Caso contrário, tentar extrair HH:MM do string
    const match = horario.match(/(\d{2}):(\d{2})/)
    if (match) {
      return `${match[1]}:${match[2]}`
    }
    
    return '--:--'
  } catch {
    return '--:--'
  }
}

// Função mais segura para formatar horário
const formatarHorarioSeguro = (horario: string | null): string => {
  if (!horario) return '--:--'
  
  try {
    
    // Extrair HH:MM de diferentes formatos
    let match
    
    // Formato HH:MM:SS-TZ (ex: "11:00:00-03")
    match = horario.match(/^(\d{1,2}):(\d{2}):(\d{2})/)
    if (match && match[1] && match[2]) {
      const [, hora, minuto] = match
      return `${hora.padStart(2, '0')}:${minuto}`
    }
    
    // Formato HH:MM (ex: "11:00")
    match = horario.match(/^(\d{1,2}):(\d{2})$/)
    if (match && match[1] && match[2]) {
      const [, hora, minuto] = match
      return `${hora.padStart(2, '0')}:${minuto}`
    }
    
    // Formato ISO com timestamp (ex: "2025-10-16T11:00:00-03:00")
    if (horario.includes('T')) {
      const data = new Date(horario)
      if (!isNaN(data.getTime())) {
        return data.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    }
    
    // Tentar extrair qualquer padrão HH:MM
    match = horario.match(/(\d{1,2}):(\d{2})/)
    if (match && match[1] && match[2]) {
      const [, hora, minuto] = match
      return `${hora.padStart(2, '0')}:${minuto}`
    }
    
    console.error('Formato de horário não reconhecido:', horario)
    return `${horario}`
  } catch (error) {
    console.error('Erro ao formatar horário:', horario, error)
    return `${horario}`
  }
}

const formatarDataHora = (dataHora: string | null): string => {
  if (!dataHora) return 'Data não informada'
  
  try {
    const data = new Date(dataHora)
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Data inválida'
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>