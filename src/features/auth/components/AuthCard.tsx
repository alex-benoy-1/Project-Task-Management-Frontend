import type { ReactNode } from "react";
import { Card } from "../../../components/ui/Card.tsx";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>

      {children}
    </Card>
  );
}