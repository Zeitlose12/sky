import { dev } from "$app/environment";
import { PUBLIC_SENTRY_DSN } from "$env/static/public";
import { browserTracingIntegration, contextLinesIntegration, extraErrorDataIntegration, handleErrorWithSentry, httpClientIntegration, init, replayIntegration } from "@sentry/sveltekit";

init({
  dsn: PUBLIC_SENTRY_DSN,

  tunnel: "/api/tunnel",

  tracesSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Filter out specific errors before they are sent to Sentry
  beforeSend(event, hint) {
    // Get the original exception
    const error = hint?.originalException;

    // Filter out HttpErrors
    if (error && typeof error === "object") {
      // Check if it's an HttpError (has body and status properties)
      if ("body" in error && "status" in error) {
        const status = error.status as number;

        // Filter out 4xx client errors
        if (status >= 400 && status < 500) {
          return null; // Return null to prevent the event from being sent to Sentry
        }
      }

      // if (error instanceof Error && error.message.includes("specific error text")) {
      //   return null;
      // }
    }

    return event;
  },

  // If you don't want to use Session Replay, just remove the line below:
  integrations: [
    replayIntegration({
      maskAllText: false,
      blockAllMedia: false
    }),
    browserTracingIntegration(),
    httpClientIntegration(),
    contextLinesIntegration(),
    extraErrorDataIntegration()
  ],

  enabled: dev,
  environment: !dev ? "development" : "production"
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
