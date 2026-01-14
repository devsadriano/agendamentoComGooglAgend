<template>
  <BaseModal
    v-model="modalVisible"
    :title="isEdicao ? 'Editar Cliente' : 'Novo Cliente'"
    :confirm-text="isEdicao ? 'Atualizar' : 'Criar'"
    :confirm-variant="isEdicao ? 'success' : 'primary'"
    cancel-text="Cancelar"
    :loading="loading"
    :disabled="!isFormValid"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <!-- Formulário -->
    <form @submit.prevent="handleConfirm" class="space-y-4">
      <div>
        <BaseInput
          v-model="form.nome_cliente"
          label="Nome do Cliente"
          placeholder="Digite o nome do cliente"
          required
          :error="errors.nome_cliente"
          @blur="validateNome"
        />
      </div>

      <div>
        <BaseInput
          v-model="form.cpf"
          label="CPF"
          placeholder="000.000.000-00"
          required
          :error="errors.cpf"
          :maxlength="14"
          @blur="validateCpf"
        />
      </div>

      <div>
        <BaseInput
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="Digite o email"
          :error="errors.email"
          @blur="validateEmail"
        />
      </div>

      <div>
        <BaseInput
          v-model="form.telefone"
          label="Telefone"
          placeholder="(00)00000-0000"
          :error="errors.telefone"
          :maxlength="14"
          @blur="validateTelefone"
        />
      </div>

      <div>
        <BaseInput
          v-model="form.endereco"
          label="Endereço"
          placeholder="Digite o endereço"
          :error="errors.endereco"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Cliente } from '../../shared/types/database'

interface Props {
  modelValue: boolean
  isEdicao?: boolean
  cliente?: Cliente | null
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  cliente: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

// Composable para ações de clientes
const { inserirCliente, editarCliente } = useProfissionais()
const { showSuccess, showError } = useNotification()

// Estados reativos
const loading = ref(false)
const form = ref({
  nome_cliente: '',
  cpf: '',
  email: '',
  telefone: '',
  endereco: ''
})
const errors = ref({
  nome_cliente: '',
  cpf: '',
  email: '',
  telefone: '',
  endereco: ''
})

// Computed
const modalVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isFormValid = computed(() => {
  // Campos obrigatórios preenchidos corretamente
  const nomeValido = form.value.nome_cliente.trim().length >= 3
  const cpfValido = isValidCpf(form.value.cpf)
  
  // Campos opcionais válidos se preenchidos
  const emailValido = !form.value.email.trim() || isValidEmail(form.value.email.trim())
  const telefoneValido = !form.value.telefone.trim() || isValidTelefone(form.value.telefone)
  
  // Nenhum erro nos campos
  const semErros = !Object.values(errors.value).some(error => error.trim() !== '')
  
  return nomeValido && cpfValido && emailValido && telefoneValido && semErros
})

// Métodos
const resetForm = () => {
  form.value = {
    nome_cliente: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: ''
  }
  errors.value = {
    nome_cliente: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: ''
  }
}

const validateForm = () => {
  // Executar todas as validações
  validateNome()
  validateCpf()
  validateEmail()
  validateTelefone()
  
  // Retornar se não há erros
  return !Object.values(errors.value).some(error => error.trim() !== '')
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Função para validar CPF
const isValidCpf = (cpf: string) => {
  const cleanCpf = cpf.replace(/\D/g, '')
  
  // Verifica se tem 11 dígitos
  if (cleanCpf.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false
  
  // Validação do algoritmo do CPF
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf.charAt(10))) return false
  
  return true
}

// Função para validar telefone
const isValidTelefone = (telefone: string) => {
  const cleanTelefone = telefone.replace(/\D/g, '')
  return cleanTelefone.length >= 10 && cleanTelefone.length <= 11
}

// Validações individuais dos campos
const validateNome = () => {
  const nome = form.value.nome_cliente.trim()
  if (!nome) {
    errors.value.nome_cliente = 'Nome do cliente é obrigatório'
  } else if (nome.length < 3) {
    errors.value.nome_cliente = 'Nome deve ter pelo menos 3 caracteres'
  } else {
    errors.value.nome_cliente = ''
  }
}

const validateCpf = () => {
  const cpf = form.value.cpf.trim()
  if (!cpf) {
    errors.value.cpf = 'CPF é obrigatório'
  } else if (!isValidCpf(cpf)) {
    const cleanCpf = cpf.replace(/\D/g, '')
    if (cleanCpf.length < 11) {
      errors.value.cpf = 'CPF deve ter 11 dígitos'
    } else {
      errors.value.cpf = 'CPF inválido'
    }
  } else {
    errors.value.cpf = ''
  }
}

const validateEmail = () => {
  const email = form.value.email.trim()
  if (!email) {
    errors.value.email = ''
    return
  }
  
  if (!isValidEmail(email)) {
    errors.value.email = 'Email deve ter um formato válido (exemplo@email.com)'
  } else {
    errors.value.email = ''
  }
}

const validateTelefone = () => {
  const telefone = form.value.telefone.trim()
  if (!telefone) {
    errors.value.telefone = ''
    return
  }
  
  const cleanTelefone = telefone.replace(/\D/g, '')
  if (cleanTelefone.length < 10) {
    errors.value.telefone = 'Telefone deve ter pelo menos 10 dígitos'
  } else if (cleanTelefone.length > 11) {
    errors.value.telefone = 'Telefone deve ter no máximo 11 dígitos'
  } else {
    errors.value.telefone = ''
  }
}

const handleConfirm = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    // Preparar dados limpos (sem formatação)
    const cpfLimpo = form.value.cpf.replace(/\D/g, '')
    const telefoneLimpo = form.value.telefone.replace(/\D/g, '') || null
    
