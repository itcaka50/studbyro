import { ErrorRequestHandler } from "express";
import { treeifyError, ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  console.log(err);
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof ZodError) {
    return res
      .status(400)
      .send({ message: 'Invalid input', errors: treeifyError(err) });
  }

  console.error('[Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Възникна грешка в сървъра.'
  });
};