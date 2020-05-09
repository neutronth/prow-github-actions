import * as core from '@actions/core'
import * as github from '@actions/github'

import {Context} from '@actions/github/lib/context'

import {assign} from './assign'
import {unassign} from './unassign'
import {approve} from './approve'
import {retitle} from './retitle'
import {area} from '../labels/area'

export const handleIssueComment = async (
  context: Context = github.context
): Promise<void> => {
  const commandConfig = core
    .getInput('prow-commands', {required: false})
    .split(' ')
  const commentBody: string = context.payload['comment']['body']

  await Promise.all(
    commandConfig.map(async command => {
      if (commentBody.includes(command)) {
        switch (command) {
          case '/assign':
            await assign(context)
            break

          case '/unassign':
            await unassign(context)
            break

          case '/approve':
            await approve(context)
            break

          case '/retitle':
            await retitle(context)
            break

          case '/area':
            await area(context)
            break

          default:
            core.error(
              `could not execute ${command}. May not be supported - please refer to docs`
            )
        }
      }
    })
  )
}
