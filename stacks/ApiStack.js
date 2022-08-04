import { Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
  const { table } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        permissions: [table],
        environment: {
          TABLE_NAME: table.tableName,
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        },
      },
    },
    routes: {
      "GET /notes": "functions/list.main",
      "GET /notes/{id}": "functions/get.main",
      "POST /notes": "functions/create.main",
      "PUT /notes/{id}": "functions/update.main",
      "DELETE /notes/{id}": "functions/delete.main",
      "POST /billing": "functions/billing.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Return the API resource
  return {
    api,
  };
}


// Stripe test developer keys
// pk_test_51LSh6VJp2xMZehlhMrcxw19VL06lZXREjLmvtvqbF6UbvBXt1GcVOU4U0nETq5P3f9OdmLxvIFRzQGc8RbIQlQjE00ZJLtrW9E
// sk_test_51LSh6VJp2xMZehlh3uQxtBtP968fuLJMMSYfz9fqzm4vHGwZeAJkG4fgYK5xIPzAR3TV8pJrbi4szeX9H9IUTZCb00ZlAXDzVH


// Command to test
// npx aws-api-gateway-cli-test \  
// --username='admin@example.com' \
// --password='Passw0rd!' \
// --user-pool-id='us-east-1_d5fzI9CZh' \
// --app-client-id='hogf2ljpfr1dksql19u6lmg1e' \
// --cognito-region='us-east-1' \
// --identity-pool-id='us-east-1:71095a46-6e7b-45d9-a7f1-c33e9691981b' \
// --invoke-url='https://4w2tf5e74h.execute-api.us-east-1.amazonaws.com' \
// --api-gateway-region='us-east-1' \
// --path-template='/notes' \
// --method='POST' \
// --body='{"content":"hello world","attachment":"hello.jpg"}'