import { GET, POST } from "@/app/api/avatars/route";
import { getAvatars, createCustomAvatar } from "@/lib/queries";

jest.mock("@/lib/queries", () => ({
  getAvatars: jest.fn(),
  createCustomAvatar: jest.fn(),
}));

const mockGetAvatars = getAvatars as jest.Mock;
const mockCreateCustomAvatar = createCustomAvatar as jest.Mock;

afterEach(() => jest.clearAllMocks());

function makePostRequest(body: unknown) {
  return new Request("http://localhost/api/avatars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("GET /api/avatars", () => {
  it("returns avatars for the authenticated user", async () => {
    const avatars = [{ id: "1", name: "Sofia", is_preset: true }];
    mockGetAvatars.mockResolvedValueOnce(avatars);

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(avatars);
  });

  it("returns 401 for unauthenticated requests", async () => {
    mockGetAvatars.mockRejectedValueOnce(new Error("Not authenticated"));

    const res = await GET();

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Not authenticated" });
  });
});

describe("POST /api/avatars", () => {
  it("creates an avatar with valid data", async () => {
    const created = { id: "2", name: "Marco", description: "Patient teacher", is_preset: false };
    mockCreateCustomAvatar.mockResolvedValueOnce(created);

    const res = await POST(makePostRequest({ name: "Marco", description: "Patient teacher" }));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(created);
    expect(mockCreateCustomAvatar).toHaveBeenCalledWith("Marco", "Patient teacher", undefined);
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makePostRequest({ description: "No name provided" }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "name is required" });
    expect(mockCreateCustomAvatar).not.toHaveBeenCalled();
  });
});
