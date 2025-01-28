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
import { useEffect } from "react";

type Snippet = {
  id: number;
  name: string;
  language: string;
  content?: string;
};

async function getSnippets() {
  try {
    const db = await Database.load("sqlite:main.db");
    const dbSnippets = await db.select<Snippet[]>("SELECT * FROM Snippets");
    // await db.execute('DELETE FROM snippets')
    console.log(dbSnippets);
  } catch (error) {
    console.log(error);
  }
}

export const FileNavigation = () => {
  /* Gets the snippets on render */
  useEffect(() => {
    getSnippets();
  }, []);

  return (
    <SidebarProvider className="flex flex-col">
      <ModalForm />
      <Sidebar collapsible="none" className="dark">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your Snippets</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      href="#"
                      onClick={() => {
                        alert(`my name is placeholderItem`);
                      }}
                    >
                      <span>placeholderItem</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};
