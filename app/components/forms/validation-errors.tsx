interface ValidationErrorsProps {
    errors?: any;
}

export function ValidationErrors({ errors }: ValidationErrorsProps) {
    if(!errors || typeof errors !== 'object' || !errors.properties) return null;

    return (
        <div className="bg-destructive/10 border border-destructive/50 rounded-md p-4">
            <p className="text-destructive font-medium">Please fix the following errors</p>
            <div className="mt-2 space-y-1">
                {Object.entries(errors.properties).map(([field, errorData]: [string, any]) => (
                    errorData.errors?.map((error: any, index: number) => (
                        <p key={`${field}-${index}`} className="text-destructive/80 text-sm">
                            <strong>{field}:</strong> {error.message}
                        </p>
                    ))
                ))}
            </div>
        </div>
    )
}
