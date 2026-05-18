import { Card, CardContent, CardDescription } from "@/shared/ui/card";

type PrivacySectionProps = {
  title: string;
  description?: string;
  items: string[];
};

export default function PrivacySection({
  title,
  description,
  items,
}: PrivacySectionProps) {
  return (
    <Card>
      <CardContent>
        <details>
          <summary className="cursor-pointer list-none">
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-800">
                {title}
              </p>
              {description ? (
                <CardDescription>{description}</CardDescription>
              ) : null}
            </div>
          </summary>

          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-600">
            {items.map((item) => (
              <li key={item} className="break-keep">
                {item}
              </li>
            ))}
          </ul>
        </details>
      </CardContent>
    </Card>
  );
}