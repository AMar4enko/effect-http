import { NodeRuntime } from "@effect/platform-node"
import { Schema } from "@effect/schema"
import { Effect } from "effect"
import { Api, ApiGroup, ExampleServer, RouterBuilder } from "effect-http"

import { NodeServer } from "effect-http-node"
import { debugLogger } from "./_utils.js"

const Response = Schema.struct({ name: Schema.string })

const testApi = ApiGroup.make("test", {
  description: "Test description",
  externalDocs: {
    description: "Test external doc",
    url: "https://www.google.com/search?q=effect-http"
  }
}).pipe(
  ApiGroup.addEndpoint(
    ApiGroup.get("test", "/test").pipe(Api.setResponseBody(Response))
  )
)

const userApi = ApiGroup.make("Users", {
  description: "All about users",
  externalDocs: {
    url: "https://www.google.com/search?q=effect-http"
  }
}).pipe(
  ApiGroup.addEndpoint(
    ApiGroup.get("getUser", "/user").pipe(Api.setResponseBody(Response))
  ),
  ApiGroup.addEndpoint(
    ApiGroup.post("storeUser", "/user").pipe(Api.setResponseBody(Response))
  ),
  ApiGroup.addEndpoint(
    ApiGroup.put("updateUser", "/user").pipe(Api.setResponseBody(Response))
  ),
  ApiGroup.addEndpoint(
    ApiGroup.delete("deleteUser", "/user").pipe(Api.setResponseBody(Response))
  )
)

const categoriesApi = ApiGroup.make("Categories").pipe(
  ApiGroup.addEndpoint(
    ApiGroup.get("getCategory", "/category").pipe(Api.setResponseBody(Response))
  ),
  ApiGroup.addEndpoint(
    ApiGroup.post("storeCategory", "/category").pipe(Api.setResponseBody(Response))
  ),
  ApiGroup.addEndpoint(
    ApiGroup.put("updateCategory", "/category").pipe(Api.setResponseBody(Response))
  ),
  ApiGroup.addEndpoint(
    ApiGroup.delete("deleteCategory", "/category").pipe(Api.setResponseBody(Response))
  )
)

const api = Api.make().pipe(
  Api.addGroup(testApi),
  Api.addGroup(userApi),
  Api.addGroup(categoriesApi)
)

ExampleServer.make(api).pipe(
  RouterBuilder.build,
  NodeServer.listen({ port: 3000 }),
  Effect.provide(debugLogger),
  NodeRuntime.runMain
)
