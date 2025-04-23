
import { supabase } from "@/integrations/supabase/client";
import { toProjectArea } from '../projectAreaUtils';
import { getDefaultColor } from '../utils/colorUtils';
import type { ProjectAreaFormValues, ProjectArea } from "../projectAreaTypes";

export async function fetchProjectAreas(companyId: string | undefined): Promise<ProjectArea[]> {
  if (!companyId) {
    return [];
  }

  const { data, error } = await supabase
    .from("project_areas")
    .select("*")
    .eq('company_id', companyId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Failed to load project areas");
  }

  return Array.isArray(data)
    ? data.map(area => toProjectArea({
        ...area,
        color: area.color || "#E5DEFF",
      }))
    : [];
}

export async function createProjectArea(
  companyId: string, 
  values: ProjectAreaFormValues
): Promise<ProjectArea> {
  const areaData = {
    code: values.code,
    name: values.country,
    emoji: null,
    company_id: companyId,
    color: getDefaultColor(values.color)
  };

  const { data, error } = await supabase
    .from("project_areas")
    .insert(areaData)
    .select()
    .single();

  if (error || !data) {
    throw new Error("Failed to save area");
  }

  return toProjectArea({
    ...data,
    color: data.color || values.color
  });
}

export async function updateProjectArea(
  id: string,
  companyId: string,
  values: ProjectAreaFormValues
): Promise<void> {
  const areaData = {
    code: values.code,
    name: values.country,
    company_id: companyId,
    color: getDefaultColor(values.color)
  };

  const { error } = await supabase
    .from("project_areas")
    .update(areaData)
    .eq("id", id);

  if (error) {
    throw new Error("Failed to update area");
  }
}

export async function deleteProjectAreas(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from("project_areas")
    .delete()
    .in("id", ids);

  if (error) {
    throw new Error("Failed to delete area(s)");
  }
}
