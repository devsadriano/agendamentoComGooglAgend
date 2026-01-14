<template>
  <BaseModal
    v-model="modalVisible"
    :title="isEdicao ? 'Editar Especialidade' : 'Nova Especialidade'"
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
          v-model="form.nome"
          label="Nome da Especialidade"
          placeholder="Digite o nome da especialidade"
          required
          :error="errors.nome"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Especialidade } from '../../shared/types/database'

interface Props {
  modelValue: boolean
  isEdicao?: boolean
  especialidade?: Especialidade | null
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  especialidade: null
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

// Composable para ações de especialidades
const { inserirEspecialidade, editarEspecialidade } = useProfissionais()

// Estados reativos
const loading = ref(false)
const form = ref({
  nome: ''
})
const errors = ref({
  nome: ''
})

// Computed
const modalVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isFormValid = computed(() => {
  return form.value.nome.trim().length > 0
})

// Métodos
const resetForm = () => {
  form.value = {
    nome: ''
  }
  errors.value = {
    nome: ''
  }
}

const validateForm = () => {
  errors.value.nome = ''
  
  if (!form.value.nome.trim()) {
    errors.value.nome = 'Nome da especialidade é obrigatório'
    return false
  }
  
  if (form.value.nome.trim().length < 2) {
    errors.value.nome = 'Nome deve ter pelo menos 2 caracteres'
    return false
  }
  
  return true
}

const handleConfirm = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    let response: any
    
    if (props.isEdicao && props.especialidade) {
      // Editar especialidade existente
      response = await editarEspecialidade(props.especialidade.id, form.value.nome.trim())
    } else {
      // Inserir nova especialidade
      response = await inserirEspecialidade(form.value.nome.trim())
    }
    
    if (response.success) {
      console.log(props.isEdicao ? 'Especialidade editada:' : 'Especialidade criada:', response.message)
      emit('success')
      handleClose()
    } else {
      errors.value.nome = response.message
    }
  } catch (error) {
    console.error('Erro ao salvar especialidade:', error)
    errors.value.nome = 'Erro ao salvar especialidade. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  resetForm()
  modalVisible.value = false
}

// Carregar dados para edição (usando dados passados diretamente)
const loadEspecialidade = () => {
  if (!props.isEdicao || !props.especialidade) {
    return
  }
  
  // Preencher formulário com dados já disponíveis
  form.value.nome = props.especialidade.nome
}

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetForm()
      if (props.isEdicao && props.especialidade) {
        loadEspecialidade()
      }
    }
  }
)
</script>