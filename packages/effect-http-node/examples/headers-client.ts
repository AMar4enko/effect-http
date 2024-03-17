import { Schema } from "@effect/schema"
import { Effect, pipe, ReadonlyArray } from "effect"
import { Api, Client } from "effect-http"

// Example client triggering the API from `examples/headers.ts`
// Running the script call the `/hello` endpoint 1000k times

export const api = pipe(
  Api.make(),
  Api.addEndpoint(
    Api.post("hello", "/hello").pipe(
      Api.setResponseBody(Schema.string),
      Api.setRequestBody(Schema.struct({ value: Schema.number })),
      Api.setRequestHeaders(Schema.struct({ "x-client-id": Schema.string }))
    )
  )
)

const client = Client.make(api, { baseUrl: "http://localhost:3000" })

Effect.all(
  client.hello({ body: { value: 1 }, headers: { "x-client-id": "abc" } }).pipe(
    Effect.flatMap((r) => Effect.logInfo(`Success ${r}`)),
    Effect.catchAll((e) => Effect.logInfo(`Error ${JSON.stringify(e)}`)),
    ReadonlyArray.replicate(1000000)
  )
).pipe(Effect.scoped, Effect.runPromise)
