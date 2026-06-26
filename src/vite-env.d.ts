/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Lightweight creator-gate passcode. NOT a secret and NOT authentication.
   * Defaults to a local fallback when unset. See src/creator/useCreatorUnlock.ts.
   */
  readonly VITE_CREATOR_PASSCODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
