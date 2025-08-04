import { LogContext, logger } from '@/services/logging'

import {
  ApiJob,
  ApiRequirements,
  ApiSearchResponse,
  ApiTechnology,
} from '../types/api'
import { Job, SearchResponse } from '../types/models'

/**
 * Transform API job response to frontend format
 * Converts snake_case API fields to camelCase frontend fields
 */

/**
 * Transform a single job from API format to frontend format
 * @param apiJob - Job object from API response
 * @returns Transformed job object for frontend use
 */
export const transformJob = (apiJob: ApiJob | null | undefined): Job | null => {
  if (!apiJob) return null

  return {
    // Basic job information
    id: apiJob.job_id,
    title: apiJob.title,
    company: apiJob.company_name,
    companyId: apiJob.company_id,
    companyLogoUrl: apiJob.company_logo_url, // This is already optional in ApiJob

    // Job details
    description: apiJob.description,
    responsibilities: apiJob.responsibilities ?? [],
    benefits: apiJob.benefits ?? [],
    applicationUrl: apiJob.application_url,

    // Job classification
    experience: apiJob.experience_level,
    jobType: apiJob.employment_type,
    location: apiJob.location,
    workMode: apiJob.work_mode,

    // Requirements (transform nested object)
    requirements: transformRequirements(apiJob.requirements),

    // Technologies (transform array of objects to array of strings)
    technologies: transformTechnologies(apiJob.technologies),

    // Date information
    postedDate: transformPostedDate(apiJob.posted_at),
  }
}

/**
 * Transform requirements object from API format
 * @param apiRequirements - Requirements from API
 * @returns Transformed requirements object
 */
const transformRequirements = (
  apiRequirements?: ApiRequirements
): { mustHave: string[]; niceToHave: string[] } => {
  if (!apiRequirements) return { mustHave: [], niceToHave: [] }

  return {
    mustHave: apiRequirements.must_have ?? [],
    niceToHave: apiRequirements.nice_to_have ?? [],
  }
}

/**
 * Transform technologies array from API format
 * @param apiTechnologies - Technologies array from API
 * @returns Array of technology names
 */
const transformTechnologies = (apiTechnologies?: ApiTechnology[]): string[] => {
  if (!Array.isArray(apiTechnologies)) return []

  return apiTechnologies.map(tech => tech.name)
}

/**
 * Transform posted date from API format to display format
 * @param apiPostedAt - ISO date string from API
 * @returns Human-readable date string
 */
const transformPostedDate = (apiPostedAt?: string): string => {
  if (!apiPostedAt) return 'unknown'

  try {
    const postedDate = new Date(apiPostedAt)
    const now = new Date()
    const diffInMs = now.getTime() - postedDate.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    // Handle same day posts with hour precision
    if (diffInDays === 0) {
      if (diffInMinutes <= 1) return '1 minute ago'
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
      if (diffInHours === 1) return '1 hour ago'
      return `${diffInHours} hours ago`
    }

    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 14) return '1 week ago'
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 60) return '1 month ago'

    return `${Math.floor(diffInDays / 30)} months ago`
  } catch (error) {
    const logContext: LogContext = {
      component: 'transformer',
      action: 'date-transformation',
      apiPostedAt,
      errorType: error instanceof Error ? error.name : 'unknown',
      inputValue: apiPostedAt,
      ...(error instanceof Error && {
        errorMessage: error.message,
        errorStack: error.stack,
      }),
    }

    logger.warn('Error parsing posted date', logContext)
    return 'unknown'
  }
}

/**
 * Transform array of jobs from API format to frontend format
 * @param apiJobs - Array of job objects from API
 * @returns Array of transformed job objects
 */
export const transformJobs = (apiJobs?: ApiJob[]): Job[] => {
  if (!Array.isArray(apiJobs)) return []

  return apiJobs.map(transformJob).filter(Boolean) as Job[] // Filter out any null results
}

/**
 * Transform API search response to frontend format
 * @param apiResponse - Complete API response
 * @returns Transformed response object
 */
export const transformSearchResponse = (
  apiResponse?: ApiSearchResponse
): SearchResponse => {
  if (!apiResponse) return { jobs: [], pagination: null }

  return {
    jobs: transformJobs(apiResponse.data),
    pagination: apiResponse.pagination
      ? {
          total: apiResponse.pagination?.total ?? 0,
          limit: apiResponse.pagination?.limit ?? 20,
          offset: apiResponse.pagination?.offset ?? 0,
          hasMore: apiResponse.pagination?.has_more ?? false,
        }
      : null,
  }
}
