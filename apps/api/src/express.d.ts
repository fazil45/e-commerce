declare global {
  namespace Express {
    interface Request {
      userId:_id
    }
  }
}

export {};