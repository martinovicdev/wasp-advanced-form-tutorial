import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { createCustomer, updateCustomer } from 'wasp/client/operations';
import { Toaster } from '../../components/ui/toaster';
import { useToast } from '../../hooks/use-toast';
import { DatePicker } from '../../components/ui/date-picker';
import Header from '../../components/layout/header';
import { Customer } from 'wasp/entities';
import { add } from 'date-fns';

export const CustomerForm = ({ customer }: { customer: Customer }) => {
  const { toast } = useToast();

  const formSchema = z
    .object({
      name: z.string().min(1, { message: 'Name is required' }),
      surname: z.string().min(1, { message: 'Surname is required' }),
      email: z.string().email({ message: 'Invalid email address' }),
      dateOfBirth: z.date().max(new Date(), {
        message: 'Date of birth cannot be in the future',
      }),
      premiumUser: z.boolean(),
      username: z.string().min(1, { message: 'Username is required' }),
      address: z.string().min(1, { message: 'Address is required' }),
      postalCode: z.string().min(1, { message: 'Postal code is required' }),
      city: z.string().min(1, { message: 'City is required' }),
      country: z.string().min(1, { message: 'Country is required' }),
    })
    .superRefine((data, ctx) => {
      const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

      // Validate postal code format based on country
      if (data.country === 'UK' || data.country === 'United Kingdom') {
        if (!ukPostcodeRegex.test(data.postalCode)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid UK postal code format (e.g., SW1A 1AA)',
            path: ['postalCode'],
          });
        }
      } else if (!/^\d+$/.test(data.postalCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Postal code must be numeric for non-UK addresses',
          path: ['postalCode'],
        });
      }

      if (data.username.includes(' ')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Username cannot contain spaces',
          path: ['username'],
        });
      }

      if (/^\d+$/.test(data.city)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'City name cannot be purely numeric',
          path: ['city'],
        });
      }
    });
  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: customer,
  });

  async function onSubmit(values: FormData) {
    if (customer.id) {
      try {
        await updateCustomer({
          id: customer.id,
          name: values.name,
          surname: values.surname,
          email: values.email,
          dateOfBirth: values.dateOfBirth,
          premiumUser: values.premiumUser,
          username: values.username,
          address: values.address,
          postalCode: values.postalCode,
          city: values.city,
          country: values.country,
        });
        toast({
          title: 'Success!',
          description: 'Customer updated successfully',
        });
      } catch (err: any) {
        window.alert('Error: ' + err?.message);
      }
    } else {
      try {
        await createCustomer({
          name: values.name,
          surname: values.surname,
          email: values.email,
          dateOfBirth: values.dateOfBirth,
          premiumUser: values.premiumUser,
          username: values.username,
          address: values.address,
          postalCode: values.postalCode,
          city: values.city,
          country: values.country,
        });
        toast({
          title: 'Success!',
          description: 'Customer created successfully',
        });
        form.reset();
      } catch (err: any) {
        window.alert('Error: ' + err?.message);
      }
    }
  }

  return (
    <>
      <Header />
      <div className="flex flex-col gap-10 items-center">
        <Form {...form}>
          <h1 className="text-2xl font-semibold text-center">
            Add new customer
          </h1>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" border border-border p-3 rounded-md space-y-8 mx-10 w-96 gap-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>

                  <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="premiumUser"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Premium user</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      <Toaster />
    </>
  );
};
