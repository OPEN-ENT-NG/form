import dayjs from "dayjs";
import { isSelectedForm, getFormDistributions, isFormFilled, getFormStatusText } from "~/core/models/form/utils";
import { makeMockedForm, makeMockedDistribution } from "~/tests/utils";
import { DistributionStatus } from "../../distribution/enums";
import { useTranslation } from "react-i18next";

// A dummy date‐formatter that just returns `${date}|${key}`
const formatDateWithTime = (date: string | Date | undefined, key: string) => `${date}│${key}`;

describe("formUtils", () => {
  const { t } = useTranslation();
  describe("isSelectedForm", () => {
    it("returns true when the form is in the selected list", () => {
      const form = makeMockedForm(1);
      const selectedForms = [makeMockedForm(1), makeMockedForm(2)];
      expect(isSelectedForm(form, selectedForms)).toBe(true);
    });

    it("returns false when the form is not in the list", () => {
      const form = makeMockedForm(3);
      const selectedForms = [makeMockedForm(1), makeMockedForm(2)];
      expect(isSelectedForm(form, selectedForms)).toBe(false);
    });
  });

  describe("getFormDistributions", () => {
    it("returns only the distributions whose formId matches", () => {
      const form = makeMockedForm(5);
      const d1 = makeMockedDistribution(5);
      const d2 = makeMockedDistribution(7);
      const d3 = makeMockedDistribution(5);
      const results = getFormDistributions(form, [d1, d2, d3]);
      expect(results).toEqual([d1, d3]);
    });
  });

  describe("isFormFilled", () => {
    it("for non-multiple forms returns true if any distribution is FINISHED", () => {
      const form = makeMockedForm(1); // multiple=false by factory

      const done = makeMockedDistribution(1);
      done.status = DistributionStatus.FINISHED;

      const other = makeMockedDistribution(1);
      other.status = DistributionStatus.ON_CHANGE;

      const doneAnoterForm = makeMockedDistribution(2);
      doneAnoterForm.status = DistributionStatus.FINISHED;

      expect(isFormFilled(form, [done, other])).toBe(true);
      expect(isFormFilled(form, [other])).toBe(false);
      expect(isFormFilled(form, [other, doneAnoterForm])).toBe(false);
    });

    it("for form with no distributions returns false", () => {
      const form = makeMockedForm(1); // multiple=false
      const fromAnotherForm = makeMockedDistribution(2);
      expect(isFormFilled(form, [fromAnotherForm])).toBe(false);
    });

    it("for multiple answer form checks only the distribution with the earliest dateSending", () => {
      const form = makeMockedForm(4); // multiple=true by factory

      const earliestDate = dayjs("2024-01-01").toISOString();
      const laterDate = dayjs("2024-02-01").toISOString();

      const earliestDone = makeMockedDistribution(4);
      earliestDone.dateSending = earliestDate;
      earliestDone.status = DistributionStatus.FINISHED;

      const laterToDo = makeMockedDistribution(4);
      laterToDo.dateSending = laterDate;
      laterToDo.status = DistributionStatus.TO_DO;

      const earliestToDo = makeMockedDistribution(4);
      earliestToDo.dateSending = earliestDate;
      earliestToDo.status = DistributionStatus.TO_DO;

      const laterDone = makeMockedDistribution(4);
      laterDone.dateSending = laterDate;
      laterDone.status = DistributionStatus.FINISHED;

      const earliestDoneFromAnotherForm = makeMockedDistribution(5);
      earliestDoneFromAnotherForm.dateSending = earliestDate;
      earliestDoneFromAnotherForm.status = DistributionStatus.FINISHED;

      // earliest is DONE => true, even if later is TO_DO
      expect(isFormFilled(form, [earliestDone, laterToDo])).toBe(true);

      // earliest is TO_DO => false, even though later is DONE
      expect(isFormFilled(form, [earliestToDo, laterDone])).toBe(false);

      // earliest is DONE => false, if later is DONE from another form
      expect(isFormFilled(form, [earliestToDo, laterDone, earliestDoneFromAnotherForm])).toBe(false);
    });
  });

  describe("getFormStatusText", () => {
    describe("multiple=true", () => {
      it("returns a count of FINISHED distributions", () => {
        const form = makeMockedForm(4); // multiple=true

        const done1 = makeMockedDistribution(4);
        done1.status = DistributionStatus.FINISHED;

        const done2 = makeMockedDistribution(4);
        done2.status = DistributionStatus.FINISHED;

        const toDo = makeMockedDistribution(4);
        toDo.status = DistributionStatus.TO_DO;

        const doneFromAnotherForm = makeMockedDistribution(5);
        doneFromAnotherForm.status = DistributionStatus.FINISHED;

        // two finished among three
        const text = getFormStatusText(form, [done1, done2, toDo, doneFromAnotherForm], formatDateWithTime, t);
        expect(text).toBe(`formulaire.responses.count : 2`);
      });
    });

    describe("multiple=false", () => {
      it("when there is at least one FINISHED, returns formatted date of the latest response", () => {
        const form = makeMockedForm(1); // multiple=false

        const oldDone = makeMockedDistribution(1);
        oldDone.status = DistributionStatus.FINISHED;
        oldDone.dateResponse = dayjs("2025-01-01").toISOString();

        const newDone = makeMockedDistribution(1);
        newDone.status = DistributionStatus.FINISHED;
        newDone.dateResponse = dayjs("2025-02-02").toISOString();

        const text = getFormStatusText(form, [oldDone, newDone], formatDateWithTime, t);
        // should pick the later dateResponse (2025-02-02)
        expect(text).toBe(`${newDone.dateResponse}│formulaire.responded.date`);
      });

      it("when none finished, returns the waiting key", () => {
        const form = makeMockedForm(1); // multiple=false

        const toDo = makeMockedDistribution(1);
        toDo.status = DistributionStatus.TO_DO;

        expect(getFormStatusText(form, [toDo], formatDateWithTime, t)).toBe("formulaire.responded.waiting");
      });
    });
  });
});
