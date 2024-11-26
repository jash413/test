import { redirect } from 'next/navigation';
import { ComponentType } from 'react';

export function withServerSideErrorHandling<P extends object>(
  WrappedComponent: ComponentType<P>
) {
  return async function WithErrorHandling(props: P) {
    try {
      return <WrappedComponent {...props} />;
    } catch (error) {
      console.error('Server-side error:', error);
      redirect('/server-error');
    }
  };
}