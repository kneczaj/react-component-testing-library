import { expectNot } from "./utils";

describe('Utils', () => {
  describe('expectNot', () => {
    it('negates expect', () => {
      expectNot('a').toEqual('b');
    });
    it('provides negation', () => {
      expectNot('a').not.toEqual('a');
    });
  });
});
