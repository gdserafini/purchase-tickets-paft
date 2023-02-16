export const swaggerDocument = {
    "openapi": "3.0.0",
    "info": {
        "title": "Tickets purchase API documentation.",
        "description": "In this documentation you can consult and test the routes of purchase service.",        
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "http://localhost:3004",
            "description": "Local server."
        }
    ],
    "paths": {
        "/purchase/me?show=show-test": {
            "post": {
                "summary": "Create a purchase.",
                "description": "Create a purchase by logged user (by JWT token and show name)",
                "security": [{ "bearerAuth": [] }],
                "response": {
                    "200": {
                        "description": "Succesfuly."
                    },
                    "400": {
                        "description": "Missing data - Bad request."
                    },
                    "401": {
                        "description": "Missing authorization - Unauthorized."
                    },
                    "403": {
                        "description": "Cannot buy - Forbidden"
                    },
                    "404": {
                        "description": "Not found."
                    },
                    "500": {
                        "description": "Internal server error."
                    }
                }
            }
        },
        "/purchase/me": {
            "delete": {
                "summary": "Delete all purchases.",
                "description": "Delete all purchases by logged user (by JWT token)",
                "security": [{ "bearerAuth": [] }],
                "response": {
                    "200": {
                        "description": "Succesfuly."
                    },
                    "400": {
                        "description": "Missing data - Bad request."
                    },
                    "401": {
                        "description": "Missing authorization - Unauthorized."
                    },
                    "500": {
                        "description": "Internal server error."
                    }
                }
            }
        },
        "/purchase/me/{id}": {
            "delete": {
                "summary": "Delete a specific purchases.",
                "description": "Delete a purchases by logged user (by JWT token and params.id)",
                "security": [{ "bearerAuth": [] }],
                "response": {
                    "200": {
                        "description": "Succesfuly."
                    },
                    "400": {
                        "description": "Missing data - Bad request."
                    },
                    "401": {
                        "description": "Missing authorization - Unauthorized."
                    },
                    "404": {
                        "description": "Not found."
                    },
                    "500": {
                        "description": "Internal server error."
                    }
                }
            }
        },
        "/purchase/list/me": {
            "get": {
                "summary": "Get your own purchases.",
                "description": "Return a list of all purchases from a logged user (by id on JWT token)",
                "security": [{ "bearerAuth": [] }],
                "response": {
                    "200": {
                        "description": "Succesfuly."
                    },
                    "400": {
                        "description": "Missing data - Bad request."
                    },
                    "401": {
                        "description": "Missing authorization - Unauthorized."
                    },
                    "404": {
                        "description": "Not found."
                    },
                    "500": {
                        "description": "Internal server error."
                    }
                }
            }
        }   
    },
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      }
    }
}