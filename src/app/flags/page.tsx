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

export default function Page() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const fetchFlags = () => {
    fetch("http://localhost:3000/flags")
      .then((res) => res.json())
      .then((data) => {
        setData(data["data"]);
        setLoading(false);
      });
  };

  useEffect(fetchFlags, []);

  const toggleEnvironmentFlag = (
    environment_flag: {id: int, flag_id: int, environment_id: int},
    checked: boolean
  ) => {
    setData((prevData) => {
      const updatedFlags = prevData.flags.map((flag) => {
        const updatedEnvironmentFlags = flag.environment_flags.map((ef) =>
          ef.id === environment_flag.id ? { ...ef, value: checked } : ef
        );
        return { ...flag, environment_flags: updatedEnvironmentFlags };
      });
      return { ...prevData, flags: updatedFlags };
    });
    fetch(`http://localhost:3000/flags/${environment_flag.flag_id}/environments/${environment_flag.environment_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: checked }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update environment flag");
        }
        return res.json();
      })
      .catch((error) => {
        setData((prevData) => {
          const updatedFlags = prevData.flags.map((flag) => {
            const updatedEnvironmentFlags = flag.environment_flags.map((ef) =>
              ef.id === environment_flag_id ? { ...ef, value: !checked } : ef
            );
            return { ...flag, environment_flags: updatedEnvironmentFlags };
          });
          return { ...prevData, flags: updatedFlags };
        });
        console.error("Error updating environment flag:", error);
      });
  };

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
                          <Switch
                            checked={environment_flag?.value}
                            onCheckedChange={(checked) =>
                              toggleEnvironmentFlag(
                                  environment_flag,
                                  checked
                              )
                            }
                          />
                        </TableHead>
                      );
                    })}
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
