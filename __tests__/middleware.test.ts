import { describe, it, expect, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '@/middleware'

describe('Auth Middleware', () => {
  function createRequest(pathname: string, hasSession = false): NextRequest {
    const url = `http://localhost:3000${pathname}`
    const request = new NextRequest(url)

    if (hasSession) {
      // Set session cookie
      request.cookies.set('session', 'test-session-id')
    }

    return request
  }

  describe('unauthenticated users', () => {
    it('should redirect to login when accessing root without session', () => {
      const request = createRequest('/')
      const response = middleware(request)

      expect(response.status).toBe(307) // Temporary redirect
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should redirect to login when accessing protected route', () => {
      const request = createRequest('/groups')
      const response = middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toContain('/login')
    })

    it('should preserve intended destination in redirect param', () => {
      const request = createRequest('/groups/123')
      const response = middleware(request)

      const location = response.headers.get('location')
      expect(location).toContain('redirect=%2Fgroups%2F123')
    })

    it('should allow access to login page', () => {
      const request = createRequest('/login')
      const response = middleware(request)

      expect(response.status).toBe(200)
    })

    it('should allow access to verify page', () => {
      const request = createRequest('/verify')
      const response = middleware(request)

      expect(response.status).toBe(200)
    })

    it('should allow access to verify page with query params', () => {
      const request = createRequest('/verify?token=abc123')
      const response = middleware(request)

      expect(response.status).toBe(200)
    })
  })

  describe('authenticated users', () => {
    it('should allow access to root', () => {
      const request = createRequest('/', true)
      const response = middleware(request)

      expect(response.status).toBe(200)
    })

    it('should allow access to protected routes', () => {
      const request = createRequest('/groups', true)
      const response = middleware(request)

      expect(response.status).toBe(200)
    })

    it('should redirect from login to root', () => {
      const request = createRequest('/login', true)
      const response = middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/')
    })

    it('should redirect from verify to root', () => {
      const request = createRequest('/verify', true)
      const response = middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/')
    })

    it('should redirect to intended destination after login', () => {
      const request = createRequest('/login?redirect=%2Fgroups%2F123', true)
      const response = middleware(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/groups/123')
    })

    it('should handle redirect parameter with encoded slashes', () => {
      const request = createRequest('/login?redirect=%2Fitems%2Fabc', true)
      const response = middleware(request)

      expect(response.headers.get('location')).toBe('http://localhost:3000/items/abc')
    })
  })

  describe('edge cases', () => {
    it('should handle nested auth routes', () => {
      const request = createRequest('/login/check-email')
      const response = middleware(request)

      expect(response.status).toBe(200)
    })

    it('should handle nested verify routes', () => {
      const request = createRequest('/verify/success')
      const response = middleware(request)

      expect(response.status).toBe(200)
    })

    it('should preserve query parameters in protected routes', () => {
      const request = createRequest('/groups?sort=name')
      const response = middleware(request)

      const location = response.headers.get('location')
      expect(location).toContain('redirect=%2Fgroups%3Fsort%3Dname')
    })

    it('should handle root redirect parameter correctly', () => {
      const request = createRequest('/login?redirect=%2F', true)
      const response = middleware(request)

      expect(response.headers.get('location')).toBe('http://localhost:3000/')
    })
  })
})
