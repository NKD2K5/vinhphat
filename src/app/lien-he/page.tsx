import { redirect } from 'next/navigation';

export default function LienHeRedirect() {
  redirect('/contact');
  return null;
}
