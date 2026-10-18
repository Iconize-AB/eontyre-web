import type {Template} from 'sanity'

import {locales, type Locale} from '../i18n/config'
import {getDictionaryFor} from '../i18n/dictionaries'

const key = () => Math.random().toString(36).slice(2, 10)

export type IntegrationKind = 'addon' | 'integration'

const items = (count: number) => Array.from({length: count}, () => ({_type: 'featureGridItem', _key: key()}))

/**
 * The starting content of a new add-on or integration page: the recommended block order
 * (BRIEF-3, section 4), with the blocks empty and ready to fill in. Editors can remove,
 * reorder or add any block afterwards.
 */
export function integrationPageValue(language: Locale, kind: IntegrationKind) {
  const text = getDictionaryFor(language).integrations.template
  // Both buttons start out pointing at the contact section of the About page.
  const contact = () => ({
    _type: 'link',
    linkType: 'internal',
    page: {_type: 'reference', _ref: `page-about-${language}`},
    anchor: 'contact',
    openInNewTab: false,
  })
  const buttons = () => [
    {_type: 'button', _key: key(), label: text.order, variant: 'primary', link: contact()},
    {_type: 'button', _key: key(), label: text.getCall, variant: 'outline', link: contact()},
  ]

  return {
    language,
    kind,
    ...(kind === 'addon' && {
      // Add-ons start in the "Add-ons" category (editors can pick another).
      category: {_type: 'reference', _ref: `integration-category-addons-${language}`},
    }),
    status: 'available',
    hasDetailPage: true,
    blocks: [
      {_type: 'pageHeroBlock', _key: key(), media: 'image', buttons: buttons(), theme: 'dark'},
      {
        _type: 'featureGridBlock',
        _key: key(),
        heading: text.howItWorks,
        variant: 'numbered',
        layout: 'full',
        source: 'manual',
        items: items(3),
        theme: 'dark',
        background: 'default',
        paddingTop: 'default',
      },
      {
        _type: 'featureGridBlock',
        _key: key(),
        variant: 'topRule',
        layout: 'split',
        source: 'manual',
        items: items(4),
        theme: 'dark',
        background: 'surface',
        paddingTop: 'default',
      },
      {
        _type: 'textMediaBlock',
        _key: key(),
        imagePosition: 'left',
        listStyle: 'plain',
        theme: 'dark',
        background: 'default',
        paddingTop: 'default',
      },
      {
        _type: 'faqBlock',
        _key: key(),
        source: 'document',
        openFirst: true,
        theme: 'dark',
        background: 'surface',
        paddingTop: 'default',
      },
      {_type: 'ctaBannerBlock', _key: key(), style: 'accent', buttons: buttons(), theme: 'dark'},
    ],
  }
}

/** "Add-on page (English)", "Integration page (Svenska)" … in the Studio's "New document" menu. */
export const integrationPageTemplates: Template[] = locales.flatMap((locale) =>
  (['addon', 'integration'] as const).map((kind) => ({
    id: `integration-page-${kind}-${locale.id}`,
    title: `${kind === 'addon' ? 'Add-on' : 'Integration'} page (${locale.title})`,
    schemaType: 'integration',
    value: () => integrationPageValue(locale.id, kind),
  })),
)
