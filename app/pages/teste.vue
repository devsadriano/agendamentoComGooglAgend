<template>
  <div class="min-h-screen bg-background-secondary">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-text-primary mb-2">
          Teste de Componentes
        </h1>
        <p class="text-lg text-text-secondary">
          Avaliação dos componentes BaseButton e BaseInput
        </p>
      </header>

      <div class="max-w-4xl mx-auto space-y-12">
        <!-- BaseButton Tests -->
        <section class="bg-white rounded-2xl p-8 shadow-card">
          <h2 class="text-2xl font-bold text-text-primary mb-6">BaseButton</h2>
          
          <!-- Variantes -->
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-text-primary mb-4">Variantes</h3>
              <div class="flex flex-wrap gap-3">
                <BaseButton variant="primary" text="Primary" />
                <BaseButton variant="secondary" text="Secondary" />
                <BaseButton variant="success" text="Success" />
                <BaseButton variant="warning" text="Warning" />
                <BaseButton variant="error" text="Error" />
                <BaseButton variant="ghost" text="Ghost" />
                <BaseButton variant="outline" text="Outline" />
              </div>
            </div>

            <!-- Tamanhos -->
            <div>
              <h3 class="text-lg font-semibold text-text-primary mb-4">Tamanhos</h3>
              <div class="flex flex-wrap items-center gap-3">
                <BaseButton size="xs" text="Extra Small" />
                <BaseButton size="sm" text="Small" />
                <BaseButton size="md" text="Medium" />
                <BaseButton size="lg" text="Large" />
                <BaseButton size="xl" text="Extra Large" />
              </div>
            </div>

            <!-- Estados -->
            <div>
              <h3 class="text-lg font-semibold text-text-primary mb-4">Estados</h3>
              <div class="flex flex-wrap gap-3">
                <BaseButton text="Normal" />
                <BaseButton text="Disabled" disabled />
                <BaseButton text="Loading" loading />
                <BaseButton text="Full Width" full-width />
              </div>
            </div>

            <!-- Com ícones -->
            <div>
              <h3 class="text-lg font-semibold text-text-primary mb-4">Com Ícones</h3>
              <div class="flex flex-wrap gap-3">
                <BaseButton text="Salvar">
                  <template #icon-left>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6a1 1 0 10-2 0v5.586l-1.293-1.293z"/>
                    </svg>
                  </template>
                </BaseButton>
                
                <BaseButton text="Próximo" variant="outline">
                  <template #icon-right>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </template>
                </BaseButton>
                
                <BaseButton variant="ghost">
                  <template #icon-left>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                  </template>
                </BaseButton>
              </div>
            </div>
          </div>
        </section>

        <!-- BaseInput Tests -->
        <section class="bg-white rounded-2xl p-8 shadow-card">
          <h2 class="text-2xl font-bold text-text-primary mb-6">BaseInput</h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Coluna 1 -->
            <div class="space-y-6">
              <!-- Básicos -->
              <div>
                <h3 class="text-lg font-semibold text-text-primary mb-4">Básicos</h3>
                <div class="space-y-4">
                  <BaseInput
                    label="Nome completo"
                    placeholder="Digite seu nome"
                    v-model="formData.name"
                  >
                    <template #icon-left>
                      <UserIcon class="w-5 h-5 text-text-tertiary" />
                    </template>
                  </BaseInput>
                  
                  <BaseInput
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    v-model="formData.email"
                    required
                  >
                    <template #icon-left>
                      <EnvelopeIcon class="w-5 h-5 text-text-tertiary" />
                    </template>
                  </BaseInput>
                  
                  <BaseInput
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    v-model="formData.password"
                    required
                  >
                    <template #icon-left>
                      <LockClosedIcon class="w-5 h-5 text-text-tertiary" />
                    </template>
                  </BaseInput>
                </div>
              </div>

              <!-- Tamanhos -->
              <div>
                <h3 class="text-lg font-semibold text-text-primary mb-4">Tamanhos</h3>
                <div class="space-y-4">
                  <BaseInput
                    size="sm"
                    placeholder="Small"
                    v-model="formData.small"
                  >
                    <template #icon-left>
                      <HashtagIcon class="w-4 h-4 text-text-tertiary" />
                    </template>
                  </BaseInput>
                  <BaseInput
                    size="md"
                    placeholder="Medium (padrão)"
                    v-model="formData.medium"
                  >
                    <template #icon-left>
                      <DocumentTextIcon class="w-5 h-5 text-text-tertiary" />
                    </template>
                  </BaseInput>
                  <BaseInput
                    size="lg"
                    placeholder="Large"
                    v-model="formData.large"
                  >
                    <template #icon-left>
                      <IdentificationIcon class="w-6 h-6 text-text-tertiary" />
                    </template>
                  </BaseInput>
                </div>
              </div>
            </div>

            <!-- Coluna 2 -->
            <div class="space-y-6">
              <!-- Variantes -->
              <div>
                <h3 class="text-lg font-semibold text-text-primary mb-4">Variantes</h3>
                <div class="space-y-4">
                  <BaseInput
                    label="Default"
                    variant="default"
                    placeholder="Estilo padrão"
                    v-model="formData.default"
                  >
                    <template #icon-left>
                      <DocumentTextIcon class="w-5 h-5 text-text-tertiary" />
                    </template>
                  </BaseInput>
                  
                  <BaseInput
                    label="Filled"
                    variant="filled"
                    placeholder="Estilo preenchido"
                    v-model="formData.filled"
                  >
                    <template #icon-left>
                      <IdentificationIcon class="w-5 h-5 text-text-tertiary" />
                    </template>
                  </BaseInput>
                  
                  <BaseInput
                    label="Borderless"
                    variant="borderless"
                    placeholder="Sem bordas"
                    v-model="formData.borderless"
                  >
                    <template #icon-left>
                      <UserIcon class="w-5 h-5 text-text-tertiary" />
                    </template>
                  </BaseInput>
                </div>
              </div>

              <!-- Estados especiais -->
              <div>
                <h3 class="text-lg font-semibold text-text-primary mb-4">Estados</h3>
                <div class="space-y-4">
                  <BaseInput
                    label="Com erro"
                    placeholder="Campo inválido"
                    error-message="Este campo é obrigatório"
                    v-model="formData.error"
                  >
                    <template #icon-left>
                      <XCircleIcon class="w-5 h-5 text-error" />
                    </template>
                  </BaseInput>
                  
                  <BaseInput
                    label="Desabilitado"
                    placeholder="Campo desabilitado"
                    disabled
                    v-model="formData.disabled"
                  >
                    <template #icon-left>
                      <LockClosedIcon class="w-5 h-5 text-text-tertiary" />
                    </template>
                  </BaseInput>
                  
                  <BaseInput
                    label="Readonly"
                    value="Texto somente leitura"
                    readonly
                    helper-text="Este campo não pode ser editado"
                  >
                    <template #icon-left>
                      <DocumentTextIcon class="w-5 h-5 text-text-tertiary" />
                    </template>
                  </BaseInput>
                </div>
              </div>
            </div>
          </div>

          <!-- Com ícones -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-text-primary mb-4">Com Ícones Especiais</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <BaseInput
                label="Buscar"
                placeholder="Digite para buscar..."
                v-model="formData.search"
              >
                <template #icon-left>
                  <MagnifyingGlassIcon class="w-5 h-5 text-text-tertiary" />
                </template>
              </BaseInput>
              
              <BaseInput
                label="Valor"
                type="number"
                placeholder="0,00"
                v-model="formData.price"
              >
                <template #icon-left>
                  <CurrencyDollarIcon class="w-5 h-5 text-text-tertiary" />
                </template>
              </BaseInput>
              
              <BaseInput
                label="Telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                v-model="formData.phone"
              >
                <template #icon-left>
                  <PhoneIcon class="w-5 h-5 text-text-tertiary" />
                </template>
              </BaseInput>
              
              <BaseInput
                label="Data de Agendamento"
                type="date"
                v-model="formData.date"
              >
                <template #icon-left>
                  <CalendarIcon class="w-5 h-5 text-text-tertiary" />
                </template>
              </BaseInput>
            </div>
          </div>

          <!-- Password Toggle Demo -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-text-primary mb-4">Toggle de Senha (Olhinho)</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <BaseInput
                label="Senha com Toggle"
                type="password"
                placeholder="Digite sua senha"
                v-model="formData.passwordToggle"
                helper-text="Clique no ícone do olho para mostrar/ocultar"
              >
                <template #icon-left>
                  <LockClosedIcon class="w-5 h-5 text-text-tertiary" />
                </template>
              </BaseInput>
              
              <BaseInput
                label="Confirmar Senha"
                type="password"
                placeholder="Confirme sua senha"
                v-model="formData.confirmPassword"
                helper-text="Funcionalidade automática para campos password"
              >
                <template #icon-left>
                  <LockClosedIcon class="w-5 h-5 text-text-tertiary" />
                </template>
              </BaseInput>
            </div>
          </div>

          <!-- Valores atuais -->
          <div class="mt-8 p-4 bg-neutral-50 rounded-lg">
            <h4 class="text-sm font-semibold text-text-primary mb-2">Valores dos campos:</h4>
            <pre class="text-xs text-text-secondary">{{ JSON.stringify(formData, null, 2) }}</pre>
          </div>
        </section>

        <!-- Heroicons + Toast -->
        <section class="bg-white rounded-2xl p-8 shadow-card">
          <h2 class="text-2xl font-bold text-text-primary mb-6">Heroicons + Notificações Toast</h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Ícones -->
            <div>
              <h3 class="text-lg font-semibold text-text-primary mb-4">Heroicons</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <UserIcon class="w-6 h-6 text-primary-500" />
                  <span>UserIcon</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <CalendarIcon class="w-6 h-6 text-secondary-500" />
                  <span>CalendarIcon</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <ClockIcon class="w-6 h-6 text-warning" />
                  <span>ClockIcon</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <BellIcon class="w-6 h-6 text-error" />
                  <span>BellIcon</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <CheckCircleIcon class="w-6 h-6 text-success" />
                  <span>CheckCircleIcon</span>
                </div>
              </div>
            </div>

            <!-- Toast Tests -->
            <div>
              <h3 class="text-lg font-semibold text-text-primary mb-4">Notificações Toast</h3>
              <div class="space-y-3">
                <BaseButton 
                  @click="showSuccessToast" 
                  variant="success" 
                  full-width
                >
                  <template #icon-left>
                    <CheckCircleIcon class="w-4 h-4" />
                  </template>
                  Toast de Sucesso
                </BaseButton>
                
                <BaseButton 
                  @click="showErrorToast" 
                  variant="error" 
                  full-width
                >
                  <template #icon-left>
                    <XCircleIcon class="w-4 h-4" />
                  </template>
                  Toast de Erro
                </BaseButton>
                
                <BaseButton 
                  @click="showWarningToast" 
                  variant="warning" 
                  full-width
                >
                  <template #icon-left>
                    <ExclamationTriangleIcon class="w-4 h-4" />
                  </template>
                  Toast de Aviso
                </BaseButton>
                
                <BaseButton 
                  @click="showInfoToast" 
                  variant="outline" 
                  full-width
                >
                  <template #icon-left>
                    <InformationCircleIcon class="w-4 h-4" />
                  </template>
                  Toast de Info
                </BaseButton>
                
                <BaseButton 
                  @click="clearAllToasts" 
                  variant="ghost" 
                  full-width
                >
                  <template #icon-left>
                    <TrashIcon class="w-4 h-4" />
                  </template>
                  Limpar Todos
                </BaseButton>
              </div>
            </div>
          </div>
        </section>

        <!-- Teste de interação -->
        <section class="bg-white rounded-2xl p-8 shadow-card">
          <h2 class="text-2xl font-bold text-text-primary mb-6">Teste de Interação</h2>
          
          <div class="space-y-4">
            <div class="flex gap-4">
              <BaseButton @click="clearForm" variant="outline">
                Limpar Formulário
              </BaseButton>
              <BaseButton @click="fillSampleData" variant="secondary">
                Preencher Dados de Exemplo
              </BaseButton>
              <BaseButton @click="showAlert" variant="success">
                Testar Clique
              </BaseButton>
            </div>
            
            <p class="text-sm text-text-tertiary">
              Use os botões acima para testar as interações com os componentes.
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports dos ícones Heroicons
import {
  UserIcon,
  CalendarIcon,
  ClockIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  IdentificationIcon,
  DocumentTextIcon,
  HashtagIcon,
} from '@heroicons/vue/24/outline'

