// Reack Hooks
import { useState } from "react";

// shadcn dialogs
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// shadcn forms
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// shadcn selects
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const posibleLanguages = ["JavaScript", "Python", "Go", "other"] as const;

interface Props {
  parentMethod: () => void;
}

const CustomForm = ({ parentMethod }: Props) => {
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    parentMethod();
  }

  const minChars = 2;
  const maxChars = 50;
  const formSchema = z.object({
    Name: z
      .string()
      .min(minChars, {
        message: `The name must have atleast ${minChars} characters.`,
      })
      .max(50, {
        message: `The name must be shorter than ${maxChars} characters.`,
      }),
    Language: z.enum(posibleLanguages),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      Language: "JavaScript",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" text-start space-y-8"
      >
        <FormField
          control={form.control}
          name="Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Snippet Name</FormLabel>
              <FormControl>
                <Input placeholder="Ej. NavbarStructure" {...field} />
              </FormControl>
              <FormDescription>
                Tip: Name it something that would help you identify it easily on
                the future.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Creates options based on possibleLanguages const. */}
                  {posibleLanguages.map((language) => (
                    <SelectItem value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                You can change it later, don't worry.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export const ModalForm = () => {
  const [open, setOpen] = useState(false);

  return (
    /* Used to close the dialog when the form is submitted. */
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-none text-emerald-500">Create</Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 text-white border-emerald-500 rounded">
        <DialogHeader>
          <DialogTitle>Create a snippet</DialogTitle>
          <DialogDescription>
            Provide a name and language to correctly identify the snippet.
          </DialogDescription>
          <CustomForm parentMethod={() => setOpen(!open)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
