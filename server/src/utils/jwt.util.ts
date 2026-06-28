import jwt from 'jsonwebtoken';
import { config } from '../config';
import z from 'zod';

const payloadSchema = z.object({
    id: z.coerce.number(),
    isAdmin: z.boolean().optional(),
});
type Payload = z.infer<typeof payloadSchema>;

export class JwtUtil {
    sign(payload: Payload) {
        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expirySeconds,
        });
    }

    verify(token: string): Payload | undefined {
        try {
            const decoded = jwt.verify(token, config.jwt.secret);
            const result = payloadSchema.safeParse(decoded);
            return result.success ? result.data : undefined;
        } catch {
            return undefined;
        }
    }
}