// Configurações da página
definePageMeta({
  title: 'Teste de Componentes'
})

useHead({
  title: 'Teste de Componentes - Design System',
  meta: [
    { name: 'description', content: 'Página para testar os componentes BaseButton e BaseInput' }
  ]
})

// Composable para notificações
const { showSuccess, showError, showWarning, showInfo, clear } = useNotification()

// Dados do formulário reativo
const formData = ref({
  name: '',
  email: '',
  password: '',
  small: '',
  medium: '',
  large: '',
  default: '',
  filled: '',
  borderless: '',
  error: '',
  disabled: '',
  search: '',
  price: '',
  phone: '',
  date: '',
  passwordToggle: '',
  confirmPassword: '',
})

// Funções de teste
const clearForm = () => {
  Object.keys(formData.value).forEach(key => {
    formData.value[key as keyof typeof formData.value] = ''
  })
}

const fillSampleData = () => {
  formData.value = {
    name: 'João Silva',
    email: 'joao@exemplo.com',
    password: 'senha123',
    small: 'Texto pequeno',
    medium: 'Texto médio',
    large: 'Texto grande',
    default: 'Padrão',
    filled: 'Preenchido',
    borderless: 'Sem bordas',
    error: 'Com erro',
    disabled: '',
    search: 'Buscar algo...',
    price: '299.90',
    phone: '(11) 99999-9999',
    date: '2025-10-15',
    passwordToggle: 'minhasenha123',
    confirmPassword: 'minhasenha123',
  }
}

// Funções para toast
const showSuccessToast = () => {
  showSuccess('Operação realizada com sucesso! ✅')
}

const showErrorToast = () => {
  showError('Ocorreu um erro inesperado! ❌')
}

const showWarningToast = () => {
  showWarning('Atenção: Verifique as informações! ⚠️')
}

const showInfoToast = () => {
  showInfo('Esta é uma informação importante! ℹ️')
}

const clearAllToasts = () => {
  clear()
}

const showAlert = () => {
  alert('Botão clicado com sucesso! 🎉')
}
</script>