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
            projects: {
                Row: {
                    id: string
                    title: string
                    description: string
                    phase: string
                    tags: string[]
                    needs: string[]
                    team_members: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description: string
                    phase: string
                    tags?: string[]
                    needs?: string[]
                    team_members?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string
                    phase?: string
                    tags?: string[]
                    needs?: string[]
                    team_members?: Json
                    created_at?: string
                }
            }
            backlog_ideas: {
                Row: {
                    id: string
                    title: string
                    description: string
                    category: string
                    skills: string
                    author: string
                    votes: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description: string
                    category: string
                    skills: string
                    author: string
                    votes?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string
                    category?: string
                    skills?: string
                    author?: string
                    votes?: number
                    created_at?: string
                }
            }
            join_requests: {
                Row: {
                    id: string
                    project_id: string | null
                    name: string
                    email: string
                    role: string
                    message: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    name: string
                    email: string
                    role: string
                    message?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    name?: string
                    email?: string
                    role?: string
                    message?: string | null
                    created_at?: string
                }
            }
            problems: {
                Row: {
                    id: string
                    user: string
                    problem: string
                    job_to_be_done: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user: string
                    problem: string
                    job_to_be_done: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user?: string
                    problem?: string
                    job_to_be_done?: string
                    created_at?: string
                }
            }
        }
    }
}
