import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsGeoJSON(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGeoJSON',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'object' || value === null) return false;
          // Validación básica de estructura GeoJSON (Polygon / MultiPolygon)
          const validTypes = ['Polygon', 'MultiPolygon', 'Feature', 'Point'];
          return (
            validTypes.includes(value.type) &&
            (Array.isArray(value.coordinates) ||
              Array.isArray(value.geometry?.coordinates))
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser un objeto GeoJSON válido (ej. Polygon o MultiPolygon)`;
        },
      },
    });
  };
}
