"use client"

import { Companion } from "@prisma/client"
import { Category } from "@prisma/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import ImageUpload from "@/components/ImageUpload"


interface CompanionFormProps {
  initialData: Companion | null
  categories: Category[]
}


const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  instructions: z.string().min(200, {
    message: "Instructions must be at least 200 characters long",
  }),
  seed: z.string().min(200, {
    message: "Seed must be at least 200 characters long",
  }),
  src: z.string().min(1, {
    message: "Image is required",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
})


const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: "",
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                Fill out the general information about your companion.
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>

          <FormField 
            name="src"
            control={form.control}
            render={({ field }) => {
              console.log("Current src field value:", field.value)
              return (
                <FormItem className="flex flex-col items-center justify-center space-y-4">
                  <FormLabel>Name</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </form>
      </Form>
    </div>
  )
}

export default CompanionForm