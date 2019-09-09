describe("jest", () => {
    it("should use the testSetup.js", () => {
        expect(process.env.SOME_REQUIRED_ENV).toBe('test');
    })
})