import '@dotenvx/dotenvx/config';
import z from 'zod';

export const config = z
    .object({
        DB_HOST: z.string(),
        DB_PORT: z.coerce.number() || 3000,
        DB_USER: z.string(),
        DB_PASS: z.string(),
        DB_NAME: z.string(),
        PORT: z.coerce.number(),
        JWT_SECRET: z.string(),
        JWT_EXPIRY_SECONDS: z.coerce.number(),
    })
    .transform((obj) => ({
        db: {
            host: obj.DB_HOST,
            port: obj.DB_PORT,
            user: obj.DB_USER,
            password: obj.DB_PASS,
            database: obj.DB_NAME,
        },
        port: obj.PORT,
        jwt: {
            secret: obj.JWT_SECRET,
            expirySeconds: obj.JWT_EXPIRY_SECONDS,
        },
    }))
    .parse(process.env);
