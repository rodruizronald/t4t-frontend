/**
 * Types related to search parameters and API requests
 */

/**
 * API parameters interface for job search requests
 */
export interface ApiParams {
  q?: string
  date_from?: string
  date_to?: string
  company?: string
  experience_level?: string
  work_mode?: string
  employment_type?: string
  limit: number
  offset: number
  [key: string]: string | number | undefined
}

/**
 * Generic search parameters interface for type-safe parameter handling
 */
export interface SearchParams {
  [key: string]: string | number | boolean | undefined | null
}

/**
 * Date range object for API requests
 */
export interface DateRange {
  date_from: string
  date_to: string
}

/**
 * Types related to search parameters and API responses
 */

/**
 * API job search response interface
 */
export interface ApiSearchResponse {
  data?: ApiJob[]
  pagination?: {
    total?: number
    limit?: number
    offset?: number
    has_more?: boolean
  }
}

export interface ApiJob {
  job_id: string
  title: string
  company_name: string
  company_id: string
  company_logo_url?: string
  description: string
  responsibilities?: string[]
  benefits?: string[]
  application_url: string
  experience_level: string
  employment_type: string
  location: string
  work_mode: string
  requirements?: ApiRequirements
  technologies?: ApiTechnology[]
  posted_at?: string
}

export interface ApiRequirements {
  must_have?: string[]
  nice_to_have?: string[]
}

export interface ApiTechnology {
  name: string
  [key: string]: unknown
}
