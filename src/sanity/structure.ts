import {CogIcon} from '@sanity/icons/Cog'
import type {StructureResolver} from 'sanity/structure'

import {SITE_SETTINGS_ID} from './schemaTypes/documents/siteSettings'

export const SINGLETON_TYPES = new Set(['siteSettings'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('integration').title('Integrations'),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId(SITE_SETTINGS_ID).title('Site settings')),
    ])
