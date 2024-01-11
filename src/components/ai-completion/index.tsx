import { Button } from "../ui/button";

interface AICompletionProps {
  currentText: string;
  completionText: string;
  onAccept: (text: string) => void;
  onDismiss: () => void;
}

export default function AICompletion({
  currentText,
  completionText,
  onAccept,
  onDismiss,
}: AICompletionProps) {
  const last3Words = currentText.split(" ").slice(-3).join(" ");

  return (
    <div className="p-4 space-y-2">
      <h3 className="font-semibold">AI-suggested sentence completion</h3>
      <p className="text-sm max-w-72">
        <span className="text-muted-foreground">...{last3Words}</span>{" "}
        <span className="">{completionText}</span>
      </p>
      <div className="flex flex-row justify-end space-x-2">
        <Button
          variant="link"
          onClick={() => {
            onDismiss();
          }}
        >
          Dismiss
        </Button>
        <Button
          onClick={() => {
            onAccept(completionText);
          }}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
