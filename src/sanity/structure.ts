import {CogIcon} from '@sanity/icons/Cog'
import {PlugIcon} from '@sanity/icons/Plug'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {StructureResolver} from 'sanity/structure'

import {SITE_SETTINGS_ID} from './schemaTypes/documents/siteSettings'

export const SINGLETON_TYPES = new Set(['siteSettings'])

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('page').title('Pages'),
      // Drag to reorder: the integration directory follows this order.
      orderableDocumentListDeskItem({type: 'integration', title: 'Integrations', icon: PlugIcon, S, context}),
      S.documentTypeListItem('post').title('News'),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId(SITE_SETTINGS_ID).title('Site settings')),
    ])
