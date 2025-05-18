import offerSchema from '../../validation/offerSchema';

/**
 * Test suite for the offerSchema validation.
 * @module OfferSchemaTests
 * @description Verifies the validation behavior of the offerSchema.
 */
describe('offerSchema', () => {
  /**
   * @test {offerSchema} valid complete offer
   * @description Verifies that the offerSchema validates a correct complete offer.
   */
  it('validates a correct complete offer', () => {
    expect(() => {
      offerSchema.validateSync({
        name: 'Super Offre',
        price: 12.5,
        description: 'Une super promo',
      });
    }).not.toThrow();
  });

  /**
   * @test {offerSchema} valid offer without description
   * @description Verifies that the offerSchema validates an offer without a description.
   */
  it('validates an offer without a description', () => {
    expect(() => {
      offerSchema.validateSync({
        name: 'Solo',
        price: 50,
        description: undefined,
      });
    }).not.toThrow();
  });

  /**
   * @test {offerSchema} missing name
   * @description Verifies that the offerSchema fails if the name is missing.
   */
  it('fails if the name is missing', () => {
    expect(() => {
      offerSchema.validateSync({
        name: '',
        price: 10,
      });
    }).toThrow('Le nom de l’offre est requise');
  });

  /**
   * @test {offerSchema} name with only spaces
   * @description Verifies that the offerSchema fails if the name is only spaces.
   */
  it('fails if the name is only spaces', () => {
    expect(() => {
      offerSchema.validateSync({
        name: '    ',
        price: 10,
      });
    }).toThrow('Le nom de l’offre est requise');
  });

  /**
   * @test {offerSchema} missing price
   * @description Verifies that the offerSchema fails if the price is missing.
   */
  it('fails if the price is missing', () => {
    expect(() => {
      offerSchema.validateSync({
        name: 'Duo',
        price: undefined,
      });
    }).toThrow('Le prix est requis');
  });

  /**
   * @test {offerSchema} negative price
   * @description Verifies that the offerSchema fails if the price is negative.
   */
  it('fails if the price is negative', () => {
    expect(() => {
      offerSchema.validateSync({
        name: 'Famille',
        price: -5,
      });
    }).toThrow('Le prix doit être positif');
  });

  /**
   * @test {offerSchema} zero price
   * @description Verifies that the offerSchema fails if the price is zero.
   */
  it('fails if the price is zero', () => {
    expect(() => {
      offerSchema.validateSync({
        name: 'Famille',
        price: 0,
      });
    }).toThrow('Le prix doit être positif');
  });

  /**
   * @test {offerSchema} non-numeric price
   * @description Verifies that the offerSchema fails if the price is not a number.
   */
  it('fails if the price is not a number', () => {
    expect(() => {
      offerSchema.validateSync({
        name: 'Duo',
        price: 'abc',
      });
    }).toThrow();
  });
});
