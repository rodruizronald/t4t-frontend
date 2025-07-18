/**
 * Frontend model types for the jobs feature
 */

export interface SearchResponse {
  jobs: Job[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  } | null
}

export interface Job {
  id: string
  title: string
  company: string
  companyId: string
  companyLogoUrl?: string | undefined
  description: string
  responsibilities: string[]
  benefits: string[]
  applicationUrl: string
  experience: string
  jobType: string
  location: string
  workMode: string
  requirements: {
    mustHave: string[]
    niceToHave: string[]
  }
  technologies: string[]
  postedDate: string
}
