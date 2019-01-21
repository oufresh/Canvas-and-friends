import { uuidGenerator } from "../uuid";

describe("uuidGenerator", () => {
  it("generate uuid", () => {
    const uuid = uuidGenerator();
    expect(uuid).not.toBeUndefined();
    expect(typeof uuid).toBe("string");
  });
});
