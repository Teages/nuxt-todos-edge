import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString
  })
  const session = await requireUserSession(event)
  const userId = session.user.id

  try {
    const deletedTodo = await usePrisma().todos.delete({
      where: { id, userId }
    })

    return deletedTodo
  }
  catch {
    throw createError({
      statusCode: 404,
      message: 'Todo not found'
    })
  }
})
