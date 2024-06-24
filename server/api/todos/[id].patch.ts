import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })
  const { completed } = await useValidatedBody(event, {
    completed: z.number().int().min(0).max(1).transform(Boolean)
  })
  const session = await requireUserSession(event)
  const userId = session.user.id

  const todo = await usePrisma().todos.update({
    where: { id, userId },
    data: { completed }
  })

  return todo
})
