export abstract class BaseService {
  protected constructor() {}

  protected handleError(error: any, operation: string) {
    console.error(`Error ${operation}:`, {
      message: error.message,
      code: error.code,
      details: error.details
    });
    throw error;
  }

  protected logOperation(operation: string, data?: any) {
    console.log(`[${this.constructor.name}] ${operation}`, data);
  }
} 