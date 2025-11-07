// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "~/components/ui/alert-dialog";
// import { Loader } from "lucide-react";

// interface DeleteDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onConfirm: () => void;
//   title?: string;
//   description?: string;
//   confirmText?: string;
//   cancelText?: string;
//   isDeleting?: boolean;
// }

// export function DeleteDialog({
//   open,
//   onOpenChange,
//   onConfirm,
//   title = "Are you sure?",
//   description = "This action cannot be undone.",
//   confirmText = "Delete",
//   cancelText = "Cancel",
//   isDeleting = false,
// }: DeleteDialogProps) {
//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent className="sm:max-w-md bg-red-100 border-destructive focus-visible:ring-destructive">
//         <AlertDialogHeader>
//           <AlertDialogTitle className="text-destructive font-semibold text-sm">
//             {title}
//           </AlertDialogTitle>
//           <AlertDialogDescription className="text-muted-foreground text-xs">
//             {description}
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel disabled={isDeleting}>
//             {cancelText}
//           </AlertDialogCancel>
//           <AlertDialogAction
//             onClick={onConfirm}
//             disabled={isDeleting}
//             className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive"
//           >
//             {isDeleting ? (
//               <div className="flex items-center gap-2">
//                 <Loader className="h-4 w-4 animate-spin" />
//                 Deleting...
//               </div>
//             ) : (
//               confirmText
//             )}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Loader } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDeleting = false,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Deleting...
              </div>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
