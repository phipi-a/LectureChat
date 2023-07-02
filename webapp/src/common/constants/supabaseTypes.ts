export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      data: {
        Row: {
          created_at: string | null
          data: string | null
          id: string
          page: number | null
          room_id: string
          video_end_ms: number | null
          video_start_ms: number | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          id?: string
          page?: number | null
          room_id: string
          video_end_ms?: number | null
          video_start_ms?: number | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          id?: string
          page?: number | null
          room_id?: string
          video_end_ms?: number | null
          video_start_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "data_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "room"
            referencedColumns: ["id"]
          }
        ]
      }
      room: {
        Row: {
          created_at: string | null
          id: string
          is_video_room: boolean | null
          password: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id: string
          is_video_room?: boolean | null
          password: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_video_room?: boolean | null
          password?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      room_access: {
        Row: {
          created_at: string | null
          id: string
          password: string | null
          room_id: string
          room_title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password?: string | null
          room_id: string
          room_title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password?: string | null
          room_id?: string
          room_title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_access_room_id_fkey"
            columns: ["room_id"]
            referencedRelation: "room"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_access_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      test: {
        Row: {
          created_at: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
        }
        Update: {
          created_at?: string | null
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      password: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      test: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
