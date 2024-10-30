"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsGreaterThanOrEqual = exports.IsGreaterThan = void 0;
const class_validator_1 = require("class-validator");
const IsGreaterThan = (property, validationOptions) => function (object, propertyName) {
    (0, class_validator_1.registerDecorator)({
        name: 'IsGreaterThan',
        target: object.constructor,
        propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
            validate(value, args) {
                const [constraintValue] = args.constraints;
                return (typeof value === 'number' &&
                    typeof constraintValue === 'number' &&
                    value > constraintValue);
            },
        },
    });
};
exports.IsGreaterThan = IsGreaterThan;
const IsGreaterThanOrEqual = (property, validationOptions) => function (object, propertyName) {
    (0, class_validator_1.registerDecorator)({
        name: 'IsGreaIsGreaterThanOrEqualterThan',
        target: object.constructor,
        propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
            validate(value, args) {
                const [constraintValue] = args.constraints;
                return (typeof value === 'number' &&
                    typeof constraintValue === 'number' &&
                    value >= constraintValue);
            },
        },
    });
};
exports.IsGreaterThanOrEqual = IsGreaterThanOrEqual;
//# sourceMappingURL=validators.js.map