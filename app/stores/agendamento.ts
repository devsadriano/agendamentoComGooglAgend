import { defineStore } from 'pinia'
import type { AgendamentoState, DiaSemana } from '../../shared/types/database'

/**
 * Store de agendamentos - gerencia a navegação de semanas e dias
 * Controla a data de referência e calcula automaticamente os dias da semana
 */
export const useAgendamentoStore = defineStore('agendamento', {
  state: (): AgendamentoState => ({
    dataReferencia: new Date(),
    loading: false,
    error: null
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    dataAtual: (state) => state.dataReferencia,
    
    /**
     * Calcula automaticamente os dias da semana baseado na data de referência
     * Este getter é reativo e se atualiza sempre que dataReferencia mudar
     */
    semanaAtual: (state): DiaSemana[] => {
      const diasSemana: DiaSemana[] = []
      const nomesDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
      
      // Encontrar o domingo da semana da data de referência
      const dataRef = new Date(state.dataReferencia)
      const diaSemanaRef = dataRef.getDay() // 0 = domingo, 1 = segunda, etc.
      const inicioSemana = new Date(dataRef)
      inicioSemana.setDate(dataRef.getDate() - diaSemanaRef)
      
      // Gerar os 7 dias da semana (domingo a sábado)
      for (let i = 0; i < 7; i++) {
        const data = new Date(inicioSemana)
        data.setDate(inicioSemana.getDate() + i)
        
        const diaSemana: DiaSemana = {
          data: new Date(data),
          diaSemana: nomesDias[i] || '',
          diaNumero: data.getDate(),
          mesAno: data.toLocaleDateString('pt-BR', { 
            month: 'short', 
            year: 'numeric' 
          }).replace('.', '')
        }
        
        diasSemana.push(diaSemana)
      }
      
      return diasSemana
    }
  },

  actions: {
    /**
     * Avança uma semana (soma 7 dias na data de referência)
     */
    avancarSemana() {
      const novaData = new Date(this.dataReferencia)
      novaData.setDate(novaData.getDate() + 7)
      this.dataReferencia = novaData
    },

    /**
     * Volta uma semana (subtrai 7 dias da data de referência)
     */
    voltarSemana() {
      const novaData = new Date(this.dataReferencia)
      novaData.setDate(novaData.getDate() - 7)
      this.dataReferencia = novaData
    },

    /**
     * Define uma nova data de referência
     */
    setDataReferencia(novaData: Date) {
      this.dataReferencia = new Date(novaData)
    }
  }
})