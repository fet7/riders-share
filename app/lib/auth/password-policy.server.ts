export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

export class PasswordPolicy{
    /**
     * Validate password against policy
     */
    static validate(password: string): PasswordValidationResult{
        const errors: string[] = [];

        if(password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        };

        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }

            // Optional: Check for common passwords (basic example)
        const commonPasswords = ['password', '12345678', 'qwerty'];
        if (commonPasswords.includes(password.toLowerCase())) {
            errors.push('Password is too common');
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }

    /**
     * generate a random password(for admin reset)
     */
    static generateRandomPassword(length: number=12): string{
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

        let password= '';

        // ensure at least one of each required type
        password += 'a',
        password += 'A',
        password += '1',
        password += '!'

        // fill the rest randomly
        for(let i=password.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password +=charset[randomIndex];
        }

        // shuffle password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }
}
