import { ExternalLink, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/context/LanguageContext";
import { benefitResources } from "@/data/benefitResources";
import { BackToStart, Card, Footer, Header, Shell } from "./Shared";

export function HelpScreen() {
  const { t } = useT();
  return (
    <Shell>
      <Header />
      <main className="flex flex-col gap-3 px-3">
        <BackToStart />
        <h2 className="text-xl font-bold leading-7">{t("helpTitle")}</h2>
        <Card className="rounded-lg">
          <h3 className="text-base font-bold">{t("helpSnapTitle")}</h3>
          <p className="mt-2 text-sm leading-6">{t("helpSnapText")}</p>
          <Button asChild className="tap mt-3 h-auto min-h-12 w-full rounded-lg px-3 py-2 whitespace-normal shadow-none">
            <a href={benefitResources.snapPhone}><Phone aria-hidden />{t("helpSnapCall")}</a>
          </Button>
          <Button asChild variant="link" className="tap mt-2 h-auto justify-start px-0 text-left whitespace-normal">
            <a href={benefitResources.snap} target="_blank" rel="noopener noreferrer"><span>{t("helpHoursLink")}</span><ExternalLink aria-hidden /></a>
          </Button>
        </Card>
        <Card className="rounded-lg">
          <h3 className="text-base font-bold">{t("help211Title")}</h3>
          <p className="mt-2 text-sm leading-6">{t("help211Text")}</p>
          <Button asChild className="tap mt-3 h-auto min-h-12 w-full rounded-lg px-3 py-2 whitespace-normal shadow-none">
            <a href={benefitResources.communityPhone}><Phone aria-hidden />{t("call211")}</a>
          </Button>
        </Card>
        <p className="text-sm leading-6 text-muted-foreground">{t("helpNote")}</p>
      </main>
      <Footer />
    </Shell>
  );
}