import {CogIcon} from '@sanity/icons/Cog'
import {PlugIcon} from '@sanity/icons/Plug'
import {TagIcon} from '@sanity/icons/Tag'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {ListItemBuilder, StructureResolver} from 'sanity/structure'

import {locales} from '../i18n/config'
import {siteSettingsId} from './schemaTypes/documents/siteSettings'

export const SINGLETON_TYPES = new Set(['siteSettings'])

export const structure: StructureResolver = (S, context) => {
  /** A list of documents that is split per language: Pages → Svenska, English, Norsk, Suomi. */
  const perLanguage = (type: string, title: string): ListItemBuilder =>
    S.listItem()
      .title(title)
      .child(
        S.list()
          .title(title)
          .items(
            locales.map((locale) =>
              S.listItem()
                .title(locale.title)
                .child(
                  S.documentList()
                    .title(`${title} · ${locale.title}`)
                    .schemaType(type)
                    .filter('_type == $type && language == $language')
                    .params({type, language: locale.id})
                    .initialValueTemplates([S.initialValueTemplateItem(`${type}-${locale.id}`)]),
                ),
            ),
          ),
      )

  return S.list()
    .title('Content')
    .items([
      perLanguage('page', 'Pages'),
      S.listItem()
        .title('Add-ons and integrations')
        .icon(PlugIcon)
        .child(
          S.list()
            .title('Add-ons and integrations')
            .items(
              locales.map((locale) =>
                // Drag to reorder: the integration directory follows this order, per language.
                orderableDocumentListDeskItem({
                  type: 'integration',
                  id: `integrations-${locale.id}`,
                  title: locale.title,
                  icon: PlugIcon,
                  filter: 'language == $language',
                  params: {language: locale.id},
                  S,
                  context,
                }),
              ),
            ),
        ),
      S.listItem()
        .title('Integration categories')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Integration categories')
            .items(
              locales.map((locale) =>
                // The filter chips on the integration directory, in this order.
                orderableDocumentListDeskItem({
                  type: 'integrationCategory',
                  id: `integration-categories-${locale.id}`,
                  title: locale.title,
                  icon: TagIcon,
                  filter: 'language == $language',
                  params: {language: locale.id},
                  S,
                  context,
                }),
              ),
            ),
        ),
      perLanguage('post', 'News'),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Site settings')
            .items(
              locales.map((locale) =>
                S.listItem()
                  .title(locale.title)
                  .child(
                    S.document()
                      .schemaType('siteSettings')
                      .documentId(siteSettingsId(locale.id))
                      .title(`Site settings · ${locale.title}`),
                  ),
              ),
            ),
        ),
    ])
}
