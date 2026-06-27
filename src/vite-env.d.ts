/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Lightweight creator-gate passcode. NOT a secret and NOT authentication.
   * Defaults to a local fallback when unset. See src/creator/useCreatorUnlock.ts.
   */
  readonly VITE_CREATOR_PASSCODE?: string;
  /**
   * Public Web3Forms access key used to email a submitted guide brief (with its
   * file attachments) to Steven. PUBLIC by design - not a secret. Falls back to
   * a built-in key when unset. See src/creator/brief/submit.ts.
   */
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
