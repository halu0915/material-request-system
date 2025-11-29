/// <reference types="node" />

// Ensure Node.js global types are available
declare var process: NodeJS.Process;
declare var console: Console;
declare var Buffer: BufferConstructor;

// Extend global namespace
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      NODE_ENV?: string;
      PORT?: string;
      DATABASE_URL?: string;
      JWT_SECRET?: string;
      FRONTEND_URL?: string;
    }
  }
  
  var process: NodeJS.Process;
  var console: Console;
  var Buffer: BufferConstructor;
}

export {};
