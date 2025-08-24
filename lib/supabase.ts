import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// The environment variables were not loading correctly, causing the app to crash.
// Using the credentials directly from your connected project to ensure a stable connection.
const supabaseUrl = "https://xrcydwximpfkbhgnywpf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyY3lkd3hpbXBma2JoZ255d3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjYzNzUsImV4cCI6MjA3MTYwMjM3NX0.0ltDoZeWZtRi3n9X0UJV_4A7yyogAl7wd6oijXJ9ow8";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cards: {
        Row: {
          balance: number
          card_name: string
          card_number: string
          card_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          balance?: number
          card_name: string
          card_number: string
          card_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          balance?: number
          card_name?: string
          card_number?: string
          card_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      investments: {
        Row: {
          change_percent: number
          created_at: string
          id: string
          name: string
          symbol: string
          user_id: string
          value: number
        }
        Insert: {
          change_percent?: number
          created_at?: string
          id?: string
          name: string
          symbol: string
          user_id: string
          value?: number
        }
        Update: {
          change_percent?: number
          created_at?: string
          id?: string
          name?: string
          symbol?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      onboarding_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          response: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          response: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          response?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      savings_goals: {
        Row: {
          color: string
          created_at: string
          current_amount: number
          deadline: string | null
          emoji: string
          id: string
          target_amount: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          emoji?: string
          id?: string
          target_amount: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          emoji?: string
          id?: string
          target_amount?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          icon: string
          id: string
          merchant: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          icon: string
          id?: string
          merchant: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          icon?: string
          id?: string
          merchant?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          email: string
          financial_goals: string[] | null
          full_name: string | null
          id: string
          monthly_income: number | null
          occupation: string | null
          onboarding_completed: boolean
          risk_tolerance:
            | "conservative"
            | "moderate"
            | "aggressive"
            | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          email: string
          financial_goals?: string[] | null
          full_name?: string | null
          id?: string
          monthly_income?: number | null
          occupation?: string | null
          onboarding_completed?: boolean
          risk_tolerance?:
            | "conservative"
            | "moderate"
            | "aggressive"
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          financial_goals?: string[] | null
          full_name?: string | null
          id?: string
          monthly_income?: number | null
          occupation?: string | null
          onboarding_completed?: boolean
          risk_tolerance?:
            | "conservative"
            | "moderate"
            | "aggressive"
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
