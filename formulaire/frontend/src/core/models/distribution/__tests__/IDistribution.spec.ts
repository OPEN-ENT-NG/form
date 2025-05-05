import { makeMockedDistribution } from "~/tests/utils";
import {
  getFirstDistribution,
  getFirstDistributionDate,
  getLatestDistribution,
  getLatestResponsedDistribution,
  getNbFinishedDistrib,
  transformDistribution,
  transformDistributions,
  transformDistributionsToTableData,
} from "../utils";
import { DistributionStatus } from "../enums";
import { IDistributionDTO, IPersonResponseData } from "../types";

describe("distributionUtils", () => {
  describe("transformDistribution", () => {
    it("maps a raw DTO to IDistribution correctly", () => {
      const raw: IDistributionDTO = {
        id: 10,
        form_id: 3,
        sender_id: "s1",
        sender_name: "Sender One",
        responder_id: "r1",
        responder_name: "Responder One",
        status: DistributionStatus.TO_DO,
        date_sending: "2025-06-01T08:00:00Z",
        date_response: "2025-06-02T09:30:00Z",
        active: true,
        structure: "Main Office",
        original_id: 5,
        public_key: "pub-key-5",
        captcha_id: "captcha-5",
      };

      const dist = transformDistribution(raw);
      expect(dist).toEqual({
        id: 10,
        formId: 3,
        senderId: "s1",
        senderName: "Sender One",
        responderId: "r1",
        responderName: "Responder One",
        status: DistributionStatus.TO_DO,
        dateSending: "2025-06-01T08:00:00Z",
        dateResponse: "2025-06-02T09:30:00Z",
        active: true,
        structure: "Main Office",
        originalId: 5,
        publicKey: "pub-key-5",
        captchaId: "captcha-5",
      });
    });
  });

  describe("transformDistributions", () => {
    it("maps an array of DTOs using transformDistribution", () => {
      const raws: IDistributionDTO[] = [
        {
          id: 1,
          form_id: 1,
          sender_id: "a",
          sender_name: "A",
          responder_id: "x",
          responder_name: "X",
          status: DistributionStatus.FINISHED,
          date_sending: null,
          date_response: null,
          active: false,
          structure: null,
          original_id: null,
          public_key: null,
          captcha_id: null,
        },
        {
          id: 2,
          form_id: 2,
          sender_id: "b",
          sender_name: "B",
          responder_id: "y",
          responder_name: "Y",
          status: DistributionStatus.FINISHED,
          date_sending: null,
          date_response: null,
          active: true,
          structure: "Struct",
          original_id: 1,
          public_key: "key-1",
          captcha_id: "cap-1",
        },
      ];

      const results = transformDistributions(raws);
      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(transformDistribution(raws[0]));
      expect(results[1]).toEqual(transformDistribution(raws[1]));
    });
  });

  describe("transformDistributionsToTableData", () => {
    // helper to build a simple IDistribution
    const makeDist = (responderId: string, responderName: string, status: DistributionStatus) => {
      const d = makeMockedDistribution(Math.floor(Math.random() * 1000));
      d.responderId = responderId;
      d.responderName = responderName;
      d.status = status;
      return d;
    };

    const d1 = makeDist("u1", "Charlie", DistributionStatus.FINISHED);
    const d2 = makeDist("u1", "Charlie", DistributionStatus.TO_DO);
    const d3 = makeDist("u2", "Alice", DistributionStatus.FINISHED);
    const d4 = makeDist("u3", "Bob", DistributionStatus.TO_DO);

    it("returns only answered responders when showAnswered=true", () => {
      const rows = transformDistributionsToTableData([d1, d2, d3, d4], true, false);
      // Charlie (1), Alice (1); sorted by name => Alice, Charlie
      expect(rows).toEqual<IPersonResponseData[]>([
        { responderId: "u2", responderName: "Alice", responseCount: 1 },
        { responderId: "u1", responderName: "Charlie", responseCount: 1 },
      ]);
    });

    it("returns only not answered responders when showNotAnswered=true", () => {
      const rows = transformDistributionsToTableData([d1, d2, d3, d4], false, true);
      // only Bob has 0 finished
      expect(rows).toEqual<IPersonResponseData[]>([{ responderId: "u3", responderName: "Bob", responseCount: 0 }]);
    });

    it("returns both when both flags are true, sorted by responderName", () => {
      const rows = transformDistributionsToTableData([d1, d2, d3, d4], true, true);
      expect(rows.map((r) => r.responderName)).toEqual(["Alice", "Bob", "Charlie"]);
      expect(rows.map((r) => r.responseCount)).toEqual([1, 0, 1]);
    });

    it("returns empty array when both flags are false", () => {
      const rows = transformDistributionsToTableData([d1, d2, d3, d4], false, false);
      expect(rows).toEqual([]);
    });
  });

  describe("getLatestDistribution", () => {
    it("picks the one with the most recent dateSending", () => {
      const d1 = makeMockedDistribution(2); // dateSending 2025-01-02
      const d2 = makeMockedDistribution(4); // dateSending 2025-01-04
      const d3 = makeMockedDistribution(6); // dateSending 2025-01-06
      // include one with null sending to ensure it's skipped
      const dNull = makeMockedDistribution(3); // dateSending null

      const latest = getLatestDistribution([dNull, d1, d2, d3]);
      expect(latest).toBe(d3);
    });

    it("falls back to the first element if none have dateSending", () => {
      const a = makeMockedDistribution(1); // dateSending null
      const b = makeMockedDistribution(3); // dateSending null
      const chosen = getLatestDistribution([a, b]);
      expect(chosen).toBe(a);
    });
  });

  describe("getFirstDistribution", () => {
    it("picks the one with the earliest dateSending", () => {
      const d2 = makeMockedDistribution(2); // 2025-01-02
      const d4 = makeMockedDistribution(4); // 2025-01-04
      const d6 = makeMockedDistribution(6); // 2025-01-06
      const dNull = makeMockedDistribution(5); // null

      const first = getFirstDistribution([dNull, d6, d4, d2]);
      expect(first).toBe(d2);
    });

    it("falls back to the first element if none have dateSending", () => {
      const d1 = makeMockedDistribution(1);
      const d3 = makeMockedDistribution(3);
      const first = getFirstDistribution([d1, d3]);
      expect(first).toBe(d1);
    });
  });

  describe("getNbFinishedDistrib", () => {
    it("counts only those with status = FINISHED", () => {
      const d1 = makeMockedDistribution(1);
      const d2 = makeMockedDistribution(2);
      const d3 = makeMockedDistribution(3);
      // override statuses
      d1.status = DistributionStatus.FINISHED;
      d2.status = DistributionStatus.FINISHED;
      d3.status = DistributionStatus.TO_DO;

      expect(getNbFinishedDistrib([d1, d2, d3])).toBe(2);
      expect(getNbFinishedDistrib([d3])).toBe(0);
    });
  });

  describe("getFirstDistributionDate", () => {
    it("returns the date of the earliest dateSending", () => {
      const d2 = makeMockedDistribution(2); // "2025-01-02"
      const d4 = makeMockedDistribution(4); // "2025-01-04"
      const firstDate = getFirstDistributionDate([d4, d2]);
      expect(firstDate.toISOString()).toMatch(/^2025-01-02/);
    });
  });

  describe("getLatestResponsedDistribution", () => {
    it("picks the one with the most recent dateResponse", () => {
      const d3 = makeMockedDistribution(3); // dateResponse "2025-02-03"
      const d6 = makeMockedDistribution(6); // dateResponse "2025-02-06"
      const d2 = makeMockedDistribution(2); // null
      const latest = getLatestResponsedDistribution([d2, d3, d6]);
      expect(latest).toBe(d6);
    });

    it("falls back to the first element if none have dateResponse", () => {
      const a = makeMockedDistribution(1); // null
      const b = makeMockedDistribution(2); // null
      const chosen = getLatestResponsedDistribution([a, b]);
      expect(chosen).toBe(a);
    });
  });
});
