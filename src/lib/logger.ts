type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Simple logger with PII redaction.
 * Never logs tokens, access_tokens, or sensitive PII.
 */
class Logger {
  private sensitiveKeys = [
    'password',
    'token',
    'access_token',
    'plaidAccessToken',
    'secret',
    'apiKey',
    'creditCard',
    'ssn',
    'socialSecurity',
  ];

  private redact(obj: unknown): unknown {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.redact(item));
    }

    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = this.sensitiveKeys.some((sk) => lowerKey.includes(sk.toLowerCase()));

      if (isSensitive) {
        redacted[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        redacted[key] = this.redact(value);
      } else {
        redacted[key] = value;
      }
    }
    return redacted;
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const redactedContext = context ? this.redact(context) : undefined;

    const logEntry = {
      timestamp,
      level,
      message,
      ...(redactedContext || {}),
    };

    const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    method(JSON.stringify(logEntry));
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, context);
    }
  }
}

export const logger = new Logger();
