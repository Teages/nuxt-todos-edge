import { useValidatedBody, z } from 'h3-zod'

export default eventHandler(async (event) => {
  const { title } = await useValidatedBody(event, {
    title: z.string().min(1).max(100)
  })
  const session = await requireUserSession(event)

  const todo = await usePrisma().todos.create({
    data: {
      userId: session.user.id,
      title,
      createdAt: new Date()
    }
  })

  return todo
})
