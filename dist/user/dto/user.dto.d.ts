export declare class CreateUserDTO {
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: string;
}
export declare class UpdateUserDTO {
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    profileImage: string;
    role: string;
}
export declare class ResetPasswordDTO {
    password: string;
    currentPassword?: string;
}
export declare class LoginDTO {
    password: string;
    email: string;
}
export declare enum RoleEnum {
    SuperAdmin = "superadmin",
    Admin = "admin"
}
