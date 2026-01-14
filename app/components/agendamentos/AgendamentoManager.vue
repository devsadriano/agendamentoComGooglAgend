<template>
  <div class="rounded-lg h-full flex flex-col" style="background-color: #FAFAFA;">
    <!-- Header - Agendamentos (altura automática) -->
    <div class="flex items-center">
      <!-- Card único com todos os componentes -->
      <ControladorSemana 
        @novo-agendamento="abrirModalNovoAgendamento" 
        @abrir-selecao-profissional="abrirModalSelecionarProfissional" 
      />
    </div>

    <!-- Corpo - Conteúdo Principal (ocupa todo o espaço restante) -->
    <div class="flex-1 flex">
      <!-- Lado esquerdo: Régua de horários -->
      <ReguaHorarios />
      
      <!-- Lado direito: Grid dos dias da semana -->
      <div class="flex-1 flex" style="background-color: #FAFAFA;">
        <!-- Iteração pelos 7 dias da semana -->
        <ItemAgendamento 
          v-for="dia in agendamentoStore.semanaAtual" 
          :key="dia.data.toISOString()"
          :data="dia.data"
          :agendamentos="getAgendamentosDoDia(dia.data)"
          :loading="loadingAgendamentos"
          class="flex-1"
          @editar-agendamento="abrirModalEditarAgendamento"
        />
      </div>
    </div>
    
    <!-- Modal Novo Agendamento -->
    <ModalNovoAgendamento
      v-model="showModalNovoAgendamento"
      :profissional-ativo="profissionalAtivo"
      :dias-semana="agendamentoStore.semanaAtual"
      :clientes="clientes"
      :carregando-clientes="carregandoClientes"
      :agendamentos-existentes="todosAgendamentos"
      :loading-salvar="loadingAgendamento"
      @salvar="handleNovoAgendamento"
    />

    <!-- Modal Editar Agendamento -->
    <ModalEditarAgendamento
      v-model="showModalEditarAgendamento"
      :agendamento="agendamentoSelecionado"
      :clientes="clientes"
      :profissional-nome="profissionalAtivo?.nome_profissional || ''"
      @success="handleEditarAgendamentoSucesso"
      @cancelado="handleAgendamentoCancelado"
    />

    <!-- Modal Selecionar Profissional -->
    <ModalSelecionarProfissional
      v-model="showModalSelecionarProfissional"
      @profissional-selecionado="handleProfissionalSelecionado"
    />
  </div>
</template>

<script setup lang="ts">
// Import explícito dos componentes
import ControladorSemana from './ControladorSemana.vue'
import ReguaHorarios from './ReguaHorarios.vue'
import ItemAgendamento from './ItemAgendamento.vue'
import ModalNovoAgendamento from './ModalNovoAgendamento.vue'
import ModalEditarAgendamento from '../ModalEditarAgendamento.vue'
import ModalSelecionarProfissional from './ModalSelecionarProfissional.vue'
import { useAgendamentoStore } from '../../stores/agendamento'
import { useProfissionalAtivo } from '../../composables/useProfissionalAtivo'
import { useAgendamento } from '../../composables/useAgendamento'
import { useProfissionais } from '../../composables/useProfissionais'
import { useNotification } from '../../composables/useNotification'
import type { Agendamento, Cliente } from '../../../shared/types/database'

// Acessar o store de agendamentos
const agendamentoStore = useAgendamentoStore()

// Acessar o profissional ativo
const { profissionalAtivo } = useProfissionalAtivo()

// Usar o composable de agendamento
const { buscarAgendamentosPorProfissionalEPeriodo, loading: loadingAgendamentos, error } = useAgendamento()

// Usar o composable de profissionais para buscar clientes
const { buscarClientes } = useProfissionais()

// Estado reativo para todos os agendamentos do profissional
const todosAgendamentos = ref<Agendamento[]>([])

// Estado reativo para clientes
const clientes = ref<Cliente[]>([])
const carregandoClientes = ref(false)

// Estado reativo para loading de inserção de agendamento
const loadingAgendamento = ref(false)

/**
 * Calcula as datas de início e fim da semana atual
 */
const periodoSemanaAtual = computed(() => {
  const semana = agendamentoStore.semanaAtual
  if (semana.length === 0 || !semana[0] || !semana[6]) {
    return { inicio: '', fim: '' }
  }
  
  const dataInicio = semana[0].data.toISOString().split('T')[0] // formato YYYY-MM-DD
  const dataFim = semana[6].data.toISOString().split('T')[0]   // formato YYYY-MM-DD
  
  return { inicio: dataInicio, fim: dataFim }
})

/**
 * Filtra agendamentos de uma data específica
 */
const getAgendamentosDoDia = (data: Date): Agendamento[] => {
  const diaAtual = data.toISOString().split('T')[0] // formato YYYY-MM-DD
  
  return todosAgendamentos.value.filter(agendamento => 
    agendamento.data === diaAtual
  )
}

/**
 * Busca agendamentos quando profissional ou semana mudarem
 */
