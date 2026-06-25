/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Web3Forms public access key. This key is designed to live in client-side
   * forms (spam protected), so it is NOT a private API key. When set, the
   * Builder's "Submit for approval" POSTs the draft to Web3Forms, which emails
   * it to the inbox tied to the key. Get a key at https://web3forms.com.
   */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
  /**
   * Optional alternative: a custom URL to POST drafts to for review (any
   * form-to-email relay that accepts a JSON body). When neither this nor the
   * Web3Forms key is set, the Builder shows an honest "submission not
   * connected" message and relies on Copy/Download JSON. Never put private API
   * keys in frontend env vars.
   */
  readonly VITE_COURSE_SUBMISSION_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
