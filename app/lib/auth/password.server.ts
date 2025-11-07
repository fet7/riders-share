import * as argon2 from "argon2";

export interface PasswordHashingOptions {
    timeCost?: number;
    memoryCost?: number;
    parallelism?: number;
    hashLength?: number;
}

export class PasswordService {
    private static defaultOptions: PasswordHashingOptions = {
        timeCost: 3,
        memoryCost: 65536,
        parallelism: 1,
        hashLength: 32
    };

    /**
     * Hash password using argon2id
     */
    static async hashPassword(
        password: string,
        options: PasswordHashingOptions = {},
    ): Promise<string> {
        try {
            const mergedOptions = {...this.defaultOptions, ...options};

            const hash = await argon2.hash(password, {
                type: argon2.argon2id,
                timeCost: mergedOptions.timeCost,
                memoryCost: mergedOptions.memoryCost,
                parallelism: mergedOptions.parallelism,
                hashLength: mergedOptions.hashLength,
            });

            return hash;
        }catch(error) {
            console.error('password hashing error:', error);
            throw new Error('Failed to hash password');
        }
    }

    /**
     * verify a password against a hash
     */
    static async verifyPassword(
        password: string,
        hash: string
    ): Promise<boolean> {
        try {
            return await argon2.verify(hash, password);
        } catch(error) {
            console.error("password verification error:", error);
            return false;
        }
    }

    /**
     * check if password needs rehashing (if options changed)
     */
    static async needsRehash(hash: string): Promise<boolean> {
        try {
            return await argon2.needsRehash(hash);
        } catch(error) {
            console.error('password rehash check error:', error);
            return true;
        }
    }
}


// convenience functions for common use cases
export async function hashPassword(password: string): Promise<string> {
    return PasswordService.hashPassword(password);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean>{
    return PasswordService.verifyPassword(password, hash);
}

export async function needsRehash(hash: string): Promise<boolean>{
    return PasswordService.needsRehash(hash);
}
