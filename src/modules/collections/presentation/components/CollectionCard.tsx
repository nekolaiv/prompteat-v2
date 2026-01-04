"use client";

import { Collection } from "../../domain/entities";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Lock, Globe } from "lucide-react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  // Dynamically get icon component
  const IconComponent = collection.icon
    ? (LucideIcons as any)[collection.icon] || Folder
    : Folder;

  return (
    <Link href={`/collections/${collection.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10">
                <IconComponent className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="line-clamp-1">{collection.name}</CardTitle>
                {collection.description && (
                  <CardDescription className="line-clamp-2 mt-1">
                    {collection.description}
                  </CardDescription>
                )}
              </div>
            </div>
            {collection.visibility === "private" ? (
              <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {collection.promptCount} {collection.promptCount === 1 ? "prompt" : "prompts"}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
