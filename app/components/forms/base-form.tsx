import { useFetcher, type FetcherWithComponents } from "react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { ValidationErrors } from "./validation-errors";

interface BaseFormProps {
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    action?: string;
    method?: "post" | "put" | "patch";
    isSubmitting?: boolean;
    submitText?: string;
    editId?: string;
}

export function BaseForm({
    title,
    open,
    onOpenChange,
    children,
    action,
    method = "post",
    isSubmitting = false,
    submitText = "Submit",
    editId,
}: BaseFormProps) {
    const fetcher = useFetcher();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-hidden">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>

                <div className="relative flex-1 min-h-0 px-4">
                    <ScrollArea className="rounded-md px-4 border scroll-smooth shadow-inner h-[60vh] md:h-[90vh]">
                        <fetcher.Form
                        method={method}
                        action={action}
                        className="space-y-4 py-4 px-2"
                        >
                            {editId && (
                                <input type="hidden" name="id" value={editId}/>
                            )}
                            <ValidationErrors errors={fetcher.data?.errors}/>

                            {children}

                            <SubmitButton
                                isSubmitting={isSubmitting || fetcher.state === "submitting"}
                                text={submitText}
                            />

                            {fetcher.data?.error && (
                                <div className="text-destructive text-sm p-2 bg-destructive/10 rounded">
                                    Error: {fetcher.data.error}
                                </div>
                            )}
                        </fetcher.Form>
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    )
}


function SubmitButton({ isSubmitting, text }: { isSubmitting: boolean; text: string }) {
    return (
        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
                <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin"/>
                    Processing...
                </div>
            ) : text}
        </Button>
    )
}
