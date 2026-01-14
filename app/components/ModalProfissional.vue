<template>
  <BaseModal
    v-model="modalVisible"
    :title="isEdicao ? 'Editar Profissional' : 'Novo Profissional'"
    :confirm-text="isEdicao ? 'Atualizar' : 'Criar'"
    :confirm-variant="isEdicao ? 'success' : 'primary'"
    cancel-text="Cancelar"
    :loading="loading"
    :disabled="!isFormValid"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <!-- Verificar se é admin antes de mostrar o formulário -->
    <div v-if="!isAdmin" class="text-center py-8">
      <div class="text-gray-500">
        <p class="text-lg">Acesso restrito</p>
        <p class="text-sm">Apenas administradores podem gerenciar profissionais.</p>
      </div>
    </div>

    <!-- Formulário - só aparece para admins -->
    <form v-else @submit.prevent="handleConfirm" class="space-y-4">
      <div>
        <label for="perfil" class="block text-sm font-medium text-gray-700 mb-1">
          Selecionar Perfil
          <span class="text-red-500 ml-1">*</span>
        </label>
        <select
          id="perfil"
          v-model="form.profile_id"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.profile_id }"
          required
        >
          <option value="">Selecione um perfil</option>
          <option 
            v-for="perfil in perfis" 
            :key="perfil.id" 
            :value="perfil.id"
          >
            {{ perfil.nome }}
          </option>
        </select>
        <p v-if="errors.profile_id" class="mt-1 text-sm text-red-600">
          {{ errors.profile_id }}
        </p>
      </div>

      <div>
        <label for="especialidade" class="block text-sm font-medium text-gray-700 mb-1">
          Selecionar Especialidade
          <span class="text-red-500 ml-1">*</span>
        </label>
        <select
          id="especialidade"
          v-model="form.especialidade_id"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.especialidade_id }"
          required
        >
          <option value="">Selecione uma especialidade</option>
          <option 
            v-for="especialidade in especialidades" 
            :key="especialidade.id" 
            :value="especialidade.id"
          >
            {{ especialidade.nome }}
          </option>
        </select>
        <p v-if="errors.especialidade_id" class="mt-1 text-sm text-red-600">
          {{ errors.especialidade_id }}
        </p>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Profissional, Perfil, Especialidade } from '../../shared/types/database'

interface Props {
  modelValue: boolean
  isEdicao?: boolean
  profissional?: Profissional | null
  perfis: Perfil[]
  especialidades: Especialidade[]
  isAdmin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdicao: false,
  profissional: null,
  isAdmin: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

// Composables
const { inserirProfissional, editarProfissional } = useProfissionais()
const toast = useNotification()

// Estados reativos
const loading = ref(false)
const form = ref({
  profile_id: '',
  especialidade_id: ''
})
const errors = ref({
  profile_id: '',
  especialidade_id: ''
})

// Computed
const modalVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isFormValid = computed(() => {
  // Se não for admin, desabilitar o formulário
  if (!props.isAdmin) return false
  
  return form.value.profile_id !== '' && form.value.especialidade_id !== ''
})

// Métodos
const resetForm = () => {
  form.value = {
    profile_id: '',
    especialidade_id: ''
  }
  errors.value = {
    profile_id: '',
    especialidade_id: ''
  }
}

const validateForm = () => {
  errors.value.profile_id = ''
  errors.value.especialidade_id = ''
  
  if (!form.value.profile_id) {
    errors.value.profile_id = 'Perfil é obrigatório'
    return false
  }
  
  if (!form.value.especialidade_id) {
    errors.value.especialidade_id = 'Especialidade é obrigatória'
    return false
  }
  
  return true
}

const handleConfirm = async () => {
  // Verificar se é admin antes de processar
  if (!props.isAdmin) return
  
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    if (props.isEdicao) {
      // Editar profissional existente
      if (!props.profissional) {
        throw new Error('Dados do profissional não encontrados')
      }
      
      await editarProfissional(
        props.profissional.profissional_id,
        Number(form.value.profile_id),
        Number(form.value.especialidade_id)
      )
      toast.showSuccess('Profissional atualizado com sucesso!')
    } else {
      // Inserir novo profissional
      await inserirProfissional(
        Number(form.value.profile_id),
        Number(form.value.especialidade_id)
      )
      toast.showSuccess('Profissional adicionado com sucesso!')
    }
    
    emit('success')
    handleClose()
  } catch (error) {
    console.error('Erro ao salvar profissional:', error)
    toast.showError('Erro ao salvar profissional. Tente novamente.')
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  resetForm()
  modalVisible.value = false
}

// Carregar dados para edição
const loadProfissional = () => {
  if (!props.isEdicao || !props.profissional) {
    return
  }
  
  // Preencher formulário com os IDs do profissional
  form.value.profile_id = props.profissional.profile_id.toString()
  form.value.especialidade_id = props.profissional.especialidade_id.toString()
}

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetForm()
      if (props.isEdicao && props.profissional) {
        loadProfissional()
      }
    }
  }
)
</script>