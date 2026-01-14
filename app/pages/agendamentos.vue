<template>
  <NuxtLayout>
    <!-- Header com título -->
    <div class="px-6 py-4">
      <h1 class="text-2xl font-bold text-gray-800">Agendamentos</h1>
    </div>
    
    <!-- Área de conteúdo -->
    <div class="p-6">
      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Filtro de Cliente -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Cliente <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                v-model="filtroCliente"
                @change="aplicarFiltros"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Digite para pesquisar ou selecione um cliente</option>
                <option
                  v-for="cliente in clientes"
                  :key="cliente.id"
                  :value="cliente.id"
                >
                  {{ cliente.nome_cliente }}
                </option>
              </select>
            </div>
            <p class="text-sm text-gray-500 mt-1">
              Não encontrou o cliente? 
              <NuxtLink 
                to="/clientes" 
                class="text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Cadastrar novo cliente
              </NuxtLink>
            </p>
          </div>

          <!-- Filtro de Profissional -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Profissional</label>
            <div class="relative">
              <select
                v-model="filtroProfissional"
                @change="aplicarFiltros"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Digite para pesquisar ou selecione um profissional</option>
                <option
                  v-for="profissional in profissionais"
                  :key="profissional.profissional_id"
                  :value="profissional.profissional_id"
                >
                  {{ profissional.nome_profissional }}
                </option>
              </select>
            </div>
            <p class="text-sm text-gray-500 mt-1">Selecione um profissional para filtrar os agendamentos</p>
          </div>
        </div>

        <!-- Botão Limpar Filtros -->
        <div class="mt-4 flex justify-end">
          <button
            @click="limparFiltros"
            class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Tabela de Cards dos Agendamentos -->
      <TabelaAgendamentos 
        :agendamentos="agendamentosFiltrados"
        :loading="loading"
        :error="error"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { AgendamentoCompleto, Cliente, Profissional } from '../../shared/types/database'

const { buscarRelatorioAgendamentos } = useAgendamento()
const { buscarClientes, buscarProfissionais } = useProfissionais()

// Estados reativos
const agendamentos = ref<AgendamentoCompleto[]>([])
const clientes = ref<Cliente[]>([])
const profissionais = ref<Profissional[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Estados dos filtros
const filtroCliente = ref<number | string>('')
const filtroProfissional = ref<number | string>('')

// Computed para agendamentos filtrados
const agendamentosFiltrados = computed(() => {
  let resultado = agendamentos.value

  // Filtrar por cliente
  if (filtroCliente.value) {
    resultado = resultado.filter(agendamento => 
      agendamento.cliente_id === Number(filtroCliente.value)
    )
  }

  // Filtrar por profissional
  if (filtroProfissional.value) {
    resultado = resultado.filter(agendamento => 
      agendamento.profissional_id === Number(filtroProfissional.value)
    )
  }

  return resultado
})

// Função para carregar agendamentos
const carregarAgendamentos = async () => {
  loading.value = true
  error.value = null
  
  try {
    agendamentos.value = await buscarRelatorioAgendamentos()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('Erro ao carregar agendamentos:', err)
  } finally {
    loading.value = false
  }
}

// Função para carregar clientes em segundo plano
const carregarClientes = async () => {
  try {
    console.log('🔄 Buscando clientes em segundo plano...')
    clientes.value = await buscarClientes()
    console.log('✅ Clientes carregados:', clientes.value.length)
  } catch (err) {
    console.error('❌ Erro ao carregar clientes:', err)
  }
}

// Função para carregar profissionais em segundo plano
const carregarProfissionais = async () => {
  try {
    console.log('🔄 Buscando profissionais em segundo plano...')
    profissionais.value = await buscarProfissionais()
    console.log('✅ Profissionais carregados:', profissionais.value.length)
  } catch (err) {
    console.error('❌ Erro ao carregar profissionais:', err)
  }
}

// Função para aplicar filtros (chamada quando os selects mudam)
const aplicarFiltros = () => {
  console.log('🔍 Aplicando filtros:', {
    cliente: filtroCliente.value,
    profissional: filtroProfissional.value,
    total: agendamentos.value.length,
    filtrados: agendamentosFiltrados.value.length
  })
}

// Função para limpar filtros
const limparFiltros = () => {
  filtroCliente.value = ''
  filtroProfissional.value = ''
  console.log('🧹 Filtros limpos')
}

// Carregar dados ao montar a página
onMounted(() => {
  // Carregar agendamentos (principal)
  carregarAgendamentos()
  
  // Carregar clientes e profissionais em segundo plano
  carregarClientes()
  carregarProfissionais()
})
</script>