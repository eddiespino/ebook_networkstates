interface UnicornStudioInterface {
  readonly isInitialized: boolean;
  init: () => void;
}

interface Window {
  UnicornStudio?: UnicornStudioInterface;
}
