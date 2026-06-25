/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional URL to POST course drafts to for review. When unset, the Builder
   * shows an honest "submission not connected" message and relies on
   * Copy/Download JSON. Never put private API keys in frontend env vars.
   */
  readonly VITE_COURSE_SUBMISSION_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
