import prismadb from "@/lib/prismadb"
import { checkSubscription } from "@/lib/subscription"
import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

type Params = Promise<{ id: string }> 

export async function PATCH(req: Request, props: { params: Params }) {
  const params = await props.params;

  try {
    const body = await req.json()
    const user = await currentUser()
    const { name, description, instructions, seed, src, categoryId } = body

    if (!params.id) {
      return new NextResponse("Companion ID is required", { status: 400 })
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!name || !description || !instructions || !seed || !src || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const isPro = await checkSubscription();

    if (!isPro) {
      return new NextResponse("Pro subscription required", { status: 403 });
    }

    const companion = await prismadb.companion.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed
      }
    })

    return NextResponse.json(companion)

  } catch (error) {
    console.log('[COMPANION_PATCH]', error)
    return new Response("Internal Server Error", { status: 500 })
  }

}

export async function DELETE(req: Request, props: { params: Params }) {
  const params = await props.params;

  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const companion = await prismadb.companion.delete({
      where: {
        userId,
        id: params.id,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log('[COMPANION_DELETE]', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

}