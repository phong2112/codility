import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // Specify the version of OpenAPI/Swagger
    info: {
      title: "Express API with Swagger",
      version: "1.0.0",
      description: "A simple CRUD API application with Swagger documentation",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`, // Replace with your server URL
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.ts"], // Path to the API docs (include route files)
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
