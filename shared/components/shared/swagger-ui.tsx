'use client';

import SwaggerUIReact from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerUi() {
  return (
    <SwaggerUIReact
      url="/api/openapi"
      docExpansion="list"
      displayRequestDuration
      defaultModelsExpandDepth={-1}
      tryItOutEnabled
      persistAuthorization
      filter
    />
  );
}
