import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!(value instanceof Date)) {
            return false;
          }

          const now = new Date();
          return value.getTime() <= now.getTime();
        },
        defaultMessage(args: ValidationArguments) {
          return 'Timestamp cannot be in the future';
        },
      },
    });
  };
}
