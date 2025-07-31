export interface ReactLogContext {
  component?: string
  action?: string
  userId?: string
  props?: Record<string, unknown>
  state?: Record<string, unknown>
  metric?: string
  value?: number
  method?: string
  url?: string
  status?: number
  duration?: number
  [key: string]: unknown
}
