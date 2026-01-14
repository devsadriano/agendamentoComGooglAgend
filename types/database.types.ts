export type Database = {
  public: {
    Tables: {
      ag_profiles: {
        Row: {
          id: number
          created_at: string
          user_id: string | null
          nome: string | null
          role: string | null
          email: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id?: string | null
          nome?: string | null
          role?: string | null
          email?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string | null
          nome?: string | null
          role?: string | null
          email?: string | null
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
