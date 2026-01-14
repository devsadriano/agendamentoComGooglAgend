<template>
  <BaseModal
    v-model="modalVisible"
    title="Editar Agendamento"
    confirm-text="Salvar Alterações"
    confirm-variant="success"
    cancel-text="Cancelar"
    :loading="loading"
    :disabled="!isFormValid"
    @confirm="handleConfirm"
    @close="handleClose"
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
                  {{ nomeProfissionalAtual?.charAt(0).toUpperCase() || 'P' }}
                </span>
              </div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">
                {{ nomeProfissionalAtual || 'Carregando...' }}
              </div>
              <div class="text-xs text-gray-500">
                Profissional
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cliente (somente leitura) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Cliente <span class="text-red-500">*</span>
        </label>
        
        <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-green-600">
                  {{ clienteNome?.charAt(0).toUpperCase() || 'C' }}
                </span>
              </div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">
                {{ clienteNome || 'Cliente não encontrado' }}
              </div>
              <div class="text-xs text-gray-500">
                {{ clienteTelefone ? clienteTelefone : 'Sem telefone cadastrado' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Título (editável) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Título <span class="text-red-500">*</span>
        </label>
        <BaseInput
          v-model="form.titulo"
          placeholder="Ex: Consulta de rotina"
          required
          :error="errors.titulo"
          @blur="validateTitulo"
        />
      </div>

      <!-- Descrição (editável) -->
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

      <!-- Data (somente leitura) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Data <span class="text-red-500">*</span>
        </label>
        <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div class="text-sm font-medium text-gray-900">
            {{ dataFormatada }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            Data do agendamento (não pode ser alterada)
          </div>
        </div>
      </div>

      <!-- Horários (somente leitura) -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Hora Início -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hora Início <span class="text-red-500">*</span>
          </label>
          <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="text-sm font-medium text-gray-900">
              {{ horaInicioFormatada }}
            </div>
          </div>
        </div>

        <!-- Hora Fim -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Hora Fim <span class="text-red-500">*</span>
          </label>
          <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="text-sm font-medium text-gray-900">
              {{ horaFimFormatada }}
            </div>
          </div>
        </div>
      </div>

      <!-- Informação sobre campos não editáveis -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
              Profissional, cliente, data e horários não podem ser alterados. Apenas título, descrição e cor podem ser modificados.
            </p>
          </div>
        </div>
      </div>

      <!-- Cor do Agendamento (editável) -->
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

      <!-- Opção de cancelamento -->
      <div class="border-t pt-4">
        <button
          type="button"
          class="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          @click="confirmarCancelamento"
        >
          Cancelar Agendamento
        </button>
      </div>
    </div>
  </BaseModal>

  <!-- Modal de confirmação de cancelamento -->
  <ModalConfirmacaoSimples
    v-model="showConfirmacaoCancelamento"
    titulo="Cancelar Agendamento"
    mensagem="Tem certeza que deseja cancelar este agendamento?"
    :loading="loading"
    @confirm="executarCancelamento"
    @close="fecharConfirmacao"
  />
</template>

<script setup lang="ts">
import type { Agendamento, Cliente } from '../../shared/types/database'
import { useProfissionais } from '../composables/useProfissionais'

interface Props {
  modelValue: boolean
  agendamento?: Agendamento | null
  clientes: Cliente[]
  profissionalNome?: string
}

const props = withDefaults(defineProps<Props>(), {
  agendamento: null,
  profissionalNome: '',
  clientes: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
  cancelado: []
}>()

// Composables
const { editarAgendamento, cancelarAgendamento } = useAgendamento()
const { showSuccess, showError } = useNotification()
const { buscarProfissionais } = useProfissionais()

// Estado reativo para o nome do profissional atual
const nomeProfissionalAtual = ref('')

// Estados reativos
const loading = ref(false)
const showConfirmacaoCancelamento = ref(false)

const form = ref({
  titulo: '',
  descricao: '',
  cor: '#DBE9FE'
})

const errors = ref({
  titulo: ''
})

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

// Computed
const modalVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isFormValid = computed(() => {
  const tituloValido = form.value.titulo.trim().length >= 3
  const semErros = !Object.values(errors.value).some(error => error.trim() !== '')
  return tituloValido && semErros
})

const clienteNome = computed(() => {
  if (!props.agendamento?.cliente_id) return 'N/A'
  
  const cliente = props.clientes.find(c => c.id === props.agendamento?.cliente_id)
  return cliente?.nome_cliente || 'Cliente não encontrado'
})

const clienteTelefone = computed(() => {
  if (!props.agendamento?.cliente_id) return null
  
  const cliente = props.clientes.find(c => c.id === props.agendamento?.cliente_id)
  return cliente?.telefone || null
})

const dataFormatada = computed(() => {
  if (!props.agendamento?.data) return 'N/A'
  
  try {
    const data = new Date(props.agendamento.data + 'T00:00:00')
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      weekday: 'short'
    })
  } catch {
    return props.agendamento.data
  }
})

const horaInicioFormatada = computed(() => {
  if (!props.agendamento?.hora_inicio) return 'N/A'
  
  // Remover timezone se presente e pegar apenas HH:MM
  const horaLimpa = props.agendamento.hora_inicio.split(/[T\-\+]/)[0] || props.agendamento.hora_inicio
  const partes = horaLimpa.split(':')
  if (partes.length >= 2) {
    return `${partes[0]}:${partes[1]}`
  }
  return props.agendamento.hora_inicio
})

const horaFimFormatada = computed(() => {
  if (!props.agendamento?.hora_fim) return 'N/A'
  
  // Remover timezone se presente e pegar apenas HH:MM
  const horaLimpa = props.agendamento.hora_fim.split(/[T\-\+]/)[0] || props.agendamento.hora_fim
  const partes = horaLimpa.split(':')
  if (partes.length >= 2) {
    return `${partes[0]}:${partes[1]}`
  }
  return props.agendamento.hora_fim
})

// Métodos
const resetForm = () => {
  form.value = {
    titulo: '',
    descricao: '',
    cor: '#DBE9FE'
  }
  errors.value = {
    titulo: ''
  }
}

const selecionarCor = (cor: string) => {
  form.value.cor = cor
}

const validateTitulo = () => {
  const titulo = form.value.titulo.trim()
  if (!titulo) {
    errors.value.titulo = 'Título é obrigatório'
  } else if (titulo.length < 3) {
    errors.value.titulo = 'Título deve ter pelo menos 3 caracteres'
  } else {
    errors.value.titulo = ''
  }
}

const validateForm = () => {
  validateTitulo()
  return !Object.values(errors.value).some(error => error.trim() !== '')
}

const handleConfirm = async () => {
  if (!validateForm() || !props.agendamento) {
    return
  }
  
  loading.value = true
  
  try {
    await editarAgendamento(
      props.agendamento.id,
      {
        titulo: form.value.titulo.trim(),
        descricao: form.value.descricao.trim() || null,
        cor: form.value.cor
      }
    )
    
    showSuccess('Agendamento atualizado com sucesso!')
    emit('success')
    handleClose()
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
    showError('Erro ao atualizar agendamento. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const confirmarCancelamento = () => {
  showConfirmacaoCancelamento.value = true
}

const executarCancelamento = async () => {
  if (!props.agendamento) return
  
  loading.value = true
  
  try {
    await cancelarAgendamento(props.agendamento.id)
    
    showSuccess('Agendamento cancelado com sucesso!')
    emit('cancelado')
    showConfirmacaoCancelamento.value = false
    handleClose()
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error)
    showError('Erro ao cancelar agendamento. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const fecharConfirmacao = () => {
  showConfirmacaoCancelamento.value = false
}

const handleClose = () => {
  resetForm()
  modalVisible.value = false
}

const loadAgendamento = () => {
  if (!props.agendamento) {
    return
  }
  
  form.value.titulo = props.agendamento.titulo || ''
  form.value.descricao = props.agendamento.descricao || ''
  form.value.cor = props.agendamento.cor || '#DBE9FE'
}

// Carregar nome do profissional baseado no profissional_id do agendamento
const carregarNomeProfissional = async () => {
  if (!props.agendamento?.profissional_id) {
    nomeProfissionalAtual.value = ''
    return
  }

  try {
    const profissionais = await buscarProfissionais()
    const profissional = profissionais.find(p => p.profissional_id === props.agendamento?.profissional_id)
    nomeProfissionalAtual.value = profissional?.nome_profissional || 'Profissional não encontrado'
  } catch (error) {
    console.error('Erro ao carregar nome do profissional:', error)
    nomeProfissionalAtual.value = 'Erro ao carregar'
  }
}

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetForm()
      if (props.agendamento) {
        loadAgendamento()
        carregarNomeProfissional()
      }
    }
  }
)

// Observar mudanças no profissional_id do agendamento
watch(
  () => props.agendamento?.profissional_id,
  (newProfissionalId, oldProfissionalId) => {
    if (newProfissionalId !== oldProfissionalId && props.modelValue) {
      carregarNomeProfissional()
    }
  }
)
</script>