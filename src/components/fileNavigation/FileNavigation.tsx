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

import Database from "@tauri-apps/plugin-sql";
import { useEffect, useState } from "react";
import { createContext } from "react";

type Snippet = {
  id: number;
  name: string;
  language: string;
  content: string;
};
export const navContext = createContext<Function>(() => {});

export const FileNavigation = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  async function showSnippets() {
    try {
      const db = await Database.load("sqlite:main.db");
      const dbContent = await db.select<Snippet[]>("SELECT * FROM Snippets");
      // await db.execute('DELETE FROM snippets')

      setSnippets(dbContent);
    } catch (error) {
      console.log(error);
    }
  }

  const navElements = snippets.map((snippet: Snippet) => (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <button key={snippet.id}>{snippet.name}</button>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));
  /* Gets the snippets on render */
  useEffect(() => {
    showSnippets();
  }, []);

  return (
    <SidebarProvider className="flex flex-col">
      <navContext.Provider value={showSnippets}>
        <ModalForm />
      </navContext.Provider>
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
