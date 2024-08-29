import { act, renderHook } from "@testing-library/react-hooks";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useModelContext } from "../provider";
import { useAIModel } from "../useAIModel";

// Mock the dependencies
vi.mock("../provider", () => ({
	useModelContext: vi.fn(),
}));

vi.mock("../queries", () => ({
	useGenerateText: vi.fn(),
	useStreamText: vi.fn(),
	useGenerateObject: vi.fn(),
	useStreamObject: vi.fn(),
}));

describe("useAIModel", () => {
	const mockModel = {
		specificationVersion: "v1",
		provider: "mockProvider",
		modelId: "mockModelId",
		defaultObjectGenerationMode: "json",
		supportsImageUrls: true,
		supportsStructuredOutputs: true,
		doGenerate: vi.fn().mockResolvedValue({
			text: "Generated Text",
			finishReason: "completed",
			usage: {
				promptTokens: 10,
				completionTokens: 20,
			},
			rawCall: {
				rawPrompt: {},
				rawSettings: {},
			},
		}),
		doStream: vi.fn().mockResolvedValue({
			stream: new ReadableStream(),
			rawCall: {
				rawPrompt: {},
				rawSettings: {},
			},
		}),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("throws an error if no model is provided", () => {
		(useModelContext as any).mockReturnValue({ model: null });

		const { result } = renderHook(() => useAIModel(null as any));

		expect(result.error).toEqual(new Error("Model is required"));
	});
});
