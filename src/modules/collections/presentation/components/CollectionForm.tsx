"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collection } from "../../domain/entities";
import { CreateCollectionDTO, UpdateCollectionDTO } from "../../domain/repositories";
import { ArrowLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface CollectionFormProps {
  userId?: string;
  onSubmit: (data: CreateCollectionDTO | UpdateCollectionDTO) => Promise<void>;
  isLoading?: boolean;
  initialData?: Collection;
  mode?: "create" | "edit";
}

const ICON_OPTIONS = [
  { value: "Folder", label: "Folder" },
  { value: "FolderOpen", label: "Folder Open" },
  { value: "Layers", label: "Layers" },
  { value: "BookMarked", label: "Book Marked" },
  { value: "Archive", label: "Archive" },
  { value: "Package", label: "Package" },
  { value: "Bookmark", label: "Bookmark" },
  { value: "Star", label: "Star" },
  { value: "Heart", label: "Heart" },
  { value: "Briefcase", label: "Briefcase" },
];

export function CollectionForm({ userId, onSubmit, isLoading, initialData, mode = "create" }: CollectionFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Folder",
    visibility: "private" as "private" | "public",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        icon: initialData.icon || "Folder",
        visibility: initialData.visibility,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "edit") {
        await onSubmit({
          name: formData.name,
          description: formData.description || undefined,
          icon: formData.icon,
          visibility: formData.visibility,
        });
      } else {
        await onSubmit({
          userId: userId!,
          name: formData.name,
          description: formData.description || undefined,
          icon: formData.icon,
          visibility: formData.visibility,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save collection");
    }
  };

  const IconPreview = (LucideIcons as any)[formData.icon] || LucideIcons.Folder;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{mode === "edit" ? "Edit Collection" : "Create New Collection"}</h2>
          <p className="text-sm text-muted-foreground">Organize your prompts into collections</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter collection name"
            required
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of this collection"
            maxLength={500}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <IconPreview className="h-4 w-4" />
                  <span>{ICON_OPTIONS.find((opt) => opt.value === formData.icon)?.label || "Folder"}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((option) => {
                  const Icon = (LucideIcons as any)[option.value] || LucideIcons.Folder;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value: any) => setFormData({ ...formData, visibility: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? "Saving..." : mode === "edit" ? "Update Collection" : "Create Collection"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
