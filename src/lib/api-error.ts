import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class ApiError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly code?: string
    ) {
        super(message)
        this.name = 'ApiError'
    }

    static badRequest(message: string, code?: string) {
        return new ApiError(400, message, code)
    }

    static unauthorized(message = 'Unauthorized') {
        return new ApiError(401, message, 'UNAUTHORIZED')
    }

    static forbidden(message = 'Forbidden') {
        return new ApiError(403, message, 'FORBIDDEN')
    }

    static notFound(message = 'Not found') {
        return new ApiError(404, message, 'NOT_FOUND')
    }

    static conflict(message: string) {
        return new ApiError(409, message, 'CONFLICT')
    }

    static internal(message = 'Internal server error') {
        return new ApiError(500, message, 'INTERNAL_ERROR')
    }
}

export function handleApiError(error: unknown): NextResponse {
    console.error('API Error:', error)

    // Zod validation errors
    if (error instanceof ZodError) {
        const formattedErrors = error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
        }))
        return NextResponse.json(
            { error: 'Validation failed', details: formattedErrors },
            { status: 400 }
        )
    }

    // Custom API errors
    if (error instanceof ApiError) {
        return NextResponse.json(
            { error: error.message, code: error.code },
            { status: error.statusCode }
        )
    }

    // Generic errors
    if (error instanceof Error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    // Unknown errors
    return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
    )
}

// Helper to wrap API handlers with error handling
export function withErrorHandler<T>(
    handler: () => Promise<T>
): Promise<T | NextResponse> {
    return handler().catch(handleApiError)
}
