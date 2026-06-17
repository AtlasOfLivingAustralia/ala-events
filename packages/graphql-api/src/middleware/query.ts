import { NextFunction, Request, Response } from "express";

const mutateQuery = (req: Request, res: Response, next: NextFunction) => {
  // Convert req.query to a mutable object 
  const mutableQuery = { ...req.query };

  // Re-define req.query as writable
  Object.defineProperty(req, 'query', {
    value: mutableQuery,
    writable: true,
    configurable: true
  });

  next();
}

export default mutateQuery;