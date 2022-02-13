import { Env } from '..'

const post = async (request: Request, env: Env): Promise<Response> => {
  const body: {
    created: string
    object: any
    objectType: string
    type: 'post.created' | 'post.status_changed' | 'vote.created'
  } = await request.clone().json()

  const dNewLine = `\n`
  const dHash = '#tooot功能建议'
  const dVote = `\n\n投票链接 👇 ${body.object.url || body.object.post.url}`

  const data = new FormData()
  switch (body.type) {
    case 'post.created':
      const dSuggestion = `用户刚刚提交了建议『${body.object.title}』`

      data.append(
        'status',
        dHash + dNewLine + dNewLine + '🆕' + dNewLine + dSuggestion + dVote
      )
      break
    case 'post.status_changed':
      const statusMapping = {
        open: 'N/A',
        'under review': '审核中，敬请期待下次状态更新！',
        planned: '已加入开发计划，敬请期待下次状态更新！',
        'in progress': '开发中，敬请期待下次状态更新！',
        complete: '开发完成啦！敬请期待应用更新～',
        closed: 'N/A'
      }
      switch (body.object.status) {
        case 'open':
        case 'closed':
          return new Response()
        default:
          const dSuggestion = `建议『${body.object.title}』的最新状态为：${
            // @ts-ignore
            statusMapping[body.object.status]
          }`
          const dComment = body.object.changeComment?.value
            ? `\n\n💬 ${body.object.changeComment?.value}`
            : ''

          data.append(
            'status',
            dHash +
              dNewLine +
              dNewLine +
              '⏩' +
              dNewLine +
              dSuggestion +
              (body.object.status === 'complete'
                ? dComment
                : body.object.status !== 'in progress'
                ? dVote
                : '')
          )
          break
      }
      break
    case 'vote.created':
      if (body.object.post.score === 1) {
        return new Response()
      }

      if (Math.random() > 0.3) {
        return new Response()
      }

      const dNewVote = `建议『${body.object.post.title}』刚刚获得了一票。现在总票数为「${body.object.post.score}」`
      data.append(
        'status',
        dHash + dNewLine + dNewLine + '⬆️' + dNewLine + dNewVote + dVote
      )
      break
  }

  await fetch('https://social.xmflsct.com/api/v1/statuses', {
    method: 'post',
    headers: {
      'Idempotency-Key': `${body.created}-${body.object.id}`,
      Authorization: `Bearer ${env.TOKEN}`
    },
    body: data
  })

  return new Response()
}

export default post
