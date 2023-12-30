import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsOneOfFieldsNotEmpty(properties: string[], validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isOneOfFieldsNotEmpty',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyNames] = args.constraints;
          const object = args.object as any;
          return relatedPropertyNames.some((property) => object[property] != null && object[property] !== '');
        },
      },
    });
  };
}
