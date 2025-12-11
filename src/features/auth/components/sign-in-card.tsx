'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/features/auth/api/use-login';
import { signInFormSchema } from '@/features/auth/schema';

export const SignInCard = () => {
  const { mutate: login, isPending } = useLogin();
  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof signInFormSchema>) => {
    login(
      {
        json: values,
      },
      {
        onSuccess: () => {
          signInForm.reset();
        },
        onError: () => {
          signInForm.resetField('password');
        },
      },
    );
  };

  return (
    <Card className="size-full border-border/50 shadow-lg md:w-[487px] bg-card/95 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:shadow-primary/5">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-500">
          Welcome back!
        </CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...signInForm}>
          <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isPending}
              name="email"
              control={signInForm.control}
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
              control={signInForm.control}
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
              Login
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7 pb-4 text-right">
        <Link href="/password/forgot" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Forgot Password?
        </Link>
      </div>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="flex items-center justify-center p-7">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
