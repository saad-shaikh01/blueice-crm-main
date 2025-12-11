'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRegister } from '@/features/auth/api/use-register';
import { signUpFormSchema } from '@/features/auth/schema';

export const SignUpCard = () => {
  const { mutate: register, isPending } = useRegister();
  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    register(
      {
        json: values,
      },
      {
        onSuccess: () => {
          signUpForm.reset();
        },
        onError: () => {
          signUpForm.resetField('password');
        },
      },
    );
  };
  return (
    <Card className="size-full border-border/50 shadow-lg md:w-[487px] bg-card/95 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:shadow-primary/5">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-500">
          Create an account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          By signing up, you agree to{' '}
          <Link href="#" className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
            Terms of Service
          </Link>
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isPending}
              name="name"
              control={signUpForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Full name" className="bg-background/50 border-input focus:border-primary focus:ring-primary/20" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isPending}
              name="email"
              control={signUpForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Email address" className="bg-background/50 border-input focus:border-primary focus:ring-primary/20" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isPending}
              name="password"
              control={signUpForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Password" className="bg-background/50 border-input focus:border-primary focus:ring-primary/20" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} size="lg" className="w-full bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 shadow-md">
              Register
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="flex items-center justify-center p-7">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
