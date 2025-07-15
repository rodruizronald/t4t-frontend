/**
 * Transform API job response to frontend format
 * Converts snake_case API fields to camelCase frontend fields
 */

/**
 * Transform a single job from API format to frontend format
 * @param {Object} apiJob - Job object from API response
 * @returns {Object} Transformed job object for frontend use
 */
export const transformJob = apiJob => {
  if (!apiJob) return null

  return {
    // Basic job information
    id: apiJob.job_id,
    title: apiJob.title,
    company: apiJob.company_name,
    companyId: apiJob.company_id,
    companyLogoUrl: apiJob.company_logo_url,

    // Job details
    description: apiJob.description,
    responsibilities: apiJob.responsibilities || [],
    benefits: apiJob.benefits || [],
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
 * @param {Object} apiRequirements - Requirements from API
 * @returns {Object} Transformed requirements object
 */
const transformRequirements = apiRequirements => {
  if (!apiRequirements) return { mustHave: [], niceToHave: [] }

  return {
    mustHave: apiRequirements.must_have || [],
    niceToHave: apiRequirements.nice_to_have || [],
  }
}

/**
 * Transform technologies array from API format
 * @param {Array} apiTechnologies - Technologies array from API
 * @returns {Array} Array of technology names
 */
const transformTechnologies = apiTechnologies => {
  if (!Array.isArray(apiTechnologies)) return []

  return apiTechnologies.map(tech => tech.name)
}

/**
 * Transform posted date from API format to display format
 * @param {string} apiPostedAt - ISO date string from API
 * @returns {string} Human-readable date string
 */
const transformPostedDate = apiPostedAt => {
  if (!apiPostedAt) return 'Unknown'

  try {
    const postedDate = new Date(apiPostedAt)
    const now = new Date()
    const diffInMs = now - postedDate
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
    console.warn('Error parsing posted date:', apiPostedAt, error)
    return 'unknown'
  }
}

/**
 * Transform array of jobs from API format to frontend format
 * @param {Array} apiJobs - Array of job objects from API
 * @returns {Array} Array of transformed job objects
 */
export const transformJobs = apiJobs => {
  if (!Array.isArray(apiJobs)) return []

  return apiJobs.map(transformJob).filter(Boolean) // Filter out any null results
}

/**
 * Transform API search response to frontend format
 * @param {Object} apiResponse - Complete API response
 * @returns {Object} Transformed response object
 */
export const transformSearchResponse = apiResponse => {
  if (!apiResponse) return { jobs: [], pagination: null }

  return {
    jobs: transformJobs(apiResponse.data),
    pagination: {
      total: apiResponse.pagination?.total || 0,
      limit: apiResponse.pagination?.limit || 20,
      offset: apiResponse.pagination?.offset || 0,
      hasMore: apiResponse.pagination?.has_more || false,
    },
  }
}
