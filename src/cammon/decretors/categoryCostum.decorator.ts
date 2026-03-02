import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator'
import { Types } from 'mongoose';


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

@ValidatorConstraint({
    name: 'categoryCustom',
    async: false
})
export class idMongo implements ValidatorConstraintInterface {
    validate(ids: string | string[], args: ValidationArguments) {
        if (Array.isArray(ids)) {
            return ids.filter((id) => Types.ObjectId.isValid(id)).length == ids.length
        }
        return Types.ObjectId.isValid(ids)
    }
    defaultMessage(args: ValidationArguments) {
        return `Invalid id`
    }
}