    if (props.isEdicao && props.cliente) {
      // Editar cliente existente
      await editarCliente(
        props.cliente.id,
        form.value.nome_cliente.trim(),
        cpfLimpo,
        form.value.endereco.trim() || null,
        form.value.email.trim() || null,
        telefoneLimpo
      )
      
      showSuccess('Cliente atualizado com sucesso!')
    } else {
      // Inserir novo cliente
      await inserirCliente(
        form.value.nome_cliente.trim(),
        cpfLimpo,
        form.value.endereco.trim() || null,
        form.value.email.trim() || null,
        telefoneLimpo
      )
      
      showSuccess('Cliente criado com sucesso!')
    }
    
    emit('success')
    handleClose()
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    showError('Erro ao salvar cliente. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  resetForm()
  modalVisible.value = false
}

// Carregar dados para edição
const loadCliente = () => {
  if (!props.isEdicao || !props.cliente) {
    return
  }
  
  // Preencher formulário com dados já disponíveis
  form.value.nome_cliente = props.cliente.nome_cliente || ''
  
  // Aplicar máscara no CPF se houver dados
  if (props.cliente.cpf) {
    const cpf = props.cliente.cpf.replace(/\D/g, '')
    form.value.cpf = formatCpfMask(cpf)
  } else {
    form.value.cpf = ''
  }
  
  form.value.email = props.cliente.email || ''
  
  // Aplicar máscara no telefone se houver dados
  if (props.cliente.telefone) {
    const telefone = props.cliente.telefone.replace(/\D/g, '')
    form.value.telefone = formatTelefoneMask(telefone)
  } else {
    form.value.telefone = ''
  }
  
  form.value.endereco = props.cliente.endereco || ''
}

// Funções para aplicar máscaras
const formatCpfMask = (value: string) => {
  const cleanValue = value.replace(/\D/g, '')
  if (cleanValue.length <= 11) {
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return cleanValue
}

const formatTelefoneMask = (value: string) => {
  const cleanValue = value.replace(/\D/g, '')
  if (cleanValue.length <= 11) {
    return cleanValue
      .replace(/(\d{2})(\d)/, '($1)$2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
  }
  return cleanValue
}

// Watchers para formatação automática
watch(() => form.value.cpf, (newValue) => {
  if (newValue) {
    const formatted = formatCpfMask(newValue)
    if (formatted !== newValue) {
      form.value.cpf = formatted
    }
  }
})

watch(() => form.value.telefone, (newValue) => {
  if (newValue) {
    const formatted = formatTelefoneMask(newValue)
    if (formatted !== newValue) {
      form.value.telefone = formatted
    }
  }
})

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetForm()
      if (props.isEdicao && props.cliente) {
        loadCliente()
      }
    }
  }
)
</script>