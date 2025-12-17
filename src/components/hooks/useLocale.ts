import { useEffect } from 'react';
import { httpGet } from '@/lib/fetch';
import { setItem } from '@/lib/storage';
import { LOCALE_CONFIG, DEFAULT_LOCALE } from '@/lib/constants';
import { getDateLocale, getTextDirection } from '@/lib/lang';
import useStore, { setLocale } from '@/store/app';
import { useForceUpdate } from './useForceUpdate';
import enUS from '../../../public/intl/messages/en-US.json';
import frFR from '../../../public/intl/messages/fr-FR.json';

const messages = {
  'en-US': enUS,
  'fr-FR': frFR,
};

const selector = (state: { locale: any }) => state.locale;

export function useLocale() {
  const locale = useStore(selector);
  const forceUpdate = useForceUpdate();
  const dir = getTextDirection(locale);
  const dateLocale = getDateLocale(locale);

  async function loadMessages(locale: string) {
    try {
      const { data } = await httpGet(`${process.env.basePath || ''}/intl/messages/${locale}.json`);
      if (data) {
        messages[locale] = data;
      }
    } catch (error) {
      console.error(`Failed to load messages for locale: ${locale}`, error);
    }
  }

  async function saveLocale(value: string) {
    // Toujours recharger les messages depuis le serveur pour s'assurer qu'ils sont corrects
    await loadMessages(value);

    setItem(LOCALE_CONFIG, value);

    document.getElementById('__next')?.setAttribute('dir', getTextDirection(value));

    if (locale !== value) {
      setLocale(value);
    } else {
      forceUpdate();
    }
  }

  useEffect(() => {
    // S'assurer que les messages sont chargés pour la locale actuelle
    if (!messages[locale] || Object.keys(messages[locale] || {}).length === 0) {
      loadMessages(locale).then(() => {
        forceUpdate();
      });
    }
  }, [locale]);

  useEffect(() => {
    const url = new URL(window?.location?.href);
    const locale = url.searchParams.get('locale');

    if (locale) {
      saveLocale(locale);
    }
  }, []);

  return { locale, saveLocale, messages, dir, dateLocale };
}

export default useLocale;
