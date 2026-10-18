import type {SchemaTypeDefinition} from 'sanity'

import {blockSchemas} from '../../blocks/schemas'
import {integration} from './documents/integration'
import {page} from './documents/page'
import {post} from './documents/post'
import {siteSettings} from './documents/siteSettings'
import {button, navItem} from './objects/button'
import {link} from './objects/link'
import {postBody, richText} from './objects/richText'
import {seo} from './objects/seo'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  page,
  siteSettings,
  integration,
  post,
  // Shared objects
  link,
  button,
  navItem,
  seo,
  richText,
  postBody,
  // Page-builder blocks
  ...blockSchemas,
]
