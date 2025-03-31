"use client";
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

// const data = {
//   flags: [
//     {
//       id: 1,
//       name: "Show UI",
//       key: "show_ui",
//       description: "Show the UI",
//       default_value: false,
//       created_at: "2025-03-23T11:44:12.352Z",
//       updated_at: "2025-03-23T11:44:12.352Z",
//       environment_flags: [
//         {
//           id: 1,
//           environment_id: 1,
//           value: true,
//         },
//         {
//           id: 2,
//           environment_id: 2,
//           value: false,
//         },
//         {
//           id: 7,
//           environment_id: 3,
//           value: false,
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: "Show Contact",
//       key: "show-contact",
//       description: "Show Contact info",
//       default_value: false,
//       created_at: "2025-03-23T11:44:12.421Z",
//       updated_at: "2025-03-23T11:44:12.421Z",
//       environment_flags: [
//         {
//           id: 3,
//           environment_id: 1,
//           value: false,
//         },
//         {
//           id: 4,
//           environment_id: 2,
//           value: false,
//         },
//         {
//           id: 8,
//           environment_id: 3,
//           value: false,
//         },
//       ],
//     },
//   ],
//   environments: [
//     {
//       id: 1,
//       name: "Development",
//     },
//     {
//       id: 2,
//       name: "Test",
//     },
//     {
//       id: 3,
//       name: "Staging",
//     },
//   ],
// };

export default function Page() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/flags")
      .then((res) => res.json())
      .then((data) => {
        setData(data["data"]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No flag data</p>;
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Flags</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Table>
            <TableCaption>A list of your flags.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Details</TableHead>
                <TableHead className="w-[200px]">Key</TableHead>
                {data.environments.map((environment) => {
                  return (
                    <TableHead
                      key={"environment-" + environment.id}
                      className="w-[150px]"
                    >
                      {environment.name}
                    </TableHead>
                  );
                })}
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.flags.map((flag) => {
                return (
                  <TableRow key={"flag-" + flag.id}>
                    <TableCell className="font-medium">
                      <strong>{flag.name}</strong> <br />
                      {flag.description}
                    </TableCell>
                    <TableCell>{flag.key}</TableCell>
                    {data.environments.map((environment) => {
                      const environment_flag = flag.environment_flags.find(
                        (e) => e.environment_id === environment.id
                      );
                      return (
                        <TableHead
                          key={"environment_flag-" + environment_flag?.id}
                          className="w-[150px]"
                        >
                          <Switch checked={environment_flag?.value} />
                        </TableHead>
                      );
                    })}
                    <TableCell className="text-right">
                      <Switch checked={flag.default_value} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
