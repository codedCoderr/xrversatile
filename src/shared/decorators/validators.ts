import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export const IsGreaterThan = (
  property: number,
  validationOptions?: ValidationOptions,
): any =>
  // eslint-disable-next-line func-names
  function (object: any, propertyName: string): any {
    registerDecorator({
      name: 'IsGreaterThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [constraintValue] = args.constraints;
          return (
            typeof value === 'number' &&
            typeof constraintValue === 'number' &&
            value > constraintValue
          );
        },
      },
    });
  };

export const IsGreaterThanOrEqual = (
  property: number,
  validationOptions?: ValidationOptions,
): any =>
  // eslint-disable-next-line func-names
  function (object: any, propertyName: string): any {
    registerDecorator({
      name: 'IsGreaIsGreaterThanOrEqualterThan',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [constraintValue] = args.constraints;
          return (
            typeof value === 'number' &&
            typeof constraintValue === 'number' &&
            value >= constraintValue
          );
        },
      },
    });
  };
