import { PropsWithChildren, useEffect, useState } from "react";
import i18n from "../../i18n";

export default function LanguageTheme({ children }: PropsWithChildren) {
  const [lang, setLang] = useState<string>(i18n.language);

  useEffect(() => {
    const handler = (lng: string) => setLang(lng);
    i18n.on("languageChanged", handler);
    // in case external code changed it before mount
    setLang(i18n.language);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, []);

  return <div data-lang={lang}>{children}</div>;
}


