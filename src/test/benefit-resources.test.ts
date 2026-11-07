import { describe, expect, it } from "vitest";
import { benefitResources } from "@/data/benefitResources";

describe("Supplied official contact destinations", () => {
  it("uses the exact Louisiana SNAP phone number", () => {
    expect(benefitResources.snapPhone).toBe("tel:+18885243578");
  });
  it("uses the exact community help number", () => {
    expect(benefitResources.communityPhone).toBe("tel:211");
  });
  it("uses the supplied online application destination", () => {
    expect(benefitResources.apply).toBe("https://sspweb.ie.dcfs.la.gov/selfservice/");
  });
  it("uses the supplied LDH SNAP information destination", () => {
    expect(benefitResources.snap).toBe("https://www.ldh.la.gov/page/snap-eligibility-application");
  });
  it("uses the supplied LDH WIC destination", () => {
    expect(benefitResources.wic).toBe("https://www.ldh.la.gov/bureau-of-nutrition-services/women-infants-children-program");
  });
});