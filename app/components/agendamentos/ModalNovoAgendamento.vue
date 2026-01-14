<template>
  <BaseModal
    v-model="showModal"
    title="Novo Agendamento"
    confirm-text="Salvar"
    cancel-text="Cancelar"
    :loading="loading || props.loadingSalvar"
    @confirm="salvarAgendamento"
    @close="fecharModal"
  >
    <div class="space-y-6">
      <!-- Profissional (somente leitura) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Profissional
        </label>
        <div class="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-blue-600">
                  {{ profissionalAtivo?.nome_profissional?.charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">
                {{ profissionalAtivo?.nome_profissional }}
              </div>
              <div class="text-xs text-gray-500">
                {{ profissionalAtivo?.especialidade_profissional }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cliente -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Cliente <span class="text-red-500">*</span>
        </label>
        
        <!-- Dropdown pesquisável -->
        <div class="relative">
          <input
            v-model="pesquisaCliente"
            type="text"
            placeholder="Digite para pesquisar ou selecionar cliente..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @focus="mostrarDropdownClientes = true"
            @blur="ocultarDropdownComDelay"
          />
          
          <!-- Loading indicator -->
          <div v-if="carregandoClientes" class="absolute right-3 top-3">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
          
          <!-- Dropdown lista de clientes -->
          <div 
            v-if="mostrarDropdownClientes && clientesFiltrados.length > 0"
            class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            <button
              v-for="cliente in clientesFiltrados"
              :key="cliente.id"
              type="button"
              class="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
              @mousedown.prevent="selecionarCliente(cliente)"
            >
              <div class="text-sm font-medium text-gray-900">{{ cliente.nome_cliente }}</div>
              <div v-if="cliente.telefone" class="text-xs text-gray-500">{{ cliente.telefone }}</div>
            </button>
          </div>
          
          <!-- Mensagem quando não há clientes -->
          <div 
            v-else-if="mostrarDropdownClientes && !carregandoClientes && clientes.length === 0"
            class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3"
          >
            <div class="text-sm text-gray-500 text-center">Nenhum cliente encontrado</div>
          </div>
        </div>
        
        <p class="mt-1 text-xs text-gray-500">
          Não encontrou o cliente? 
          <NuxtLink to="/clientes" class="text-blue-600 hover:text-blue-800 underline">
            Cadastrar novo cliente
          </NuxtLink>
        </p>
      </div>

      <!-- Título -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Título <span class="text-red-500">*</span>
        </label>
        <BaseInput
          v-model="form.titulo"
          placeholder="Ex: Consulta de rotina"
          required
        />
      </div>

      <!-- Descrição -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          v-model="form.descricao"
          placeholder="Detalhes do agendamento (opcional)"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        ></textarea>
      </div>

      <!-- Data -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Data <span class="text-red-500">*</span>
        </label>
        <select 
          v-model="form.data"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          @change="onDataChange"
        >
          <option value="">Selecione uma data</option>
          <option 
            v-for="dia in diasSemana" 
            :key="dia.data.toISOString()"
            :value="dia.data.toISOString().split('T')[0]"
          >
            {{ formatarDataCompleta(dia.data) }}
          </option>
        </select>
      </div>

      <!-- Horários (habilitados apenas quando data está selecionada) -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Hora Início -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hora Início <span class="text-red-500">*</span>
          </label>
          <select 
            v-model="form.horaInicio"
            :disabled="!form.data"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            @change="onHoraInicioChange"
          >
            <option value="">Selecione</option>
            <option 
              v-for="hora in horariosDisponiveis" 
              :key="hora"
              :value="hora"
            >
              {{ hora }}
            </option>
          </select>
        </div>

        <!-- Hora Fim -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hora Fim <span class="text-red-500">*</span>
          </label>
          <select 
            v-model="form.horaFim"
            :disabled="!form.horaInicio"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          >
            <option value="">Selecione</option>
            <option 
              v-for="hora in horariosFimDisponiveis" 
              :key="hora"
              :value="hora"
            >
              {{ hora }}
            </option>
          </select>
        </div>
      </div>

      <!-- Aviso quando horários estão desabilitados -->
      <div v-if="!form.data" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
              Selecione uma data para habilitar os campos de horário
            </p>
          </div>
        </div>
      </div>

      <!-- Cor do Agendamento -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Cor do Agendamento
        </label>
        
        <!-- Paleta de cores predefinidas -->
        <div class="grid grid-cols-8 gap-2 mb-3">
          <button
            v-for="cor in coresPredefinidas"
            :key="cor.hex"
            type="button"
            class="relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :class="form.cor === cor.hex ? 'border-gray-400 shadow-lg' : 'border-gray-200'"
            :style="{ backgroundColor: cor.hex }"
            :title="cor.nome"
            @click="selecionarCor(cor.hex)"
          >
            <!-- Checkmark quando selecionado -->
            <div 
              v-if="form.cor === cor.hex"
              class="absolute inset-0 flex items-center justify-center"
            >
              <svg class="w-4 h-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>
        </div>
        
        <!-- Cor personalizada -->
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <input
              v-model="form.cor"
              type="color"
              class="w-8 h-8 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Cor personalizada"
              @input="onCorPersonalizada"
            />
            <span class="text-sm text-gray-600">Personalizada</span>
          </div>
          <div class="flex items-center space-x-2">
            <div 
              class="w-4 h-4 rounded border border-gray-300"
              :style="{ backgroundColor: form.cor }"
            ></div>
            <span class="text-xs font-mono text-gray-500">{{ form.cor.toUpperCase() }}</span>
          </div>
        </div>
        
        <p class="mt-2 text-xs text-gray-500">
          Escolha uma cor para identificar visualmente este agendamento
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../BaseModal.vue'
import BaseInput from '../BaseInput.vue'
import type { Profissional, DiaSemana, Cliente, Agendamento } from '../../../shared/types/database'

interface Props {
  modelValue: boolean
  profissionalAtivo: Profissional | null
  diasSemana: DiaSemana[]
  clientes: Cliente[]
  carregandoClientes?: boolean
  agendamentosExistentes: Agendamento[]
  loadingSalvar?: boolean
}

interface FormData {
  clienteId: string
  titulo: string
  descricao: string
  data: string
  horaInicio: string
  horaFim: string
  cor: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'salvar': [data: FormData]
}>()

// Estado do modal
const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Watch para debug quando modal abrir
watch(showModal, (novoValor) => {
  if (novoValor) {
    console.log('🚀 Modal aberto - DEBUG COMPLETO:')
    console.log('📋 Props agendamentosExistentes:', props.agendamentosExistentes)
    console.log('📅 Dias da semana:', props.diasSemana)
    console.log('👤 Profissional ativo:', props.profissionalAtivo)
  }
})

const loading = ref(false)

// Formulário
const form = ref<FormData>({
  clienteId: '',
  titulo: '',
  descricao: '',
  data: '',
  horaInicio: '',
  horaFim: '',
  cor: '#DBE9FE' // Cor padrão
})

// Estado do dropdown de clientes
const pesquisaCliente = ref('')
const mostrarDropdownClientes = ref(false)
const clienteSelecionado = ref<Cliente | null>(null)

// Cores predefinidas para seleção rápida
const coresPredefinidas = [
  { nome: 'Azul Claro', hex: '#DBE9FE' },
  { nome: 'Verde Suave', hex: '#D1FAE5' },
  { nome: 'Rosa Suave', hex: '#FCE7F3' },
  { nome: 'Amarelo Suave', hex: '#FEF3C7' },
  { nome: 'Roxo Suave', hex: '#E9D5FF' },
  { nome: 'Laranja Suave', hex: '#FED7AA' },
  { nome: 'Vermelho Suave', hex: '#FECACA' },
  { nome: 'Cinza Suave', hex: '#F3F4F6' },
  { nome: 'Azul Médio', hex: '#93C5FD' },
  { nome: 'Verde Médio', hex: '#86EFAC' },
  { nome: 'Rosa Médio', hex: '#F9A8D4' },
  { nome: 'Amarelo Médio', hex: '#FDE047' },
  { nome: 'Roxo Médio', hex: '#C4B5FD' },
  { nome: 'Laranja Médio', hex: '#FDBA74' },
  { nome: 'Vermelho Médio', hex: '#F87171' },
  { nome: 'Teal', hex: '#5EEAD4' }
]

// Função para selecionar cor predefinida
const selecionarCor = (cor: string) => {
  form.value.cor = cor
}

// Função para lidar com cor personalizada
const onCorPersonalizada = () => {
  // A cor já é atualizada automaticamente pelo v-model
  console.log('Cor personalizada selecionada:', form.value.cor)
}

// Funções auxiliares para cálculo de conflitos
const converterHorarioParaMinutos = (horario: string): number => {
  // Limpar o horário removendo timezone e segundos se existirem
  let horarioLimpo = horario
  
  // Se tem formato 'HH:MM:SS.SSS+TZ', extrair apenas 'HH:MM'
  if (horario.includes(':') && horario.length > 5) {
    const partes = horario.split(':')
    if (partes.length >= 2) {
      horarioLimpo = `${partes[0]}:${partes[1]}`
    }
  }
  
  console.log(`🕒 Convertendo horário: "${horario}" → "${horarioLimpo}"`)
  
  const partes = horarioLimpo.split(':').map(Number)
  if (partes.length !== 2) {
    console.error(`❌ Formato de horário inválido: ${horario}`)
    return 0
  }
  
  const [hora, minuto] = partes
  if (hora === undefined || minuto === undefined || isNaN(hora) || isNaN(minuto)) {
    console.error(`❌ Hora ou minuto inválido: ${horario}`)
    return 0
  }
  
  const totalMinutos = hora * 60 + minuto
  console.log(`🕒 ${horarioLimpo} = ${totalMinutos} minutos`)
  return totalMinutos
}

const verificarConflito = (inicioMinutos: number, fimMinutos: number, agendamento: Agendamento): boolean => {
  // Verificar se os horários do agendamento existem
  if (!agendamento.hora_inicio || !agendamento.hora_fim) return false
  
  const agendamentoInicioMinutos = converterHorarioParaMinutos(agendamento.hora_inicio)
  const agendamentoFimMinutos = converterHorarioParaMinutos(agendamento.hora_fim)
  
  // Verificar se há sobreposição
  return !(fimMinutos <= agendamentoInicioMinutos || inicioMinutos >= agendamentoFimMinutos)
}

const obterAgendamentosDoDia = (dataSelecionada: string): Agendamento[] => {
  console.log(`📅 Filtrando agendamentos para data: ${dataSelecionada}`)
  console.log(`📋 Total de agendamentos existentes:`, props.agendamentosExistentes)
  
  const agendamentosFiltrados = props.agendamentosExistentes.filter(agendamento => {
    // Normalizar a data do agendamento (pode vir como YYYY-MM-DD ou YYYY-MM-DDTHH:MM:SS)
    let dataAgendamento = agendamento.data
    if (dataAgendamento && dataAgendamento.includes('T')) {
      const partes = dataAgendamento.split('T')
      dataAgendamento = partes[0] || dataAgendamento // Pegar apenas YYYY-MM-DD
    }
    
    console.log(`🔍 Comparando: "${dataAgendamento}" === "${dataSelecionada}"`)
    return dataAgendamento === dataSelecionada
  })
  
  console.log(`📋 Agendamentos do dia ${dataSelecionada}:`, agendamentosFiltrados)
  return agendamentosFiltrados
}

// Horários disponíveis (8h às 22h, de 30 em 30 minutos) - Filtrados por conflitos
const horariosDisponiveis = computed(() => {
  const horarios = []
  for (let hora = 8; hora <= 22; hora++) {
    horarios.push(`${hora.toString().padStart(2, '0')}:00`)
    if (hora < 22) { // Não adicionar :30 para 22h
      horarios.push(`${hora.toString().padStart(2, '0')}:30`)
    }
  }
  
  // Se não há data selecionada, retorna todos os horários
  if (!form.value.data) {
    console.log('📅 Nenhuma data selecionada - retornando todos os horários')
    return horarios
  }
  
  const agendamentosDoDia = obterAgendamentosDoDia(form.value.data)
  
  console.log('🔍 Verificando horários para data:', form.value.data)
  console.log('📋 Agendamentos do dia encontrados:', agendamentosDoDia.length)
  
  if (agendamentosDoDia.length === 0) {
    console.log('✅ Nenhum agendamento no dia - todos os horários liberados')
    return horarios
  }
  
  // Filtrar horários que não causam conflito
  const horariosLiberados = horarios.filter(horario => {
    const horarioMinutos = converterHorarioParaMinutos(horario)
    
    console.log(`\n🔍 Testando horário ${horario} (${horarioMinutos} minutos)`)
    
    // Para cada agendamento existente, verificar se o horário de início proposto
    // está dentro do intervalo do agendamento existente
    const temConflito = agendamentosDoDia.some(agendamento => {
      if (!agendamento.hora_inicio || !agendamento.hora_fim) {
        console.log(`⚠️ Agendamento sem horários válidos:`, agendamento)
        return false
      }
      
      const agendamentoInicioMinutos = converterHorarioParaMinutos(agendamento.hora_inicio)
      const agendamentoFimMinutos = converterHorarioParaMinutos(agendamento.hora_fim)
      
      console.log(`📋 Comparando com agendamento: ${agendamento.hora_inicio}-${agendamento.hora_fim} (${agendamentoInicioMinutos}-${agendamentoFimMinutos} minutos)`)
      
      // O horário de início não pode estar dentro de um agendamento existente
      // Incluindo o horário exato de início do agendamento existente
      const dentroDoAgendamento = horarioMinutos >= agendamentoInicioMinutos && horarioMinutos < agendamentoFimMinutos
      
      console.log(`🔎 ${horario}: ${horarioMinutos} >= ${agendamentoInicioMinutos} && ${horarioMinutos} < ${agendamentoFimMinutos} = ${dentroDoAgendamento}`)
      
      if (dentroDoAgendamento) {
        console.log(`🚫 Horário ${horario} BLOQUEADO - conflita com agendamento ${agendamento.hora_inicio}-${agendamento.hora_fim}`)
      } else {
        console.log(`✅ Horário ${horario} LIBERADO - não conflita`)
      }
      
      return dentroDoAgendamento
    })
    
    console.log(`📊 Resultado final para ${horario}: ${temConflito ? 'BLOQUEADO' : 'LIBERADO'}`)
    return !temConflito
  })
  
  console.log('📊 RESUMO FINAL:')
  console.log('🕐 Horários testados:', horarios.length)
  console.log('✅ Horários liberados:', horariosLiberados.length)
  console.log('🚫 Horários bloqueados:', horarios.length - horariosLiberados.length)
  console.log('📋 Lista de liberados:', horariosLiberados)
  
  return horariosLiberados
})

// Horários de fim disponíveis (baseado na hora de início e conflitos)
const horariosFimDisponiveis = computed(() => {
  if (!form.value.horaInicio || !form.value.data) return []
  
  const horarioInicioPartes = form.value.horaInicio.split(':').map(Number)
  if (horarioInicioPartes.length !== 2) return []
  
  const [horaInicio, minutoInicio] = horarioInicioPartes
  if (horaInicio === undefined || minutoInicio === undefined) return []
  
  const minutosInicio = horaInicio * 60 + minutoInicio
  const agendamentosDoDia = obterAgendamentosDoDia(form.value.data)
  
  // Gerar todos os horários possíveis de fim (a partir da hora início + 30min)
  const horariosPossiveis = []
  for (let hora = 8; hora <= 22; hora++) {
    horariosPossiveis.push(`${hora.toString().padStart(2, '0')}:00`)
    if (hora < 22) {
      horariosPossiveis.push(`${hora.toString().padStart(2, '0')}:30`)
    }
  }
  
  return horariosPossiveis.filter(horario => {
    const horarioFimPartes = horario.split(':').map(Number)
    if (horarioFimPartes.length !== 2) return false
    
    const [hora, minuto] = horarioFimPartes
    if (hora === undefined || minuto === undefined) return false
    
    const minutosFim = hora * 60 + minuto
    
    // Hora fim deve ser maior que hora início (mínimo 30 minutos)
    if (minutosFim <= minutosInicio + 30) return false
    
    console.log(`🔍 Testando horário fim ${horario} para início ${form.value.horaInicio}`)
    
    // Verificar se o período completo (início até fim) não conflita com agendamentos existentes
    const temConflito = agendamentosDoDia.some(agendamento => {
      if (!agendamento.hora_inicio || !agendamento.hora_fim) return false
      
      const agendamentoInicioMinutos = converterHorarioParaMinutos(agendamento.hora_inicio)
      const agendamentoFimMinutos = converterHorarioParaMinutos(agendamento.hora_fim)
      
      // Verificar se há qualquer sobreposição entre o novo agendamento e o existente
      const hasSobreposicao = !(minutosFim <= agendamentoInicioMinutos || minutosInicio >= agendamentoFimMinutos)
      
      if (hasSobreposicao) {
        console.log(`🚫 Horário fim ${horario} bloqueado - conflita com agendamento ${agendamento.hora_inicio}-${agendamento.hora_fim}`)
      }
      
      return hasSobreposicao
    })
    
    return !temConflito
  })
})

// Computed para filtrar clientes baseado na pesquisa
const clientesFiltrados = computed(() => {
  if (!pesquisaCliente.value.trim()) {
    return props.clientes.slice(0, 10) // Mostrar apenas 10 primeiros se não há pesquisa
  }
  
  const termo = pesquisaCliente.value.toLowerCase()
  return props.clientes.filter(cliente => 
    cliente.nome_cliente?.toLowerCase().includes(termo) ||
    (cliente.telefone && cliente.telefone.includes(termo))
  ).slice(0, 10) // Limitar a 10 resultados
})

// Funções para dropdown de clientes
const selecionarCliente = (cliente: Cliente) => {
  clienteSelecionado.value = cliente
  form.value.clienteId = cliente.id.toString()
  pesquisaCliente.value = cliente.nome_cliente || ''
  mostrarDropdownClientes.value = false
}

const ocultarDropdownComDelay = () => {
  // Delay para permitir clique nos itens do dropdown
  setTimeout(() => {
    mostrarDropdownClientes.value = false
  }, 200)
}

// Funções
const formatarDataCompleta = (data: Date): string => {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const diaSemana = diasSemana[data.getDay()]
  const dataFormatada = data.toLocaleDateString('pt-BR')
  return `${diaSemana}, ${dataFormatada}`
}

const onDataChange = () => {
  // Limpar horários quando data mudar
  form.value.horaInicio = ''
  form.value.horaFim = ''
}

const onHoraInicioChange = () => {
  // Limpar hora fim quando hora início mudar
  form.value.horaFim = ''
}

const salvarAgendamento = () => {
  console.log('🔍 Validando dados do formulário:', form.value)
  
  // Validações obrigatórias
  if (!form.value.clienteId) {
    console.error('❌ Cliente não selecionado')
    alert('Por favor, selecione um cliente')
    return
  }
  
  if (!form.value.titulo.trim()) {
    console.error('❌ Título não preenchido')
    alert('Por favor, preencha o título do agendamento')
    return
  }
  
  if (!form.value.data) {
    console.error('❌ Data não selecionada')
    alert('Por favor, selecione uma data')
    return
  }
  
  if (!form.value.horaInicio) {
    console.error('❌ Hora de início não selecionada')
    alert('Por favor, selecione a hora de início')
    return
  }
  
  if (!form.value.horaFim) {
    console.error('❌ Hora de fim não selecionada')
    alert('Por favor, selecione a hora de fim')
    return
  }
  
  // Validar se hora fim é maior que hora início
  const horaInicioMinutos = converterHorarioParaMinutos(form.value.horaInicio)
  const horaFimMinutos = converterHorarioParaMinutos(form.value.horaFim)
  
  if (horaFimMinutos <= horaInicioMinutos) {
    console.error('❌ Hora de fim deve ser maior que hora de início')
    alert('A hora de fim deve ser maior que a hora de início')
    return
  }
  
  console.log('✅ Todas as validações passaram, enviando dados:', form.value)
  emit('salvar', form.value)
}

const fecharModal = () => {
  // Resetar formulário
  form.value = {
    clienteId: '',
    titulo: '',
    descricao: '',
    data: '',
    horaInicio: '',
    horaFim: '',
    cor: '#DBE9FE' // Cor padrão
  }
  
  // Resetar estado do dropdown de clientes
  pesquisaCliente.value = ''
  clienteSelecionado.value = null
  mostrarDropdownClientes.value = false
}
</script>