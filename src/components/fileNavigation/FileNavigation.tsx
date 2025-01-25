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

/* Object to save the names of the files and to see their content in future updates.
nota: agregar type safety a esta array de objetos.
*/
const items = [
  {
    title: "itemTitle",
    url: "#",
  },
];

import { ModalForm } from "@/components/index";

/* function addItem() {
  console.log("test");
} */

export const FileNavigation = () => {
  return (
    <SidebarProvider className="flex flex-col">
      <ModalForm />
      <Sidebar collapsible="none" className="dark">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your Snippets</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        onClick={() => {
                          alert(`my name is ${item.title}`);
                        }}
                      >
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};
