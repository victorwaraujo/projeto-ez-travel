import { FastifyInstance } from "fastify";
import { compare, hash } from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { env } from "../env";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function registerUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/register', {
        schema: {
            body: z.object({
                name: z.string().min(1),
                email: z.string().email(),
                password: z.string().min(6)
            })
        }
    }, async (request, reply) => {
        const { name, email, password } = request.body;

        try {
            const encryptedPassword = await hash(password, 10);

            const user = await prisma.usuario.create({
                data: {
                    name,
                    email,
                    password: encryptedPassword,
                }
            });

            if (!user) {
                throw new ClientError('Erro ao cadastrar usuário');
            }

            return reply.status(201).send({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        } catch (error) {
            return reply.status(500).send({
                message: 'Erro interno do servidor',
            });
        }
    });
}

export async function loginUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/login', {
        schema: {
            body: z.object({
                email: z.string().email(),
                password: z.string().min(6)
            })
        }
    }, async (request, reply) => {
        const { email, password } = request.body;

        const user = await prisma.usuario.findUnique({ where: { email } });

        if (!user) {
            throw new ClientError('Email ou senha inválida');
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new ClientError('Email ou senha inválida');
        }

        const participant = await prisma.participant.findFirst({
            where: { email }
        });

        const token = Jwt.sign({ userId: user.id }, env.SENHA_JWT, { expiresIn: '360d' });

        if (participant) {
            return reply.status(200).send({
                message: 'Login successful',
                token,
                participant: true,
                tripId: participant.trip_id
            });
        } else {
            return reply.status(200).send({
                message: 'Login successful',
                token,
                participant: false
            });
        }
    });
}