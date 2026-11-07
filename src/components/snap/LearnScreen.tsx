import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useT } from "@/context/LanguageContext";
import { benefitResources } from "@/data/benefitResources";
import { BackToStart, Footer, Header, Shell } from "./Shared";

function LearnSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Collapsible className="rounded-lg border border-border bg-card px-3">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" type="button" className="group tap grid h-auto min-h-14 w-full grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-lg px-0 py-2 text-left whitespace-normal font-bold shadow-none">
          <span>{title}</span>
          <ChevronDown aria-hidden className="transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-3 text-sm leading-6">{children}</CollapsibleContent>
    </Collapsible>
  );
}

export function LearnScreen() {
  const { t } = useT();
  return (
    <Shell>
      <Header />
      <main className="flex flex-col gap-3 px-3">
        <BackToStart />
        <h2 className="text-xl font-bold leading-7">{t("learnTitle")}</h2>
        <LearnSection title={t("learnWhatTitle")}><p>{t("learnWhatText")}</p></LearnSection>
        <LearnSection title={t("learnBuyTitle")}><p>{t("learnBuyText")}</p></LearnSection>
        <LearnSection title={t("learnExcludedTitle")}>
          <p>{t("learnExcludedText")}</p>
          <p className="mt-2 text-muted-foreground">{t("learnRulesNote")}</p>
          <Button asChild variant="link" className="tap mt-1 h-auto justify-start px-0 whitespace-normal">
            <a href={benefitResources.snap} target="_blank" rel="noopener noreferrer">{t("officialSnapPage")}<ExternalLink aria-hidden /></a>
          </Button>
        </LearnSection>
        <LearnSection title={t("learnAgencyTitle")}><p>{t("learnAgencyText")}</p></LearnSection>
        <LearnSection title={t("learnApplyTitle")}>
          <div className="flex flex-col gap-2 pt-1">
            {([
              ["applyOnline", benefitResources.apply],
              ["snapInformation", benefitResources.snap],
              ["wicInformation", benefitResources.wic],
            ] as const).map(([label, href]) => (
              <Button key={label} asChild variant="outline" className="tap h-auto justify-between rounded-lg px-3 py-2 text-left whitespace-normal shadow-none">
                <a href={href} target="_blank" rel="noopener noreferrer"><span>{t(label)}</span><ExternalLink aria-hidden /></a>
              </Button>
            ))}
          </div>
        </LearnSection>
        <Button asChild className="tap mt-1 h-auto rounded-lg px-3 py-3 whitespace-normal shadow-none">
          <Link to="/shop"><ShoppingCart aria-hidden />{t("readyToShop")}</Link>
        </Button>
      </main>
      <Footer />
    </Shell>
  );
}