# RPC Handler for Remix

This directory contains utilities for handling RPC (Remote Procedure Call) requests in Remix applications. The RPC handler provides a consistent way to handle API requests with validation, error handling, and type safety.

## Features

- **Zod Validation**: Validate request data using Zod schemas
- **Neverthrow Error Handling**: Use the Result type for predictable error handling
- **Type Safety**: Full TypeScript support with proper type inference
- **Consistent Response Format**: Standardized JSON responses for both success and error cases
- **HTTP Method Support**: GET for queries and POST for mutations

## Usage

### Query Example (GET)

```typescript
// Define your input schema
const MySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

// Define your output type
type MyOutput = {
  id: string
  name: string
  email: string
}

// Create your handler function
async function myHandler(
  data: z.infer<typeof MySchema>
): Promise<ResultAsync<MyOutput, RouteError>> {
  // Process the data
  const result = {
    id: '123',
    name: data.name,
    email: data.email,
  }
  
  return okAsync(result)
}

// Create the RPC handler for your loader (GET)
export const loader = createRpcQueryHandler(MySchema, myHandler)
```

### Mutation Example (POST)

```typescript
// Define your input schema
const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['user', 'admin']).default('user'),
})

// Define your output type
type CreateUserOutput = {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
}

// Create your handler function with context
async function createUserHandler(
  data: z.infer<typeof CreateUserSchema>,
  ctx: { session: { user?: { id: string } } }
): Promise<ResultAsync<CreateUserOutput, RouteError>> {
  // Check authentication
  if (!ctx.session.user) {
    return errAsync(unauthorized('Authentication required'))
  }
  
  // Process the data
  const user = {
    id: '123',
    name: data.name,
    email: data.email,
    role: data.role,
    createdAt: new Date(),
  }
  
  return okAsync(user)
}

// Create a wrapper function that provides the context
function createUserWithContext(data: z.infer<typeof CreateUserSchema>) {
  const ctx = {
    session: {
      user: { id: '123' }, // Get from request in a real app
    },
  }
  
  return createUserHandler(data, ctx)
}

// Create the RPC handler for your action (POST)
export const action = createRpcMutationHandler(CreateUserSchema, createUserWithContext)
```

## Response Format

### Success Response

```json
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Error Response

```json
{
  "error": "Invalid email address"
}
```

## Error Handling

The RPC handler uses the `RouteError` type from `~/utils/errors` for error handling. This provides a consistent way to handle different types of errors:

- `BadRequest`: Invalid input data (400)
- `Unauthorized`: Authentication required (401)
- `NotFound`: Resource not found (404)
- `Conflict`: Resource conflict (409)
- `Other`: Unexpected errors (500)

## Type Safety

The RPC handler is fully type-safe, with proper type inference for both input and output types. This ensures that your API endpoints are type-safe and provides a better developer experience.

## HTTP Methods

The RPC handler supports different HTTP methods for different types of operations:

- **GET**: Used for queries (read operations)
  - Data is passed as URL query parameters
  - Use `createRpcQueryHandler` for loader functions

- **POST**: Used for mutations (write operations)
  - Data is passed in the request body as JSON
  - Use `createRpcMutationHandler` for action functions

This follows RESTful API design principles where GET is used for retrieving data and POST is used for creating or modifying data. 