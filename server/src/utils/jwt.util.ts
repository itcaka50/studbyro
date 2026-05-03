import jwt from 'jsonwebtoken';
import { config } from '../config';
import z from 'zod';

const payloadSchema = z.object({ id: z.coerce.number() });
type Payload = z.infer<typeof payloadSchema>;

export class JwtUtil {
    sign(payload: Payload) {
        const token = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expirySeconds,
        });
        return token;
    }

    verify(token: string) {
        const payload = jwt.verify(token, config.jwt.secret);
        const cleanPayload = payloadSchema.safeParse(payload);
        if (cleanPayload.error) {
            return undefined;
        }
        return cleanPayload.data;
    }
}
