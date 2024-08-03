import { z } from 'zod'

const userSchema = z.object({
  name: z.string()
    .trim()
    .max(100, { message: 'Campo nome tem o limite máximo de 100 caracteres' })
    .min(1, { message: 'Campo nome é obrigatório' }),
  email: z.string()
    .trim()
    .email({ message: 'Campo email precisa ter um formato válido' })
    .max(100, { message: 'Campo email tem o limite máximo de 100 caracteres' })
    .min(1, { message: 'Campo email é obrigatório' }),
  password: z.string()
    .trim()
    .min(8, { message: 'Campo senha tem o limite mínimo de 8 caracteres' })
    .min(1, { message: 'Campo senha é obrigatório' }),
})

const userLoginSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: 'Campo email precisa ter um formato válido' })
    .max(100, { message: 'Campo email tem o limite máximo de 100 caracteres' })
    .min(1, { message: 'Campo email é obrigatório' }),
  password: z.string()
    .trim()
    .min(8, { message: 'Campo senha tem o limite mínimo de 8 caracteres' })
    .min(1, { message: 'Campo senha é obrigatório' }),
})

export { userSchema, userLoginSchema }