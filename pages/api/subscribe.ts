// pages/api/subscribe.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

interface SubscribeBody {
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { email } = req.body as SubscribeBody;

    const existingSubscriber = await prismadb.subscriber.findUnique({
      where: {
        email,
      },
    });

    if (existingSubscriber) {
      return res.status(422).json({ error: 'Email already subscribed' });
    }

    const subscriber = await prismadb.subscriber.create({
      data: {
        email,
      },
    });

    return res.status(200).json(subscriber);
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}
