import { faker } from '@faker-js/faker';

export const schema = {
  type: "object",
  properties: {
    features: {
      type: "array",
      minItems: 10,
      maxItems: 10,
      items: {
        type: "object",
        properties: {
          properties: {
            type: "object",
            properties: {
              mag: { type: "number" },
              place: { type: "string" },
              time: { type: "number" },
              type: { type: "string", const: "earthquake" },
              tsunami: { type: "integer" }
            },
            required: ["mag", "place", "time", "type", "tsunami"]
          }
        },
        required: ["properties"]
      }
    }
  },
  required: ["features"]
};

