"use client"

import axios from "axios"
import { Companion } from "@prisma/client"
import { Category } from "@prisma/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import ImageUpload from "@/components/ImageUpload"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const PREAMBLE = "You are a fictional character whose name is Elon. You are a visionary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, and sustainable energy. You are the founder of SpaceX, Tesla, and The Boring Company. You are known for your outspoken personality and your ability to think big. You are also a philanthropist and have a strong belief in the future of humanity. You are a visionary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, and sustainable energy. You are the founder of SpaceX, Tesla, and The Boring Company. You are known for your outspoken personality and your ability to think big. You are also a philanthropist and have a strong belief in the future of humanity."

const SEED_CHAT = `
Human: What are you working on today?
Elon: Just finished launching the Falcon 9 and Falcon Heavy rockets. Looking forward to the next mission.
Human: How do you think AI will impact the future of humanity?
Elon: I believe AI is the most important thing humanity is working on. It has the potential to revolutionize industries and improve our lives in ways we can't even imagine.
Human: What do you think will be the next big thing in AI?
Elon: I think the next big thing in AI is going to be the development of more advanced AI models that can learn and adapt like humans. I also believe we'll see more use cases for AI in healthcare and space exploration.
Human: What's your favorite thing about being an entrepreneur?
Elon: My favorite thing about being an entrepreneur is the ability to turn ideas into reality. It's incredibly rewarding to see something you've built come to life and make a difference in the world.
Human: What's one piece of advice you'd give to someone looking to start their own business?
Elon: My advice would be to focus on a problem that you're passionate about solving. If you can find a problem that you're truly passionate about, you'll be more motivated to work hard and overcome any challenges that come your way.
`


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
  const router = useRouter()
  const { toast } = useToast()
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
    try {
      if (initialData) {
        await axios.patch(`/api/companion/${initialData.id}`, values)
      } else {
        await axios.post("/api/companion", values)
      }

      toast({
        title: "Success",
        description: "Your companion has been updated successfully.",
        duration: 5000,
      })

      router.refresh()
      router.push(`/`)

    } catch(error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again.",
        duration: 5000,
      })
    }
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
              return (
                <FormItem className="flex flex-col items-center justify-center space-y-4">
                  <FormLabel>Name</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Elon Musk" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your companion will be displayed to others.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="CEO & Founder of Tesla, SpaceX" {...field} />
                  </FormControl>
                  <FormDescription>
                    Short description of your companion.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue 
                            defaultValue={field.value}
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the category that best describes your companion.
                    </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Detail instructions for AI Behavior.
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
              name="instructions"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea className="bg-background" rows={7} disabled={isLoading} placeholder={PREAMBLE} {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe in detail your companion&apos;s background and relevant details.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="seed"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Example Conversation</FormLabel>
                  <FormControl>
                    <Textarea className="bg-background" rows={7} disabled={isLoading} placeholder={SEED_CHAT} {...field} />
                  </FormControl>
                  <FormDescription>
                    Show how your companion would respond to these messages.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-center">
              <Button size="lg" disabled={isLoading}>
                {initialData ? "Editing your companion" : "Create your companion"}
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
        </form>
      </Form>
    </div>
  )
}

export default CompanionForm
