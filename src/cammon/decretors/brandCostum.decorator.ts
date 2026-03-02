import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator'
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function AtLeastOne(requiredFields: string[], validationOptions?: ValidationOptions) {
    return function (target: any, propertyName?: string) {
        registerDecorator({
            target: propertyName ? target.constructor : target,
            propertyName: propertyName as string,
            options: validationOptions,
            constraints: requiredFields,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return requiredFields.some((field) => args.object[field]);
                },
                defaultMessage(args: ValidationArguments) {
                    return `At least one of ${args.constraints.join(', ')} is required`;
                }
            }
        });
    };
}