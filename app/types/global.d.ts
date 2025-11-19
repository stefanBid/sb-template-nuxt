declare global {
  /** Add all global types here **/

  interface LangItem {
    code: string
    label: string
    icon: string
  }

  interface RouteItem {
    name: string
    path: string
    disabled?: true
  }

  interface NotificationItem {
    id: string
    type: 'success' | 'warning' | 'error' | 'info'
    icon?: string | null
    title?: string | null
    message: string
    dismissible?: boolean
    autoClose?: boolean
    duration?: number
  }
}

export {}