const buscarAgendamentosSemana = async () => {
  if (!profissionalAtivo.value?.profissional_id) {
    todosAgendamentos.value = []
    return
  }

  const periodo = periodoSemanaAtual.value
  if (!periodo.inicio || !periodo.fim) {
    todosAgendamentos.value = []
    return
  }

  console.log('🔄 Buscando agendamentos:', {
    profissional: profissionalAtivo.value.nome_profissional,
    periodo: `${periodo.inicio} a ${periodo.fim}`
  })

  todosAgendamentos.value = await buscarAgendamentosPorProfissionalEPeriodo(
    profissionalAtivo.value.profissional_id,
    periodo.inicio,
    periodo.fim
  )

  console.log('✅ Agendamentos carregados:', todosAgendamentos.value.length)
}

/**
 * Busca clientes em segundo plano
 */
const buscarClientesBackground = async () => {
  try {
    carregandoClientes.value = true
    console.log('🔄 Buscando clientes em segundo plano...')
    
    clientes.value = await buscarClientes()
    
    console.log('✅ Clientes carregados:', clientes.value.length)
  } catch (error) {
    console.error('❌ Erro ao buscar clientes:', error)
  } finally {
    carregandoClientes.value = false
  }
}

/**
 * Watch para reagir a mudanças no profissional ativo
 */
watch(profissionalAtivo, buscarAgendamentosSemana, { immediate: true })

/**
 * Watch para reagir a mudanças na semana
 */
watch(periodoSemanaAtual, buscarAgendamentosSemana)

// Buscar clientes quando o componente for montado
onMounted(() => {
  buscarClientesBackground()
})

// Estado do modal
const showModalNovoAgendamento = ref(false)
const showModalEditarAgendamento = ref(false)
const showModalSelecionarProfissional = ref(false)
const agendamentoSelecionado = ref<Agendamento | null>(null)

// Função para lidar com novo agendamento
const handleNovoAgendamento = async (dadosAgendamento: any) => {
  console.log('📝 Tentando criar novo agendamento:', dadosAgendamento)
  
  // Validar se há profissional ativo
  if (!profissionalAtivo.value) {
    console.error('❌ Nenhum profissional ativo selecionado')
    const { showError } = useNotification()
    showError('Nenhum profissional ativo selecionado')
    return
  }

  loadingAgendamento.value = true

  try {
    // Usar o composable para inserir o agendamento
    const { inserirAgendamento, error } = useAgendamento()
    const { showSuccess, showError } = useNotification()
    
    const novoAgendamento = await inserirAgendamento({
      profissional_id: profissionalAtivo.value.profissional_id,
      cliente_id: parseInt(dadosAgendamento.clienteId),
      data: dadosAgendamento.data,
      hora_inicio: dadosAgendamento.horaInicio,
      hora_fim: dadosAgendamento.horaFim,
      titulo: dadosAgendamento.titulo,
      descricao: dadosAgendamento.descricao,
      cor: dadosAgendamento.cor
    })

    if (novoAgendamento) {
      console.log('✅ Agendamento criado com sucesso:', novoAgendamento)
      showSuccess(`Agendamento "${dadosAgendamento.titulo}" criado com sucesso!`)
      showModalNovoAgendamento.value = false
      
      // Recarregar agendamentos após criação
      buscarAgendamentosSemana()
    } else {
      console.error('❌ Falha ao criar agendamento')
      
      // Verificar se há erro específico
      if (error.value) {
        showError(`Erro ao criar agendamento: ${error.value}`)
      } else {
        showError('Falha ao criar agendamento. Tente novamente.')
      }
    }
  } catch (error: any) {
    console.error('❌ Erro ao criar agendamento:', error)
    const { showError } = useNotification()
    showError(`Erro inesperado: ${error.message || 'Tente novamente'}`)
  } finally {
    loadingAgendamento.value = false
  }
}

// Função para abrir modal (com logs para debug)
const abrirModalNovoAgendamento = () => {
  console.log('📋 Agendamentos sendo passados para o modal:', todosAgendamentos.value)
  showModalNovoAgendamento.value = true
}

// Função para abrir modal de edição de agendamento
const abrirModalEditarAgendamento = (agendamento: Agendamento) => {
  console.log('📝 Abrindo modal de edição para agendamento:', agendamento)
  agendamentoSelecionado.value = agendamento
  showModalEditarAgendamento.value = true
}

// Função para abrir modal de seleção de profissional
const abrirModalSelecionarProfissional = () => {
  console.log('👤 Abrindo modal de seleção de profissional')
  showModalSelecionarProfissional.value = true
}

// Função para lidar com seleção de profissional
const handleProfissionalSelecionado = (profissional: any) => {
  console.log('✅ Profissional selecionado:', profissional)
  // A lógica de definição já é feita no modal através do composable
  // Aqui podemos adicionar logs ou outras ações se necessário
}

// Função para lidar com sucesso na edição do agendamento
const handleEditarAgendamentoSucesso = () => {
  console.log('✅ Agendamento editado com sucesso, recarregando lista')
  buscarAgendamentosSemana()
}

// Função para lidar com cancelamento do agendamento
const handleAgendamentoCancelado = () => {
  console.log('🚫 Agendamento cancelado, recarregando lista')
  buscarAgendamentosSemana()
}

// Componente principal para gerenciar agendamentos
</script>