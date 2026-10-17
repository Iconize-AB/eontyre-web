import type {SchemaTypeDefinition} from 'sanity'

import {blockSchemas} from '../../blocks/schemas'
import {integration} from './documents/integration'
import {page} from './documents/page'
import {siteSettings} from './documents/siteSettings'
import {button, navItem} from './objects/button'
import {link} from './objects/link'
import {seo} from './objects/seo'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  page,
  siteSettings,
  integration,
  // Shared objects
  link,
  button,
  navItem,
  seo,
  // Page-builder blocks
  ...blockSchemas,
]
