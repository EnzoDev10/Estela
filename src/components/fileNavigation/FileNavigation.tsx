/* Shadcn sidebar */
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ModalForm } from "@/components/index";

import { useEffect } from "react";

import { useContentContext, useSnippetsContext } from "@/App";

type Snippet = {
  id: number;
  name: string;
  language: string;
  content: string;
};
export const FileNavigation = () => {
  const { updateShownSnippets, snippets } = useSnippetsContext();
  const { setContentToEdit, setIdContentToEdit } = useContentContext();

  const navElements = snippets?.map((snippet: Snippet) => (
    <SidebarMenuItem key={snippet.id}>
      <SidebarMenuButton asChild>
        <button
          onClick={() => {
            setContentToEdit(snippet.content);
            setIdContentToEdit(snippet.id);
          }}
        >
          {snippet.name}
        </button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));

  /* Gets the snippets on render */
  useEffect(() => {
    updateShownSnippets();
  }, []);

  return (
    <SidebarProvider className="flex flex-col">
      <ModalForm />
      <Sidebar collapsible="none" className="dark">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your Snippets</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{navElements}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};
