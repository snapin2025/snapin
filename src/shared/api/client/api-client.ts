type ApiConfig = {
  baseUrl?: string
  defaultHeaders?: Record<string, string>
}

type ApiResponse<T> = {
  data: T
  status: number
  headers: Headers
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
export class ApiClient {
  private config: Required<ApiConfig>

  constructor(config: ApiConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || '',
      defaultHeaders: {
        'Content-Type': 'application/json',
        ...config.defaultHeaders
      }
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint)
    const requestOptions = this.buildRequestOptions(options)

    const response = await fetch(url, {
      ...requestOptions
    })

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status, response)
    }

    // Parse JSON safely
    const data = await this.parseResponse<T>(response)

    return {
      data,
      status: response.status,
      headers: response.headers
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' })
  }

  private buildUrl(endpoint: string): string {
    // Handle both absolute and relative URLs
    if (endpoint.startsWith('http')) {
      return endpoint
    }
    return `${this.config.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  }

  private buildRequestOptions(options: RequestInit): RequestInit {
    return {
      ...options,
      headers: {
        ...this.config.defaultHeaders,
        ...options.headers
      }
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      try {
        return await response.json()
      } catch (error) {
        throw new ApiError('Invalid JSON response', response.status, response)
      }
    }

    return (await response.text()) as unknown as T
  }
}
