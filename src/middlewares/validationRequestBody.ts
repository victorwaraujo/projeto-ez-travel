import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { ZodError, AnyZodObject } from 'zod';

const validationRequestBody = (schema: AnyZodObject) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      schema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ message: error.errors[0].message });
      }
      throw error
    }
  }
}

export default validationRequestBody