// Global type definitions for Node.js
declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare var process: NodeJS.Process;
declare var console: Console;
declare var Buffer: BufferConstructor;

