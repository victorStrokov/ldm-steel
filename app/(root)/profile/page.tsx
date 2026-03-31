import { prisma } from '@/prisma/prisma-client';
import { ProfileForm } from '@/shared/components';
import { getUserSession } from '@/shared/lib/get-user-session';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getUserSession();
  if (!session) {
    return redirect('/not-auth');
  }
  const user = await prisma.user.findFirst({ where: { id: Number(session?.id) } });
  if (!user) {
    return redirect('/not-auth');
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-8 py-8">
      <ProfileForm data={user} />
    </div>
  );
}
