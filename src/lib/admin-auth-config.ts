export const ADMIN_AUTH_COOKIE = 'bgx-admin-auth';

export type FixedSuperAdmin = {
  email: string;
  salt: string;
  passwordHash: string;
};

export const FIXED_SUPER_ADMINS: FixedSuperAdmin[] = [
  {
    email: 'luis@armoniautomation.com',
    salt: 'c95f11078f351ac89e96fdbc48512379',
    passwordHash: 'ce19fc32ad25a6ade8ab4daedde64f7cd8c07db499eeb0ca99f06d3800e41b8d03c678c23b22c1de9897c01a341a6b513a83306054808bdf79d9d80c913080d4',
  },
  {
    email: 'alejo@alejobernal.com',
    salt: '7f18f3846f88d0a2c4d8d6bab31df9ef',
    passwordHash: '5de768ea75cf77de5405936c1c9d3e09bea2db1b7e68de3957b5e3176e4cb0809c21c08ba02661da6a2b749bbf800e3c35b8bf9f014ce593682a1f2a16b30421',
  },
];

export const FIXED_SUPER_ADMIN_EMAILS = new Set(FIXED_SUPER_ADMINS.map((admin) => admin.email));
