import { act, renderHook } from "@testing-library/react-hooks";
import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  useGenerateObject,
  useGenerateText,
  useStreamObject,
  useStreamText,
} from "../queries";
import { useQuery } from "@tanstack/react-query";
import { generateObject, generateText, streamObject, streamText } from "ai";

// Mock the dependencies
vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

vi.mock("ai", () => ({
  generateObject: vi.fn(),
  generateText: vi.fn(),
  streamObject: vi.fn(),
  streamText: vi.fn(),
}));

describe("Custom Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useGenerateObject", () => {
    it("should call useQuery with correct parameters", () => {
      const params = { prompt: "test prompt", messages: [] };
      const options = { enabled: true };
      const mockQueryResult = { data: { object: {} } };

      (useQuery as any).mockReturnValue(mockQueryResult);
      (generateObject as any).mockResolvedValue({ object: {} });

      const { result } = renderHook(() => useGenerateObject(params, options));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["generateObject", "test prompt", "[]"],
          queryFn: expect.any(Function),
          enabled: true,
        })
      );
      expect(result.current.object).toEqual({});
    });
  });

  describe("useGenerateText", () => {
    it("should call useQuery with correct parameters", () => {
      const params = { prompt: "test prompt", messages: [] } as Parameters<typeof streamText>[0];
      const options = { enabled: true };
      const mockQueryResult = { data: { text: "Generated Text" } };

      (useQuery as any).mockReturnValue(mockQueryResult);
      (generateText as any).mockResolvedValue({ text: "Generated Text" });

      const { result } = renderHook(() => useGenerateText(params, options));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["generateText", "test prompt", "[]"],
          queryFn: expect.any(Function),
          enabled: true,
        })
      );
      expect(result.current.text).toEqual("Generated Text");
    });
  });

  describe("useStreamObject", () => {
    it("should call useQuery with correct parameters", async () => {
      const params = { prompt: "test prompt", messages: [] };
      const options = { enabled: true, onSuccess: vi.fn() };
      const mockStreamObjectResult = {
        partialObjectStream: (async function* () {
          yield { partial: "data" };
        })(),
        object: { final: "object" },
      };

      const mockQueryFn = vi.fn().mockImplementation(async () => {
        for await (const partialObject of mockStreamObjectResult.partialObjectStream) {
          options.onSuccess(partialObject);
        }
        return mockStreamObjectResult.object;
      });

      (useQuery as any).mockReturnValue({ queryFn: mockQueryFn });
      (streamObject as any).mockResolvedValue(mockStreamObjectResult);

      const { result } = renderHook(() => useStreamObject(params, options));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["streamObject", "[]"],
          queryFn: expect.any(Function),
          enabled: true,
        })
      );

      await act(async () => {
        await mockQueryFn();
      });

      expect(options.onSuccess).toHaveBeenCalledWith({ partial: "data" });
    });
  });

  describe("useStreamText", () => {
    it("should call useQuery with correct parameters", () => {
      const params = { prompt: "test prompt", messages: [] } as Parameters<typeof streamText>[0];
      const options = { enabled: true };
      const mockQueryResult = { data: { text: "Streamed Text" } };

      (useQuery as any).mockReturnValue(mockQueryResult);
      (streamText as any).mockResolvedValue({ text: "Streamed Text" });

      const { result } = renderHook(() => useStreamText(params, options));

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["generateText", "test prompt", "[]"],
          queryFn: expect.any(Function),
          enabled: true,
        })
      );
      expect(result.current.text).toEqual("Streamed Text");
    });
  });
});
