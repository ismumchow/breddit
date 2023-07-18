import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { subredditId, title, content } = PostValidator.parse(body)
    
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // check if user has already subscribed to subreddit
    const subscription = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    })

    if (!subscription) {
      return new Response("You must subscribe to the sub-breddit", {
        status: 400,
      })
    }

    // create subreddit and associate it with the user
    await db.post.create({
        data: {
            title,
            content,
            authorId: session.user.id,
            subredditId,
        },
    })

    return new Response('OK')
  } catch (error) {
    (error)
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not subscribe to subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}