// logger.ts - Système de logging sécurisé
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

class Logger {
  private level: LogLevel;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.level = this.isProduction ? LogLevel.ERROR : LogLevel.DEBUG;
  }

  // Sécuriser les données sensibles avant logging
  private sanitize(data: any): any {
    if (!data) return data;
    
    if (typeof data === 'object') {
      const sanitized = { ...data };
      
      // Masquer les champs sensibles
      const sensitiveFields = ['password', 'token', 'api_key', 'apiKey', 'secret', 'credentials'];
      sensitiveFields.forEach(field => {
        if (field in sanitized) {
          sanitized[field] = '******';
        }
      });
      
      return sanitized;
    }
    
    return data;
  }

  debug(message: string, ...data: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      const sanitizedData = data.map(item => this.sanitize(item));
      if (this.isProduction) {
        // En production, ne pas logger les données, seulement les messages
        console.debug(`[DEBUG] ${message}`);
      } else {
        console.debug(`[DEBUG] ${message}`, ...sanitizedData);
      }
    }
  }

  info(message: string, ...data: any[]): void {
    if (this.level <= LogLevel.INFO) {
      const sanitizedData = data.map(item => this.sanitize(item));
      console.info(`[INFO] ${message}`, ...sanitizedData);
    }
  }

  warn(message: string, ...data: any[]): void {
    if (this.level <= LogLevel.WARN) {
      const sanitizedData = data.map(item => this.sanitize(item));
      console.warn(`[WARN] ${message}`, ...sanitizedData);
    }
  }

  error(message: string, ...data: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      const sanitizedData = data.map(item => this.sanitize(item));
      console.error(`[ERROR] ${message}`, ...sanitizedData);
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }
}

// Exporter une instance singleton
const logger = new Logger();
export default logger;
