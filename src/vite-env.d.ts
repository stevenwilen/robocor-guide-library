/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Lightweight creator-gate passcode. NOT a secret and NOT authentication.
   * Defaults to a local fallback when unset. See src/creator/useCreatorUnlock.ts.
   */
  readonly VITE_CREATOR_PASSCODE?: string;
  /**
   * Optional URL to POST guide drafts / update requests to for review. When
   * unset, the Builder honestly reports that submission is not connected and
   * relies on Copy / Download JSON. Never put private API keys in frontend env.
   */
  readonly VITE_SUBMISSION_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
